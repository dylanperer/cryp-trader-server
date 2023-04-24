import express from "express";
import http from "http";
import WebSocket from "ws";
import {
  IServerLog,
  ServerModuleType,
  MailActionType,
  LogType,
  readServerLogFromCsv,
} from "../logger/logger";

const app = express();
const server = http.createServer(app);

const websocketServer = new WebSocket.Server({ server: server });

websocketServer.on("connection", (user: WebSocket) => {
  console.log("@> new client connected", user);

  user.send("@> hello client");

  user.on("message", (incomingMessage) =>
    console.log("@> from client ", incomingMessage)
  );
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", async (req, res) => {
  const logs = await readServerLogFromCsv("temp1/log1.csv");
  res.send(logs);
});

export const startExpress = (logs: Array<IServerLog>) => {
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
};
