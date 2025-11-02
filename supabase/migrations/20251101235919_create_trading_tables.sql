/*
  # Create trading plans and journal entries tables

  1. New Tables
    - `trading_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `currency_pair` (text)
      - `amount` (numeric)
      - `risk_percent` (numeric)
      - `trading_sessions` (text array)
      - `timeframe` (text)
      - `strategies` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `trade_journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date)
      - `pair` (text)
      - `direction` (text - Long or Short)
      - `entry_price` (numeric)
      - `stop_loss` (numeric)
      - `take_profit` (numeric)
      - `result` (numeric, nullable)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Users can only view, insert, update, and delete their own records
*/

CREATE TABLE IF NOT EXISTS trading_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency_pair text NOT NULL,
  amount numeric NOT NULL,
  risk_percent numeric NOT NULL,
  trading_sessions text[] NOT NULL DEFAULT '{}',
  timeframe text NOT NULL,
  strategies text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trade_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  pair text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('Long', 'Short')),
  entry_price numeric NOT NULL,
  stop_loss numeric NOT NULL,
  take_profit numeric NOT NULL,
  result numeric,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trading plans"
  ON trading_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trading plans"
  ON trading_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trading plans"
  ON trading_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trading plans"
  ON trading_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own journal entries"
  ON trade_journal_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON trade_journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON trade_journal_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON trade_journal_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_trading_plans_user_id ON trading_plans(user_id);
CREATE INDEX idx_trading_plans_created_at ON trading_plans(created_at);
CREATE INDEX idx_trade_journal_user_id ON trade_journal_entries(user_id);
CREATE INDEX idx_trade_journal_date ON trade_journal_entries(date);
