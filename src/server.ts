import dotenv from "dotenv";
import { startExpress } from "./api/healthController";
import { addMailListener } from './mail/mail';
import { IServerLog, MailActionType, ServerModuleType, LogType } from './logger/logger';

dotenv.config();

const CURRENT_LOGS:Array<IServerLog> = [{module:ServerModuleType.Mail, action:MailActionType.attachListener, context:'', logLevel: LogType.success}];

startExpress(CURRENT_LOGS);

addMailListener(
  process.env.EMAIL_ADDRESS || "",
  process.env.EMAIL_PASSWORD || ""
);

