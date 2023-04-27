"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMailListener = void 0;
//@ts-ignore
const mail_listener5_1 = require("mail-listener5");
const server_1 = require("../server");
let _MAIL_LISTENER_REFRESH_ATTEMPTS = 2;
const logger_1 = require("./logger");
const options = {
    username: "imap-username",
    password: "imap-password",
    host: "outlook.office365.com",
    port: 993,
    tls: true,
    connTimeout: 10000,
    authTimeout: 5000,
    debug: null,
    autotls: "never",
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX",
    searchFilter: ["ALL"],
    markSeen: true,
    fetchUnreadOnStart: true,
    attachments: false, // download attachments as they are encountered to the project directory
};
const onMail = (mail, seqno, attributes, startTime, seenUIDs) => __awaiter(void 0, void 0, void 0, function* () {
    const find = seenUIDs.find((c) => c.subject === mail.subject && c.uid === attributes.uid);
    if (!find && mail.date > startTime) {
        seenUIDs.push({ uid: attributes.uid, subject: mail.subject });
        (0, logger_1.serverInfo)(logger_1.ModuleType.Mail, logger_1.ActionType.onReceiveMail, `${mail.subject}`);
    }
});
const onError = (error) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logger_1.serverError)(logger_1.ModuleType.Mail, logger_1.ActionType.mailError, `${error.toString()}, ${error.message}`);
    (0, logger_1.serverInfo)(logger_1.ModuleType.Mail, logger_1.ActionType.mailRestart, `restarting, attempts remaining ${_MAIL_LISTENER_REFRESH_ATTEMPTS}...`);
    _MAIL_LISTENER_REFRESH_ATTEMPTS -= 1;
    (0, exports.addMailListener)();
});
const parseAlert = (subject) => {
    //Alert: 2023-04-27T06:14:00Z,LONG,buy ETHUSDT.P,1898.54,0.03
};
const addMailListener = () => __awaiter(void 0, void 0, void 0, function* () {
    const email = process.env.EMAIL_ADDRESS;
    const password = process.env.EMAIL_PASSWORD;
    try {
        if (!email || !password) {
            throw new Error(`Invalid email or password`);
        }
        if (_MAIL_LISTENER_REFRESH_ATTEMPTS === 0) {
            throw new Error("Mail listener failed to restart");
        }
        const seenUIDs = [];
        const mailListener = new mail_listener5_1.MailListener(Object.assign(Object.assign({}, options), { username: email, password: password }));
        // Start
        mailListener.start();
        // Get errors
        mailListener.on("error", onError);
        mailListener.on("server:connected", () => {
            mailListener.on("mail", (mail, seqno, attributes) => {
                onMail(mail, seqno, attributes, server_1._SERVER_START_TIME.toDate(), seenUIDs);
            });
            (0, logger_1.serverSuccess)(logger_1.ModuleType.Mail, logger_1.ActionType.addMailListener);
        });
        // Simple example of how to get all attachments from an email
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Mail, logger_1.ActionType.addMailListener, `${error.message}`);
        process.exit(1);
    }
});
exports.addMailListener = addMailListener;
