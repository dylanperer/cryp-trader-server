import dotenv from "dotenv";
import { startExpress } from "./src/api/healthController";
import { addMailListener } from "./src/mail";
import {
  IServerLog,
  MailActionType,
  ServerModuleType,
  LogType,
} from "./src/logger";
import * as fs from "fs";

dotenv.config();

const CURRENT_LOGS: Array<IServerLog> = [
  {
    module: ServerModuleType.Mail,
    action: MailActionType.attachListener,
    context: "",
    logLevel: LogType.success,
  },
];


startExpress(CURRENT_LOGS);

addMailListener(
  process.env.EMAIL_ADDRESS || "",
  process.env.EMAIL_PASSWORD || ""
);
