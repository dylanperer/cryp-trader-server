import dotenv from "dotenv";
import { startExpress } from "./src/api/healthController";
import { addMailListener } from "./src/mail";
import { serverError, ModuleType, ActionType, serverInfo } from './src/logger';
import { connectDatabase } from "./src/database/mongoose";
import moment from "moment";

dotenv.config();

const startServer = async() => {
  try {
    await connectDatabase();

    startExpress();

    // addMailListener();
    setInterval(()=>{
      serverInfo(ModuleType.Server, ActionType.serverStart, moment().toLocaleString());
    }, 1000)
    
  } catch (error:any) {
    serverError(ModuleType.Server, ActionType.serverStart, `${error.message}`)    
  }

};

startServer();