
import React, { useState, useEffect } from 'react';
import { Habit, CompletionLog } from '../types';
import { ICON_MAP, COLORS } from '../constants';
import ProgressRing from './ProgressRing';
import Heatmap from './Heatmap';
import MilestoneProgress from './MilestoneProgress';
import { calculateStreak, getTodayStr, getProgressForDate } from '../lib/utils';
import { Trash2, Plus, Quote, Bell, MessageSquare } from 'lucide-react';
import { getMotivationalQuote } from '../lib/gemini';

interface HabitCardProps {
  habit: Habit;
  logs: CompletionLog[];
  onLog: (habitId: string, note?: string) => void;
  onDelete: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, logs, onLog, onDelete }) => {
  const todayStr = getTodayStr();
  const currentLog = logs.find(l => l.habitId === habit.id && l.date === todayStr);
  const currentCount = currentLog?.count || 0;
  const streak = calculateStreak(habit.id, logs, habit.targetFrequency);
  const progress = Math.min(currentCount / habit.targetFrequency, 1);
  
  const [quote, setQuote] = useState<string>("");
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      setLoadingQuote(true);
      const q = await getMotivationalQuote(habit.name, streak);
      setQuote(q);
      setLoadingQuote(false);
    };
    fetchQuote();
  }, [habit.name, streak]);

  const handleLog = () => {
    onLog(habit.id, note);
    setNote("");
    setShowNoteInput(false);
  };

  return (
    <div className="glass-card rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 group border-transparent hover:border-blue-500/20">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-2xl text-blue-600 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-slate-700">
            {ICON_MAP[habit.icon]}
          </div>
          <div>
            <div className="flex items-center gap-2">
               <h3 className="font-bold text-lg">{habit.name}</h3>
               {habit.reminderTime && <Bell size={12} className="text-slate-400" />}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{habit.category}</p>
          </div>
        </div>
        <button 
          onClick={() => onDelete(habit.id)}
          className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative flex items-center justify-center">
          <ProgressRing radius={40} stroke={5} progress={progress} color={COLORS.primary} />
          <div className="absolute flex flex-col items-center">
             <span className="text-lg font-black">{currentCount}</span>
             <span className="text-[8px] uppercase text-slate-400 font-bold">Today</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <span className="text-3xl font-black italic text-slate-900 dark:text-white">{streak}</span>
            <span className="text-xl">🔥</span>
          </div>
          <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Active Streak</span>
        </div>
      </div>

      <Heatmap habitId={habit.id} logs={logs} target={habit.targetFrequency} />
      <MilestoneProgress streak={streak} />

      <div className="mt-6 flex flex-col gap-3">
        {quote && !loadingQuote && (
          <div className="bg-slate-50/80 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-2 items-start animate-in fade-in slide-in-from-bottom-2">
            <Quote size={12} className="text-blue-400 mt-1 flex-shrink-0" />
            <p className="text-[11px] italic text-slate-600 dark:text-slate-400 leading-snug">
              {quote}
            </p>
          </div>
        )}

        {showNoteInput && (
          <div className="animate-in slide-in-from-top-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling about this habit today?"
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-slate-100 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-colors resize-none h-20"
            />
          </div>
        )}

        <div className="flex gap-2">
          {!showNoteInput && progress < 1 && (
             <button 
               onClick={() => setShowNoteInput(true)}
               className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-blue-500 transition-colors"
               title="Add reflection note"
             >
               <MessageSquare size={18} />
             </button>
          )}
          <button
            onClick={handleLog}
            disabled={progress >= 1}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black transition-all duration-300 shadow-xl active:scale-95 ${
              progress >= 1 
                ? 'bg-emerald-500 text-white cursor-default shadow-emerald-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
            }`}
          >
            {progress >= 1 ? (
              'COMPLETED'
            ) : (
              <>
                <Plus size={18} />
                LOG SESSION
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
