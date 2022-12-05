const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const archiver = require('archiver');
const request = require('request');
const spawn = require('child_process').spawn;

const path = require('path');
const fs = require('fs').promises;

const UPLOADER_PATH = path.join(__dirname, '..', 'uploader');
const uploader = multer({
	storage: multer.diskStorage({
		destination(req,file,cb){
			cb(null, UPLOADER_PATH);
		},
		filename(req,file,cb){
			const ext = path.extname(file.originalname);
			cb(null, 'file_'+Date.now()+ext);
		}
	}),
	limits: {fileSize: 5*1024*1024},
});

const projects = require('./queries/projects');
const images = require('./queries/images');
const mlmodels = require('./queries/mlmodels');
const exporter = require('./exporter');
const importer = require('./importer');
const maria = require('./database');
const { setup, checkLoginMiddleware, authHandler } = require('./auth');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const transport =  require("./mail.transport");

const funcs = require('./utils/functions');

const UPLOADS_PATH = path.join(__dirname, '..', 'uploads');

const app = express();

setup(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));
maria.connect();

const SECRET_KEY = "MY-SECRET-KEY"
const getRandomNum = function(min,max) {
	const randomNum = Math.floor(Math.random()*(max-min + 1)) + min;
	return randomNum;
} 


app.get('/api/mlmodels', (req, res) => {
  res.json(mlmodels.getAll());
});


app.post('/api/mlmodels', checkLoginMiddleware, (req, res) => {
  // TODO: sanitize input data
  const { model } = req.body;
  const id = mlmodels.create(model);
  res.json({
    success: true,
    id,
  });
});

app.post('/api/Login', (req,res) => {
	const body = req.body;
	const userid = body.params.username;
	const pw = body.params.password;
	const hash = bcrypt.hashSync(pw, 10)
	maria.query('SELECT * FROM Users where id= ?', userid, function (err, rows, fields){
	if(!err) {
		if(rows.length){
			maria.query('SELECT * FROM Users where id = ?', userid ,async function (err, rows , fields){
				const result = await bcrypt.compare(pw ,rows[0].pw);
				const userID = await rows[0].id
				if(result){
					const token = jwt.sign({
					type: 'JWT',
					name: rows[0].userName,
					isAdmin : rows[0].userLevel
					}, SECRET_KEY, {expiresIn:'60m',issuer:'token',});
					maria.query("UPDATE Users SET token =? where id = ?", [token,userid], async(err, rows, fields) => {
						maria.query("SELECT * FROM Users WHERE id = ? ", userid ,async function (err,rows, fields){
						res.json({
							code: 200,
							message: "Token Success",
							UserInfo:rows[0]
							 });

						});
					});
					console.log("token save");
				}else{
					res.json({
					LoginPW: false 
					})
					console.log("!!Password ERR!!");
				}
			})
		}else{
			console.log("ID ERR!!")	
			res.json({
			LoginID: false 
			})
		}
	}else{
		console.log("NetWork ERR!!")
	 }
	});
});

app.post('/api/MyProJectList', (req,res) =>{
	const UserIndex = req.body.userIndex
	maria.query("SELECT TaskGroup.idx, Company.companyName,TaskGroup.taskTitle,Users.userName,Users.idx FROM Users INNER JOIN TaskGroup ON Users.idx = TaskGroup.useridx INNER JOIN Company ON TaskGroup.companyidx = Company.idx WHERE Users.idx = ?" ,UserIndex  , (err, rows, fields) => {
		res.json({
		MyProJectList : rows
		})
		})
	})

