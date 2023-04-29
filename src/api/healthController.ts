import express from "express";
import { serverSuccess, serverError, serverInfo } from '../logger';
import { prisma } from '../../prisma/prisma';
import * as fs from 'fs';


import {
  IServerLog,
  ModuleType,
  ActionType,
  LogType,
  readServerLogFromCsv,
} from "../logger";

const app = express();

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

app.get("/logs", async (req, res)=>{
  try{  
    res.send(await prisma.log.findMany());
  }catch(error){
    serverError(ModuleType.Api, ActionType.apiEndpoint, '/logs');
  }
});

export const startExpress = () => {
  const port = process.env.PORT;

  app.listen(port, () => {
    serverSuccess(ModuleType.Api, ActionType.apiStarted, `Port:${port}`);
  });

};
