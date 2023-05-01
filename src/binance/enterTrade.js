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
exports.findLowestAsk = exports.placeOrder = exports.createTrade = void 0;
const constants_1 = require("../../constants");
const prisma_1 = require("../../prisma/prisma");
const logger_1 = require("../logger");
const tradeSettings_1 = require("./tradeSettings");
const binance_1 = require("./binance");
const createTrade = (client, entryAlert) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check for still active trades
        const activeTrade = yield prisma_1.prisma.trade.findFirst({
            where: { status: constants_1.TradeStatus.Active },
        });
        if (activeTrade) {
            (0, logger_1.serverWarn)(logger_1.ModuleType.Binance, logger_1.ActionType.createTrade, `trade [${activeTrade.id}] is still active. New trade is discarded.`);
            return null;
        }
        //get trade settings
        const tradSettings = (0, tradeSettings_1.getTradeSettings)();
        if (!tradSettings) {
            throw new Error("Invalid trade settings. Unable to create trade.");
        }
        const { market, baseCoin, symbol, margin } = tradSettings;
        //validate alert side
        const side = entryAlert.side === constants_1.AlertAction.Long
            ? "Buy"
            : entryAlert.side === constants_1.AlertAction.Short
                ? "Short"
                : null;
        if (!side) {
            (0, logger_1.serverWarn)(logger_1.ModuleType.Binance, logger_1.ActionType.createTrade, `side [${side}] is invalid. No trade created.`);
            return null;
        }
        //create trade record with partial info
        const coinAsset = yield (0, binance_1.getCoinAsset)(client);
        const trade = yield prisma_1.prisma.trade.create({
            data: {
                market: market,
                baseCoin: baseCoin,
                symbol: symbol,
                side: side.toString(),
                status: constants_1.TradeStatus.Processing,
                margin: Number(margin),
                entryAlertId: entryAlert.id,
                entryAlertPrice: entryAlert.price,
                entryWalletBalance: Number(coinAsset === null || coinAsset === void 0 ? void 0 : coinAsset.walletBalance),
            },
        });
        return trade;
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Binance, logger_1.ActionType.createTrade, error.message);
        return null;
    }
});
exports.createTrade = createTrade;
const placeOrder = (client, entryAlert) => __awaiter(void 0, void 0, void 0, function* () {
    const trade = yield (0, exports.createTrade)(client, entryAlert);
    if (trade) {
    }
});
exports.placeOrder = placeOrder;
const findLowestAsk = (client, trade) => __awaiter(void 0, void 0, void 0, function* () {
    const orderBook = yield client.getOrderBook({
        symbol: trade.symbol,
        limit: 500,
    });
    if (!orderBook || !orderBook.asks || orderBook.asks.length === 0) {
        throw new Error("fetching order book error");
    }
    const asks = orderBook.asks;
    let lowestAsk = asks[0];
    for (let i = 1; i < asks.length; i++) {
        const currentAsk = asks[i];
        if (currentAsk[0] < lowestAsk[0]) {
            lowestAsk = currentAsk;
        }
    }
    console.log(lowestAsk);
    return lowestAsk;
});
exports.findLowestAsk = findLowestAsk;
