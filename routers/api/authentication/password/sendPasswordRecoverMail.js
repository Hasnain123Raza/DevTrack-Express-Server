import sendMail from "../../../../services/mail";

import dotenv from "dotenv";
dotenv.config();

export default async function sendPasswordRecoverMail(
  displayName,
  email,
  token
) {
  const recoverLink = `${process.env.CORS_ORIGIN}/authentication/password/new/${token}`;

  await sendMail(
    email,
    "Password Recovery",
    `
    <html>
      <body>
        Hello ${displayName}! <br/> <br/>
        
        You have requested a password change for your account associated with your email on <b>DevTrack</b> website. <br/>
        To complete the process, please go to this link: <a href="${recoverLink}">verify</a> <br/> <br/>
        
        Please do not reply to this email as it is send through an automated bot. <br/>
        To contact us, please visit this link: <a href="#">contact</a>
      </body>
    </html>
    `
  );
}
