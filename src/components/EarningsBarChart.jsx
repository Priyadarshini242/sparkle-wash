// src/components/EarningsBarChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Aug 20", earnings: 400 },
  { date: "Aug 21", earnings: 650 },
  { date: "Aug 22", earnings: 800 },
  { date: "Aug 23", earnings: 300 },
  { date: "Aug 24", earnings: 1200 },
  { date: "Aug 25", earnings: 650 },
  { date: "Aug 26", earnings: 900 },
];

export default function EarningsBarChart() {
  return (
    <div className="w-full h-80 bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Recent Earnings (₹)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#374151" />
          <YAxis stroke="#374151" />
          <Tooltip />
          <Bar dataKey="earnings" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}