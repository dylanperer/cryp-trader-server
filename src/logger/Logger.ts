import chalk from "chalk";

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
  info = 0,
  warn = 1,
  error = 2,
  success = 3,
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
  const str = `> ${module.toString()}, ${action.toString()}, ${context}`;

  switch (logLevel) {
    case LogType.error: {
      console.log(chalk.hex("#ff471a").bold(str));
      break;
    }
    case LogType.warn: {
      console.log(chalk.hex("#ff8533").bold(str));
      break;
    }
    case LogType.info: {
      console.log(chalk.hex("#00ccff").bgHex('#0d0d0d').bold(str));
      break;
    }
    case LogType.success: {
      console.log(chalk.hex("#66ff99").bgHex('#0d0d0d').bold(str));
      break;
    }
  }
};
