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
exports.archivedLogs = exports.liveSessionLogs = void 0;
const prisma_1 = require("../../prisma/prisma");
const logger_1 = require("../logger");
const route = "log";
//live session's logs
const liveSessionLogs = (expressApp) => {
    expressApp.get(`/${route}/live`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const liveSession = yield prisma_1.prisma.session.findFirst({
                where: { hasEnded: "false" },
            });
            const logs = yield prisma_1.prisma.log.findMany({
                where: { sessionId: liveSession === null || liveSession === void 0 ? void 0 : liveSession.id },
            });
            res.status(200).send({ session: liveSession, logs: logs });
        }
        catch (error) {
            (0, logger_1.serverError)(logger_1.ModuleType.Api, logger_1.ActionType.apiEndpoint, `/${route}/live`);
        }
    }));
};
exports.liveSessionLogs = liveSessionLogs;
//archived logs
const archivedLogs = (expressApp) => {
    expressApp.get(`/${route}/archive`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const archivedSessions = yield prisma_1.prisma.session.findMany({
                where: { hasEnded: "true" },
            });
            const sessions = [];
            // Use map to create an array of promises
            const sessionPromises = archivedSessions.map((c) => __awaiter(void 0, void 0, void 0, function* () {
                const session = {
                    session: c,
                    logs: [],
                };
                const sessionLogs = yield prisma_1.prisma.log.findMany({
                    where: { sessionId: c.id },
                });
                sessionLogs.map((u) => {
                    session.logs.push(u);
                });
                return session;
            }));
            // Use Promise.all to wait for all promises to resolve
            const resolvedSessions = yield Promise.all(sessionPromises);
            // Add the resolved sessions to the response
            resolvedSessions.forEach((session) => {
                sessions.push(session);
            });
            res.status(200).send(sessions);
        }
        catch (error) {
            (0, logger_1.serverError)(logger_1.ModuleType.Api, logger_1.ActionType.apiEndpoint, `/${route}/archive`);
        }
    }));
};
exports.archivedLogs = archivedLogs;
