import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

await (async () => {
  const { error, success } = transporter.verify();
  if (error) console.log(error);
  else console.log("Nodemailer transporter is working.");
})();

export default async function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject,
    html,
  };

  const { error, info } = await transporter.sendMail(mailOptions);
  if (error) console.log(error);
}
