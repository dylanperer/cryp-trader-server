"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mail_1 = require("./mail/mail");
dotenv_1.default.config();
(0, mail_1.addMailListener)(process.env.EMAIL_ADDRESS || "", process.env.EMAIL_PASSWORD || "");
