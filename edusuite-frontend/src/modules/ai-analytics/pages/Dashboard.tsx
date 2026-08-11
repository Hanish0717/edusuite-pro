import {
  Users,
  AlertTriangle,
  Target,
  Sparkles,
  Send,
  MessageSquare,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";

const RISK_DISTRIBUTION = [
  { name: "Low Risk", value: 850, color: "#1d4ed8" },
  { name: "Medium Risk", value: 340, color: "#3b82f6" },
  { name: "High Risk", value: 160, color: "#f59e0b" },
  { name: "Critical Risk", value: 70, color: "#ef4444" },
];

const DEPT_PERFORMANCE = [
  { name: "CSE", cgpa: 7.9, attendance: 82 },
  { name: "ECE", cgpa: 7.4, attendance: 79 },
  { name: "EEE", cgpa: 7.1, attendance: 76 },
  { name: "ME", cgpa: 6.8, attendance: 74 },
  { name: "Civil", cgpa: 6.9, attendance: 75 },
];

const ATTENDANCE_FORECAST = [
  { week: "Wk 1", actual: 80, predicted: 80 },
  { week: "Wk 4", actual: 82, predicted: 81 },
  { week: "Wk 8", actual: 79, predicted: 80 },
  { week: "Wk 12", actual: 75, predicted: 76 },
  { week: "Wk 16", actual: 78, predicted: 78 },
];

const PLACEMENT_PROBABILITY = [
  { batch: "2023", rate: 82 },
  { batch: "2024", rate: 85 },
  { batch: "2025", rate: 89 },
  { batch: "2026 (AI Pred)", rate: 92 },
];

export function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Total Students Tracked"
          value="1,420"
          icon={Users}
          delta="100% Core coverage"
        />
        <KpiCard
          label="Active Students At Risk"
          value="230"
          icon={AlertTriangle}
          tone="warning"
          delta="16.2% of cohort"
        />
        <KpiCard
          label="Attendance Accuracy"
          value="94.2%"
          icon={Target}
          tone="success"
          delta="ML Confidence: High"
        />
        <KpiCard
          label="Placement Accuracy"
          value="89.6%"
          icon={Sparkles}
          tone="info"
          delta="XGBoost Classifier"
        />
        <KpiCard
          label="AI Notifications Dispatched"
          value="342"
          icon={Send}
          delta="SMS/Email triggers"
        />
        <KpiCard
          label="Chatbot Queries Today"
          value="128"
          icon={MessageSquare}
          delta="Avg response: 0.6s"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Attendance Forecast Trends"
          description="Average institutional actual vs. machine learning-predicted weekly attendance percentages."
        >
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTENDANCE_FORECAST}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="Actual %"
                  stroke="#1d4ed8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  name="Predicted %"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#colorPred)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Student Academic Risk Distribution"
          description="Machine learning classifier segmenting cohorts based on internals, attendance, and assignment metrics."
        >
          <div className="flex flex-col sm:flex-row items-center justify-between h-80 pt-4 gap-4">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RISK_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {RISK_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 flex flex-col gap-3 pr-2">
              {RISK_DISTRIBUTION.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  <span className="font-mono text-muted-foreground font-bold">{item.value} students</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Department Vitals Overview"
          description="Comparison of mean academic performance (CGPA) and average attendance percentages per department."
        >
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Bar dataKey="cgpa" name="Mean CGPA" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendance" name="Avg Attendance %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Placement Success Analytics"
          description="Historical graduation recruitment success vs. predicted recruitment rate for active batch."
        >
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PLACEMENT_PROBABILITY}>
                <defs>
                  <linearGradient id="colorPlacement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="batch" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[70, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Placement %"
                  stroke="#1d4ed8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPlacement)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}
