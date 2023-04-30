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
exports.serverSuccess = exports.serverWarn = exports.serverInfo = exports.serverError = exports.readServerLogFromCsv = exports.LogType = exports.ActionType = exports.ModuleType = void 0;
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const fs = __importStar(require("fs"));
const csv_parse_1 = require("csv-parse");
const prisma_1 = require("../prisma/prisma");
var ModuleType;
(function (ModuleType) {
    ModuleType["Mail"] = "Mail";
    ModuleType["Binance"] = "Binance";
    ModuleType["Server"] = "Server";
    ModuleType["Api"] = "Express";
    ModuleType["Database"] = "Database";
})(ModuleType = exports.ModuleType || (exports.ModuleType = {}));
var ActionType;
(function (ActionType) {
    ActionType["addMailListener"] = "Attaching mail listener";
    ActionType["onReceiveMail"] = "Receiving mail";
    ActionType["mailError"] = "Mail error";
    ActionType["mailRestart"] = "Restarting listener";
    ActionType["mailRefresh"] = "Restarting refresh";
    ActionType["alertParse"] = "Parsing alert";
    ActionType["serverStart"] = "String server";
    ActionType["serverError"] = "Server error";
    ActionType["apiStarted"] = "Starting express api";
    ActionType["apiError"] = "Express error";
    ActionType["apiEndpoint"] = "Express endpoint";
    ActionType["connectDatabase"] = "Connecting to database";
    ActionType["databaseError"] = "Database error";
    ActionType["databaseInsert"] = "Inserting into database";
    ActionType["connectBinance"] = "Connecting to binance";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var LogType;
(function (LogType) {
    LogType["info"] = "[Info]";
    LogType["warn"] = "[Warning]";
    LogType["error"] = "[Error]";
    LogType["success"] = "[Successful]";
})(LogType = exports.LogType || (exports.LogType = {}));
const writeServerLogToCsv = (serverLog, filePath) => {
    var _a, _b;
    const headerRow = "module,action,context,logLevel\n";
    const dataRow = `${serverLog.module},${serverLog.action},${(_a = serverLog.context) !== null && _a !== void 0 ? _a : ""},${(_b = serverLog.logLevel) !== null && _b !== void 0 ? _b : ""}\n`;
    // If the file already exists, append the data to it; otherwise, create a new file.
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, dataRow);
    }
    else {
        fs.writeFileSync(filePath, headerRow + dataRow);
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
const Log = (module, action, context, logLevel) => {
    const str = buildLogStr(module, action, logLevel, context);
    const _str = `> ${str}`;
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
};
const buildLogStr = (module, action, logLevel, context) => {
    const formattedTime = (0, moment_1.default)(new Date()).format("DD/MM/YYYY h:mm:ss");
    const str = `${formattedTime} [${module.toString()}] [${action.toString()}] ${context ? context.concat(".") : ""}`;
    (0, prisma_1.getActiveSession)().then((session) => {
        if (session) {
            prisma_1.prisma.log
                .create({
                data: {
                    sessionId: session.id,
                    module: module.toString(),
                    action: action.toString(),
                    logLevel: (logLevel === null || logLevel === void 0 ? void 0 : logLevel.toString()) || LogType.info.toString(),
                    context: context,
                },
            })
                .then();
        }
    });
    return str;
};
const serverError = (module, action, context) => {
    Log(module, action, context, LogType.error);
};
exports.serverError = serverError;
const serverInfo = (module, action, context) => {
    Log(module, action, context, LogType.info);
};
exports.serverInfo = serverInfo;
const serverWarn = (module, action, context) => {
    Log(module, action, context, LogType.warn);
};
exports.serverWarn = serverWarn;
const serverSuccess = (module, action, context) => {
    Log(module, action, context, LogType.success);
};
exports.serverSuccess = serverSuccess;
