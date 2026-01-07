
export type HabitIcon = 'droplets' | 'code' | 'book' | 'bike' | 'brain' | 'flame' | 'sun';
export type HabitCategory = 'Health' | 'Focus' | 'Learning' | 'Mindset';

export interface Habit {
  id: string;
  name: string;
  icon: HabitIcon;
  category: HabitCategory;
  targetFrequency: number;
  reminderTime?: string; // HH:mm
  createdAt: number;
}

export interface CompletionLog {
  habitId: string;
  date: string; // YYYY-MM-DD
  count: number;
  note?: string;
}

export interface UserState {
  habits: Habit[];
  logs: CompletionLog[];
  theme: 'light' | 'dark';
}
