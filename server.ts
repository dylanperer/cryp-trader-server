import dotenv from "dotenv";
import { startExpress } from "./src/api/healthController";
import { addMailListener, attachMailListener, getDelay } from "./src/mail";
import { serverError, ModuleType, ActionType, serverInfo } from "./src/logger";
import { prisma } from "./prisma/prisma";
import { v4 } from "uuid";
import moment from "moment";
import { connectToBinance } from "./src/binance/binance";
dotenv.config();
export const _SESSION_ID = v4();
export const _SERVER_START_TIME = moment();

const configureServer = async () => {
  try {
    startExpress();

    await addMailListener();
    await connectToBinance();
  } catch (error: any) {
    serverError(ModuleType.Server, ActionType.serverStart, `${error.message}`);
  }
};

const main = async () => {
  await configureServer();
};

main();
