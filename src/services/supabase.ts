import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function saveTradingPlan(plan: any) {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('trading_plans')
    .insert({
      user_id: user.id,
      currency_pair: plan.currencyPair,
      amount: plan.amount,
      risk_percent: plan.riskPercent,
      trading_sessions: plan.tradingSessions,
      timeframe: plan.timeframe,
      strategies: plan.strategies,
    })
    .select();

  return { data, error };
}

export async function getTradingPlans() {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('trading_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function saveJournalEntry(entry: any) {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('trade_journal_entries')
    .insert({
      user_id: user.id,
      date: entry.date,
      pair: entry.pair,
      direction: entry.direction,
      entry_price: entry.entryPrice,
      stop_loss: entry.stopLoss,
      take_profit: entry.takeProfit,
      result: entry.result,
      notes: entry.notes,
    })
    .select();

  return { data, error };
}

export async function getJournalEntries() {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('trade_journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  return { data, error };
}

export async function updateJournalEntry(id: string, updates: any) {
  const { data, error } = await supabase
    .from('trade_journal_entries')
    .update(updates)
    .eq('id', id)
    .select();

  return { data, error };
}

export async function deleteJournalEntry(id: string) {
  const { error } = await supabase
    .from('trade_journal_entries')
    .delete()
    .eq('id', id);

  return { error };
}
