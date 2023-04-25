import dotenv from "dotenv";
import { startExpress } from "./src/api/healthController";
import { addMailListener } from "./src/mail";
import { serverError, ModuleType, ActionType } from './src/logger';
import { connectDatabase } from "./src/database/mongoose";

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