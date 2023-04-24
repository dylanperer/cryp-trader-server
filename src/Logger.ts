import chalk from "chalk";
import moment from "moment";

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
