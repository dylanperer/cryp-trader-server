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
exports.getCoinAsset = exports.connectToBinance = void 0;
const binance_1 = require("binance");
const logger_1 = require("../logger");
const tradeSettings_1 = require("./tradeSettings");
const enterTrade_1 = require("./enterTrade");
const connectToBinance = () => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_SECRET_KEY;
    try {
        if (!apiKey || !apiSecret) {
            throw new Error(`Invalid api or secret key`);
        }
        const client = new binance_1.USDMClient({
            api_key: apiKey,
            api_secret: apiSecret,
        });
        (0, tradeSettings_1.getTradeSettings)();
        const coinAsset = yield (0, exports.getCoinAsset)(client);
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            //@ts-ignore
            yield (0, enterTrade_1.findLowestAsk)(client, { symbol: 'ETHUSDT' });
        }), 3000);
        (0, logger_1.serverSuccess)(logger_1.ModuleType.Binance, logger_1.ActionType.connectBinance, `coin: ${coinAsset === null || coinAsset === void 0 ? void 0 : coinAsset.asset} ballance ${coinAsset === null || coinAsset === void 0 ? void 0 : coinAsset.availableBalance}`);
    }
    catch (e) {
        (0, logger_1.serverError)(logger_1.ModuleType.Binance, logger_1.ActionType.connectBinance, e.message);
    }
});
exports.connectToBinance = connectToBinance;
const getCoinAsset = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const coin = process.env.BASE_COIN;
    const info = yield client.getAccountInformation();
    const coinAsset = info.assets.find((c) => c.asset === coin);
    return coinAsset;
});
exports.getCoinAsset = getCoinAsset;
