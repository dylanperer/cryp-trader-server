import { MainClient, USDMClient } from "binance";
import {
  ActionType,
  ModuleType,
  serverError,
  serverSuccess,
  serverInfo,
  serverWarn,
} from "../logger";
import { prisma } from "../../prisma/prisma";
import { AlertAction, TradeSide, Market, TradeStatus } from "../../constants";
import { Alert, Trade } from "@prisma/client";

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
    serverSuccess(
      ModuleType.Binance,
      ActionType.connectBinance,
      `coin: ${coinAsset?.asset} ballance ${coinAsset?.availableBalance}`
    );
  } catch (e: any) {
    serverError(ModuleType.Binance, ActionType.connectBinance, e.message);
  }
};

const getCoinAsset = async (client: USDMClient) => {
  const coin = process.env.COIN;

  const info = await client.getAccountInformation();
  const coinAsset = info.assets.find((c) => c.asset === coin);

  return coinAsset;
};

export const createTrade = async (client: USDMClient, entryAlert: Alert): Promise<Trade| null> => {
  try {
    //check for still active trades
    const activeTrade = await prisma.trade.findFirst({where: {status: TradeStatus.Active}});
    if(activeTrade){
      serverWarn(
        ModuleType.Binance,
        ActionType.createTrade,
        `trade [${activeTrade.id}] is still active. New trade is discarded.`
      );
      return null;
    }

    //get trade settings
    const tradSettings = getTradeSettings();
    if (!tradSettings) {
      throw new Error("Invalid trade settings. Unable to create trade.")
    }

    const { market, coin, margin } = tradSettings;

    //validate alert side
    const side =
      entryAlert.side === AlertAction.Long
        ? "Buy"
        : entryAlert.side === AlertAction.Short
        ? "Short"
        : null;

    if (!side) {
      serverWarn(
        ModuleType.Binance,
        ActionType.createTrade,
        `side [${side}] is invalid. No trade created.`
      );
      return null;
    }

    //create trade record with partial info
    const coinAsset = await getCoinAsset(client);
    const trade = await prisma.trade.create({
      data: {
        market: market,
        coin: coin,
        side: side.toString(),
        status: TradeStatus.Active,
        margin: Number(margin),
        entryAlertId: entryAlert.id,
        entryAlertPrice: entryAlert.price,
        entryWalletBalance: Number(coinAsset?.walletBalance),
      },
    });

    return trade;
  } catch (error: any) {
    serverError(ModuleType.Binance, ActionType.createTrade, error.message);
    return null;
  }
}
export const placeOrder = async (client: USDMClient, entryAlert: Alert)=>{
  const trade = await createTrade(client, entryAlert);

  if(trade){
    
  }
}

interface ITradeSettings {
  market: string;
  coin: string;
  margin: string;
}

export const getTradeSettings = (): ITradeSettings | null => {
  const market = process.env.MARKET;
  const coin = process.env.COIN;
  const margin = process.env.MARGIN;
  try {
    if (!market || market !== "futures") {
      throw new Error(`Invalid market configuration`);
    }
    if (!coin || coin !== "BUSD") {
      throw new Error(`Invalid coin configuration`);
    }
    if (!margin || Number(margin)) {
      throw new Error(`Invalid margin configuration`);
    }
    const tradeSettings: ITradeSettings = {
      market: margin,
      coin: coin,
      margin: margin,
    };
    serverSuccess(ModuleType.Binance, ActionType.tradeConfiguration);
    return tradeSettings;
  } catch (error: any) {
    serverError(
      ModuleType.Binance,
      ActionType.tradeConfiguration,
      `${error.message}`
    );
    return null;
  }
};
