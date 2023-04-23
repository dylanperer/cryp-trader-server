import { sendMail } from "./mail/mail";

console.log('HELLO FROM SERVER');

// Call the authorize() and watchForNewEmails() functions
sendMail()
  .then((result) => console.log("Email sent...", result))
  .catch((error) => console.log(error.message));
