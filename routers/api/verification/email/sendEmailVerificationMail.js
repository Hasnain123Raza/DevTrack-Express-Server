import sendMail from "../../../../services/mail";

import dotenv from "dotenv";
dotenv.config();

export default async function sendEmailVerificationMail(
  displayName,
  email,
  token
) {
  const verificationLink = `${process.env.CORS_ORIGIN}/verification/email/${token}`;

  await sendMail(
    email,
    "Email Verification",
    `
    <html>
      <body>
        Hello ${displayName}! <br/> <br/>
        
        You have registered on <b>DevTrack</b> website using this email. <br/>
        To verify this email please go to this link: <a href="${verificationLink}">verify</a> <br/> <br/>
        
        Please do not reply to this email as it is send through an automated bot. <br/>
        To contact us, please visit this link: <a href="#">contact</a>
      </body>
    </html>
    `
  );
}
