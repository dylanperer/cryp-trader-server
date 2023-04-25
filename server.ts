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

    // addMailListener();
    
    await TradeModel.deleteMany({});

    setInterval(async ()=>{
       const res = await TradeModel.insertMany([
        {
          tradeEvent: moment().toLocaleString(),
          entryPrice: 0.00
        },
      ]);
      console.log('Inserted', res)
    }, 2000)
    
  } catch (error:any) {
    serverError(ModuleType.Server, ActionType.serverStart, `${error.message}`)    
  }

};

startServer();