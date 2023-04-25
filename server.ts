import dotenv from "dotenv";
import { startExpress } from "./src/api/healthController";
import { addMailListener } from "./src/mail";
import { serverError, ModuleType, ActionType, serverInfo } from './src/logger';
import { connectDatabase } from "./src/database/mongoose";
import moment from "moment";
import { TradeModel } from "./src/database/models/trade";

dotenv.config();

const startServer = async() => {
  try {
    await connectDatabase();

    startExpress();

    addMailListener();
    
  } catch (error:any) {
    serverError(ModuleType.Server, ActionType.serverStart, `${error.message}`)    
  }

};

startServer();