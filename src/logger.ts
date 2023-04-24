import chalk from "chalk";
import moment from "moment";
import * as fs from 'fs';
import * as path from 'path';
import {parse} from 'csv-parse';

export enum ServerModuleType {
  Mail = "Mail",
  Binance = "Binance",
}

export enum MailActionType {
  attachListener = "attach-listener",
  receiveMail = "receive-mail",
  error = "mail-error",
}

export enum LogType {
  info = '[Info]',
  warn = '[Warning]',
  error = '[Error]',
  success = '[Successful]',
}

export interface IServerLog{
  module: ServerModuleType,
  action: MailActionType,
  context?: string,
  logLevel?: LogType
}

const writeServerLogToCsv = (serverLog: IServerLog, filePath: string): void => {
  const headerRow = 'module,action,context,logLevel\n';
  const dataRow = `${serverLog.module},${serverLog.action},${serverLog.context ?? ''},${serverLog.logLevel ?? ''}\n`;

  // If the file already exists, append the data to it; otherwise, create a new file.
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, dataRow);
  } else {
    fs.writeFileSync(filePath, headerRow + dataRow);
  }
};

export const readServerLogFromCsv = async (filePath: string): Promise<IServerLog[]> => {
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

export const ServerLog = (
  module: ServerModuleType,
  action: MailActionType,
  context?: string,
  logLevel?: LogType
) => {
  if (!logLevel) {
    logLevel= LogType.info;
  }
  const formattedTime = moment(new Date()).format('DD/MM/YYYY h:mm:ss');
  
  const str = `${formattedTime} ${logLevel.toString()} ${module.toString()} ${action.toString()}${context?' | '.concat(context).concat('.'):'.'}`
  const _str = `> ${str}`;

  // const str = `> ${module.toString()}, ${action.toString()}${context?',':'.'} ${context} ${logLevel === LogType.success? '[Successful]': logLevel === LogType.error?'[Failed]': ''}`;

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
      console.log(chalk.hex("#00ccff").bgHex('#0d0d0d').bold(_str));
      break;
    }
    case LogType.success: {
      console.log(chalk.hex("#66ff99").bgHex('#0d0d0d').bold(_str));
      break;
    }
  }


};