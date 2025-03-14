import nodemailer from "nodemailer";

export async function sendEmail(to, subject, text) {
  
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)

  const transporter = nodemailer.createTransport({
    service: "gmail.com",
    auth: {
      user: process.env.EMAIL_USER, // Set in .env
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"BELDS App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
