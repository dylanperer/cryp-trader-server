import express from "express";
import http from "http";
import { serverSuccess, serverError } from '../logger';


import {
  IServerLog,
  ModuleType,
  ActionType,
  LogType,
  readServerLogFromCsv,
} from "../logger";

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", async (req, res) => {
  try {
    res.send("OK")
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
