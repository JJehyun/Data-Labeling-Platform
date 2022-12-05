exports.adminType = {
    MASTER : 0,
    MODERATOR : 1,
    ADMIN : 2,
    NORMAL : 3
};

exports.checkLevel = (maria, userIdx, cb) => {
    var sql = 'SELECT userLevel FROM Users where idx = ?';
    maria.query(sql, userIdx, function(err, rows, fields) {
        console.log('rows : ', rows[0].userLevel);
        if (err) {
            throw err;
        }
        cb(rows[0].userLevel);
    });
}