app.post('/api/MyProJectList2', (req,res) =>{
	// const UserIndex = req.body.userIndex
	// console.log(UserIndex)
	maria.query("SELECT Tg.idx, U.userName, Cp.companyName, Tg.taskTitle, Tg.taskCategory, Tg.taskSize, Tg.taskDone, Tg.taskPoint, Tg.annotationTool FROM Users AS U LEFT JOIN TaskGroup AS Tg ON U.idx = Tg.useridx LEFT JOIN Company AS Cp ON Tg.companyidx = Cp.idx WHERE NOT Tg.idx IN ('null')", (err, rows, fields) => {
		// console.log(rows)
		res.json({
		MyProJectList: rows
		})
		})
	})

app.post('/api/Join' , (req,res) => {
	const body = req.body.params;
	const id = body.email;
	const password = body.password;
	const hash = bcrypt.hashSync(password, 10)
	const name = body.name;
	const phone = body.prefix + body.number;
	const birthday = body.birthday;
	const bank = body.bank;
	const account = body.account;
	const accountHolder = body.accountHolder;
	const infor = [id, hash , name, phone, birthday, bank, account,  accountHolder]
		maria.query("INSERT INTO Users (id, pw, userName, phoneNumber, birthday, bankName, account, accountHolder, emailReceive, mesgReceive) VALUES (?,?,?,?,?,?,?,?, 1, 1)" , infor , (err, rows, fields) => {
			console.log("!Join Success!!")
	})
})

app.post('/api/DuplicateID' , (req,res) => {
	const body = req.body.params;
	maria.query("SELECT id from Users WHERE id = ? ", body, function (err, rows, fields){
		if(rows.length){
			res.json({Duplicate : false})
			console.log("Duplicate ID")
		}else{
			const number = getRandomNum(111111,999999)
			transport.sendMail({
				from: "koreafirstt@gmail.com",
				to: body ,
				subject: "koreafirstec label tool Authentication code.",
				text: 'Authentication codes :' + number,
			})
			res.json({Duplicate : true,Authent : number})
			console.log("Not Duplicate ID")
		}
	})
	console.log("DuplicateID API");
})

app.post('/api/FindId', (req,res) => {
	const body = req.body.params;
	const name = body.name;
	const phone = body.phone;
	const array = [name, phone];
	maria.query("SELECT id FROM Users WHERE  userName = ? AND phoneNumber = ?", array , function (err,rows,fields){
		if(rows.length){
			res.json(rows[0]);
			console.log("Find ID");
		}else{
			console.log("Not Find Id");
			res.json({id : false});
		}

	})
})

app.post('/api/ChangePw', (req,res) => {
	const body = req.body.params;
	const password = body.password;
	const email = body.emailBox;
	const hash = bcrypt.hashSync(password, 10);
	const array = [hash,email];
	maria.query("UPDATE Users SET pw = ? WHERE id = ?" , array , function(err,rows,fields){
		console.log("changePw");
		res.json({changePw: true});
	})
})

app.post('/api/QuestionList' , (req,res) =>{
	Companyidx = req.body.useridx
	maria.query("SELECT Question.QuestionType,Question.QuestionTitle,Question.QuestionContents,Question.QuestionDate,Question.QuestionState,Users.userName,Question.Answer,Question.idx FROM Question INNER JOIN Users ON Users.idx = Question.userIdx WHERE Question.CompanyIdx = ?" , Companyidx , function (err,rows,fields){
	console.log("/api/QuestionList")
	res.json({QuestionList: rows});
	})
})

app.post('/api/UserInfo' , (req,res) =>{
	Token = req.body.token
	maria.query( "SELECT * FROM Users WHERE token = ?", Token , function (err,rows,fields){
	res.json({List: rows[0]});
	})
})

app.get('/api/UserListReturn' , (req,res) =>{
	maria.query( "SELECT * FROM Users WHERE NOT userLevel in (0, 1)", function (err,rows,fields){
		if(!err){res.json({UserList: rows})}
		else{res.json({UserList: false})}
	})
})

app.post('/api/UserListReturn' , (req,res) =>{
        const body = req.body.params;
        for(var i in body){
            id = body[i].id;
            userLevel = body[i].userLevel;
            array = [userLevel, id];
            maria.query( "UPDATE Users SET UserLevel = ? WHERE id = ?", array , function (err,rows,fields){
            })
        }
        res.json({Update : true});
})

