
import React, { useState, useEffect } from 'react';
import { Habit, CompletionLog, UserState, HabitIcon, HabitCategory } from './types';
import HabitCard from './components/HabitCard';
import HabitForm from './components/HabitForm';
import CoachSection from './components/CoachSection';
import { getTodayStr, downloadCSV } from './lib/utils';
import { Plus, BarChart2, Sun, Moon, Download, Trophy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'habitforge_v2';

const App: React.FC = () => {
  const [state, setState] = useState<UserState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { habits: [], logs: [], theme: 'light' };
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  // Request notification permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const addHabit = (name: string, icon: HabitIcon, category: HabitCategory, targetFrequency: number, reminderTime?: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      icon,
      category,
      targetFrequency,
      reminderTime,
      createdAt: Date.now(),
    };
    setState(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
    setIsFormOpen(false);
  };

  const deleteHabit = (id: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      setState(prev => ({
        ...prev,
        habits: prev.habits.filter(h => h.id !== id),
        logs: prev.logs.filter(l => l.habitId !== id)
      }));
    }
  };

  const logActivity = (habitId: string, note?: string) => {
    const date = getTodayStr();
    setState(prev => {
      const existingLogIndex = prev.logs.findIndex(l => l.habitId === habitId && l.date === date);
      const newLogs = [...prev.logs];
      const habit = prev.habits.find(h => h.id === habitId);
      
      if (existingLogIndex > -1) {
        newLogs[existingLogIndex] = {
          ...newLogs[existingLogIndex],
          count: newLogs[existingLogIndex].count + 1,
          note: note || newLogs[existingLogIndex].note
        };
      } else {
        newLogs.push({ habitId, date, count: 1, note });
      }

      if (habit) {
        const currentCount = existingLogIndex > -1 ? newLogs[existingLogIndex].count : 1;
        if (currentCount === habit.targetFrequency) {
          confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.7 },
            colors: ['#4361ee', '#f72585', '#4cc9f0']
          });
        }
      }

      return { ...prev, logs: newLogs };
    });
  };

  const handleExport = () => {
    const headers = 'Habit,Date,Completions,Notes\n';
    const rows = state.logs.map(log => {
      const habit = state.habits.find(h => h.id === log.habitId);
      return `"${habit?.name || 'Unknown'}",${log.date},${log.count},"${log.note || ''}"`;
    }).join('\n');
    downloadCSV(headers + rows, `habitforge_data_${getTodayStr()}.csv`);
  };

  const totalCompletions = state.logs.reduce((acc, log) => acc + log.count, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 pb-36 text-slate-900 dark:text-slate-50">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
             <Flame size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">HabitForge</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> System Active
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleExport} className="p-4 glass-card rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500" title="Download Records">
            <Download size={22} />
          </button>
          <button onClick={toggleTheme} className="p-4 glass-card rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500">
            {state.theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card p-8 rounded-[2rem] flex items-center justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume</p>
                <p className="text-4xl font-black tracking-tight">{totalCompletions}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Total Logs Processed</p>
              </div>
              <Trophy className="text-slate-100 dark:text-slate-800/20 absolute -right-4 -bottom-4" size={120} />
            </div>
            <div className="glass-card p-8 rounded-[2rem] flex items-center justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consistency</p>
                <p className="text-4xl font-black tracking-tight">{state.habits.length}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Active Challenges</p>
              </div>
              <BarChart2 className="text-slate-100 dark:text-slate-800/20 absolute -right-4 -bottom-4" size={120} />
            </div>
          </div>

          {/* Habits Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {state.habits.map(habit => (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                logs={state.logs} 
                onLog={logActivity}
                onDelete={deleteHabit}
              />
            ))}
            
            {state.habits.length === 0 && (
              <div className="col-span-full py-32 flex flex-col items-center text-center glass-card rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-8 text-slate-200">
                   <Plus size={40} />
                </div>
                <h2 className="text-2xl font-black mb-3">No active experiments.</h2>
                <p className="text-slate-500 max-w-xs mb-10 font-medium">Initiate your first 21-day behavioral re-wiring protocol below.</p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-4 rounded-[1.5rem] shadow-2xl shadow-blue-500/40 transition-all active:scale-95"
                >
                  FORGE NEW HABIT
                </button>
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-4">
           <CoachSection state={state} />
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black px-12 py-5 rounded-[2.25rem] shadow-2xl flex items-center gap-4 active:scale-95 transition-all hover:pr-14 group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform" />
          NEW HABIT
        </button>
      </div>

      {isFormOpen && (
        <HabitForm onAdd={addHabit} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};

export default App;
