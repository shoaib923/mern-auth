// utils/emailUtils.js
import transporter from "../config/nodeMailer.js";

export const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
    text, // Optional plain-text fallback
  };
  await transporter.sendMail(mailOptions);
};