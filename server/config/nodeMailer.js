import nodemailer from "nodemailer";

console.log("EMAIL:", process.env.SMTP_USER);
console.log("PASS:", process.env.SMTP_PASS);
const transporter = nodemailer.createTransport({
  secure:true,
  host: "smtp.gmail.com", 
  port: 465,
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP Error:", err);
  } else {
    console.log("SMTP server is ready to send emails (Mailtrap)");
  }
});

export default transporter;