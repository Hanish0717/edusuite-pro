import {
  Bus,
  CalendarCheck,
  IndianRupee,
  Star,
  User,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GroupedBarChart, TrendLineChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  AiInsightsWidget,
  UpcomingWidget,
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
import { Button } from "@/components/ui/button";
import { monthlyAttendanceBars, notifications, semesterProgress } from "@/data/mock";

export function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Parent Portal</h2>
          <p className="text-sm text-muted-foreground">
            Wards: <b>Sai Teja</b> (B.Tech CSE - Yr 4). Monitor academic welfare.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary w-fit">PARENT ACCESS</Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto bg-background/50 border border-border p-1 gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Child Progress</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fee Status</TabsTrigger>
          <TabsTrigger value="bus">Bus Tracking</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Attendance"
              value="88%"
              icon={CalendarCheck}
              delta="4%"
              tone="success"
            />
            <KpiCard label="CGPA" value="8.45" icon={Star} delta="0.08" />
            <KpiCard label="Fee Paid" value="Rs 85,000" icon={IndianRupee} tone="info" />
            <KpiCard label="Pending Fee" value="Rs 0" icon={IndianRupee} tone="success" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              title="Recent Ward Notifications"
              description="Circulars & ward messages"
              className="lg:col-span-2"
            >
              <ul className="space-y-3">
                {notifications.map((n, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-3 border-b border-border/40 pb-2.5 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.meta}</p>
                    </div>
                    {n.unread && <Badge className="shrink-0 text-[0.65rem] px-1.5 py-0">New</Badge>}
                  </li>
                ))}
              </ul>
            </Panel>

            <UpcomingWidget />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AiInsightsWidget />
            <QuickActionsWidget
              actions={["Request PTM with Mentor", "Download Grade Card", "Contact Hostel Warden"]}
            />
          </div>
        </TabsContent>

        {/* TAB 2: CHILD PROGRESS */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              title="Subject Grades Report"
              description="Current Mid-Term evaluations"
              className="lg:col-span-2"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Mid Exams</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead>Syllabus Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { sub: "Distributed Systems", exam: "27/30", ass: "9/10", grade: "Excellent" },
                    { sub: "Cryptography & Security", exam: "25/30", ass: "8/10", grade: "Good" },
                    {
                      sub: "Theory of Computation",
                      exam: "28/30",
                      ass: "9.5/10",
                      grade: "Excellent",
                    },
                    {
                      sub: "Digital Logic Design",
                      exam: "22/30",
                      ass: "7/10",
                      grade: "Needs Focus",
                    },
                  ].map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-xs">{row.sub}</TableCell>
                      <TableCell className="text-xs">{row.exam}</TableCell>
                      <TableCell className="text-xs">{row.ass}</TableCell>
                      <TableCell>
                        <Badge
                          variant={row.grade.includes("Needs") ? "destructive" : "secondary"}
                          className="text-[0.65rem] px-2 py-0"
                        >
                          {row.grade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Panel>

            <Panel title="Mentor Comments" description="Academic advisor reviews">
              <div className="space-y-4">
                <div className="border border-border rounded-xl p-3.5 bg-muted/20 text-xs leading-relaxed">
                  <div className="flex gap-2 items-center mb-1.5">
                    <User className="size-4 text-primary shrink-0" />
                    <span className="font-bold">Dr. Ramesh Nair (Advisor)</span>
                  </div>
                  <p className="text-muted-foreground">
                    "Sai is demonstrating good analytical competence in Distributed Systems. He is
                    actively participating in lab activities. Needs minor spelling/documentation
                    cleanup in assignments."
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Request Virtual Meeting
                </Button>
              </div>
            </Panel>
          </div>

          <Panel title="Academic Trend Chart" description="SGPA and CGPA progress graph">
            <TrendLineChart
              data={semesterProgress}
              xKey="term"
              series={[
                { key: "sgpa", label: "SGPA" },
                { key: "cgpa", label: "CGPA" },
              ]}
              height={220}
            />
          </Panel>
        </TabsContent>

        {/* TAB 3: ATTENDANCE */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              title="Monthly Present/Absent Stats"
              description="Breakdown per month"
              className="lg:col-span-2"
            >
              <GroupedBarChart
                data={monthlyAttendanceBars}
                xKey="month"
                series={[
                  { key: "present", label: "Present" },
                  { key: "absent", label: "Absent" },
                  { key: "leave", label: "Leave" },
                ]}
                height={220}
              />
            </Panel>

            <Panel title="Leave Logs" description="Approved leave applications">
              <div className="space-y-3">
                {[
                  { reason: "Family Wedding Leave", date: "Jul 15 - Jul 18", status: "Approved" },
                  { reason: "Viral Fever Leave", date: "Jun 02 - Jun 05", status: "Approved" },
                ].map((log, idx) => (
                  <div key={idx} className="border border-border rounded-xl p-3 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{log.reason}</span>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[0.6rem]">
                        {log.status}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">{log.date}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </TabsContent>

        {/* TAB 4: FEE STATUS */}
        <TabsContent value="fees" className="space-y-6">
          <Panel title="Fee Payment Summary" description="Statements and ledger receipts">
            <div className="rounded-xl border border-emerald-550/20 bg-emerald-550/5 p-4 mb-4 flex justify-between items-center text-xs">
              <div>
                <h4 className="font-bold text-emerald-700 dark:text-emerald-300">
                  All fees are cleared!
                </h4>
                <p className="text-muted-foreground mt-0.5">
                  Sai Teja has no active outstanding invoices for Semester 7.
                </p>
              </div>
              <Badge className="bg-emerald-500 text-white">Paid in Full</Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    rcpt: "RCPT812903",
                    desc: "Semester 7 Tuition fee payment",
                    mode: "NetBanking SBI",
                    amt: "Rs 85,000",
                    date: "Jul 12, 2026",
                  },
                  {
                    rcpt: "RCPT811562",
                    desc: "Transport Fee - Route 3 (Annual)",
                    mode: "UPI payment",
                    amt: "Rs 25,000",
                    date: "Jul 12, 2026",
                  },
                ].map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">{item.rcpt}</TableCell>
                    <TableCell className="font-medium text-xs">{item.desc}</TableCell>
                    <TableCell className="text-xs">{item.mode}</TableCell>
                    <TableCell className="text-xs">{item.amt}</TableCell>
                    <TableCell className="text-xs">{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </TabsContent>

        {/* TAB 5: BUS TRACKING */}
        <TabsContent value="bus" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              title="Bus Location Status"
              description="Route 3: Hyderabad Central -> Campus"
              className="lg:col-span-2"
            >
              <div className="space-y-6 relative pl-6 before:absolute before:bottom-1 before:left-2 before:top-1 before:w-0.5 before:bg-border">
                {[
                  {
                    stop: "Hyderabad Central Depot (Start)",
                    status: "Completed",
                    time: "08:00 AM",
                  },
                  { stop: "Kukatpally Point", status: "Completed", time: "08:15 AM" },
                  {
                    stop: "Sai's Stop (Miyapur X Roads)",
                    status: "Active (Current Location)",
                    time: "08:30 AM",
                  },
                  { stop: "SIT Campus Main Gate", status: "Pending", time: "09:00 AM (Scheduled)" },
                ].map((chk, idx) => (
                  <div key={idx} className="relative">
                    <span
                      className={`absolute -left-6 top-1 grid size-4.5 place-items-center rounded-full border text-[0.6rem] font-bold ${
                        chk.status.includes("Completed")
                          ? "bg-primary border-primary text-primary-foreground"
                          : chk.status.includes("Active")
                            ? "bg-amber-500 border-amber-500 text-white animate-pulse"
                            : "bg-muted border-muted text-muted-foreground"
                      }`}
                    >
                      {chk.status.includes("Completed") ? "✓" : idx + 1}
                    </span>
                    <div className="ml-2 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-semibold">{chk.stop}</h4>
                        <p className="text-muted-foreground text-[0.65rem]">{chk.status}</p>
                      </div>
                      <span className="font-mono text-muted-foreground shrink-0">{chk.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Bus Details" description="Driver contact card">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-border pb-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Bus className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">Bus No: AP39 AB 1234</h4>
                    <p className="text-[0.65rem] text-muted-foreground">
                      Route 3 - Miyapur Express
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex gap-2 items-center">
                    <MapPin className="size-4 text-muted-foreground shrink-0" />
                    <span>
                      Current Speed: <b>42 km/h</b>
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Phone className="size-4 text-muted-foreground shrink-0" />
                    <span>
                      Driver: <b>Suresh Kumar</b> (+91 98765 43210)
                    </span>
                  </div>
                </div>
                <Button className="w-full text-xs">Call Driver</Button>
              </div>
            </Panel>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
