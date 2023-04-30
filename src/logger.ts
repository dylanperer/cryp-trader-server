import chalk from "chalk";
import moment from "moment";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { getActiveSession, prisma } from "../prisma/prisma";

export enum ModuleType {
  Mail = "Mail",
  Binance = "Binance",
  Server = "Server",
  Api = "Express",
  Database = "Database",
}

export enum ActionType {
  addMailListener = "Attaching mail listener",
  onReceiveMail = "Receiving mail",
  mailError = "Mail error",
  mailRestart = "Restarting listener",
  mailRefresh = "Restarting refresh",
  alertParse = "Parsing alert",

  serverStart = "String server",
  serverError = "Server error",

  apiStarted = "Starting express api",
  apiError = "Express error",
  apiEndpoint = "Express endpoint",

  connectDatabase = "Connecting to database",
  databaseError = "Database error",
  databaseInsert = "Inserting into database",

  connectBinance = "Connecting to binance",
}

export enum LogType {
  info = "[Info]",
  warn = "[Warning]",
  error = "[Error]",
  success = "[Successful]",
}

export interface IServerLog {
  module: ModuleType;
  action: ActionType;
  context?: string;
  logLevel?: LogType;
}

const writeServerLogToCsv = (serverLog: IServerLog, filePath: string): void => {
  const headerRow = "module,action,context,logLevel\n";
  const dataRow = `${serverLog.module},${serverLog.action},${
    serverLog.context ?? ""
  },${serverLog.logLevel ?? ""}\n`;

  // If the file already exists, append the data to it; otherwise, create a new file.
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, dataRow);
  } else {
    fs.writeFileSync(filePath, headerRow + dataRow);
  }
};

export const readServerLogFromCsv = async (
  filePath: string
): Promise<IServerLog[]> => {
  const serverLogs: IServerLog[] = [];

  // Read the CSV file
  const csvData = await fs.promises.readFile(filePath);

  // Parse the CSV data
  const records = await parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  // Convert each CSV record to an IServerLog object
  for await (const record of records) {
    const serverLog: IServerLog = {
      module: record.module,
      action: record.action,
      context: record.context || undefined,
      logLevel: record.logLevel || undefined,
    };
    serverLogs.push(serverLog);
  }

  return serverLogs;
};

const Log = (
  module: ModuleType,
  action: ActionType,
  context?: string,
  logLevel?: LogType
) => {
  const str = buildLogStr(module, action, logLevel, context);

  const _str = `> ${str}`;

  switch (logLevel) {
    case LogType.error: {
      console.log(chalk.hex("#ff471a").bold(_str));
      break;
    }
    case LogType.warn: {
      console.log(chalk.hex("#ff8533").bold(_str));
      break;
    }
    case LogType.info: {
      console.log(chalk.hex("#00ccff").bgHex("#0d0d0d").bold(_str));
      break;
    }
    case LogType.success: {
      console.log(chalk.hex("#66ff99").bgHex("#0d0d0d").bold(_str));
      break;
    }
  }
};

const buildLogStr = (
  module: ModuleType,
  action: ActionType,
  logLevel?: LogType,
  context?: string
) => {
  const formattedTime = moment(new Date()).format("DD/MM/YYYY h:mm:ss");

  const str = `${formattedTime} [${module.toString()}] [${action.toString()}] ${
    context ? context.concat(".") : ""
  }`;

  getActiveSession().then((session) => {
    if (session) {
      prisma.log
        .create({
          data: {
            sessionId: session.id,
            module: module.toString(),
            action: action.toString(),
            logLevel: logLevel?.toString() || LogType.info.toString(),
            context: context,
          },
        })
        .then();
    }
  });

  return str;
};
export const serverError = (
  module: ModuleType,
  action: ActionType,
  context?: string
) => {
  Log(module, action, context, LogType.error);
};

export const serverInfo = (
  module: ModuleType,
  action: ActionType,
  context?: string
) => {
  Log(module, action, context, LogType.info);
};

export const serverWarn = (
  module: ModuleType,
  action: ActionType,
  context?: string
) => {
  Log(module, action, context, LogType.warn);
};

export const serverSuccess = (
  module: ModuleType,
  action: ActionType,
  context?: string
) => {
  Log(module, action, context, LogType.success);
};
