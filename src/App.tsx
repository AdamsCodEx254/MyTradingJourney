import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TradingPlanForm } from './components/TradingPlanForm';
import { ResultsSection } from './components/ResultsSection';
import { TradeJournal } from './components/TradeJournal';
import { TradingStats } from './components/TradingStats';
import { Auth } from './components/Auth';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TradingPlan, CalculationResults } from './types';
import { calculateTradingPlan, calculateTradingStats, getTraderRank } from './utils/calculations';
import { TradeJournalEntry } from './types';
import { getJournalEntries, saveJournalEntry, updateJournalEntry, deleteJournalEntry } from './services/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const [tradingPlan, setTradingPlan] = useState<TradingPlan | null>(null);
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  const [journalEntries, setJournalEntries] = useState<TradeJournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadJournalEntries();
    } else {
      const saved = localStorage.getItem('tradeJournal');
      setJournalEntries(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  const loadJournalEntries = async () => {
    setLoadingEntries(true);
    try {
      const { data, error } = await getJournalEntries();
      if (error) {
        console.error('Error loading entries:', error);
        const saved = localStorage.getItem('tradeJournal');
        setJournalEntries(saved ? JSON.parse(saved) : []);
      } else if (data) {
        const transformed = data.map((entry: any) => ({
          id: entry.id,
          date: entry.date,
          pair: entry.pair,
          direction: entry.direction,
          entryPrice: entry.entry_price,
          stopLoss: entry.stop_loss,
          takeProfit: entry.take_profit,
          result: entry.result,
          notes: entry.notes,
        }));
        setJournalEntries(transformed);
      }
    } finally {
      setLoadingEntries(false);
    }
  };

  // Calculate trading statistics
  const tradingStats = calculateTradingStats(journalEntries);
  const traderRank = getTraderRank(tradingStats);

  const handleStartTrading = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlanGenerated = (plan: TradingPlan) => {
    const results = calculateTradingPlan(plan);
    setTradingPlan(plan);
    setCalculationResults(results);
    
    // Smooth scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleExportPDF = () => {
    if (!tradingPlan || !calculationResults) return;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Trading Plan Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #ffffff;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 60px 40px;
      background: #0f3460;
      min-height: 100vh;
    }
    .header {
      border-bottom: 3px solid #d4af37;
      padding-bottom: 30px;
      margin-bottom: 40px;
      text-align: center;
    }
    .header h1 {
      color: #d4af37;
      font-size: 2.5em;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .header p {
      color: #b8860b;
      font-size: 0.9em;
      letter-spacing: 1px;
    }
    .section {
      margin-bottom: 35px;
      background: rgba(212, 175, 55, 0.05);
      padding: 25px;
      border-left: 4px solid #d4af37;
    }
    .section h2 {
      color: #d4af37;
      font-size: 1.5em;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .section-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .metric {
      background: rgba(15, 52, 96, 0.5);
      padding: 15px;
      border-radius: 4px;
    }
    .metric-label {
      color: #b8860b;
      font-size: 0.85em;
      text-transform: uppercase;
      margin-bottom: 5px;
      letter-spacing: 0.5px;
    }
    .metric-value {
      color: #d4af37;
      font-size: 1.4em;
      font-weight: bold;
    }
    .rules-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .rule {
      display: flex;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    }
    .rule:last-child {
      border-bottom: none;
    }
    .rule-bullet {
      color: #d4af37;
      font-weight: bold;
      flex-shrink: 0;
    }
    .rule-text {
      color: #ffffff;
      flex: 1;
    }
    .config-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .config-item {
      padding: 10px 0;
      border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    }
    .config-item:last-child {
      border-bottom: none;
    }
    .config-label {
      color: #b8860b;
      font-size: 0.85em;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .config-value {
      color: #d4af37;
      font-weight: bold;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #d4af37;
      text-align: center;
      color: #b8860b;
      font-size: 0.85em;
    }
    .disclaimer {
      background: rgba(212, 175, 55, 0.1);
      padding: 15px;
      border-radius: 4px;
      color: #d4af37;
      font-style: italic;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Trading Plan Report</h1>
      <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </div>

    <div class="section">
      <h2>Trading Configuration</h2>
      <div class="config-grid">
        <div class="config-item">
          <div class="config-label">Currency Pair</div>
          <div class="config-value">${tradingPlan.currencyPair}</div>
        </div>
        <div class="config-item">
          <div class="config-label">Starting Capital</div>
          <div class="config-value">$${tradingPlan.amount.toFixed(2)}</div>
        </div>
        <div class="config-item">
          <div class="config-label">Risk per Trade</div>
          <div class="config-value">${tradingPlan.riskPercent}%</div>
        </div>
        <div class="config-item">
          <div class="config-label">Timeframe</div>
          <div class="config-value">${tradingPlan.timeframe}</div>
        </div>
        <div class="config-item">
          <div class="config-label">Trading Sessions</div>
          <div class="config-value">${tradingPlan.tradingSessions.join(', ')}</div>
        </div>
        <div class="config-item">
          <div class="config-label">Strategies</div>
          <div class="config-value">${tradingPlan.strategies.join(', ')}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Key Metrics</h2>
      <div class="section-content">
        <div class="metric">
          <div class="metric-label">Max Risk per Trade</div>
          <div class="metric-value">$${calculationResults.maxRiskPerTrade.toFixed(2)}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Position Size</div>
          <div class="metric-value">$${calculationResults.positionSize.toFixed(2)}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Stop Loss</div>
          <div class="metric-value">${calculationResults.stopLoss.toFixed(2)}%</div>
        </div>
        <div class="metric">
          <div class="metric-label">Take Profit</div>
          <div class="metric-value">${calculationResults.takeProfit.toFixed(2)}%</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Entry Rules</h2>
      <div class="rules-list">
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Wait for clear signal confirmation</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Check multiple timeframe alignment</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Ensure risk-reward ratio is at least 1:2</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Verify volume confirmation</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Avoid trading during high-impact news</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Exit Rules</h2>
      <div class="rules-list">
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Stick to predetermined stop-loss levels</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Take partial profits at key resistance levels</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Trail stop-loss in profitable trades</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Exit if trade thesis becomes invalid</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Don't let winners turn into losers</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Risk Management</h2>
      <div class="rules-list">
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Never risk more than set percentage per trade</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Don't increase position size after losses</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Maintain proper position sizing</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Keep a trading journal for all trades</div>
        </div>
        <div class="rule">
          <div class="rule-bullet">•</div>
          <div class="rule-text">Take breaks after consecutive losses</div>
        </div>
      </div>
    </div>

    <div class="disclaimer">
      This plan is for educational purposes only and not financial advice. Trade at your own risk.
    </div>

    <div class="footer">
      <p>Generated by Trading Plan Builder • ${new Date().getFullYear()}</p>
    </div>
  </div>

  <script>
    window.print();
  </script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Trading-Plan-${tradingPlan.currencyPair.replace('/', '-')}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <div className="py-20 px-4">
          <Auth />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <Hero onStartTrading={handleStartTrading} />

      <div ref={formRef}>
        <TradingPlanForm onPlanGenerated={handlePlanGenerated} />
      </div>

      {tradingPlan && calculationResults && (
        <div ref={resultsRef}>
          <ResultsSection
            plan={tradingPlan}
            results={calculationResults}
            onExportPDF={handleExportPDF}
          />
        </div>
      )}

      <TradeJournal onEntriesChange={setJournalEntries} />

      <div ref={statsRef}>
        <TradingStats stats={tradingStats} rank={traderRank} />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;