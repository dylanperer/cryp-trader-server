"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradeSettings = void 0;
const logger_1 = require("../logger");
const getTradeSettings = () => {
    const market = process.env.MARKET;
    const baseCoin = process.env.BASE_COIN;
    const symbol = process.env.SYMBOL;
    const margin = process.env.MARGIN;
    try {
        if (!market) {
            throw new Error(`Invalid market configuration`);
        }
        if (!baseCoin) {
            throw new Error(`Invalid base coin configuration`);
        }
        if (!symbol) {
            throw new Error(`Invalid base coin configuration`);
        }
        if (!margin) {
            throw new Error(`Invalid margin configuration`);
        }
        const tradeSettings = {
            market,
            baseCoin,
            symbol,
            margin,
        };
        (0, logger_1.serverSuccess)(logger_1.ModuleType.Binance, logger_1.ActionType.tradeConfiguration);
        return tradeSettings;
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Binance, logger_1.ActionType.tradeConfiguration, `${error.message}`);
        return null;
    }
};
exports.getTradeSettings = getTradeSettings;
