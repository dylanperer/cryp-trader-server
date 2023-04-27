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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._SERVER_START_TIME = exports._SESSION_ID = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const healthController_1 = require("./src/api/healthController");
const mail_1 = require("./src/mail");
const logger_1 = require("./src/logger");
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
dotenv_1.default.config();
exports._SESSION_ID = (0, uuid_1.v4)();
exports._SERVER_START_TIME = (0, moment_1.default)();
const configureServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, healthController_1.startExpress)();
        (0, mail_1.addMailListener)();
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Server, logger_1.ActionType.serverStart, `${error.message}`);
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield configureServer();
});
main();
