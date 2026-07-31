import {
  Users,
  UserCog,
  Building2,
  IndianRupee,
  Activity,
  ShieldCheck,
  TrendingUp,
  Brain,
  ListTodo,
  Shield,
  Layers,
  Percent,
  Search,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  ChartLegend,
  DonutChart,
  TrendAreaChart,
  TrendLineChart,
} from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  ActivityWidget,
  AiInsightsWidget,
  QuickActionsWidget,
} from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { admissionTrend, moduleUsage, departmentPerformance } from "@/data/mock";

const systemHealth = [
  { label: "Database", status: "Healthy" },
  { label: "Server Cluster", status: "Healthy" },
  { label: "Redis Cache", status: "Healthy" },
  { label: "Storage", status: "72% used" },
  { label: "Last backup", status: "Today 02:00 AM" },
];

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Super Admin Cockpit
          </h2>
          <p className="text-sm text-muted-foreground">
            Global platform management and institutional metrics.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary w-fit">SUPER-ADMIN</Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto bg-background/50 border border-border p-1 gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="institution">Institution</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Total Students" value="5,246" icon={Users} delta="8.5% vs last term" />
            <KpiCard label="Total Staff" value="623" icon={UserCog} delta="4.2%" tone="info" />
            <KpiCard label="Departments" value="23" icon={Building2} tone="success" />
            <KpiCard
              label="Total Revenue"
              value="Rs 12.45 Cr"
              icon={IndianRupee}
              delta="11.3%"
              tone="warning"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              title="System Health"
              description="Real-time node cluster monitoring"
              className="lg:col-span-2"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                <div className="border border-border rounded-xl p-3 flex justify-between items-center text-xs">
                  <span>API Response Time</span>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">42ms</Badge>
                </div>
                <div className="border border-border rounded-xl p-3 flex justify-between items-center text-xs">
                  <span>SSL Certificate</span>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Valid</Badge>
                </div>
                <div className="border border-border rounded-xl p-3 flex justify-between items-center text-xs">
                  <span>Errors (24h)</span>
                  <Badge variant="secondary">0.02%</Badge>
                </div>
              </div>
              <ul className="space-y-3 border-t border-border pt-4">
                {systemHealth.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2 font-medium">
                      <Activity className="size-4 text-muted-foreground" />
                      {item.label}
                    </span>
                    <Badge variant="secondary">{item.status}</Badge>
                  </li>
                ))}
              </ul>
            </Panel>

            <AiInsightsWidget />
          </div>

          <QuickActionsWidget
            actions={[
              "Add new institution",
              "Register global user",
              "Audit system settings",
              "Trigger system backup",
            ]}
          />
        </TabsContent>

        {/* TAB 2: ANALYTICS */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              title="Admissions & Fees Trend"
              description="Comparison over the fiscal year"
              className="lg:col-span-2"
            >
              <TrendAreaChart
                data={admissionTrend}
                xKey="month"
                series={[
                  { key: "admissions", label: "Admissions" },
                  { key: "attendance", label: "Attendance" },
                  { key: "fees", label: "Fees Collection" },
                ]}
                height={260}
              />
            </Panel>

            <Panel title="Module Usage Breakdown" description="Platform engagement ratio">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <DonutChart data={moduleUsage} centerLabel="42%" />
                <ChartLegend items={moduleUsage} />
              </div>
            </Panel>
          </div>

          <Panel title="Cross-Department Performance" description="Average score vs placement rate">
            <TrendLineChart
              data={departmentPerformance}
              xKey="month"
              series={[
                { key: "attendance", label: "Attendance" },
                { key: "results", label: "Results" },
                { key: "placement", label: "Placement" },
              ]}
              height={220}
            />
          </Panel>
        </TabsContent>

        {/* TAB 3: INSTITUTION */}
        <TabsContent value="institution" className="space-y-6">
          <Panel title="Affiliated Colleges & Campuses" description="Manage primary setups">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campus Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Accreditation</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: "State Institute of Technology (Main)",
                    code: "SIT-HYD",
                    students: "3,200",
                    faculty: "380",
                    acc: "NAAC A+",
                    status: "Active",
                  },
                  {
                    name: "SIT School of Management",
                    code: "SIT-MGMT",
                    students: "1,200",
                    faculty: "140",
                    acc: "NBA",
                    status: "Active",
                  },
                  {
                    name: "SIT Research Academy",
                    code: "SIT-RES",
                    students: "846",
                    faculty: "103",
                    acc: "NIRF top 100",
                    status: "Active",
                  },
                ].map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-semibold text-xs">{item.name}</TableCell>
                    <TableCell className="font-mono text-xs">{item.code}</TableCell>
                    <TableCell className="text-xs">{item.students}</TableCell>
                    <TableCell className="text-xs">{item.faculty}</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="secondary" className="text-[0.65rem]">
                        {item.acc}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[0.65rem]">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </TabsContent>

        {/* TAB 4: REVENUE */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard label="Tuition Revenue" value="Rs 8.40 Cr" icon={IndianRupee} tone="info" />
            <KpiCard label="Hostel & Transport" value="Rs 2.85 Cr" icon={IndianRupee} />
            <KpiCard
              label="Pending Receivables"
              value="Rs 1.20 Cr"
              icon={IndianRupee}
              tone="destructive"
            />
          </div>

          <Panel title="Recent Transactions" description="Finance logs across campuses">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Campus</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    tx: "TXN904812",
                    student: "Anirudh Sharma",
                    campus: "SIT-HYD",
                    cat: "Tuition Fees",
                    amt: "Rs 1,20,000",
                    status: "Completed",
                  },
                  {
                    tx: "TXN904811",
                    student: "Megha Rao",
                    campus: "SIT-MGMT",
                    cat: "Exam Fees",
                    amt: "Rs 4,500",
                    status: "Completed",
                  },
                  {
                    tx: "TXN904810",
                    student: "Kevin Paul",
                    campus: "SIT-HYD",
                    cat: "Hostel Rent",
                    amt: "Rs 45,000",
                    status: "Pending",
                  },
                ].map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">{item.tx}</TableCell>
                    <TableCell className="font-medium text-xs">{item.student}</TableCell>
                    <TableCell className="text-xs">{item.campus}</TableCell>
                    <TableCell className="text-xs">{item.cat}</TableCell>
                    <TableCell className="text-xs">{item.amt}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "Completed" ? "default" : "warning"}
                        className="text-[0.65rem]"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </TabsContent>

        {/* TAB 5: AI INSIGHTS */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Student Risk Analytics" description="AI prediction models for drop-outs">
              <div className="space-y-4">
                {[
                  { dept: "Computer Science", risk: "Low (2.1% risk)", val: 12 },
                  { dept: "Electrical Engineering", risk: "Medium (8.4% risk)", val: 42 },
                  { dept: "Mechanical Engineering", risk: "High (14.2% risk)", val: 78 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{item.dept}</span>
                      <span
                        className={
                          item.val > 50
                            ? "text-destructive"
                            : item.val > 25
                              ? "text-amber-500"
                              : "text-emerald-500"
                        }
                      >
                        {item.risk}
                      </span>
                    </div>
                    <Progress value={item.val} className="h-2" />
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              title="Platform Anomaly Engine"
              description="Real-time security and traffic alarms"
            >
              <div className="space-y-3">
                <div className="border border-amber-200 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl flex gap-3 items-start">
                  <Brain className="size-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-300">
                      Concurrent Login Spike
                    </h4>
                    <p className="text-muted-foreground mt-0.5">
                      Spike of 800+ concurrent requests detected on SIT-HYD node during Exam
                      registration hours.
                    </p>
                  </div>
                </div>
                <div className="border border-destructive/20 bg-destructive/5 p-3 rounded-xl flex gap-3 items-start">
                  <Shield className="size-5 text-destructive shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <h4 className="font-semibold text-destructive">Brute Force Attempt Blocked</h4>
                    <p className="text-muted-foreground mt-0.5">
                      IP 192.168.1.145 blocked after 15 failed password attempts on staff account
                      Ravi.K.
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </TabsContent>

        {/* TAB 6: AUDIT LOGS */}
        <TabsContent value="audit-logs" className="space-y-6">
          <Panel
            title="Admin Audit Trail"
            description="Trace system mutations made by administrators"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    time: "2026-07-31 14:38:22",
                    actor: "Admin-HYD",
                    act: "Generated API Credentials",
                    mod: "Security",
                    ip: "103.82.40.12",
                    status: "Success",
                  },
                  {
                    time: "2026-07-31 14:22:15",
                    actor: "System Daemon",
                    act: "Automated DB Backup",
                    mod: "Infrastructure",
                    ip: "127.0.0.1",
                    status: "Success",
                  },
                  {
                    time: "2026-07-31 13:05:08",
                    actor: "Admin-MGMT",
                    act: "Altered Course Structure",
                    mod: "Academics",
                    ip: "103.82.40.99",
                    status: "Success",
                  },
                  {
                    time: "2026-07-31 10:14:50",
                    actor: "Admin-HYD",
                    act: "Deleted Staff Profile",
                    mod: "HRMS",
                    ip: "103.82.40.12",
                    status: "Success",
                  },
                ].map((log, idx) => (
                  <TableRow key={idx} className="text-xs">
                    <TableCell className="font-mono text-muted-foreground">{log.time}</TableCell>
                    <TableCell className="font-semibold">{log.actor}</TableCell>
                    <TableCell>{log.act}</TableCell>
                    <TableCell>{log.mod}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{log.ip}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[0.6rem]">
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
