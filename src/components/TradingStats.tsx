import React from 'react';
import { TrendingUp, TrendingDown, Target, Award, Zap, BarChart3 } from 'lucide-react';
import { CircularProgress } from './CircularProgress';
import { TradingStats as TradingStatsType, TraderRank } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculations';

interface TradingStatsProps {
  stats: TradingStatsType;
  rank: TraderRank;
}

export function TradingStats({ stats, rank }: TradingStatsProps) {
  const getColorForPnL = (value: number) => {
    if (value > 0) return '#10b981'; // green
    if (value < 0) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  const getColorForWinRate = (winRate: number) => {
    if (winRate >= 70) return '#10b981'; // green
    if (winRate >= 50) return '#f59e0b'; // yellow
    if (winRate >= 30) return '#3b82f6'; // blue
    return '#ef4444'; // red
  };

  const getRankColor = (color: string) => {
    const colors = {
      gray: '#6b7280',
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      yellow: '#f59e0b',
      red: '#ef4444'
    };
    return colors[color as keyof typeof colors] || '#6b7280';
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Trading Performance
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Track your progress and analyze your trading performance
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* P&L Overview */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
              <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
              Profit & Loss Overview
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Total P&L Circular Progress */}
              <div className="text-center">
                <CircularProgress
                  percentage={Math.min(Math.abs(stats.totalPnL) / 100, 100)}
                  size={160}
                  strokeWidth={12}
                  color={getColorForPnL(stats.totalPnL)}
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      stats.totalPnL > 0 ? 'text-green-600' : 
                      stats.totalPnL < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {formatCurrency(stats.totalPnL)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total P&L</div>
                  </div>
                </CircularProgress>
              </div>

              {/* Win Rate Circular Progress */}
              <div className="text-center">
                <CircularProgress
                  percentage={stats.winRate}
                  size={160}
                  strokeWidth={12}
                  color={getColorForWinRate(stats.winRate)}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {formatPercentage(stats.winRate)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Win Rate</div>
                  </div>
                </CircularProgress>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-gray-800 dark:text-white">{stats.totalTrades}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Trades</div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-green-600">{stats.winningTrades}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Wins</div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-red-600">{stats.losingTrades}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Losses</div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-blue-600">{stats.profitFactor.toFixed(2)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Profit Factor</div>
              </div>
            </div>
          </div>

          {/* Trader Ranking */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Award className="h-6 w-6 text-yellow-600 mr-3" />
              Your Rank
            </h3>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{rank.icon}</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{rank.level}</div>
              <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">{rank.title}</div>
              
              {/* Rank Progress */}
              <div className="mb-4">
                <CircularProgress
                  percentage={Math.min((stats.winRate / 80) * 100, 100)}
                  size={100}
                  strokeWidth={8}
                  color={getRankColor(rank.color)}
                >
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-800 dark:text-white">
                      {Math.min(Math.round((stats.winRate / 80) * 100), 100)}%
                    </div>
                  </div>
                </CircularProgress>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Progress to next level
              </div>
            </div>

            {/* Rank Requirements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Win Rate</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {formatPercentage(stats.winRate)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Trades</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {stats.totalTrades}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Average Performance */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              Average Performance
            </h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Avg Win</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(stats.averageWin)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Avg Loss</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(stats.averageLoss)}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Risk/Reward</span>
                <span className="font-medium text-blue-600">
                  1:{(stats.averageWin / Math.max(stats.averageLoss, 1)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <Zap className="h-5 w-5 text-yellow-600 mr-2" />
              Current Streak
            </h4>
            
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                stats.currentStreak > 0 ? 'text-green-600' : 
                stats.currentStreak < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stats.currentStreak > 0 ? '+' : ''}{stats.currentStreak}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {stats.currentStreak > 0 ? 'Winning Streak' : 
                 stats.currentStreak < 0 ? 'Losing Streak' : 'No Active Streak'}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Best: +{stats.bestStreak}</span>
                <span>Worst: {stats.worstStreak}</span>
              </div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
              Performance Grade
            </h4>
            
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                stats.winRate >= 70 ? 'text-green-600' :
                stats.winRate >= 50 ? 'text-yellow-600' :
                stats.winRate >= 30 ? 'text-blue-600' : 'text-red-600'
              }`}>
                {stats.winRate >= 70 ? 'A+' :
                 stats.winRate >= 60 ? 'A' :
                 stats.winRate >= 50 ? 'B' :
                 stats.winRate >= 40 ? 'C' :
                 stats.winRate >= 30 ? 'D' : 'F'}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Trading Grade
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Based on win rate and consistency
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}