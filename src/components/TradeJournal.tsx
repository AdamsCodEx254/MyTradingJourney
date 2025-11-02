import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, CreditCard as Edit3, Trash2, Save } from 'lucide-react';
import { TradeJournalEntry } from '../types';

interface TradeJournalProps {
  onEntriesChange?: (entries: TradeJournalEntry[]) => void;
}

export function TradeJournal({ onEntriesChange }: TradeJournalProps) {
  const [entries, setEntries] = useState<TradeJournalEntry[]>(() => {
    const saved = localStorage.getItem('tradeJournal');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<TradeJournalEntry>>({
    date: new Date().toISOString().split('T')[0],
    pair: 'BTC/USDT',
    direction: 'Long',
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem('tradeJournal', JSON.stringify(entries));
    onEntriesChange?.(entries);
  }, [entries]);

  const addEntry = () => {
    if (newEntry.pair && newEntry.entryPrice && newEntry.stopLoss && newEntry.takeProfit) {
      const entry: TradeJournalEntry = {
        id: Date.now().toString(),
        date: newEntry.date || new Date().toISOString().split('T')[0],
        pair: newEntry.pair,
        direction: newEntry.direction as 'Long' | 'Short',
        entryPrice: newEntry.entryPrice,
        stopLoss: newEntry.stopLoss,
        takeProfit: newEntry.takeProfit,
        result: newEntry.result,
        notes: newEntry.notes || ''
      };
      
      setEntries([...entries, entry]);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        pair: 'BTC/USDT',
        direction: 'Long',
        entryPrice: 0,
        stopLoss: 0,
        takeProfit: 0,
        notes: ''
      });
    }
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const updateEntry = (id: string, updatedEntry: Partial<TradeJournalEntry>) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedEntry } : entry
    ));
    setEditingId(null);
  };

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Trade Journal
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Track your trades and analyze your performance
          </p>
        </div>

        {/* Add New Entry Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Trade
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            />
            
            <input
              type="text"
              placeholder="Pair"
              value={newEntry.pair}
              onChange={(e) => setNewEntry({ ...newEntry, pair: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            />
            
            <select
              value={newEntry.direction}
              onChange={(e) => setNewEntry({ ...newEntry, direction: e.target.value as 'Long' | 'Short' })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            >
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
            
            <input
              type="number"
              placeholder="Entry Price"
              value={newEntry.entryPrice || ''}
              onChange={(e) => setNewEntry({ ...newEntry, entryPrice: parseFloat(e.target.value) })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            />
            
            <input
              type="number"
              placeholder="Stop Loss"
              value={newEntry.stopLoss || ''}
              onChange={(e) => setNewEntry({ ...newEntry, stopLoss: parseFloat(e.target.value) })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            />
            
            <input
              type="number"
              placeholder="Take Profit"
              value={newEntry.takeProfit || ''}
              onChange={(e) => setNewEntry({ ...newEntry, takeProfit: parseFloat(e.target.value) })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            />
            
            <input
              type="number"
              placeholder="Result ($)"
              value={newEntry.result || ''}
              onChange={(e) => setNewEntry({ ...newEntry, result: parseFloat(e.target.value) })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            />
          </div>
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Notes"
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            />
            
            <button
              onClick={addEntry}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform duration-200 text-sm font-medium"
            >
              Add Trade
            </button>
          </div>
        </div>

        {/* Journal Entries */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pair</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Direction</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stop Loss</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Take Profit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No trades recorded yet. Add your first trade above.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{entry.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{entry.pair}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.direction === 'Long' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {entry.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">${entry.entryPrice}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">${entry.stopLoss}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">${entry.takeProfit}</td>
                      <td className="px-4 py-3 text-sm">
                        {entry.result ? (
                          <span className={`font-medium ${
                            entry.result > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${entry.result}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {entry.notes}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingId(entry.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}