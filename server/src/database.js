const maria = require('mysql');

const conn = maria.createConnection({
	host:'172.30.1.80',
	port:3306,
	user:'root',
	password:'first2000',
	database:'LabelTool'
})

module.exports = conn;
