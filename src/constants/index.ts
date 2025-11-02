export const CURRENCY_PAIRS = [
  'BTC/USDT',
  'ETH/USDT',
  'BNB/USDT',
  'ADA/USDT',
  'SOL/USDT',
  'DOT/USDT',
  'MATIC/USDT',
  'XRP/USDT'
];

export const RISK_PERCENTAGES = [
  { value: 1, label: '1%' },
  { value: 1.5, label: '1.5%' },
  { value: 2, label: '2%' },
  { value: 3, label: '3%' }
];

export const TRADING_SESSIONS = [
  'Asia',
  'London',
  'New York'
];

export const TIMEFRAMES = [
  '1m',
  '5m',
  '15m',
  '1h',
  '4h',
  '1d'
];

export const STRATEGIES = [
  'Swing Trading',
  'Day Trading',
  'Trend-following',
  'Scalping'
];

export const TRADING_RULES = {
  entryRules: [
    'Wait for clear signal confirmation',
    'Check multiple timeframe alignment',
    'Ensure risk-reward ratio is at least 1:2',
    'Verify volume confirmation',
    'Avoid trading during high-impact news'
  ],
  exitRules: [
    'Stick to predetermined stop-loss levels',
    'Take partial profits at key resistance levels',
    'Trail stop-loss in profitable trades',
    'Exit if trade thesis becomes invalid',
    'Don\'t let winners turn into losers'
  ],
  riskManagement: [
    'Never risk more than set percentage per trade',
    'Don\'t increase position size after losses',
    'Maintain proper position sizing',
    'Keep a trading journal for all trades',
    'Take breaks after consecutive losses'
  ]
};