const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_EMAIL_HOST,
    port: process.env.NODEMAILER_EMAIL_PORT,
    auth: {
      user: process.env.NODEMAILER_EMAIL_USERNAME,
      pass: process.env.NODEMAILER_EMAIL_PASSWORD,
    },
  });

  // 2) Define email options
  const mailOptions = {
    from: process.env.NODEMAILER_DEFAULT_FROM_ADDRESS,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
