import chalk from "chalk";
import moment from "moment";
export var ServerModuleType;
(function (ServerModuleType) {
    ServerModuleType["Mail"] = "Mail";
    ServerModuleType["Binance"] = "Binance";
})(ServerModuleType = ServerModuleType || (ServerModuleType = {}));
export var MailActionType;
(function (MailActionType) {
    MailActionType["attachListener"] = "attach-listener";
    MailActionType["receiveMail"] = "receive-mail";
    MailActionType["error"] = "mail-error";
})(MailActionType = MailActionType || (MailActionType = {}));
export var LogType;
(function (LogType) {
    LogType["info"] = "[Info]";
    LogType["warn"] = "[Warning]";
    LogType["error"] = "[Error]";
    LogType["success"] = "[Successful]";
})(LogType = LogType || (LogType = {}));
export const ServerLog = (module, action, context, logLevel) => {
    if (!logLevel) {
        logLevel = LogType.info;
    }
    const formattedTime = moment(new Date()).format('DD/MM/YYYY h:mm:ss');
    const str = `${formattedTime} ${logLevel.toString()} ${module.toString()} ${action.toString()}${context ? ' | '.concat(context).concat('.') : '.'}`;
    const _str = `> ${str}`;
    // const str = `> ${module.toString()}, ${action.toString()}${context?',':'.'} ${context} ${logLevel === LogType.success? '[Successful]': logLevel === LogType.error?'[Failed]': ''}`;
    switch (logLevel) {
        case LogType.error: {
            console.log(chalk.hex("#ff471a").bold(_str));
            break;
        }
        case LogType.warn: {
            console.log(chalk.hex("#ff8533").bold(_str));
            break;
        }
        case LogType.info: {
            console.log(chalk.hex("#00ccff").bgHex('#0d0d0d').bold(_str));
            break;
        }
        case LogType.success: {
            console.log(chalk.hex("#66ff99").bgHex('#0d0d0d').bold(_str));
            break;
        }
    }
};
//# sourceMappingURL=logger.js.map