export interface TradingPlan {
  currencyPair: string;
  amount: number;
  riskPercent: number;
  tradingSessions: string[];
  timeframe: string;
  strategies: string[];
}

export interface CalculationResults {
  maxRiskPerTrade: number;
  positionSize: number;
  stopLoss: number;
  takeProfit: number;
}

export interface TradeJournalEntry {
  id: string;
  date: string;
  pair: string;
  direction: 'Long' | 'Short';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  result?: number;
  notes: string;
}

export interface TradingStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalPnL: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  currentStreak: number;
  bestStreak: number;
  worstStreak: number;
}

export interface TraderRank {
  level: string;
  title: string;
  minWinRate: number;
  minTrades: number;
  color: string;
  icon: string;
}

export interface Theme {
  isDark: boolean;
}