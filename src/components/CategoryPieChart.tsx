"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTransactionStore } from '@/store/transactionStore';

const COLORS = ['#00ff94', '#0068ed', '#845ef7', '#ff6b6b', '#ffa94d', '#20c997'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-highest/95 backdrop-blur-xl border border-outline p-2.5 rounded-xl shadow-2xl">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">{payload[0].name}</p>
        <p className="text-sm font-bold text-primary">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export const CategoryPieChart = () => {
  const { transactions } = useTransactionStore();

  const data = React.useMemo(() => {
    const byCat = transactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(byCat)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  if (data.length === 0) return null;

  return (
    <div className="h-48 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
