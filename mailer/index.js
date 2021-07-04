const nodemailer = require('nodemailer');
const config = require('../config');

const { emailService, email, emailPassword } = config

const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: email,
    pass: emailPassword
  },
});

const mailer = (data) => {
  const { from, to, subject, text } = data;

  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = mailer;