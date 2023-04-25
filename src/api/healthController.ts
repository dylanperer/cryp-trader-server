import express from "express";
import http from "http";
import WebSocket from "ws";
import { serverSuccess, serverError } from '../logger';
import { TradeModel } from '../database/models/trade';


import {
  IServerLog,
  ModuleType,
  ActionType,
  LogType,
  readServerLogFromCsv,
} from "../logger";

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
  try {
    const _res = await TradeModel.insertMany([
      {
        tradeEvent: 'Buy',
        entryPrice: 10.99
      },
      {
        tradeEvent: 'Sell',
        entryPrice: 12.34
      }
    ]);
    res.send(_res)
  } catch (error) {
    serverError(ModuleType.Api, ActionType.apiEndpoint, '/');
  }
});

export const startExpress = () => {
  const port = process.env.PORT;
  app.listen(port, () => {
    serverSuccess(ModuleType.Api, ActionType.apiStarted, `Port:${port}`);
  });
};
