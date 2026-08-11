import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from "recharts";
import { Panel } from "@/components/dashboard/panel";

export function AttendanceAnalytics() {
  const trendData = [
    { day: "Mon", attendance: 92 },
    { day: "Tue", attendance: 94 },
    { day: "Wed", attendance: 88 },
    { day: "Thu", attendance: 91 },
    { day: "Fri", attendance: 89 },
    { day: "Sat", attendance: 95 },
  ];

  const distributionData = [
    { name: "Present", value: 89 },
    { name: "Absent", value: 6 },
    { name: "Late", value: 3 },
    { name: "On Duty", value: 2 },
  ];

  const COLORS = ["#10b981", "#f43f5e", "#f59e0b", "#3b82f6"];

  return (
    <Panel
      title="Attendance Analytics Dashboard"
      description="Pedagogy reports on weekly submittal ratios and student status shares"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trend Area Chart */}
        <div className="space-y-2">
          <h5 className="font-extrabold text-[0.7rem] text-muted-foreground uppercase tracking-wider">Weekly Attendance Trend (%)</h5>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tickLine={false} axisLine={false} style={{ fontSize: "10px", fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[80, 100]} tickLine={false} axisLine={false} style={{ fontSize: "10px", fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Area type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAttend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Bar Chart */}
        <div className="space-y-2">
          <h5 className="font-extrabold text-[0.7rem] text-muted-foreground uppercase tracking-wider">Attendance Status Share (%)</h5>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: "10px", fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: "10px", fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Panel>
  );
}
