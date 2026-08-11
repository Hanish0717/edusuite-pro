import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarRange,
  Clock,
  User,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  History,
  Building2,
  CalendarCheck,
  Check,
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/staff/finance-dean/timetable")({
  head: () => ({
    meta: [{ title: "Finance Dean Budget & Lecture Schedule — EduSuite Pro" }],
  }),
  component: TimetableComponent,
});

function TimetableComponent() {
  const [activeTab, setActiveTab] = useState<"my" | "faculty" | "allocate" | "history">("my");
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("FM501 Financial Management");
  const [subDate, setSubDate] = useState("2026-08-10");
  const [subPeriod, setSubPeriod] = useState("Period 2 (10:00 - 11:00 AM)");
  const [assignedFaculty, setAssignedFaculty] = useState("Dr. Priya Sharma");
  const [assignReason, setAssignReason] = useState("Academic Council Meeting");
  const [assignSuccess, setAssignSuccess] = useState(false);

  const mySchedule = [
    {
      id: "MY-1",
      day: "Monday",
      period: "Period 1 (09:00 - 10:00 AM)",
      subject: "FM501 Financial Management",
      section: "MBA Sem 3",
      room: "MBA Block Hall-2",
      time: "09:00 AM",
      status: "Scheduled"
    },
    {
      id: "MY-2",
      day: "Tuesday",
      period: "Period 3 (11:15 - 12:15 PM)",
      subject: "Institutional Department Budget Scrutiny",
      section: "All HODs",
      room: "Finance Senate",
      time: "11:15 AM",
      status: "Scheduled"
    },
    {
      id: "MY-3",
      day: "Thursday",
      period: "Period 2 (10:00 - 11:00 AM)",
      subject: "Statutory Financial Audit Review",
      section: "Audit Team",
      room: "Finance Conference Room",
      time: "10:00 AM",
      status: "Scheduled"
    }
  ];

  const facultyTimetables = useMemo(() => {
    return [
    { facultyName: "Dr. Rajesh Varma", department: "Finance", subject: "Financial Accounting", period: "09:00 AM", freeSlots: 4, availability: "Available" },
    { facultyName: "Prof. Sujatha Reddy", department: "Management", subject: "Cost Accounting", period: "10:00 AM", freeSlots: 3, availability: "Available" },
  ];
  }, []);

  const [history, setHistory] = useState([
    { date: "2026-08-01", subject: "FM501 Financial Management", originalFaculty: "Prof. Finance Dean", assignedFaculty: "Dr. Rajesh Varma", reason: "State Audit Meeting", approvedBy: "Finance Dean", status: "Approved" }
  ]);

  const filteredFaculty = useMemo(() => {
    return facultyTimetables.filter((f: Record<string, any>) =>
      f["facultyName"].toLowerCase().includes(search.toLowerCase()) ||
      f["department"].toLowerCase().includes(search.toLowerCase()) ||
      f["subject"].toLowerCase().includes(search.toLowerCase())
    );
  }, [facultyTimetables, search]);

  const handleAssign = () => {
    const newRecord = {
      date: subDate,
      subject: selectedClass,
      originalFaculty: "Prof. Finance Dean",
      assignedFaculty,
      reason: assignReason,
      status: "Approved",
      approvedBy: "Prof. Finance Dean",
    };
    setHistory((prev) => [newRecord, ...prev]);
    setAssignSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              FINANCE DEAN
            </Badge>
            <span className="text-xs text-muted-foreground">• Institutional Timetable Module</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Finance Dean Budget & Lecture Schedule</h1>
          <p className="text-sm text-muted-foreground">Official higher education ERP management ledger and verified domain records.</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant={activeTab === "my" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("my")}
            className="h-8 text-xs cursor-pointer gap-1.5 font-bold"
          >
            <CalendarRange className="size-3.5" /> My Timetable
          </Button>
          <Button
            variant={activeTab === "faculty" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("faculty")}
            className="h-8 text-xs cursor-pointer gap-1.5 font-bold"
          >
            <Users className="size-3.5" /> Faculty Timetable
          </Button>
          <Button
            variant={activeTab === "allocate" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("allocate")}
            className="h-8 text-xs cursor-pointer gap-1.5 font-bold"
          >
            <UserPlus className="size-3.5" /> Class Allocation
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className="h-8 text-xs cursor-pointer gap-1.5 font-bold"
          >
            <History className="size-3.5" /> History
          </Button>
        </div>
      </div>

      {/* KPI STATS CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Today's Sessions" value="3 Classes" icon={Clock} tone="info" />
        <KpiCard label="Weekly Workload" value="16 Hours" icon={CalendarCheck} tone="success" />
        <KpiCard label="Available Faculty" value="28 Faculty" icon={Users} tone="purple" />
        <KpiCard label="Free Slots" value="14 Slots" icon={Building2} tone="warning" />
      </div>

      {/* TAB 1: MY TIMETABLE */}
      {activeTab === "my" && (
        <Panel title="Prof. Finance Dean — Personal Teaching & Duty Schedule" description="Shows ONLY this dean's own assigned classes, meetings and office hours.">
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Day</th>
                  <th className="p-3">Period / Time</th>
                  <th className="p-3">Subject / Session Title</th>
                  <th className="p-3">Section / Scope</th>
                  <th className="p-3">Classroom / Venue</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {mySchedule.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-bold text-primary font-mono">{s.day}</td>
                    <td className="p-3 font-mono text-muted-foreground">{s.period}</td>
                    <td className="p-3 font-bold text-foreground">{s["subject"]}</td>
                    <td className="p-3 font-mono">{s.section}</td>
                    <td className="p-3 font-mono">{s.room}</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{s["status"]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* TAB 2: FACULTY TIMETABLES */}
      {activeTab === "faculty" && (
        <Panel title="Department Faculty Timetables & Availability" description="Search faculty name, department, or subject. View available vs busy slots.">
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search faculty name (e.g. Dr. Ravi Kumar), Dept..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3">Faculty Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Assigned Subjects</th>
                    <th className="p-3">Scheduled Period</th>
                    <th className="p-3 font-mono">Free Slots</th>
                    <th className="p-3 text-center">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {filteredFaculty.map((f: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-bold text-foreground">{f["facultyName"]}</td>
                      <td className="p-3 font-mono font-bold text-primary">{f["department"]}</td>
                      <td className="p-3 font-bold">{f["subject"]}</td>
                      <td className="p-3 font-mono text-muted-foreground">{f.period}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600">{f.freeSlots} Slots Free</td>
                      <td className="p-3 text-center">
                        <Badge className={f.availability === "Available" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                          {f.availability}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>
      )}

      {/* TAB 3: CLASS ALLOCATION / SUBSTITUTE ASSIGNMENT */}
      {activeTab === "allocate" && (
        <Panel title="Class Reassignment & Substitute Allocation" description="Assign your class to an available substitute faculty member.">
          <div className="space-y-4 max-w-2xl">
            {assignSuccess && (
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 flex items-center justify-between text-xs font-bold">
                <span>Substitute faculty assigned successfully! Notification sent to ${assignedFaculty}.</span>
                <Badge className="bg-emerald-600 text-white">Assigned ✓</Badge>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Select My Class / Session</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FM501 Financial Management">FM501 Financial Management (MBA Sem 3)</SelectItem>
                    <SelectItem value="Institutional Department Budget Scrutiny">Institutional Department Budget Scrutiny (All HODs)</SelectItem>
                    <SelectItem value="Statutory Financial Audit Review">Statutory Financial Audit Review (Audit Team)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Substitution Date</label>
                <Input type="date" value={subDate} onChange={(e) => setSubDate(e.target.value)} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Time Slot / Period</label>
                <Input value={subPeriod} onChange={(e) => setSubPeriod(e.target.value)} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Available Substitute Faculty</label>
                <Select value={assignedFaculty} onValueChange={setAssignedFaculty}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Priya Sharma">Dr. Priya Sharma (Available)</SelectItem>
                    <SelectItem value="Dr. Ravi Kumar">Dr. Ravi Kumar (Available)</SelectItem>
                    <SelectItem value="Prof. Anil Reddy">Prof. Anil Reddy (Available)</SelectItem>
                    <SelectItem value="Dr. Mahesh Gupta">Dr. Mahesh Gupta (Available)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Reason for Reassignment</label>
              <Input value={assignReason} onChange={(e) => setAssignReason(e.target.value)} className="h-9 text-xs" placeholder="e.g. Attending Academic Senate Meeting" />
            </div>

            <Button onClick={handleAssign} className="h-9 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
              <UserPlus className="size-4" /> Save & Assign Faculty
            </Button>
          </div>
        </Panel>
      )}

      {/* TAB 4: ASSIGNMENT HISTORY */}
      {activeTab === "history" && (
        <Panel title="Class Substitution Assignment History" description="Historical log of class reassignments and substitute faculty approvals.">
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 font-mono">Date</th>
                  <th className="p-3">Subject / Session</th>
                  <th className="p-3">Original Faculty</th>
                  <th className="p-3 font-bold text-primary">Assigned Faculty</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Approved By</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {history.map((h, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{h.date}</td>
                    <td className="p-3 font-bold text-foreground">{h["subject"]}</td>
                    <td className="p-3 font-mono">{h.originalFaculty}</td>
                    <td className="p-3 font-bold text-primary">{h.assignedFaculty}</td>
                    <td className="p-3 font-mono text-muted-foreground">{h.reason}</td>
                    <td className="p-3 font-mono">{h.approvedBy}</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{h["status"]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
