import dotenv from "dotenv";
import { startExpress } from "./src/api/healthController";
import { addMailListener } from "./src/mail";
import { serverError, ModuleType, ActionType, serverInfo } from './src/logger';
import moment from "moment";
import { prisma } from "./prisma/prisma";

dotenv.config();

const startServer = async() => {
  try {
    startExpress();

    addMailListener();

    const trade = await prisma.trade.create({data: {side: 'sell', entryPrice: 10, exitPrice: 0}});
    console.log(trade);

  } catch (error:any) {
    serverError(ModuleType.Server, ActionType.serverStart, `${error.message}`)    
  }

};

startServer();