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
const mail_1 = require("./src/mail");
const logger_1 = require("./src/logger");
const prisma_1 = require("./prisma/prisma");
const api_1 = require("./src/api");
dotenv_1.default.config();
const configureServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, prisma_1.endPreviousSession)();
        yield (0, prisma_1.createSession)();
        (0, api_1.startExpress)();
        yield (0, mail_1.addMailListener)();
        // await connectToBinance();
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Server, logger_1.ActionType.serverStart, `${error.message}`);
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield configureServer();
});
main();