app.post('/api/QuestionAnswer' , (req,res) =>{
	const value = req.body.params
	const Answer = value.values.Answer
	const Key = value.Key
	const array = [Answer,Key ];
	maria.query( "UPDATE Question SET Answer = ?, QuestionState = 2 WHERE idx = ?", array , function (err,rows,fields){
	})
})

app.post('/api/deleteQustion' , (req,res) =>{
	const value = req.body.key
	maria.query( "DELETE FROM Question WHERE idx = ?", value , function (err,rows,fields){
	res.json({delete : true})
	})
})

app.post('/api/' , (req,res) =>{
	Token = req.body.token
	maria.query( "SELECT * FROM Users WHERE token = ?", Token , function (err,rows,fields){
	})
})

app.post('/api/EmailChange' , (req,res) => {
	const id = req.body.id;
	maria.query("SELECT id from Users WHERE id = ? ", body, function (err, rows, fields){
		if(rows.length){
			res.json({Duplicate : false})
			console.log("Duplicate ID")
		}else{
			const number = getRandomNum(111111,999999)
			transport.sendMail({
				from: "koreafirstt@gmail.com",
				to: id,
				subject: "koreafirstec label tool Email change codes",
				text: 'Email change codes :' + number,
			})
			res.json({EmailChange: true, EmailChangeNum: number})
			console.log("Not Duplicate ID")
		}
	})
	console.log("DuplicateID API");
})

app.post('/api/AccountChange', (req,res) => {
    const body = req.body.params;
    const id = body.id;
    const bankName = body.bankName;
    const accountHolder = body.accountHolder;
    const account = body.account;
    const array = [bankName, account, accountHolder, id];
    maria.query("UPDATE Users SET bankName=?, account=?, accountHolder=? WHERE id=?", array, function(err, rows, fields){
        if(!err){res.json({AccountChange: true})}
        else{res.json({AccountChange: false})}
    })
})

app.post('/api/AccountWithdrawal', (req,res) => {
    const body = req.body.params;
    const id = body.id;
    const pw = body.pw.password;
    maria.query("SELECT * FROM Users WHERE id = ?", id, function (err, rows, fields){
        if(!err){
            const comparePw = bcrypt.compareSync(pw, rows[0].pw);
            if(comparePw){
                maria.query("DELETE FROM Users WHERE id=?", id, function(err, rows, fields){
                    if(!err){res.json({matchedPassword: true, UserWithdrawal: true})}
                    else{res.json({matchedPassword: true, UserWithdrawal: false})}
                })
            }else{res.json({matchedPassword: false, UserWithdrawal: false})}
        }else{res.json({matchedPassword: false, UserWithdrawal: false})}
    })
})

app.post('/api/UserChange' , (req,res) =>{
	const body = req.body.params;
	const id = body.id;
	const email = body.email;
	const mesg = body.mesg;
	const changeId = body.changeId;
	const array = [changeId, email, mesg, id];
	maria.query( "UPDATE Users SET id=?, emailReceive=?, mesgReceive=? WHERE id = ?", array , function (err,rows,fields){
		console.log("changeUser");
		res.json({Receive: true});
	})
})

app.post('/api/UserChangePw' , (req,res) =>{
	const body = req.body.params;
	const id = body.id;
	const oldpw = body.oldpw;
	const newpw = body.newpw;
	maria.query("SELECT * from Users WHERE id = ? ", id, function (err, rows, fields){
		if(rows.length){
			const comparePw = bcrypt.compareSync(oldpw, rows[0].pw);
			if(comparePw){
				const hash = bcrypt.hashSync(newpw, 10);
				const array = [hash, id];
				maria.query( "UPDATE Users SET pw=? WHERE id = ?", array , function (err,rows,fields){
					res.json({Change: true});
				})
			}else{
				console.log("This is the wrong password.");
				res.json({Change: false});
			}
		}else{
			console.log("Error")
		}
	})
})

