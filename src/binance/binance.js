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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTrade = exports.connectToBinance = void 0;
const binance_1 = require("binance");
const logger_1 = require("../logger");
const connectToBinance = () => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_SECRET_KEY;
    try {
        if (!apiKey || !apiSecret) {
            throw new Error(`Invalid api or secret key`);
        }
        const client = new binance_1.MainClient({
            api_key: apiKey,
            api_secret: apiSecret,
        });
        const status = yield client.getAccountStatus();
        (0, logger_1.serverSuccess)(logger_1.ModuleType.Binance, logger_1.ActionType.connectBinance, `status ${status.data}`);
    }
    catch (e) {
        (0, logger_1.serverError)(logger_1.ModuleType.Binance, logger_1.ActionType.connectBinance, e.message);
    }
});
exports.connectToBinance = connectToBinance;
const startTrade = () => {
    //check balance of coin pair
    //get 
};
exports.startTrade = startTrade;
