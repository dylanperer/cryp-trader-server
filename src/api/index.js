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
exports.startExpress = exports.expressApp = void 0;
const express_1 = __importDefault(require("express"));
const logger_1 = require("../logger");
const log_1 = require("./log");
const logger_2 = require("../logger");
exports.expressApp = (0, express_1.default)();
exports.expressApp.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
exports.expressApp.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send("live");
    }
    catch (error) {
        (0, logger_1.serverError)(logger_2.ModuleType.Api, logger_2.ActionType.apiEndpoint, '/');
    }
}));
const startExpress = () => {
    const port = process.env.PORT;
    exports.expressApp.listen(port, () => {
        (0, logger_1.serverSuccess)(logger_2.ModuleType.Api, logger_2.ActionType.apiStarted, `Port:${port}`);
    });
};
exports.startExpress = startExpress;
(0, log_1.archivedLogs)(exports.expressApp);
(0, log_1.liveSessionLogs)(exports.expressApp);
