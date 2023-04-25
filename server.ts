import dotenv from "dotenv";
import { startExpress } from "./src/api/healthController";
import { addMailListener } from "./src/mail";
import { serverError, ModuleType, ActionType, serverInfo } from './src/logger';
import moment from "moment";
import { prisma } from "./prisma/prisma";

dotenv.config();

const startServer = async() => {
  try {
    const deleteLogsRes = await prisma.log.deleteMany();
    serverInfo(ModuleType.Server, ActionType.serverStart, `${deleteLogsRes.count} old logs cleared`);
    startExpress();

    addMailListener();

  } catch (error:any) {
    serverError(ModuleType.Server, ActionType.serverStart, `${error.message}`)    
  }

};

startServer();