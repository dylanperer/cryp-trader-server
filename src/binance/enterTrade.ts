import { Alert, Trade } from "@prisma/client";
import { USDMClient, OrderBookRow } from "binance";
import { TradeStatus, AlertAction } from "../../constants";
import { prisma } from "../../prisma/prisma";
import { serverWarn, ModuleType, ActionType, serverError } from "../logger";
import { getTradeSettings } from "./tradeSettings";
import { getCoinAsset } from "./binance";

export const createTrade = async (
  client: USDMClient,
  entryAlert: Alert
): Promise<Trade | null> => {
  try {
    //check for still active trades
    const activeTrade = await prisma.trade.findFirst({
      where: { status: TradeStatus.Active },
    });
    if (activeTrade) {
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
      throw new Error("Invalid trade settings. Unable to create trade.");
    }

    const { market, baseCoin, symbol, margin } = tradSettings;

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
        baseCoin: baseCoin,
        symbol: symbol,
        side: side.toString(),
        status: TradeStatus.Processing,
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
};

export const placeOrder = async (client: USDMClient, entryAlert: Alert) => {
  const trade = await createTrade(client, entryAlert);

  if (trade) {
    
  }
};

export const findLowestAsk = async (client: USDMClient, trade: Trade) => {
  const orderBook = await client.getOrderBook({
    symbol: trade.symbol,
    limit: 500,
  });

  if (!orderBook || !orderBook.asks || orderBook.asks.length === 0) {
    throw new Error("fetching order book error");
  }

  const asks = orderBook.asks;
  let lowestAsk = asks[0];

  for (let i = 1; i < asks.length; i++) {
    const currentAsk = asks[i];
    if (currentAsk[0] < lowestAsk[0]) {
      lowestAsk = currentAsk;
    }
  }

  console.log(lowestAsk);
  return lowestAsk;
};
