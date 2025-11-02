import { TradingPlan, CalculationResults } from '../types';
import { TradeJournalEntry, TradingStats, TraderRank } from '../types';

export function calculateTradingPlan(plan: TradingPlan): CalculationResults {
  const maxRiskPerTrade = (plan.amount * plan.riskPercent) / 100;
  
  // Base position size calculation (simplified for demo)
  const positionSize = plan.amount * 0.8; // 80% of capital for conservative approach
  
  // Stop loss percentage based on risk and volatility
  const stopLossPercent = plan.riskPercent * 1.5;
  const stopLoss = stopLossPercent;
  
  // Take profit based on 1:2 risk-reward ratio
  const takeProfit = stopLossPercent * 2;
  
  return {
    maxRiskPerTrade,
    positionSize,
    stopLoss,
    takeProfit
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function calculateTradingStats(entries: TradeJournalEntry[]): TradingStats {
  const completedTrades = entries.filter(entry => entry.result !== undefined && entry.result !== null);
  
  if (completedTrades.length === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalPnL: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      currentStreak: 0,
      bestStreak: 0,
      worstStreak: 0
    };
  }

  const totalTrades = completedTrades.length;
  const winningTrades = completedTrades.filter(trade => (trade.result || 0) > 0);
  const losingTrades = completedTrades.filter(trade => (trade.result || 0) < 0);
  
  const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.result || 0), 0);
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
  
  const totalWins = winningTrades.reduce((sum, trade) => sum + (trade.result || 0), 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.result || 0), 0));
  
  const averageWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
  const averageLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? 999 : 0;

  // Calculate streaks
  let currentStreak = 0;
  let bestStreak = 0;
  let worstStreak = 0;
  let tempStreak = 0;
  let lastWasWin = false;

  for (let i = completedTrades.length - 1; i >= 0; i--) {
    const isWin = (completedTrades[i].result || 0) > 0;
    
    if (i === completedTrades.length - 1) {
      currentStreak = isWin ? 1 : -1;
      tempStreak = currentStreak;
      lastWasWin = isWin;
    } else {
      if ((isWin && lastWasWin) || (!isWin && !lastWasWin)) {
        tempStreak = isWin ? tempStreak + 1 : tempStreak - 1;
      } else {
        if (tempStreak > bestStreak) bestStreak = tempStreak;
        if (tempStreak < worstStreak) worstStreak = tempStreak;
        tempStreak = isWin ? 1 : -1;
        lastWasWin = isWin;
      }
    }
  }

  if (tempStreak > bestStreak) bestStreak = tempStreak;
  if (tempStreak < worstStreak) worstStreak = tempStreak;

  return {
    totalTrades,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    totalPnL,
    winRate,
    averageWin,
    averageLoss,
    profitFactor,
    currentStreak,
    bestStreak,
    worstStreak
  };
}

export function getTraderRank(stats: TradingStats): TraderRank {
  const ranks: TraderRank[] = [
    { level: 'Novice', title: 'Learning the Ropes', minWinRate: 0, minTrades: 0, color: 'gray', icon: '🌱' },
    { level: 'Apprentice', title: 'Getting Started', minWinRate: 30, minTrades: 5, color: 'blue', icon: '📚' },
    { level: 'Trader', title: 'Building Skills', minWinRate: 45, minTrades: 15, color: 'green', icon: '📈' },
    { level: 'Professional', title: 'Consistent Performer', minWinRate: 55, minTrades: 30, color: 'purple', icon: '💼' },
    { level: 'Expert', title: 'Market Veteran', minWinRate: 65, minTrades: 50, color: 'yellow', icon: '🏆' },
    { level: 'Master', title: 'Trading Legend', minWinRate: 75, minTrades: 100, color: 'red', icon: '👑' }
  ];

  for (let i = ranks.length - 1; i >= 0; i--) {
    const rank = ranks[i];
    if (stats.winRate >= rank.minWinRate && stats.totalTrades >= rank.minTrades) {
      return rank;
    }
  }

  return ranks[0];
}