import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
  colors: string[];
  height?: number;
}

export function PieChart({ data, colors, height = 300 }: PieChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend formatter={(val) => <span className="text-[11px] font-semibold text-muted-foreground">{val}</span>} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;
