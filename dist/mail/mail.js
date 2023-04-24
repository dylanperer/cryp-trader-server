import { MailListener } from "mail-listener-typescript";
import { ServerLog, ServerModuleType, MailActionType, LogType } from "../logger.js";
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
const onMail = async (mail, seqno, attributes) => {
    ServerLog(ServerModuleType.Mail, MailActionType.receiveMail, `${mail.subject}, ${mail.text}`);
};
const onError = async (error) => {
    ServerLog(ServerModuleType.Mail, MailActionType.error, `${error.toString()}, ${error.message}`, LogType.error);
};
export const addMailListener = async (email, password) => {
    try {
        const mailListener = new MailListener({ ...options, username: email, password: password });
        // Start
        mailListener.start();
        // Simple example of how to get all attachments from an email
        mailListener.on("mail", onMail);
        // Get erros
        mailListener.on("error", onError);
        ServerLog(ServerModuleType.Mail, MailActionType.attachListener, '', LogType.success);
    }
    catch (error) {
        ServerLog(ServerModuleType.Mail, MailActionType.attachListener, `${error.toString()}, ${error.message}`, LogType.error);
    }
};
//# sourceMappingURL=mail.js.map