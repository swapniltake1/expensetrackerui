import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - in real app, this would come from API
const mockTrendData = [
  { date: '2024-01-01', amount: 120 },
  { date: '2024-01-02', amount: 45 },
  { date: '2024-01-03', amount: 80 },
  { date: '2024-01-04', amount: 200 },
  { date: '2024-01-05', amount: 65 },
  { date: '2024-01-06', amount: 150 },
  { date: '2024-01-07', amount: 90 },
  { date: '2024-01-08', amount: 110 },
  { date: '2024-01-09', amount: 75 },
  { date: '2024-01-10', amount: 130 },
  { date: '2024-01-11', amount: 95 },
  { date: '2024-01-12', amount: 180 },
  { date: '2024-01-13', amount: 85 },
  { date: '2024-01-14', amount: 220 },
];

const ExpenseTrendChart: React.FC = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--card-foreground))'
            }}
            formatter={(value) => [`$${value}`, 'Amount']}
            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseTrendChart;