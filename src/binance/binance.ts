import { MainClient, OrderBookRow, USDMClient } from "binance";
import {
  ActionType,
  ModuleType,
  serverError,
  serverSuccess,
} from "../logger";
import { getTradeSettings } from "./tradeSettings";
import { findLowestAsk } from "./enterTrade";

export const connectToBinance = async () => {
  const apiKey = process.env.BINANCE_API_KEY;
  const apiSecret = process.env.BINANCE_SECRET_KEY;
  try {
    if (!apiKey || !apiSecret) {
      throw new Error(`Invalid api or secret key`);
    }
    const client = new USDMClient({
      api_key: apiKey,
      api_secret: apiSecret,
    });

    getTradeSettings();

    const coinAsset = await getCoinAsset(client);
    setInterval(async()=>{
      //@ts-ignore
      await findLowestAsk(client, {symbol: 'ETHBUSD'});
    }, 3000);
    serverSuccess(
      ModuleType.Binance,
      ActionType.connectBinance,
      `coin: ${coinAsset?.asset} ballance ${coinAsset?.availableBalance}`
    );
  } catch (e: any) {
    serverError(ModuleType.Binance, ActionType.connectBinance, e.message);
  }
};

export const getCoinAsset = async (client: USDMClient) => {
  const coin = process.env.BASE_COIN;

  const info = await client.getAccountInformation();
  const coinAsset = info.assets.find((c) => c.asset === coin);

  return coinAsset;
};


