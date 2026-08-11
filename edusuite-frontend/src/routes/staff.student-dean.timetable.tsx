import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, CalendarRange, Clock, Building2, User } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/student-dean/timetable")({
  head: () => ({
    meta: [{ title: "Timetable & Official Schedule — Student Dean" }],
  }),
  component: TimetablePage,
});

function TimetablePage() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);
  const [activeTab, setActiveTab] = useState<"official" | "faculty">("official");
  const [facultySearch, setFacultySearch] = useState("");

  const filteredFacultyTimetables = useMemo(() => {
    const list = data?.facultyTimetables || [];
    return list.filter(
      (f) =>
        (f.facultyName || "").toLowerCase().includes(facultySearch.toLowerCase()) ||
        (f.department || "").toLowerCase().includes(facultySearch.toLowerCase()) ||
        (f.subject || "").toLowerCase().includes(facultySearch.toLowerCase())
    );
  }, [data?.facultyTimetables, facultySearch]);

  const officialSchedule = useMemo(() => {
    return data?.officialSchedule || [];
  }, [data?.officialSchedule]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              TIMETABLE MODULE
            </Badge>
            <span className="text-xs text-muted-foreground">• Official Schedule & Faculty Timetables</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Institutional Timetable</h1>
          <p className="text-sm text-muted-foreground font-medium">Student Dean official schedule, inspection hours, and department faculty timetables.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "official" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("official")}
            className="h-8 text-xs cursor-pointer gap-1.5 font-bold"
          >
            <CalendarRange className="size-3.5" /> Tab 1: Student Dean Official Schedule
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Teaching Sessions" value="2 Classes / Wk" icon={Clock} tone="info" />
        <KpiCard label="Office Hours" value="11:00 AM - 01:00 PM" icon={CalendarRange} tone="success" />
        <KpiCard label="Inspection Schedule" value="Bi-Weekly" icon={Building2} tone="purple" />
        <KpiCard label="Faculty Roster" value="245 Faculty" icon={User} tone="warning" />
      </div>

      {activeTab === "official" ? (
        <Panel title="Student Dean Official Weekly Schedule" description="Meetings, Counselling sessions, Committee Meetings, Office Hours, and Inspections.">
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
                    <td className="p-3 font-bold text-foreground">{s.subject}</td>
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
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search faculty name (e.g. Dr. S. K. Gupta), Dept..."
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {filteredFacultyTimetables.map((f, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-bold text-foreground">{f.facultyName}</td>
                      <td className="p-3 font-mono font-bold text-primary">{f.department}</td>
                      <td className="p-3 font-bold">{f.subject}</td>
                      <td className="p-3 font-mono">{f.day}</td>
                      <td className="p-3 font-mono text-muted-foreground">{f.period}</td>
                      <td className="p-3 text-center font-mono font-bold">{f.room}</td>
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
