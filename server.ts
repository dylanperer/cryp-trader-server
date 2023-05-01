import dotenv from "dotenv";
import { addMailListener, getDelay } from "./src/mail";
import { serverError, ModuleType, ActionType, serverInfo } from "./src/logger";
import { prisma, endPreviousSession, createSession } from "./prisma/prisma";
import { v4 } from "uuid";
import moment from "moment";
import { connectToBinance } from "./src/binance/binance";
import { startExpress } from "./src/api";
dotenv.config();

const configureServer = async () => {
  try {
    await endPreviousSession();
    await createSession();

    // startExpress();
    // await addMailListener();
    await connectToBinance();
  } catch (error: any) {
    serverError(ModuleType.Server, ActionType.serverStart, `${error.message}`);
  }
};

const main = async () => {
  await configureServer();
};

main();
