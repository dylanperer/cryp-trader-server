import { MainClient } from "binance";
import { ActionType, ModuleType, serverError, serverSuccess, serverInfo } from '../logger';

export const connectToBinance = async () => {
  const apiKey = process.env.BINANCE_API_KEY;
  const apiSecret = process.env.BINANCE_SECRET_KEY;
  try {
    if (!apiKey || !apiSecret) {
      throw new Error(`Invalid api or secret key`);
    }
    const client =  new MainClient({
        api_key: apiKey,
        api_secret: apiSecret,
    });

    const status = await client.getAccountStatus();
    serverSuccess(ModuleType.Binance, ActionType.connectBinance, `status ${status.data}`);
  } catch (e: any) {
    serverError(ModuleType.Binance, ActionType.connectBinance, e.message);
  }
};

