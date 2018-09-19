const nodemailer = require('nodemailer');

class EmailService {

  constructor(host, port, auth) {

    this.from = auth.username;
    this.transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false,
      auth: {
        user: auth.username,
        pass: auth.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  send(to, subject, message) {
    let mailOptions = {
      from: this.from,
      to,
      subject,
      text: message
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  }

}

module.exports = EmailService;
