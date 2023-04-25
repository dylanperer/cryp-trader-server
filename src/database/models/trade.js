"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const TradeSchema = new mongoose_1.default.Schema({
    created: {
        type: Date,
        default: () => (0, moment_1.default)()
    },
    tradeEvent: {
        type: String,
        required: true,
    },
    entryPrice: {
        type: Number,
        required: true,
    },
});
exports.TradeModel = mongoose_1.default.model('Trade', TradeSchema);
