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
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../logger");
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const connectionUri = process.env.DB_URI;
    try {
        if (!connectionUri)
            throw new Error(`Invalid database connect uri`);
        const conn = yield mongoose_1.default.connect(connectionUri);
        (0, logger_1.serverSuccess)(logger_1.ModuleType.Database, logger_1.ActionType.connectDatabase);
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Database, logger_1.ActionType.connectDatabase, error.message);
    }
});
exports.connectDatabase = connectDatabase;
