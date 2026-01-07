
import React from 'react';

interface MilestoneProgressProps {
  streak: number;
}

const MilestoneProgress: React.FC<MilestoneProgressProps> = ({ streak }) => {
  const milestones = [7, 14, 21];
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Pathway Milestones</span>
        <span className="text-[10px] font-bold text-blue-500 uppercase">{streak}/21 Days</span>
      </div>
      <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        {Array.from({ length: 21 }).map((_, i) => (
          <div 
            key={i}
            className={`flex-1 transition-all duration-500 ${
              i < streak 
                ? 'bg-blue-500' 
                : milestones.includes(i + 1) 
                  ? 'bg-slate-300 dark:bg-slate-700' 
                  : 'bg-transparent'
            } ${milestones.includes(i + 1) && i < streak ? 'opacity-100' : 'opacity-40'}`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1 px-0.5">
         <span className={`text-[8px] font-bold ${streak >= 7 ? 'text-blue-500' : 'text-slate-400'}`}>7D</span>
         <span className={`text-[8px] font-bold ${streak >= 14 ? 'text-blue-500' : 'text-slate-400'}`}>14D</span>
         <span className={`text-[8px] font-bold ${streak >= 21 ? 'text-blue-500' : 'text-slate-400'}`}>21D</span>
      </div>
    </div>
  );
};

export default MilestoneProgress;
