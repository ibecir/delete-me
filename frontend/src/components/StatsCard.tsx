import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: 'blue' | 'amber' | 'purple' | 'green';
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <span className="stats-value">{value}</span>
        <span className="stats-title">{title}</span>
      </div>
    </div>
  );
}
