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
const dotenv_1 = __importDefault(require("dotenv"));
const healthController_1 = require("./src/api/healthController");
const mail_1 = require("./src/mail");
const logger_1 = require("./src/logger");
const mongoose_1 = require("./src/database/mongoose");
dotenv_1.default.config();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connectDatabase)();
        (0, healthController_1.startExpress)();
        (0, mail_1.addMailListener)();
        // setInterval(()=>{
        //   serverInfo(ModuleType.Server, ActionType.serverStart, moment().toLocaleString());
        // }, 1000)
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Server, logger_1.ActionType.serverStart, `${error.message}`);
    }
});
startServer();