app.post('/api/UserPoint' , (req,res) =>{
    const companyIdx = req.body.companyIdx;
    const sql = "SELECT c.companyName, u.id, p.point FROM Users AS u LEFT JOIN Company AS c ON u.companyIdx=c.idx LEFT JOIN Point AS p ON u.idx=p.userIdx WHERE u.companyIdx=? AND NOT u.userLevel IN (0, 1, 2)";
    maria.query(sql, companyIdx, function(err,rows,fields){
        if(!err){ res.json({UserPointList: rows}) }
        else{ res.json({UserPointList: false}) }
    })
})

app.post('/api/warning' , (req,res) =>{
  	  const body = req.body.companyIndex;
   	  const sql = "SELECT u.userName, count(w.useridx) AS count, t.taskTitle,w.warningDescription,w.warningDate,c.companyName,u.id , c.idx AS companyNumber FROM Users AS u LEFT JOIN Warning AS w ON u.idx=w.userIdx LEFT JOIN TaskGroup AS t ON t.idx=w.taskGroupIdx LEFT JOIN Company AS c ON c.idx = u.companyIdx GROUP BY u.idx HAVING c.id = ? ";
  	  maria.query(sql, body , function(err,rows,fields){
        if(!err){ res.json({list: rows}); }
        else{ res.json({UserPointList: false}) }
    })
})

app.post('/api/warning/count', async (req, res) => {
  const body = req.body;
  const userIndex = body.userIndex;
  if (userIndex == undefined) {
    res.json({
      code: 400,
      "cause": "No userIndex founded"
    });
    return;
  }
  try {
    console.log("start");
    funcs.checkLevel(maria, userIndex, function(level) {
      var sql = "select u.idx, count(*) as count from Warning as w " +
      "left join Users as u on w.userIdx = u.idx " +
      "left join Company as c on u.companyidx = c.idx ";

      switch (level) {
        case funcs.adminType.MASTER:
          maria.query(sql, function(err, rows, fields) {
            sql += "group by u.idx ";
            res.json({
              code : 200,
              list: rows
            });
          });
          break;
        case funcs.adminType.MODERATOR:
        case funcs.adminType.ADMIN:
          let companyIdx = body.companyIndex;
          if (companyIdx == undefined) {
            res.json({
              code: 400,
              "cause": "No companyIndex founded"
            });
          }
          sql += "where c.idx = ? "
          + "group by u.idx ";
          console.log('companyIdx : ', companyIdx)
          maria.query(sql, [companyIdx], function(err, rows, fields) {
            res.json({
              code : 200,
              list: rows
            });
          });
          break;
        case funcs.adminType.NORMAL:
        default:
          res.json({
            code : 403,
            "cause": "Only admin can access this api"
          });
      }
    });
  } catch (err) {
    res.json({
      code : 500,
      "cause": err
    });
  }
});


