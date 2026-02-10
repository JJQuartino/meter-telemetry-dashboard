"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/*
I was using a Cell for the bar chart, but it was deprecated. So I changed it to fill="fill", since using Cell inside a map() is considered a legacy pattern
{data.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={getBarColor(entry.flag)} />
))}
*/

export default function ConsumptionChart({ data }: { data: any[] }) {
  
  const chartData = data.map((entry) => ({
    ...entry,
    fill: entry.flag === 'gap_estimated' ? '#ea580c' :
          entry.flag === 'counter_reset' ? '#dc2626' :
          '#16a34a'                                   
  }));

  return (
    <div className="h-64 w-full bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
          <XAxis 
            dataKey="hour" 
            tickFormatter={(tick) => new Date(tick).getHours() + ":00"}
            fontSize={12}
            tick={{ fill: 'currentColor' }}
          />
          <YAxis fontSize={12} tick={{ fill: 'currentColor' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          
          <Bar dataKey="consumption" fill="fill" />
          
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}