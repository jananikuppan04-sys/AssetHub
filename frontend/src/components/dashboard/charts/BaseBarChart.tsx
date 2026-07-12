import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

export interface BaseChartProps {
  data: any[];
  dataKey: string; // the property for the main value
  xAxisKey?: string; // the property for labels
  colors?: string[];
  stacked?: boolean;
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function BaseBarChart({ data, dataKey, xAxisKey = 'name', colors = DEFAULT_COLORS, stacked }: BaseChartProps) {
  // If dataKey contains commas, it's multi-series
  const keys = dataKey.split(',').map(k => k.trim());
  const isMulti = keys.length > 1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis 
          dataKey={xAxisKey} 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
          itemStyle={{ color: 'hsl(var(--foreground))' }}
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
        />
        {isMulti && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
        
        {isMulti ? (
          keys.map((key, idx) => (
            <Bar 
              key={key} 
              dataKey={key} 
              stackId={stacked ? "a" : undefined}
              fill={colors[idx % colors.length]} 
              radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]} 
            />
          ))
        ) : (
          <Bar dataKey={keys[0]} radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