app.post('/api/warning/list', async (req,res) => {
  const body = req.body;
  const userIndex = body.userIndex;
  if (userIndex == undefined) {
    res.json({
      code: 400,
      "cause": "No userIndex founded"
    });
    return;
  }
  try {
    funcs.checkLevel(maria, userIndex, function(level) {
      var sql = "select u.id, u.userName, tg.taskTitle, c.companyName " +
      "from Warning as w " +
      "left join Users as u on w.userIdx = u.idx " +
      "left join TaskGroup as tg on w.taskGroupIdx = tg.idx " +
      "left join Company as c on u.companyidx = c.idx "

      switch (level) {
        case funcs.adminType.MASTER:
          maria.query(sql, function(err, rows, fields) {
            console.log("M-err : ", err);
            console.log("M-rows : ", rows);
            res.json({
              code : 200,
              list: rows
            });
          });
          break;
        case funcs.adminType.MODERATOR:
        case funcs.adminType.ADMIN:
          let companyIdx = body.companyIndex;
          if (companyIdx == undefined) {
            res.json({
              code: 400,
              "cause": "No companyIndex founded"
            });
          }
          sql += "where c.idx = ? ";
          console.log('companyIdx : ', companyIdx)
          maria.query(sql, [companyIdx], function(err, rows, fields) {
            console.log("A-err : ", err);
            console.log("A-rows : ", rows);
            res.json({
              code : 200,
              list: rows
            });
          });
          break;
        case funcs.adminType.NORMAL:
        default:
          res.json({
            code : 403,
            "cause": "Only admin can access this api"
          });
      }
    });
  } catch (err) {
    res.json({
      code : 500,
      "cause": err
    });
  }
})

app.get('/api/AdminRead', (req,res) => {
        const body = req.body.params;
        // const idx = body.idx;
        const level = body.level;
        const companyIdx = body.company;
        const sql = "SELECT u.idx, u.userName, u.userLevel, u.companyIdx, c.companyName FROM Users AS u left JOIN Company AS c ON u.companyIdx = c.idx";
        if(level == 0){
            maria.query(sql, function(err,rows,fields){
                if(!err){ res.json({AdminList: rows}) }
                else{ res.json({AdminList: false}) }
            })
            return;
        }
        if(level == 1){
            maria.query(sql+" WHERE NOT u.userLevel IN (0) AND u.companyIdx=?", companyIdx, function(err,rows,fields){
                if(!err){ res.json({AdminList: rows}) }
                else{ res.json({AdminList: false}) }
            })
            return;
        }
        if(level == 2){
            maria.query(sql+" WHERE NOT u.userLevel IN (0, 1) AND u.companyIdx=?", companyIdx, function(err,rows,fields){
                if(!err){ res.json({AdminList: rows}) }
                else{ res.json({AdminList: false}) }
            })
            return;
        }else{
            maria.query(sql+" WHERE NOT u.userLevel IN (0, 1, 2)", function(err,rows,fields){
                if(!err){ res.json({AdminList: rows}) }
                else{ res.json({AdminList: false}) }
            })
            return;
        }
});

app.post('/api/PointRequestList' , (req,res) =>{
	 const company= req.body.company;
	maria.query("select Company.companyName, TaskGroup.taskTitle , Users.idx , Users.userName , Users.id , Point.point , Point.DAY  from TaskGroup INNER JOIN Task ON TaskGroup.idx = Task.taskGroup INNER JOIN Users ON Task.userIdx = Users.idx INNER JOIN Company ON Company.idx = TaskGroup.companyIdx INNER JOIN Point ON Point.userIdx = Users.idx WHERE Company.idx = ? " , company , function (err,rows,fields){
	res.json({List : rows})
	console.log("/api/PointRequestList")
	})            
})

// app.patch('/api/AdminUpdate', (req,res) => {
app.post('/api/AdminUpdate', (req,res) => {
        const body = req.body.params;
        for(var i in body){
            console.log(body[i])
        }
        res.json({ddd:true})
        //const idx = body.idx;
        //const userLevel = body.level;
        //const company = body.company;
        //const array = [userLevel, company, idx];
        //maria.query("UPDATE Users SET userLevel=?, companyIdx=? where idx = ?", array, (err, rows, fields) => {
        //    if(!err){ console.log("UPDATE Users Success") }
        //    else{ console.log("UPDATE Users Fail") }
        //});
});

// app.delete('/api/AdminDelete', (req,res) => {
app.post('/api/AdminDelete', (req,res) => {
        const body = req.body.params;
        const idx = body.idx
        maria.query("Delete from Users where idx=?", idx, (err, rows, fields) => {
            if(!err){ console.log("DELETE Users Success") }
            else{ console.log("DELETE Users Fail") }
        });
});

