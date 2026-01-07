
import React, { useState } from 'react';
import { HabitIcon, HabitCategory } from '../types';
import { ICONS, ICON_MAP } from '../constants';
import { X, Check, Clock } from 'lucide-react';

interface HabitFormProps {
  onAdd: (name: string, icon: HabitIcon, category: HabitCategory, freq: number, reminder?: string) => void;
  onClose: () => void;
}

const CATEGORIES: HabitCategory[] = ['Health', 'Focus', 'Learning', 'Mindset'];

const HabitForm: React.FC<HabitFormProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<HabitIcon>('droplets');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [freq, setFreq] = useState(1);
  const [reminder, setReminder] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, icon, category, freq, reminder || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="glass-card w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight">New Habit</h2>
            <p className="text-sm text-slate-400 font-medium">Start your 21-day transformation</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black mb-3 text-slate-400 uppercase tracking-widest">Identify Habit</label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Drink Water, Read 10m..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black mb-3 text-slate-400 uppercase tracking-widest">Visual Anchor</label>
                <div className="grid grid-cols-4 gap-3">
                  {ICONS.map((i) => (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => setIcon(i.id)}
                      className={`flex items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        icon === i.id 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'border-slate-100 dark:border-slate-800 bg-transparent text-slate-400'
                      }`}
                    >
                      {ICON_MAP[i.id]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black mb-3 text-slate-400 uppercase tracking-widest">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        category === cat
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                        : 'border-slate-100 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black mb-3 text-slate-400 uppercase tracking-widest">Reminder</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="time"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black mb-3 text-slate-400 uppercase tracking-widest">Intensity (Daily Target)</label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFreq(n)}
                  className={`flex-1 py-4 rounded-2xl border-2 font-black transition-all ${
                    freq === n
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                      : 'border-slate-100 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {n}X
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-5 rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-3 mt-4 active:scale-95"
          >
            <Check size={24} />
            FORGE HABIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;
