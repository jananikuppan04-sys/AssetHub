import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export interface BaseRadarChartProps {
  data: any[];
  dataKey: string;
  angleKey?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export function BaseRadarChart({ data, dataKey, angleKey = 'name', colors = DEFAULT_COLORS }: BaseRadarChartProps) {
  const keys = dataKey.split(',').map(k => k.trim());

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis 
          dataKey={angleKey} 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
        />
        {keys.length > 1 && <Legend wrapperStyle={{ fontSize: '12px' }} />}
        
        {keys.map((key, idx) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={colors[idx % colors.length]}
            fill={colors[idx % colors.length]}
            fillOpacity={0.4}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}
