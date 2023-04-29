"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const https_1 = __importDefault(require("https"));
const logger_1 = require("../logger");
const prisma_1 = require("../../prisma/prisma");
const fs = __importStar(require("fs"));
const logger_2 = require("../logger");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send("OK");
    }
    catch (error) {
        (0, logger_1.serverError)(logger_2.ModuleType.Api, logger_2.ActionType.apiEndpoint, '/');
    }
}));
app.get("/logs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send(yield prisma_1.prisma.log.findMany());
    }
    catch (error) {
        (0, logger_1.serverError)(logger_2.ModuleType.Api, logger_2.ActionType.apiEndpoint, '/logs');
    }
}));
const startExpress = () => {
    const port = process.env.PORT;
    console.log(path_1.default.join(__dirname.replace(`\\src\\api`, ''), 'cert', 'key.pem'));
    const sslSever = https_1.default.createServer({
        key: fs.readFileSync(path_1.default.join(__dirname.replace(`\\src\\api`, ''), 'cert', 'key.pem')),
        cert: fs.readFileSync(path_1.default.join(__dirname.replace(`\\src\\api`, ''), 'cert', 'cert.pem')),
    }, app);
    sslSever.listen(port, () => {
        (0, logger_1.serverSuccess)(logger_2.ModuleType.Api, logger_2.ActionType.apiStarted, `Port:${port}`);
    });
};
exports.startExpress = startExpress;
