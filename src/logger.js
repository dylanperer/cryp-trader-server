"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerLog = exports.LogType = exports.MailActionType = exports.ServerModuleType = void 0;
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
var ServerModuleType;
(function (ServerModuleType) {
    ServerModuleType["Mail"] = "Mail";
    ServerModuleType["Binance"] = "Binance";
})(ServerModuleType = exports.ServerModuleType || (exports.ServerModuleType = {}));
var MailActionType;
(function (MailActionType) {
    MailActionType["attachListener"] = "attach-listener";
    MailActionType["receiveMail"] = "receive-mail";
    MailActionType["error"] = "mail-error";
})(MailActionType = exports.MailActionType || (exports.MailActionType = {}));
var LogType;
(function (LogType) {
    LogType["info"] = "[Info]";
    LogType["warn"] = "[Warning]";
    LogType["error"] = "[Error]";
    LogType["success"] = "[Successful]";
})(LogType = exports.LogType || (exports.LogType = {}));
const ServerLog = (module, action, context, logLevel) => {
    if (!logLevel) {
        logLevel = LogType.info;
    }
    const formattedTime = (0, moment_1.default)(new Date()).format('DD/MM/YYYY h:mm:ss');
    const str = `${formattedTime} ${logLevel.toString()} ${module.toString()} ${action.toString()}${context ? ' | '.concat(context).concat('.') : '.'}`;
    const _str = `> ${str}`;
    // const str = `> ${module.toString()}, ${action.toString()}${context?',':'.'} ${context} ${logLevel === LogType.success? '[Successful]': logLevel === LogType.error?'[Failed]': ''}`;
    switch (logLevel) {
        case LogType.error: {
            console.log(chalk_1.default.hex("#ff471a").bold(_str));
            break;
        }
        case LogType.warn: {
            console.log(chalk_1.default.hex("#ff8533").bold(_str));
            break;
        }
        case LogType.info: {
            console.log(chalk_1.default.hex("#00ccff").bgHex('#0d0d0d').bold(_str));
            break;
        }
        case LogType.success: {
            console.log(chalk_1.default.hex("#66ff99").bgHex('#0d0d0d').bold(_str));
            break;
        }
    }
};
exports.ServerLog = ServerLog;