app.post('/api/Emailkey', (req,res) => {
	const body = req.body.params;
	maria.query("SELECT id FROM Users WHERE id = ?" , body , function (err,rows,fields){
		if(rows.length){
			const number = getRandomNum(111111,999999)
			transport.sendMail({
				from: "koreafirstt@gmail.com",
				to: body ,
				subject: "koreafirstec label tool Authentication code.",
				text: 'Authentication codes :' + number,
			})
			console.log(number);
			res.json({Duplicate : true,Authent : number})
		}else{
			console.log("Not Find Id!")
			res.json({Duplicate : false})
		}
	})
})

app.post('/api/mlmodels/:id', (req, res) => {
  const { id } = req.params;
  const model = mlmodels.get(id);
  console.log(JSON.stringify(req.body))
  request
    .post(model.url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })
    .pipe(res).on('error', function(e){ this.emit('end') });
});

app.delete('/api/mlmodels/:id', checkLoginMiddleware, (req, res) => {
  const { id } = req.params;
  const model = mlmodels.delete(id);
  res.json({ success: true });
});

app.get('/api/projects', checkLoginMiddleware, (req, res) => {
  res.json(projects.getAll());
});

app.post('/api/projects', checkLoginMiddleware, (req, res) => {
  res.json(projects.create());
});

app.get('/api/projects/:id', (req, res) => {
  res.json(projects.get(req.params.id));
});

app.patch('/api/projects/:id', checkLoginMiddleware, (req, res) => {
  const { project } = req.body;
  try {
    projects.update(req.params.id, project);
  } catch (err) {
    res.status(400);
    res.json({
      message: err.message,
      code: 400,
    });
    return;
  }

  res.json({ success: true });
});

app.delete('/api/projects/:id', checkLoginMiddleware, (req, res) => {
  projects.delete(req.params.id);
  res.json({ success: true });
});

app.get('/api/images', (req, res) => {
  res.json(images.getForProject(req.query.projectId));
});

app.get('/api/images/:id', (req, res) => {
  res.json(images.get(req.params.id));
});

app.post('/api/images', checkLoginMiddleware, async (req, res) => {
  const { projectId, urls, localPath } = req.body;
  if (urls) {
    try {
      images.addImageUrls(projectId, urls);
    } catch (err) {
      res.status(400);
      res.json({
        message: err.message,
        code: 400,
      });
      return;
    }
    res.json({ success: true });
  } else if (localPath) {
    try {
      const files = await fs.readdir(localPath);
      const isImage = p =>
        ['.jpg', '.jpeg', '.png'].includes(path.extname(p).toLowerCase());
      const imagePaths = files.filter(isImage);
      if (!imagePaths.length) {
        throw new Error('The specified folder has no image files.');
      }
      //images.addImages(projectId, urls);
      for (const filename of imagePaths) {
        const id = images.addImageStub(
          projectId,
          filename,
          path.join(localPath, filename)
        );
        images.updateLink(id, { projectId, filename });
      }
    } catch (err) {
      res.status(400);
      res.json({
        message: err.message,
        code: 400,
      });
      return;
    }
    res.json({ success: true });
  } else {
    res.status(400);
    res.json({
      message: 'No urls or local path passed',
      code: 400,
    });
  }
});

app.delete('/api/images/:id', checkLoginMiddleware, (req, res) => {
  images.delete(req.params.id);
  res.json({ success: true });
});

app.get('/api/getLabelingInfo', (req, res) => {
  let { projectId, imageId } = req.query;
  if (!projectId) {
    res.status(400);
    res.json({
      message: 'projectId required',
      code: 400,
    });
    return;
  }

  try {
    if (!imageId) {
      const ret = images.allocateUnlabeledImage(projectId, imageId);
      if (!ret) {
        res.json({
          success: true,
        });
        return;
      }
      ({ imageId } = ret);
    }

    const project = projects.get(projectId);
    const image = images.get(imageId);

    res.json({
      project,
      image,
    });
  } catch (err) {
    res.status(400);
    res.json({
      message: err.message,
      code: 400,
    });
  }
});

