"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpress = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
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
app.get("/", (req, res) => {
    res.send('ho');
});
const startExpress = (logs) => {
    app.listen(3000, () => {
        console.log("Server listening on port 3000");
    });
};
exports.startExpress = startExpress;
