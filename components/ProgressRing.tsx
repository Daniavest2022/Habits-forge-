
import React from 'react';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number; // 0 to 1
  color?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ radius, stroke, progress, color = '#4361ee' }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
      <circle
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        fill="transparent"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className="text-slate-200 dark:text-slate-800"
      />
      <circle
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        strokeLinecap="round"
        fill="transparent"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

export default ProgressRing;