app.get('/api/Test', (req,res) => {
  image
})

app.patch('/api/images/:imageId', (req, res) => {
  const { imageId } = req.params;
  const { labelData, labeled } = req.body;
  if (labelData) {
    images.updateLabel(imageId, labelData);
  }
  if (labeled !== undefined) {
    images.updateLabeled(imageId, labeled);
  }
  res.json({
    success: true,
  });
});

const uploads = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const { projectId } = req.params;
      try {
        if (!projects.get(projectId)) {
          throw new Error('No such projectId.');
        }
        const dest = path.join(UPLOADS_PATH, projectId);
        try {
          await fs.mkdir(dest);
        } catch (err) {}
        cb(null, dest);
      } catch (err) {
        cb(err);
      }
    },
    filename: (req, file, cb) => {
      try {
        const { projectId } = req.params;
        const filename = file.originalname;

        if (req.reference) {
          const ext = path.extname(filename);
          const name = `_reference${ext}`;
          const referenceLink = `/uploads/${projectId}/${name}`;
          projects.updateReference(projectId, referenceLink);
          cb(null, name);
        } else {
          const id = images.addImageStub(projectId, filename, null);
          const newName = images.updateLink(id, { projectId, filename });
          cb(null, newName);
        }
      } catch (err) {
        cb(err);
      }
    },
  }),
});

app.post(
  '/api/uploads/:projectId',
  checkLoginMiddleware,
  uploads.array('images'),
  (req, res) => {
    res.json({ success: true });
  }
);

app.post(
  '/api/uploads/:projectId/reference',
  checkLoginMiddleware,
  (req, res, next) => {
    req.reference = true;
    next();
  },
  uploads.single('referenceImage'),
  (req, res) => {
    res.json({ success: true });
  }
);

const imports = multer({
  storage: importer(),
});
app.post(
  '/api/import/:projectId',
  checkLoginMiddleware,
  (req, res, next) => {
    req.importRes = [];
    next();
  },
  imports.array('files'),
  (req, res) => {
    const { importRes } = req;
    const message = importRes.map(({ message }) => message).join('\n');
    res.json({ success: true, message });
  }
);

app.get('/uploads/:projectId/:imageName', (req, res) => {
  const { projectId, imageName } = req.params;
  const imageId = imageName.split('.')[0];
  if (imageId !== '_reference') {
    const image = images.get(imageId);
    if (image.localPath) {
      res.sendFile(image.localPath);
      return;
    } else if (image.externalLink) {
      request.get(image.externalLink).pipe(res);
      return;
    }
  }
  res.sendFile(path.join(UPLOADS_PATH, projectId, path.join('/', imageName)));
});

app.post('/api/Test', uploader.single('image'), async(req,res) =>{
    const py = spawn('python3', ['src/test_server.py', req.file.filename]);
    var i = '';
    py.stdout.on('data', function(data){
        i = data.toString();
        res.json({"sno": "Sekai no Owari", "i":i});
    })
})

app.get('/api/projects/:projectId/export', checkLoginMiddleware, (req, res) => {
  const archive = archiver('zip');

  archive.on('error', err => {
    res.status(500).send({ error: err.message });
  });

  res.attachment('project-export.zip');

  archive.pipe(res);

  const { projectId } = req.params;
  exporter.exportProject(projectId).forEach(({ name, contents }) => {
    archive.append(contents, { name });
  });

  archive.finalize();
});

app.get('/api/auth', authHandler);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api/')) return next();
    if (req.url.startsWith('/uploads/')) return next();
    res.sendFile(path.join(__dirname + '/../../client/build/index.html'));
  });
}

const PORT = process.env.API_PORT || process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
