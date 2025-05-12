"use client";

import { useTheme } from "next-themes";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", posts: 400, users: 240, threads: 100 },
  { name: "Feb", posts: 300, users: 139, threads: 80 },
  { name: "Mar", posts: 200, users: 980, threads: 70 },
  { name: "Apr", posts: 278, users: 390, threads: 60 },
  { name: "May", posts: 189, users: 480, threads: 80 },
  { name: "Jun", posts: 239, users: 380, threads: 110 },
  { name: "Jul", posts: 349, users: 430, threads: 120 },
  { name: "Aug", posts: 430, users: 380, threads: 130 },
  { name: "Sep", posts: 500, users: 410, threads: 140 },
  { name: "Oct", posts: 550, users: 490, threads: 150 },
  { name: "Nov", posts: 600, users: 500, threads: 160 },
  { name: "Dec", posts: 670, users: 520, threads: 170 },
];

const ActivityChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? "#333" : "#eee"}
        />
        <XAxis dataKey="name" stroke={isDark ? "#888" : "#666"} />
        <YAxis stroke={isDark ? "#888" : "#666"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            border: `1px solid ${isDark ? "#444" : "#ddd"}`,
            color: isDark ? "#fff" : "#333",
          }}
        />
        <Line
          type="monotone"
          dataKey="posts"
          stroke="#2563eb"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#10b981"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="threads"
          stroke="#f59e0b"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;
