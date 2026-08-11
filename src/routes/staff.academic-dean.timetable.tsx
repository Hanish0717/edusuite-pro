import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, CalendarRange, Clock, Building2, User, Download, Printer } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/staff/academic-dean/timetable")({
  head: () => ({
    meta: [{ title: "Timetable & Official Schedule — Academic Dean" }],
  }),
  component: TimetablePage,
});

function TimetablePage() {
  const [activeTab, setActiveTab] = useState<"official" | "faculty">("official");
  const [facultySearch, setFacultySearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const officialSchedule = [
    { day: "Monday", period: "09:30 AM - 11:00 AM", subject: "Academic Council Standing Committee Meeting", section: "All Deans & HODs", room: "Conference Room A", type: "Council Meeting" },
    { day: "Monday", period: "02:00 PM - 04:00 PM", subject: "Curriculum & Syllabus Revision Audit", section: "BOS Chairs", room: "Dean Office Room 102", type: "Curriculum Review" },
    { day: "Tuesday", period: "10:00 AM - 12:00 PM", subject: "Department Review Meeting (CSE & ECE)", section: "HODs & Senior Faculty", room: "Board Room 2", type: "Department Review" },
    { day: "Wednesday", period: "09:30 AM - 11:30 AM", subject: "Board of Studies (BOS) Executive Meeting", section: "External BOS Members", room: "Senate Hall", type: "BOS Meeting" },
    { day: "Thursday", period: "11:00 AM - 01:00 PM", subject: "Academic Planning & Resource Allocation", section: "Academic Committee", room: "Conference Room B", type: "Academic Planning" },
    { day: "Friday", period: "03:00 PM - 04:30 PM", subject: "Faculty Academic Review & Workload Check", section: "All Faculty Members", room: "Main Auditorium", type: "Faculty Meeting" },
    { day: "Mon - Fri", period: "02:00 PM - 03:00 PM", subject: "Academic Dean Open Office Hours", section: "Faculty & Students", room: "Dean Office Room 101", type: "Office Hours" },
  ];

  const facultyTimetables = [
    { facultyName: "Dr. Srinivas Rao", department: "Computer Science & Engineering", subject: "CS501 - Advanced Software Engineering", day: "Monday", period: "09:00 AM - 10:00 AM", room: "Block A - Room 101", load: "18 Hours / Wk", status: "Available" },
    { facultyName: "Dr. Priya Sharma", department: "Electronics & Communication", subject: "EC304 - VLSI Design & Architecture", day: "Tuesday", period: "10:00 AM - 11:00 AM", room: "Block B - Room 204", load: "16 Hours / Wk", status: "Available" },
    { facultyName: "Dr. Ravi Kumar", department: "Artificial Intelligence & Data Science", subject: "AI502 - Deep Learning & Neural Networks", day: "Wednesday", period: "11:00 AM - 12:00 PM", room: "Block A - Room 302", load: "16 Hours / Wk", status: "Available" },
    { facultyName: "Dr. Lakshmi Devi", department: "Electrical & Electronics", subject: "EE401 - Power Systems & Grid Control", day: "Thursday", period: "02:00 PM - 03:00 PM", room: "Block C - Room 105", load: "16 Hours / Wk", status: "Available" },
    { facultyName: "Dr. Karthik Reddy", department: "Cyber Security", subject: "CY503 - Network Security & Cryptography", day: "Friday", period: "09:00 AM - 10:00 AM", room: "Block A - Room 202", load: "18 Hours / Wk", status: "Available" },
    { facultyName: "Dr. Mahesh Gupta", department: "Mechanical Engineering", subject: "ME302 - Thermal Dynamics & Heat Transfer", day: "Monday", period: "11:00 AM - 12:00 PM", room: "Block D - Room 104", load: "18 Hours / Wk", status: "Available" },
    { facultyName: "Dr. Anitha Rao", department: "Computer Science & Engineering", subject: "CS305 - Database Management Systems", day: "Wednesday", period: "02:00 PM - 03:00 PM", room: "Block A - Room 103", load: "16 Hours / Wk", status: "Available" },
  ];

  const filteredFacultyTimetables = useMemo(() => {
    return facultyTimetables.filter((f) => {
      const matchSearch =
        f["facultyName"].toLowerCase().includes(facultySearch.toLowerCase()) ||
        f["department"].toLowerCase().includes(facultySearch.toLowerCase()) ||
        f["subject"].toLowerCase().includes(facultySearch.toLowerCase());
      const matchDept = deptFilter === "all" || f["department"].toLowerCase().includes(deptFilter.toLowerCase());
      return matchSearch && matchDept;
    });
  }, [facultySearch, deptFilter]);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              TIMETABLE MODULE
            </Badge>
            <span className="text-xs text-muted-foreground">• Official Schedule & Faculty Timetables</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Institutional Timetable</h1>
          <p className="text-sm text-muted-foreground font-medium">Academic Dean official schedule, BOS meetings, council sessions, and department faculty timetables.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "official" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("official")}
            className="h-8 text-xs cursor-pointer gap-1.5 font-bold"
          >
            <CalendarRange className="size-3.5" /> Tab 1: Academic Dean Official Schedule
          </Button>
          <Button
            variant={activeTab === "faculty" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("faculty")}
            className="h-8 text-xs cursor-pointer gap-1.5 font-bold"
          >
            <User className="size-3.5" /> Tab 2: Faculty Timetable Browser
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Teaching Sessions" value="2 Classes / Wk" icon={Clock} tone="info" />
        <KpiCard label="Office Hours" value="02:00 PM - 03:00 PM" icon={CalendarRange} tone="success" />
        <KpiCard label="BOS Review Schedule" value="Weekly" icon={Building2} tone="purple" />
        <KpiCard label="Faculty Roster" value="345 Faculty" icon={User} tone="warning" />
      </div>

      {activeTab === "official" ? (
        <Panel title="Academic Dean Official Weekly Schedule" description="Academic Council Meetings, Department Review Meetings, BOS Meetings, Faculty Meetings, Curriculum Reviews, Academic Planning, and Office Hours.">
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Day</th>
                  <th className="p-3">Period / Time</th>
                  <th className="p-3">Subject / Event Title</th>
                  <th className="p-3">Section / Scope</th>
                  <th className="p-3">Venue / Room</th>
                  <th className="p-3 text-center">Schedule Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {officialSchedule.map((s, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-bold text-primary font-mono">{s.day}</td>
                    <td className="p-3 font-mono text-muted-foreground">{s.period}</td>
                    <td className="p-3 font-bold text-foreground">{s["subject"]}</td>
                    <td className="p-3 font-mono">{s.section}</td>
                    <td className="p-3 font-mono">{s.room}</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{s.type}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <Panel title="Department Faculty Timetables" description="Search by Faculty Name, Department, or Subject Code.">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search faculty name (e.g. Dr. Srinivas Rao), Dept..."
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={deptFilter} onValueChange={(val) => setDeptFilter(val)}>
                  <SelectTrigger className="h-9 w-[180px] text-xs">
                    <SelectValue placeholder="Filter Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="computer">Computer Science</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="intelligence">AI & Data Science</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                  </SelectContent>
                </Select>

                <Button size="sm" variant="outline" onClick={() => toast.success("Timetable PDF Exported")} className="h-9 text-xs gap-1 cursor-pointer">
                  <Download className="size-3.5" /> Export PDF
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3">Faculty Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Assigned Subject</th>
                    <th className="p-3">Scheduled Day</th>
                    <th className="p-3">Time Slot</th>
                    <th className="p-3 text-center">Classroom</th>
                    <th className="p-3 text-center">Weekly Load</th>
                    <th className="p-3 text-center">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {filteredFacultyTimetables.map((f, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-bold text-foreground">{f["facultyName"]}</td>
                      <td className="p-3 font-mono font-bold text-primary">{f["department"]}</td>
                      <td className="p-3 font-bold">{f["subject"]}</td>
                      <td className="p-3 font-mono">{f.day}</td>
                      <td className="p-3 font-mono text-muted-foreground">{f.period}</td>
                      <td className="p-3 text-center font-mono font-bold">{f.room}</td>
                      <td className="p-3 text-center font-mono">{f.load}</td>
                      <td className="p-3 text-center">
                        <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{f["status"]}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
