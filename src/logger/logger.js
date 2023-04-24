"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerLog = exports.LogType = exports.MailActionType = exports.ServerModuleType = void 0;
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const fs = __importStar(require("fs"));
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
const writeServerLogToCsv = (serverLog, filePath) => {
    var _a, _b;
    const headerRow = 'module,action,context,logLevel\n';
    const dataRow = `${serverLog.module},${serverLog.action},${(_a = serverLog.context) !== null && _a !== void 0 ? _a : ''},${(_b = serverLog.logLevel) !== null && _b !== void 0 ? _b : ''}\n`;
    // If the file already exists, append the data to it; otherwise, create a new file.
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, dataRow);
    }
    else {
        fs.writeFileSync(filePath, headerRow + dataRow);
    }
};
const ServerLog = (module, action, context, logLevel) => {
    if (!logLevel) {
        logLevel = LogType.info;
    }
    const formattedTime = (0, moment_1.default)(new Date()).format('DD/MM/YYYY h:mm:ss');
    console.log('@> WRITTING TO FILE');
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
    writeServerLogToCsv({ module, action, context, logLevel }, 'log.csv');
};
exports.ServerLog = ServerLog;
