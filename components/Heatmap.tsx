
import React from 'react';
import { getPastDates, getProgressForDate } from '../lib/utils';
import { CompletionLog } from '../types';

interface HeatmapProps {
  habitId: string;
  logs: CompletionLog[];
  target: number;
}

const Heatmap: React.FC<HeatmapProps> = ({ habitId, logs, target }) => {
  const dates = getPastDates(21); // The 21-day challenge

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-wider">
        <span>Last 21 Days</span>
        <div className="flex gap-1 items-center">
          <span>Less</span>
          <div className="w-2 h-2 rounded-sm bg-slate-200 dark:bg-slate-800"></div>
          <div className="w-2 h-2 rounded-sm bg-blue-300"></div>
          <div className="w-2 h-2 rounded-sm bg-blue-500"></div>
          <div className="w-2 h-2 rounded-sm bg-blue-700"></div>
          <span>More</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {dates.map(date => {
          const count = getProgressForDate(habitId, logs, date);
          const intensity = Math.min(count / target, 1);
          
          let colorClass = "bg-slate-200 dark:bg-slate-800";
          if (intensity > 0) colorClass = "bg-blue-300";
          if (intensity >= 0.5) colorClass = "bg-blue-500";
          if (intensity >= 1) colorClass = "bg-blue-700";

          return (
            <div
              key={date}
              className={`w-full aspect-square rounded-sm transition-colors duration-300 ${colorClass}`}
              title={`${date}: ${count}/${target}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Heatmap;
