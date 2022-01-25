const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: true,
      auth: {
        user: process.env.SEND_MAIL,
        pass: process.env.SEND_MAIL_PASSWORD
      },
    });

    await transporter.sendMail({
      from: "Cream",
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;