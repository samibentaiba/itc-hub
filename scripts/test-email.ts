import "dotenv/config";
import nodemailer from "nodemailer";

async function main() {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: "sambentaiba25@gmail.com", // send to yourself
    subject: "Test Email from ITC Hub",
    text: "If you see this, SMTP works!",
  });

  console.log("Message sent:", info.messageId);
}

main().catch(console.error);
