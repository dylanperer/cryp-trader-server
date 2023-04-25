import { MailListener, IMailObject } from "mail-listener-typescript";
import { LogType, ActionType, ModuleType, serverInfo, serverError, serverSuccess } from './logger';


const options = {
  host: "outlook.office365.com", // host
  port: 993, // imap port
  tls: true, // tls
  connTimeout: 10000, // Default by node-imap
  authTimeout: 5000, // Default by node-imap,
  debug: console.log(), // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["NEW"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: false, // all fetched email will be marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: { streamAttachments: true }, // options to be passed to mailParser lib.
  attachments: true, // get mail attachments as they are encountered
  attachmentOptions: {
    saveAttachments: false, // save attachments to the project directory
    directory: "attachments/", // folder on project directory to save attachements, will be created if not exists
    stream: true, // if it's enabled, will stream the attachments
  },
};

const onMail = async (mail: IMailObject, seqno: any, attributes: any) => {
  serverInfo(ModuleType.Mail, ActionType.onReceiveMail, `${mail.subject}, ${mail.text}`);
};

const onError = async (error: any) => {
  serverError(ModuleType.Mail, ActionType.mailError, `${error.toString()}, ${error.message}`);
};

export const addMailListener = async () => {
  const email = process.env.EMAIL_ADDRESS;
  const password = process.env.EMAIL_PASSWORD;
  try{
    if(!email || !password){
      throw new Error(`Invalid email or password`);
    }
    const mailListener = new MailListener({...options, username: email, password:password});

    // Start
    mailListener.start();

    // Simple example of how to get all attachments from an email
    mailListener.on("mail", onMail);

    // Get erros
    mailListener.on("error",onError);

    serverSuccess(ModuleType.Mail, ActionType.addMailListener);

  }catch(error: any){
    serverError(ModuleType.Mail, ActionType.addMailListener, `${error.message}`);
  }
};
