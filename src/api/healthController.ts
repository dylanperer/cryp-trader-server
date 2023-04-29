import express from "express";
import https from "https";
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
import path from "path";

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
  console.log(path.join(__dirname.replace(`\\src\\api`,''), 'cert', 'key.pem'));
  const sslSever = https.createServer({
    key: fs.readFileSync(path.join(__dirname.replace(`\\src\\api`,''), 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname.replace(`\\src\\api`,''), 'cert', 'cert.pem')),
  }, app);

  sslSever.listen(port, () => {
    serverSuccess(ModuleType.Api, ActionType.apiStarted, `Port:${port}`);
  });

};
