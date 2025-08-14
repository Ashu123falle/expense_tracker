import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#FF6B6B", // Coral Red
  "#4ECDC4", // Turquoise
  "#4795DA", // Bright Blue
  "#F7B267", // Sunset Orange
  "#81C784", // Mint Green
  "#9C89B8", // Lavender
  "#FFD166", // Sunny Yellow
  "#FFA07A", // Light Salmon
];



export const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No category data</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
           innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `₹${value}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
