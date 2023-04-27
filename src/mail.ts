//@ts-ignore
import { MailListener } from "mail-listener5";
import moment from "moment";
import { _SERVER_START_TIME } from "../server";
let _MAIL_LISTENER_REFRESH_ATTEMPTS = 2;

import {
  LogType,
  ActionType,
  ModuleType,
  serverInfo,
  serverError,
  serverSuccess,
} from "./logger";

const options = {
  username: "imap-username",
  password: "imap-password",
  host: "outlook.office365.com",
  port: 993, // imap port
  tls: true,
  connTimeout: 10000, // Default by node-imap
  authTimeout: 5000, // Default by node-imap,
  debug: null, // Or your custom function with only one incoming argument. Default: null
  autotls: "never", // default by node-imap
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["ALL"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  attachments: false, // download attachments as they are encountered to the project directory
};

const onMail = async (
  mail: any,
  seqno: any,
  attributes: any,
  startTime: Date,
  seenUIDs: Array<{ uid: number; subject: string }>
) => {
  const find = seenUIDs.find(
    (c) => c.subject === mail.subject && c.uid === attributes.uid
  );

  if (!find && mail.date > startTime) {
    seenUIDs.push({ uid: attributes.uid, subject: mail.subject });
    serverInfo(ModuleType.Mail, ActionType.onReceiveMail, `${mail.subject}`);
  }
};

const onError = async (error: any) => {
  serverError(
    ModuleType.Mail,
    ActionType.mailError,
    `${error.toString()}, ${error.message}`
  );

  serverInfo(
    ModuleType.Mail,
    ActionType.mailRestart,
    `restarting, attempts remaining ${_MAIL_LISTENER_REFRESH_ATTEMPTS}...`
  );

  _MAIL_LISTENER_REFRESH_ATTEMPTS -= 1;

  addMailListener();
};

const onReady = async () => {};

export const addMailListener = async () => {
  const email = process.env.EMAIL_ADDRESS;
  const password = process.env.EMAIL_PASSWORD;
  try {
    if (!email || !password) {
      throw new Error(`Invalid email or password`);
    }

    if (_MAIL_LISTENER_REFRESH_ATTEMPTS === 0) {
      throw new Error("Mail listener failed to restart");
    }

    const seenUIDs: Array<{ uid: number; subject: string }> = [];

    const mailListener = new MailListener({
      ...options,
      username: email,
      password: password,
    });

    // Start
    mailListener.start();

    // Get errors
    mailListener.on("error", onError);

    mailListener.on("server:connected", () => {
      mailListener.on("mail", (mail: any, seqno: any, attributes: any) => {
        onMail(mail, seqno, attributes, _SERVER_START_TIME.toDate(), seenUIDs);
      });
      serverSuccess(ModuleType.Mail, ActionType.addMailListener);
    });

    // Simple example of how to get all attachments from an email
  } catch (error: any) {
    serverError(
      ModuleType.Mail,
      ActionType.addMailListener,
      `${error.message}`
    );
    process.exit(1);
  }
};
