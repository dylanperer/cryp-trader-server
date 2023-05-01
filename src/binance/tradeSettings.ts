import { serverSuccess, ModuleType, ActionType, serverError } from "../logger";

export interface ITradeSettings {
  market: string;
  baseCoin: string;
  symbol: string;
  margin: string;
}

export const getTradeSettings = (): ITradeSettings | null => {
  const market = process.env.MARKET;
  const baseCoin = process.env.BASE_COIN;
  const symbol = process.env.SYMBOL;
  const margin = process.env.MARGIN;
  try {
    if (!market) {
      throw new Error(`Invalid market configuration`);
    }
    if (!baseCoin) {
      throw new Error(`Invalid base coin configuration`);
    }
    if (!symbol) {
      throw new Error(`Invalid base coin configuration`);
    }
    if (!margin) {
      throw new Error(`Invalid margin configuration`);
    }
    const tradeSettings: ITradeSettings = {
      market,
      baseCoin,
      symbol,
      margin,
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
