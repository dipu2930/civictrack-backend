// civictrack-backend/utils/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"CivicTrack" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your CivicTrack OTP Code",
    text: `Your verification code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
