import React from 'react';
import { Target, Shield, TrendingUp, Download, AlertTriangle } from 'lucide-react';
import { TradingPlan, CalculationResults } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import { TRADING_RULES } from '../constants';

interface ResultsSectionProps {
  plan: TradingPlan;
  results: CalculationResults;
  onExportPDF: () => void;
}

export function ResultsSection({ plan, results, onExportPDF }: ResultsSectionProps) {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Your Trading Plan Results
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Based on your parameters, here's your personalized trading strategy
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Key Metrics */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
              Key Metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Max Risk per Trade</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(results.maxRiskPerTrade)}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Position Size</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(results.positionSize)}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Stop Loss</p>
                <p className="text-2xl font-bold text-yellow-600">{formatPercentage(results.stopLoss)}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Take Profit</p>
                <p className="text-2xl font-bold text-green-600">{formatPercentage(results.takeProfit)}</p>
              </div>
            </div>

            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Trading Configuration</h4>
              <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">Pair:</span> {plan.currencyPair}</p>
                <p><span className="font-medium">Capital:</span> {formatCurrency(plan.amount)}</p>
                <p><span className="font-medium">Risk:</span> {plan.riskPercent}%</p>
                <p><span className="font-medium">Timeframe:</span> {plan.timeframe}</p>
                <p><span className="font-medium">Sessions:</span> {plan.tradingSessions.join(', ')}</p>
                <p><span className="font-medium">Strategies:</span> {plan.strategies.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Trading Rules */}
          <div className="space-y-6">
            {/* Entry Rules */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
              <h4 className="text-lg font-bold text-green-800 dark:text-green-300 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Entry Rules
              </h4>
              <ul className="space-y-2">
                {TRADING_RULES.entryRules.map((rule, index) => (
                  <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exit Rules */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700">
              <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Exit Rules
              </h4>
              <ul className="space-y-2">
                {TRADING_RULES.exitRules.map((rule, index) => (
                  <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Management */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
              <h4 className="text-lg font-bold text-red-800 dark:text-red-300 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Risk Management
              </h4>
              <ul className="space-y-2">
                {TRADING_RULES.riskManagement.map((rule, index) => (
                  <li key={index} className="text-sm text-red-700 dark:text-red-300 flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="text-center">
          <button
            onClick={onExportPDF}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
          >
            <Download className="h-5 w-5" />
            <span>Save as PDF</span>
          </button>
        </div>
      </div>
    </section>
  );
}