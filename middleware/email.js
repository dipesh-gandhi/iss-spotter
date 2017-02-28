


var sendEmail = require('gmail-send')({
  user: process.env.jenn_user,       //send gmail account
  pass: process.env.jenn_password,      //send gmail pw
  to: process.env.owner_email,     //owner of sending account
  subject: 'Message from Jenn, Dipesh VA',
  text:    'Message not provided. This is a default message'
});


exports.sendEmail = sendEmail;
