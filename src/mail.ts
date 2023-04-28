//@ts-ignore
import { MailListener } from "mail-listener5";
import moment from "moment";
import { prisma } from "../prisma/prisma";
import { _SERVER_START_TIME } from "../server";
let _MAIL_LISTENER_REFRESH_ATTEMPTS = 2;

export enum TradeSide {
  LONG = "LONG",
  SHORT = "SHORT",
  STOP_LOSS_SHORT = "STOP LOSS SHORT",
  STOP_LOSS_LONG = "STOP LOSS LONG",
}

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
    const alert = await parseAlert(mail.subject);
    if (alert) {
      const alertStr = `${alert.delay}s, ${alert.receivedAt}, ${alert.side}, ${alert.coin}, ${alert.price}`;

      seenUIDs.push({ uid: attributes.uid, subject: mail.subject });
      serverInfo(ModuleType.Mail, ActionType.onReceiveMail, `${alertStr}`);
    }
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

const parseAlert = async (subject: string) => {
  //Alert: 2023-04-27T06:14:00Z,LONG,buy ETHUSDT.P,1898.54,0.03
  try {
    const split = subject.split(",");

    const receivedAt = new Date(split[0].replace("Alert:", "").trim());
    const side = split[1].trim().toUpperCase() as TradeSide;
    const coin = split[2].replace("buy", "").trim();
    const price = Number(split[3]);

    console.log(receivedAt, side, coin, price);

    if (subject.toLowerCase().includes("alert")) {
      if (!receivedAt || !side || !price) {
        throw new Error("Alert parsing failed");
      }
    }

    const delay = new Date().getTime() - receivedAt.getTime();
    const diffInSeconds = Math.floor(delay / 1000);

    console.log(new Date().getTime(), receivedAt.getTime());
    return await prisma.alert.create({
      data: {
        coin: coin,
        side: side,
        price: price,
        receivedAt: receivedAt,
        delay: diffInSeconds,
      },
    });
  } catch (error: any) {
    serverError(ModuleType.Mail, ActionType.alertParse, `${error.message}`);
  }
};

export const getDelay = (t1: number, t2: number) => {
  const moment1 = moment.unix(t1);
  const moment2 = moment.unix(t2);

  return moment2.diff(moment1, "seconds");
};

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

    return mailListener;

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


export const attachMailListener = async ()=>{
  const m = await addMailListener();
}