
import React from 'react';
import { Droplets, Code, Book, Bike, Brain, Flame, Sun } from 'lucide-react';
import { HabitIcon } from './types';

export const COLORS = {
  primary: '#4361ee', // Calming Blue
  accent: '#f72585',  // Energetic Accent
  success: '#4cc9f0',
  dark: '#1e293b'
};

export const ICON_MAP: Record<HabitIcon, React.ReactNode> = {
  droplets: <Droplets className="w-5 h-5" />,
  code: <Code className="w-5 h-5" />,
  book: <Book className="w-5 h-5" />,
  bike: <Bike className="w-5 h-5" />,
  brain: <Brain className="w-5 h-5" />,
  flame: <Flame className="w-5 h-5" />,
  sun: <Sun className="w-5 h-5" />
};

export const ICONS: { id: HabitIcon; label: string }[] = [
  { id: 'droplets', label: 'Hydration' },
  { id: 'code', label: 'Coding' },
  { id: 'book', label: 'Reading' },
  { id: 'bike', label: 'Exercise' },
  { id: 'brain', label: 'Mindfulness' },
  { id: 'flame', label: 'Focus' },
  { id: 'sun', label: 'Morning Routine' }
];
