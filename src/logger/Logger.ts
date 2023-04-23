import chalk from "chalk";

export enum ServerModuleType {
  Mail = "MAIL",
  Binance = "BINANCE",
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
  }
  const str = `> ${module.toString()}, ${action.toString()} `;

  switch (logLevel) {
    case LogType.error: {
      console.log(chalk.hex("#e4f").bold(str));
      break;
    }
    default: {
      console.log(chalk.hex("#fff").bgHex('#ff9900').bold(str));
    }
  }
};
