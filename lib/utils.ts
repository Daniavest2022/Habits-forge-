
import { CompletionLog } from '../types';

export const getTodayStr = () => new Date().toISOString().split('T')[0];

export const getPastDates = (days: number) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export const calculateStreak = (habitId: string, logs: CompletionLog[], targetFrequency: number) => {
  let streak = 0;
  const today = new Date();
  
  // Create a map for quick lookup
  const logMap = new Map<string, number>();
  logs.filter(l => l.habitId === habitId).forEach(l => {
    logMap.set(l.date, l.count);
  });

  // Check from today backwards
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const count = logMap.get(dateStr) || 0;
    
    // If it's today and count is 0, we haven't missed it yet, just check yesterday
    if (i === 0 && count === 0) continue;
    
    if (count > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getProgressForDate = (habitId: string, logs: CompletionLog[], dateStr: string) => {
  const log = logs.find(l => l.habitId === habitId && l.date === dateStr);
  return log ? log.count : 0;
};

export const downloadCSV = (data: string, filename: string) => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
