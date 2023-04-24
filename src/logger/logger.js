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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerLog = exports.readServerLogFromCsv = exports.LogType = exports.MailActionType = exports.ServerModuleType = void 0;
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const fs = __importStar(require("fs"));
const csv_parse_1 = require("csv-parse");
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
const createFolder = (cb) => {
    const folderName = "temp";
    // Check if the directory already exists
    fs.stat(folderName, (err, stats) => {
        if (err && err.code === "ENOENT") {
            // If the directory does not exist, create it
            fs.mkdir(folderName, (err) => {
                if (err)
                    throw err;
                console.log("Directory created");
                fs.chmod(folderName, 0o777, (err) => {
                    if (err)
                        throw err;
                    console.log("Directory created with read and write permissions");
                    cb();
                });
            });
        }
        else if (err) {
            // If there was an error other than the directory not existing, throw it
            throw err;
        }
        else {
            // If the directory already exists, log a message
            console.log("Directory already exists");
            cb();
        }
    });
};
const writeServerLogToCsv = (serverLog, filePath) => {
    var _a, _b;
    const headerRow = "module,action,context,logLevel\n";
    const dataRow = `${serverLog.module},${serverLog.action},${(_a = serverLog.context) !== null && _a !== void 0 ? _a : ""},${(_b = serverLog.logLevel) !== null && _b !== void 0 ? _b : ""}\n`;
    if (fs.existsSync(filePath)) {
        // Check if the file has the necessary permissions
        try {
            fs.accessSync(filePath, fs.constants.W_OK | fs.constants.R_OK);
        }
        catch (error) {
            // If file does not have the necessary permissions, try to modify the permissions
            try {
                fs.chmodSync(filePath, 0o666);
            }
            catch (error) {
                console.error(`Unable to modify permissions for file ${filePath}`);
                return;
            }
        }
        // If the file already exists and has the necessary permissions, append the data to it
        fs.appendFileSync(filePath, dataRow);
    }
    else {
        // If the file does not exist, create a new file with the necessary permissions
        try {
            fs.writeFileSync(filePath, headerRow + dataRow, { mode: 0o666 });
        }
        catch (error) {
            console.error(`Unable to create file ${filePath}`);
            return;
        }
    }
};
const readServerLogFromCsv = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const serverLogs = [];
    // Read the CSV file
    const csvData = yield fs.promises.readFile(filePath);
    // Parse the CSV data
    const records = yield (0, csv_parse_1.parse)(csvData, {
        columns: true,
        skip_empty_lines: true,
    });
    try {
        // Convert each CSV record to an IServerLog object
        for (var _d = true, records_1 = __asyncValues(records), records_1_1; records_1_1 = yield records_1.next(), _a = records_1_1.done, !_a;) {
            _c = records_1_1.value;
            _d = false;
            try {
                const record = _c;
                const serverLog = {
                    module: record.module,
                    action: record.action,
                    context: record.context || undefined,
                    logLevel: record.logLevel || undefined,
                };
                serverLogs.push(serverLog);
            }
            finally {
                _d = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = records_1.return)) yield _b.call(records_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return serverLogs;
});
exports.readServerLogFromCsv = readServerLogFromCsv;
const ServerLog = (module, action, context, logLevel) => {
    if (!logLevel) {
        logLevel = LogType.info;
    }
    const formattedTime = (0, moment_1.default)(new Date()).format("DD/MM/YYYY h:mm:ss");
    const str = `${formattedTime} ${logLevel.toString()} ${module.toString()} ${action.toString()}${context ? " | ".concat(context).concat(".") : "."}`;
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
            console.log(chalk_1.default.hex("#00ccff").bgHex("#0d0d0d").bold(_str));
            break;
        }
        case LogType.success: {
            console.log(chalk_1.default.hex("#66ff99").bgHex("#0d0d0d").bold(_str));
            break;
        }
    }
    createFolder(() => writeServerLogToCsv({ module, action, context, logLevel }, "temp/log.csv"));
};
exports.ServerLog = ServerLog;
