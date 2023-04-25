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
exports.startExpress = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const logger_1 = require("../logger");
const trade_1 = require("../database/models/trade");
const logger_2 = require("../logger");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const websocketServer = new ws_1.default.Server({ server: server });
websocketServer.on("connection", (user) => {
    console.log("@> new client connected", user);
    user.send("@> hello client");
    user.on("message", (incomingMessage) => console.log("@> from client ", incomingMessage));
});
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _res = yield trade_1.TradeModel.insertMany([
            {
                tradeEvent: 'Buy',
                entryPrice: 10.99
            },
            {
                tradeEvent: 'Sell',
                entryPrice: 12.34
            }
        ]);
        res.send(_res);
    }
    catch (error) {
        (0, logger_1.serverError)(logger_2.ModuleType.Api, logger_2.ActionType.apiEndpoint, '/');
    }
}));
const startExpress = () => {
    const port = process.env.PORT;
    app.listen(port, () => {
        (0, logger_1.serverSuccess)(logger_2.ModuleType.Api, logger_2.ActionType.apiStarted, `Port:${port}`);
    });
};
exports.startExpress = startExpress;
