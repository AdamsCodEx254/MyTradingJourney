import React, { useState, useEffect } from 'react';
import { Calculator, Settings } from 'lucide-react';
import { TradingPlan } from '../types';
import { CURRENCY_PAIRS, RISK_PERCENTAGES, TRADING_SESSIONS, TIMEFRAMES, STRATEGIES } from '../constants';

interface TradingPlanFormProps {
  onPlanGenerated: (plan: TradingPlan) => void;
}

export function TradingPlanForm({ onPlanGenerated }: TradingPlanFormProps) {
  const [plan, setPlan] = useState<TradingPlan>({
    currencyPair: 'BTC/USDT',
    amount: 40,
    riskPercent: 2,
    tradingSessions: [],
    timeframe: '15m',
    strategies: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Real-time validation
    const newErrors: Record<string, string> = {};
    
    if (plan.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (plan.tradingSessions.length === 0) {
      newErrors.tradingSessions = 'Select at least one trading session';
    }
    
    if (plan.strategies.length === 0) {
      newErrors.strategies = 'Select at least one trading strategy';
    }

    setErrors(newErrors);
  }, [plan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      onPlanGenerated(plan);
    }
  };

  const handleSessionChange = (session: string) => {
    setPlan(prev => ({
      ...prev,
      tradingSessions: prev.tradingSessions.includes(session)
        ? prev.tradingSessions.filter(s => s !== session)
        : [...prev.tradingSessions, session]
    }));
  };

  const handleStrategyChange = (strategy: string) => {
    setPlan(prev => ({
      ...prev,
      strategies: prev.strategies.includes(strategy)
        ? prev.strategies.filter(s => s !== strategy)
        : [...prev.strategies, strategy]
    }));
  };

  return (
    <section id="trading-form" className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Configure Your Trading Plan
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Set your parameters to generate a personalized trading strategy
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Currency Pair */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Currency Pair
                </label>
                <input
                  type="text"
                  value={plan.currencyPair}
                  onChange={(e) => setPlan(prev => ({ ...prev, currencyPair: e.target.value.toUpperCase() }))}
                  placeholder="e.g., BTC/USDT, ETH/USDT"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Starting Capital ($)
                </label>
                <input
                  type="number"
                  value={plan.amount}
                  onChange={(e) => setPlan(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-4 py-3 border ${errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="40"
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
              </div>

              {/* Risk Percentage */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Risk per Trade
                </label>
                <select
                  value={plan.riskPercent}
                  onChange={(e) => setPlan(prev => ({ ...prev, riskPercent: parseFloat(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  {RISK_PERCENTAGES.map(risk => (
                    <option key={risk.value} value={risk.value}>{risk.label}</option>
                  ))}
                </select>
              </div>

              {/* Timeframe */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Timeframe
                </label>
                <select
                  value={plan.timeframe}
                  onChange={(e) => setPlan(prev => ({ ...prev, timeframe: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  {TIMEFRAMES.map(timeframe => (
                    <option key={timeframe} value={timeframe}>{timeframe}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trading Sessions */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Trading Sessions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TRADING_SESSIONS.map(session => (
                  <label key={session} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plan.tradingSessions.includes(session)}
                      onChange={() => handleSessionChange(session)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{session}</span>
                  </label>
                ))}
              </div>
              {errors.tradingSessions && <p className="text-red-500 text-sm">{errors.tradingSessions}</p>}
            </div>

            {/* Trading Strategies */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Trading Strategies
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STRATEGIES.map(strategy => (
                  <label key={strategy} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plan.strategies.includes(strategy)}
                      onChange={() => handleStrategyChange(strategy)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{strategy}</span>
                  </label>
                ))}
              </div>
              {errors.strategies && <p className="text-red-500 text-sm">{errors.strategies}</p>}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={Object.keys(errors).length > 0}
                className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Calculator className="h-5 w-5" />
                <span>Generate My Plan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}