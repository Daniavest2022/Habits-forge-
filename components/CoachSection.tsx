
import React, { useState } from 'react';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { getCoachAdvice } from '../lib/gemini';
import { UserState } from '../types';

interface CoachSectionProps {
  state: UserState;
}

const CoachSection: React.FC<CoachSectionProps> = ({ state }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestAdvice = async () => {
    setLoading(true);
    const dataSummary = state.habits.map(h => ({
      name: h.name,
      logs: state.logs.filter(l => l.habitId === h.id).length
    }));
    const res = await getCoachAdvice(dataSummary);
    setAdvice(res);
    setLoading(false);
  };

  return (
    <div className="glass-card rounded-3xl p-6 h-fit border-blue-100/30 dark:border-blue-500/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <BrainCircuit size={20} />
        </div>
        <h2 className="font-bold text-lg">Forge AI Coach</h2>
      </div>

      {!advice && !loading ? (
        <div className="text-center py-6">
          <p className="text-sm text-slate-500 mb-4">Let the Forge analyze your consistency patterns to find your optimal growth strategy.</p>
          <button 
            onClick={requestAdvice}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-all hover:scale-[1.02]"
          >
            <Sparkles size={16} />
            Generate Strategy
          </button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center py-10 gap-4">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Analyzing Neural Patterns...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {advice?.split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
          <button 
            onClick={() => setAdvice(null)}
            className="text-[10px] uppercase font-bold text-slate-400 hover:text-blue-500 transition-colors"
          >
            Clear Insight
          </button>
        </div>
      )}
    </div>
  );
};

export default CoachSection;
