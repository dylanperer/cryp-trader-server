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
const mail_listener_typescript_1 = require("mail-listener-typescript");
const logger_1 = require("./logger");
const options = {
    host: "outlook.office365.com",
    port: 993,
    tls: true,
    connTimeout: 10000,
    authTimeout: 5000,
    debug: console.log(),
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX",
    searchFilter: ["NEW"],
    markSeen: false,
    fetchUnreadOnStart: true,
    mailParserOptions: { streamAttachments: true },
    attachments: true,
    attachmentOptions: {
        saveAttachments: false,
        directory: "attachments/",
        stream: true, // if it's enabled, will stream the attachments
    },
};
const onMail = (mail, seqno, attributes) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logger_1.serverInfo)(logger_1.ModuleType.Mail, logger_1.ActionType.onReceiveMail, `${mail.subject}, ${mail.text}`);
});
const onError = (error) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logger_1.serverError)(logger_1.ModuleType.Mail, logger_1.ActionType.mailError, `${error.toString()}, ${error.message}`);
});
const addMailListener = () => __awaiter(void 0, void 0, void 0, function* () {
    const email = process.env.EMAIL_ADDRESS;
    const password = process.env.EMAIL_PASSWORD;
    try {
        if (!email || !password) {
            throw new Error(`Invalid email or password`);
        }
        const mailListener = new mail_listener_typescript_1.MailListener(Object.assign(Object.assign({}, options), { username: email, password: password }));
        // Start
        mailListener.start();
        // Simple example of how to get all attachments from an email
        mailListener.on("mail", onMail);
        // Get erros
        mailListener.on("error", onError);
        (0, logger_1.serverSuccess)(logger_1.ModuleType.Mail, logger_1.ActionType.addMailListener);
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Mail, logger_1.ActionType.addMailListener, `${error.message}`);
    }
});
exports.addMailListener = addMailListener;
