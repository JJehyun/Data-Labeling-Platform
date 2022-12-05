const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user:'koreafirstt@gmail.com',
		pass:'koreafirstt12',
	},
})

module.exports = transport
