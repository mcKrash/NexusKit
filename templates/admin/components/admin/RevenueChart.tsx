'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const generateRevenueData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  return months.slice(0, currentMonth + 1).map((month, index) => ({
    month,
    revenue: Math.floor(5000 + Math.random() * 3000 + index * 500),
    subscribers: Math.floor(50 + Math.random() * 30 + index * 5),
  }));
};

export default function RevenueChart() {
  const data = generateRevenueData();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: '#e5e7eb' }}
          label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: '#e5e7eb' }}
          label={{ value: 'Subscribers', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: 12
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
          name="Revenue"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="subscribers"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: '#8b5cf6', r: 4 }}
          activeDot={{ r: 6 }}
          name="Subscribers"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
