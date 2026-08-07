import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function saveRoute(filename, content) {
  fs.writeFileSync(path.join(routesDir, filename), content, 'utf8');
  console.log(`Generated: ${filename}`);
}

// 1. DISCIPLINE PAGE (staff.student-dean.discipline.tsx)
saveRoute("staff.student-dean.discipline.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShieldAlert, AlertTriangle, FileText, CheckCircle, UserX, Plus, Filter, Download } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GroupedBarChart } from "@/components/dashboard/charts";

export const Route = createFileRoute("/staff/student-dean/discipline")({
  head: () => ({ meta: [{ title: "Disciplinary Committee — Student Dean" }] }),
  component: DisciplinePage,
});

function DisciplinePage() {
  const [search, setSearch] = useState("");

  const cases = [
    { id: "DIS-2026-01", student: "Harsha Vardhan (22ME108)", dept: "Mechanical", incident: "Attendance Shortage Deficit", action: "Warning Letter Issued", date: "2026-08-02", status: "Resolved" },
    { id: "DIS-2026-02", student: "Abhishek Kumar (22CE110)", dept: "Civil", incident: "Library Rule Violation", action: "Mandatory Counselling", date: "2026-08-04", status: "Closed" },
    { id: "DIS-2026-03", student: "Vikram Malhotra (23CS204)", dept: "CSE", incident: "Hostel Curfew Deficit", action: "Parent Intimation & Suspension Warning", date: "2026-08-05", status: "Open" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">DISCIPLINARY CELL</Badge>
            <span className="text-xs text-muted-foreground">• Student Conduct & Ethics Committee</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Discipline & Student Conduct</h1>
          <p className="text-sm text-muted-foreground">Monitor open cases, warning letters, suspensions, counselling referrals, and behaviour analytics.</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
          <Plus className="size-3.5" /> Log Disciplinary Incident
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Open Cases" value="1 Case" icon={ShieldAlert} tone="warning" />
        <KpiCard label="Closed Cases" value="18 Cases" icon={CheckCircle} tone="success" />
        <KpiCard label="Warning Letters" value="12 Issued" icon={FileText} tone="info" />
        <KpiCard label="Suspensions" value="2 Cases" icon={UserX} tone="purple" />
        <KpiCard label="Resolved Rate" value="90.0%" icon={CheckCircle} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Department-wise Disciplinary Cases" description="Incident frequency across departments.">
          <GroupedBarChart
            data={[
              { dept: "CSE", cases: 4 },
              { dept: "ECE", cases: 2 },
              { dept: "EEE", cases: 1 },
              { dept: "Mechanical", cases: 5 },
              { dept: "Civil", cases: 3 },
            ] as unknown as Record<string, unknown>[]}
            xKey="dept"
            series={[{ key: "cases", label: "Discipline Incidents" }]}
            height={200}
          />
        </Panel>

        <Panel title="Student Behaviour Analytics" description="Categorization of logged campus infractions.">
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl border border-border bg-card flex justify-between items-center text-xs font-bold">
              <span>Attendance & Bunking Shortage Deficit</span>
              <Badge variant="outline" className="font-mono">55% Share</Badge>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card flex justify-between items-center text-xs font-bold">
              <span>Hostel Curfew & Mess Rules Infraction</span>
              <Badge variant="outline" className="font-mono">30% Share</Badge>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card flex justify-between items-center text-xs font-bold">
              <span>Library & Campus Asset Property Damage</span>
              <Badge variant="outline" className="font-mono">15% Share</Badge>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Disciplinary Case Timeline Ledger" description="Filter by status or search by student name.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search student name or case ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Case Ref ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Infraction Incident</th>
                  <th className="p-3">Action Taken</th>
                  <th className="p-3 font-mono">Date</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {cases.filter((c) => c.student.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())).map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{c.id}</td>
                    <td className="p-3 font-bold text-foreground">{c.student}</td>
                    <td className="p-3 font-mono font-bold">{c.dept}</td>
                    <td className="p-3 font-bold">{c.incident}</td>
                    <td className="p-3 font-mono text-muted-foreground">{c.action}</td>
                    <td className="p-3 font-mono">{c.date}</td>
                    <td className="p-3 text-center">
                      <Badge className={c.status === "Closed" || c.status === "Resolved" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>{c.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`);

// 2. COUNSELLING PAGE (staff.student-dean.counselling.tsx)
saveRoute("staff.student-dean.counselling.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, HeartHandshake, Calendar, CheckCircle2, Clock, Plus, User } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/counselling")({
  head: () => ({ meta: [{ title: "Student Counselling & Wellness — Student Dean" }] }),
  component: CounsellingPage,
});

function CounsellingPage() {
  const [search, setSearch] = useState("");

  const sessions = [
    { id: "CNS-901", student: "Sneha Rao (22CS107)", counsellor: "Dr. Sunita Sharma", issue: "Academic Stress & Exam Anxiety", date: "2026-08-10", status: "Upcoming", followUp: "18 Aug 2026" },
    { id: "CNS-902", student: "Nikhil Reddy (22EC106)", counsellor: "Dr. Ravi Kumar", issue: "Peer Mentoring & Time Management", date: "2026-08-03", status: "Completed", followUp: "Completed" },
    { id: "CNS-903", student: "Rahul Sharma (22CS102)", counsellor: "Dr. Sunita Sharma", issue: "Career Orientation & Higher Studies", date: "2026-08-04", status: "Completed", followUp: "Not Required" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">MENTAL WELLNESS</Badge>
            <span className="text-xs text-muted-foreground">• Student Counselling Cell</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Student Counselling</h1>
          <p className="text-sm text-muted-foreground">Manage upcoming sessions, completed consultations, assigned counsellors, and follow-up schedules.</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
          <Plus className="size-3.5" /> Book Counselling Session
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Upcoming Sessions" value="4 Sessions" icon={Calendar} tone="info" />
        <KpiCard label="Completed Sessions" value="42 Sessions" icon={CheckCircle2} tone="success" />
        <KpiCard label="Assigned Counsellors" value="6 Officers" icon={User} tone="purple" />
        <KpiCard label="Follow-up Rate" value="94.2%" icon={HeartHandshake} tone="warning" />
      </div>

      <Panel title="Counselling Session History & Follow-up Schedule" description="Search by student name or counsellor.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search student name or issue category..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Session Ref</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Assigned Counsellor</th>
                  <th className="p-3">Issue Category</th>
                  <th className="p-3 font-mono">Session Date</th>
                  <th className="p-3 font-mono">Follow-up Schedule</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {sessions.filter((s) => s.student.toLowerCase().includes(search.toLowerCase()) || s.issue.toLowerCase().includes(search.toLowerCase())).map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{s.id}</td>
                    <td className="p-3 font-bold text-foreground">{s.student}</td>
                    <td className="p-3 font-mono font-bold">{s.counsellor}</td>
                    <td className="p-3 font-bold">{s.issue}</td>
                    <td className="p-3 font-mono">{s.date}</td>
                    <td className="p-3 font-mono text-muted-foreground">{s.followUp}</td>
                    <td className="p-3 text-center">
                      <Badge className={s.status === "Completed" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>{s.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`);

// 3. CLUBS & EVENTS PAGE (staff.student-dean.clubs-events.tsx)
saveRoute("staff.student-dean.clubs-events.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Calendar, Users, Award, Plus } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/clubs-events")({
  head: () => ({ meta: [{ title: "Clubs & Campus Events — Student Dean" }] }),
  component: ClubsEventsPage,
});

function ClubsEventsPage() {
  const [search, setSearch] = useState("");

  const clubs = [
    { name: "Coding & Hackathon Society", category: "Technical", faculty: "Dr. S. K. Gupta", student: "Rahul Sharma", members: 340, nextEvent: "24Hr Codefest (12 Aug)" },
    { name: "Robotics & Embedded Guild", category: "Technical", faculty: "Dr. Meera Rao", student: "K. Sai Teja", members: 210, nextEvent: "Bot Race (15 Aug)" },
    { name: "Literary & Public Speaking Club", category: "Cultural", faculty: "Dr. Sunita Sharma", student: "Priya Reddy", members: 185, nextEvent: "Debate Fest (20 Aug)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">STUDENT LIFE</Badge>
            <span className="text-xs text-muted-foreground">• Recognized Clubs & Societies</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Clubs & Events Management</h1>
          <p className="text-sm text-muted-foreground">Active technical and cultural societies, faculty coordinators, student leads, and participation statistics.</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
          <Plus className="size-3.5" /> Register New Club
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active Clubs" value="42 Societies" icon={Users} tone="info" />
        <KpiCard label="Upcoming Events" value="8 Events" icon={Calendar} tone="success" />
        <KpiCard label="Total Student Members" value="2,480 Students" icon={Users} tone="purple" />
        <KpiCard label="Faculty Coordinators" value="28 Faculty" icon={Award} tone="warning" />
      </div>

      <Panel title="Recognized Student Clubs Directory" description="Search by club name or coordinator.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search club name or lead..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Club / Society Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Faculty Coordinator</th>
                  <th className="p-3">Student Lead</th>
                  <th className="p-3 text-center">Active Members</th>
                  <th className="p-3 font-mono">Next Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {clubs.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.student.toLowerCase().includes(search.toLowerCase())).map((c) => (
                  <tr key={c.name} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-bold text-foreground">{c.name}</td>
                    <td className="p-3"><Badge variant="outline" className="font-mono text-[0.65rem]">{c.category}</Badge></td>
                    <td className="p-3 font-mono font-bold">{c.faculty}</td>
                    <td className="p-3 font-bold text-primary">{c.student}</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-600">{c.members}</td>
                    <td className="p-3 font-mono text-muted-foreground">{c.nextEvent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`);

// 4. STUDENT ACTIVITIES PAGE (staff.student-dean.student-activities.tsx)
saveRoute("staff.student-dean.student-activities.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Trophy, Users, Award, Calendar, Plus } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/student-activities")({
  head: () => ({ meta: [{ title: "Extracurricular Activities — Student Dean" }] }),
  component: StudentActivitiesPage,
});

function StudentActivitiesPage() {
  const activities = [
    { name: "Inter-College Cricket Championship 2026", category: "Sports", date: "2026-08-01", count: 140, achievement: "Winners Trophy & Gold Medal" },
    { name: "National 24-Hour Codefest Hackathon", category: "Hackathon", date: "2026-07-28", count: 220, achievement: "1st Prize ₹50,000 Cash Award" },
    { name: "NSS Blood Donation & Health Camp", category: "NSS", date: "2026-07-20", count: 310, achievement: "Community Service Certificate" },
    { name: "NCC Annual Training Camp & Parade", category: "NCC", date: "2026-07-15", count: 85, achievement: "Best Contingent Award" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">EXTRACURRICULAR</Badge>
            <span className="text-xs text-muted-foreground">• Sports, NSS, NCC & Hackathons</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Student Activities & Achievements</h1>
          <p className="text-sm text-muted-foreground">Track sports tournaments, NSS blood drives, NCC camps, hackathons, and national trophies.</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
          <Plus className="size-3.5" /> Log Activity
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Sports Tournaments" value="12 Events" icon={Trophy} tone="info" />
        <KpiCard label="NSS Volunteers" value="450 Students" icon={Users} tone="success" />
        <KpiCard label="NCC Cadets" value="120 Cadets" icon={Award} tone="purple" />
        <KpiCard label="Trophies Won" value="18 Awards" icon={Trophy} tone="warning" />
      </div>

      <Panel title="Institutional Student Activity & Achievements Register" description="Sports, NSS, NCC, Cultural & Technical achievements.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Activity Title</th>
                <th className="p-3">Category</th>
                <th className="p-3 font-mono">Date</th>
                <th className="p-3 text-center">Participants</th>
                <th className="p-3">Award / Achievement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {activities.map((a, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-bold text-foreground">{a.name}</td>
                  <td className="p-3"><Badge variant="outline" className="font-mono text-[0.65rem]">{a.category}</Badge></td>
                  <td className="p-3 font-mono">{a.date}</td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-600">{a.count}</td>
                  <td className="p-3 font-bold text-primary">{a.achievement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
`);

// 5. MENTORING PAGE (staff.student-dean.mentoring.tsx)
saveRoute("staff.student-dean.mentoring.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, HeartHandshake, Users, CheckCircle2, MessageSquare } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/staff/student-dean/mentoring")({
  head: () => ({ meta: [{ title: "Faculty Mentoring — Student Dean" }] }),
  component: MentoringPage,
});

function MentoringPage() {
  const [search, setSearch] = useState("");

  const mentors = [
    { name: "Dr. S. K. Gupta", dept: "CSE", mentees: 20, meetingFreq: "Bi-Weekly", status: "Active", feedbackScore: "4.9 / 5.0" },
    { name: "Dr. Meera Rao", dept: "ECE", mentees: 18, meetingFreq: "Monthly", status: "Active", feedbackScore: "4.8 / 5.0" },
    { name: "Dr. Sunita Sharma", dept: "AI & DS", mentees: 15, meetingFreq: "Bi-Weekly", status: "Active", feedbackScore: "4.95 / 5.0" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">ACADEMIC SUPPORT</Badge>
            <span className="text-xs text-muted-foreground">• Faculty Mentoring System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Faculty-Student Mentoring</h1>
          <p className="text-sm text-muted-foreground">Monitor mentor assignments, assigned student groups, meeting logs, and mentor feedback scores.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active Mentors" value="180 Faculty" icon={HeartHandshake} tone="info" />
        <KpiCard label="Assigned Mentees" value="3,600 Students" icon={Users} tone="success" />
        <KpiCard label="Meetings Logged" value="1,240 Meetings" icon={MessageSquare} tone="purple" />
        <KpiCard label="Mentor Satisfaction" value="4.85 / 5.0" icon={CheckCircle2} tone="warning" />
      </div>

      <Panel title="Faculty Mentors Allotment Ledger" description="Search by mentor faculty name or department.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search mentor name or department..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Mentor Faculty Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-center">Assigned Mentees</th>
                  <th className="p-3 font-mono">Meeting Frequency</th>
                  <th className="p-3 font-mono">Feedback Score</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {mentors.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.dept.toLowerCase().includes(search.toLowerCase())).map((m) => (
                  <tr key={m.name} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-bold text-foreground">{m.name}</td>
                    <td className="p-3 font-mono font-bold text-primary">{m.dept}</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-600">{m.mentees} Students</td>
                    <td className="p-3 font-mono">{m.meetingFreq}</td>
                    <td className="p-3 font-mono font-bold">{m.feedbackScore}</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{m.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`);

// 6. STUDENT REQUESTS PAGE (staff.student-dean.student-requests.tsx)
saveRoute("staff.student-dean.student-requests.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, FileCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/student-requests")({
  head: () => ({ meta: [{ title: "Student Requests & Approvals — Student Dean" }] }),
  component: StudentRequestsPage,
});

function StudentRequestsPage() {
  const [search, setSearch] = useState("");

  const requests = [
    { id: "REQ-501", student: "Rahul Sharma (22CS102)", type: "Bonafide Certificate", date: "2026-08-02", status: "Approved" },
    { id: "REQ-502", student: "Priya Reddy (22EC103)", type: "ID Card Reissue", date: "2026-08-03", status: "In Process" },
    { id: "REQ-503", student: "K. Sai Teja (22CS101)", type: "Fee Receipt Duplicate", date: "2026-08-04", status: "Approved" },
    { id: "REQ-504", student: "Anjali Verma (23CE105)", type: "Migration Certificate", date: "2026-08-05", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">CERTIFICATE & DESK SERVICES</Badge>
            <span className="text-xs text-muted-foreground">• Student Requests Clearance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Student Requests Management</h1>
          <p className="text-sm text-muted-foreground">Clear Bonafide, Transfer Certificate (TC), Migration, Fee Receipt, Hall Ticket, and ID Card reissue requests.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Requests" value="184 Requests" icon={FileCheck} tone="info" />
        <KpiCard label="Approved Requests" value="162 Approved" icon={CheckCircle2} tone="success" />
        <KpiCard label="Pending Desk Clearance" value="18 Pending" icon={Clock} tone="warning" />
        <KpiCard label="Rejected Requests" value="4 Rejected" icon={XCircle} tone="purple" />
      </div>

      <Panel title="Student Applications & Clearances Ledger" description="Search by request type or student name.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search request type or student name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Request Ref ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Certificate / Service Type</th>
                  <th className="p-3 font-mono">Applied Date</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {requests.filter((r) => r.student.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase())).map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{r.id}</td>
                    <td className="p-3 font-bold text-foreground">{r.student}</td>
                    <td className="p-3 font-bold">{r.type}</td>
                    <td className="p-3 font-mono text-muted-foreground">{r.date}</td>
                    <td className="p-3 text-center">
                      <Badge className={r.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>{r.status}</Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Button size="sm" variant="outline" className="h-6 text-[0.65rem] font-bold cursor-pointer">
                        Approve Request
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`);

// 7. CERTIFICATES PAGE (staff.student-dean.certificates.tsx)
saveRoute("staff.student-dean.certificates.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Award, CheckCircle2, Clock, Download } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/certificates")({
  head: () => ({ meta: [{ title: "Issued Certificates — Student Dean" }] }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const [search, setSearch] = useState("");

  const certs = [
    { id: "CRT-2026-901", student: "K. Sai Teja (22CS101)", certName: "Conduct & Character Certificate", issueDate: "2026-08-01", verification: "Verified" },
    { id: "CRT-2026-902", student: "Rahul Sharma (22CS102)", certName: "Institutional Merit Attestation", issueDate: "2026-08-02", verification: "Verified" },
    { id: "CRT-2026-903", student: "Priya Reddy (22EC103)", certName: "Extracurricular Distinction Certificate", issueDate: "2026-08-03", verification: "Verified" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">CERTIFICATE REGISTRY</Badge>
            <span className="text-xs text-muted-foreground">• Attestations & Verification</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Issued Certificates</h1>
          <p className="text-sm text-muted-foreground">Digital verification ledger for Conduct, Merit, and Character certificates.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Issued Certificates" value="640 Issued" icon={Award} tone="info" />
        <KpiCard label="Pending Verification" value="12 Requests" icon={Clock} tone="warning" />
        <KpiCard label="Digital Signatures" value="100% Valid" icon={CheckCircle2} tone="success" />
        <KpiCard label="Verification SLA" value="24 Hours" icon={Award} tone="purple" />
      </div>

      <Panel title="Issued Certificates Register" description="Search by student name or certificate type.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search certificate name or student..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Certificate ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Certificate Title</th>
                  <th className="p-3 font-mono">Issuance Date</th>
                  <th className="p-3 text-center">Verification</th>
                  <th className="p-3 text-center">Download PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {certs.filter((c) => c.student.toLowerCase().includes(search.toLowerCase()) || c.certName.toLowerCase().includes(search.toLowerCase())).map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{c.id}</td>
                    <td className="p-3 font-bold text-foreground">{c.student}</td>
                    <td className="p-3 font-bold">{c.certName}</td>
                    <td className="p-3 font-mono text-muted-foreground">{c.issueDate}</td>
                    <td className="p-3 text-center"><Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{c.verification}</Badge></td>
                    <td className="p-3 text-center">
                      <Button size="sm" variant="outline" className="h-6 text-[0.65rem] gap-1 cursor-pointer">
                        <Download className="size-3" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`);

// 8. ATTENDANCE HISTORY PAGE (staff.student-dean.attendance-history.tsx)
saveRoute("staff.student-dean.attendance-history.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, History, CalendarCheck, Users, Download } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/attendance-history")({
  head: () => ({ meta: [{ title: "Attendance History Log — Student Dean" }] }),
  component: AttendanceHistoryPage,
});

function AttendanceHistoryPage() {
  const [search, setSearch] = useState("");

  const historyLogs = [
    { date: "2026-08-04", dept: "CSE", section: "Sec A", faculty: "Prof. Student Dean", pct: 95.8, present: 46, absent: 2, late: 1 },
    { date: "2026-08-03", dept: "CSE", section: "Sec B", faculty: "Dr. S. K. Gupta", pct: 93.4, present: 44, absent: 3, late: 2 },
    { date: "2026-08-02", dept: "ECE", section: "Sec A", faculty: "Dr. Meera Rao", pct: 91.2, present: 42, absent: 4, late: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">HISTORICAL AUDIT</Badge>
            <span className="text-xs text-muted-foreground">• Daily Roll Call Logs</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance History Register</h1>
          <p className="text-sm text-muted-foreground">Historical daily and monthly roll call records, faculty-wise attendance %, and late entry logs.</p>
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
          <Download className="size-3.5" /> Export Log CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Average History %" value="93.5%" icon={CalendarCheck} tone="info" />
        <KpiCard label="Total Classes Logged" value="1,420 Classes" icon={History} tone="success" />
        <KpiCard label="Avg Present / Class" value="44 Students" icon={Users} tone="purple" />
        <KpiCard label="Late Entries Logged" value="14 Students" icon={History} tone="warning" />
      </div>

      <Panel title="Historical Attendance Sessions Ledger" description="Search by department or faculty name.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search department or faculty..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 font-mono">Date</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Faculty Incharge</th>
                  <th className="p-3 text-center">Attendance %</th>
                  <th className="p-3 text-center">Present</th>
                  <th className="p-3 text-center">Absent</th>
                  <th className="p-3 text-center">Late Entries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {historyLogs.filter((h) => h.dept.toLowerCase().includes(search.toLowerCase()) || h.faculty.toLowerCase().includes(search.toLowerCase())).map((h, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{h.date}</td>
                    <td className="p-3 font-bold text-foreground">{h.dept}</td>
                    <td className="p-3 font-mono">{h.section}</td>
                    <td className="p-3 font-bold">{h.faculty}</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-600">{h.pct}%</td>
                    <td className="p-3 text-center font-mono font-bold">{h.present}</td>
                    <td className="p-3 text-center font-mono text-rose-600">{h.absent}</td>
                    <td className="p-3 text-center font-mono text-amber-600">{h.late}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`);

// 9. STUDENT REPORTS PAGE (staff.student-dean.reports.tsx)
saveRoute("staff.student-dean.reports.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/reports")({
  head: () => ({ meta: [{ title: "Student Reports & Analytics — Student Dean" }] }),
  component: StudentReportsPage,
});

function StudentReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">REPORTS & ANALYTICS</Badge>
            <span className="text-xs text-muted-foreground">• Executive Student Affairs Dossiers</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Student Reports Dashboard</h1>
          <p className="text-sm text-muted-foreground">Export PDF and Excel reports for department strength, year-wise analytics, and student performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <FileText className="size-3.5" /> Export All PDF
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <FileSpreadsheet className="size-3.5" /> Export All Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Analytics Dossiers" value="18 Dossiers" icon={BarChart3} tone="info" />
        <KpiCard label="Department Audits" value="100% Verified" icon={FileText} tone="success" />
        <KpiCard label="Performance Score" value="94.2%" icon={BarChart3} tone="purple" />
        <KpiCard label="Export Format" value="PDF & XLSX" icon={FileSpreadsheet} tone="warning" />
      </div>

      <Panel title="Available Student Reports Catalog" description="Click button to generate or download report file.">
        <div className="space-y-3">
          {[
            { title: "Annual Department Student Strength Audit Report", metric: "5,420 Enrolled Students", date: "2026-08-01" },
            { title: "Year-wise Demographics & Admission Quota Report", metric: "Convenor, Merit & Management", date: "2026-08-02" },
            { title: "Student Academic CGPA Performance Dossier", metric: "Avg CGPA 8.12", date: "2026-08-03" },
          ].map((r, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div>
                <h4 className="font-bold text-foreground text-sm">{r.title}</h4>
                <p className="text-muted-foreground font-mono">{r.metric} • Generated: {r.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 text-[0.65rem] gap-1 cursor-pointer">
                  <Download className="size-3" /> PDF
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[0.65rem] gap-1 cursor-pointer">
                  <Download className="size-3" /> Excel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
`);

// 10. ATTENDANCE REPORTS PAGE (staff.student-dean.attendance-reports.tsx)
saveRoute("staff.student-dean.attendance-reports.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, Download, CalendarCheck, AlertTriangle } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/attendance-reports")({
  head: () => ({ meta: [{ title: "Attendance Reports — Student Dean" }] }),
  component: AttendanceReportsPage,
});

function AttendanceReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">ATTENDANCE DOSSIERS</Badge>
            <span className="text-xs text-muted-foreground">• Shortage & Condonation Reports</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Reports Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overall attendance, department comparison, semester shortage dossiers, and low attendance lists.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Overall Attendance" value="92.4%" icon={CalendarCheck} tone="info" />
        <KpiCard label="Shortage Reports" value="142 Dossiers" icon={AlertTriangle} tone="warning" />
        <KpiCard label="Semester Comparison" value="Completed" icon={FileSpreadsheet} tone="purple" />
        <KpiCard label="Condonation List" value="38 Approved" icon={CalendarCheck} tone="success" />
      </div>

      <Panel title="Attendance Audit Reports Catalogue" description="Download monthly attendance and shortage dossiers.">
        <div className="space-y-3">
          {[
            { title: "Monthly Department Attendance Comparison Report", metric: "CSE 94.2% | ECE 92.8%", date: "2026-08-01" },
            { title: "Low Attendance (Below 75%) Shortage Dossier", metric: "142 Students Listed", date: "2026-08-03" },
          ].map((r, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-foreground text-sm">{r.title}</h4>
                <p className="text-muted-foreground font-mono">{r.metric} • Date: {r.date}</p>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-[0.65rem] gap-1 cursor-pointer">
                <Download className="size-3" /> Download Report
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
`);

// 11. SCHOLARSHIP REPORTS PAGE (staff.student-dean.scholarship-reports.tsx)
saveRoute("staff.student-dean.scholarship-reports.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, DollarSign, CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/scholarship-reports")({
  head: () => ({ meta: [{ title: "Scholarship Reports — Student Dean" }] }),
  component: ScholarshipReportsPage,
});

function ScholarshipReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">SCHOLARSHIP AUDIT</Badge>
            <span className="text-xs text-muted-foreground">• Welfare Disbursement Analytics</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Scholarship Reports Dashboard</h1>
          <p className="text-sm text-muted-foreground">Department-wise and category-wise government and private scholarship disbursement ledgers.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Disbursed Funds" value="₹1.85 Cr" icon={DollarSign} tone="success" />
        <KpiCard label="Approved Beneficiaries" value="1,420 Students" icon={CheckCircle2} tone="info" />
        <KpiCard label="State Govt Reimbursement" value="₹1.45 Cr" icon={Award} tone="purple" />
        <KpiCard label="Merit Scholarships" value="₹40.0 Lakhs" icon={Award} tone="warning" />
      </div>

      <Panel title="Scholarship Disbursement Audit Catalog" description="Category-wise and government reimbursement dossiers.">
        <div className="space-y-3">
          {[
            { title: "State Government Fee Reimbursement Audit Report", metric: "₹1.45 Cr Disbursed to BC/SC/ST", date: "2026-08-01" },
            { title: "Institutional Merit & EWS Scholarship Ledger", metric: "₹40 Lakhs Awarded", date: "2026-08-04" },
          ].map((r, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-foreground text-sm">{r.title}</h4>
                <p className="text-muted-foreground font-mono">{r.metric} • Date: {r.date}</p>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-[0.65rem] gap-1 cursor-pointer">
                <Download className="size-3" /> Download Audit
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
`);

// 12. NOTIFICATIONS PAGE (staff.student-dean.notifications.tsx)
saveRoute("staff.student-dean.notifications.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Send, Inbox, ShieldCheck, Plus, CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/staff/student-dean/notifications")({
  head: () => ({ meta: [{ title: "Notifications System — Student Dean" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [showCompose, setShowCompose] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const receivedMsgs = [
    { id: "MSG-R1", subject: "Autumn Semester Hall Tickets Dispatch Complete", sender: "Controller of Examinations", date: "2026-08-04", priority: "High", status: "Unread" },
    { id: "MSG-R2", subject: "Monthly Student Welfare Committee Meeting on Friday", sender: "Principal Office", date: "2026-08-03", priority: "Medium", status: "Read" },
  ];

  const sentMsgs = [
    { id: "MSG-S1", subject: "Attendance Deficit Shortage Warning Letters Issued", receiver: "All Department HODs", date: "2026-08-04", priority: "High", status: "Delivered" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">COMMUNICATION</Badge>
            <span className="text-xs text-muted-foreground">• Institutional Notifications System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">Manage incoming alerts and broadcast notices to students and department heads.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={tab === "received" ? "default" : "outline"} size="sm" onClick={() => setTab("received")} className="h-8 text-xs font-bold gap-1 cursor-pointer">
            <Inbox className="size-3.5" /> Tab 1: Received ({receivedMsgs.length})
          </Button>
          <Button variant={tab === "sent" ? "default" : "outline"} size="sm" onClick={() => setTab("sent")} className="h-8 text-xs font-bold gap-1 cursor-pointer">
            <Send className="size-3.5" /> Tab 2: Sent ({sentMsgs.length})
          </Button>
          <Button size="sm" onClick={() => setShowCompose(!showCompose)} className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Compose Notification
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Received Alerts" value={receivedMsgs.length.toString()} icon={Inbox} tone="info" />
        <KpiCard label="Sent Broadcasts" value={sentMsgs.length.toString()} icon={Send} tone="purple" />
        <KpiCard label="Unread Alerts" value="1 Alert" icon={Bell} tone="warning" />
        <KpiCard label="Delivery Status" value="100% Delivered" icon={ShieldCheck} tone="success" />
      </div>

      {showCompose && (
        <Panel title="Compose Broadcast Notification" description="Send instant notice to students or faculty.">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Recipient Group</label>
                <Input defaultValue="All Enrolled Students (5,420)" className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Subject Line</label>
                <Input placeholder="Enter notice subject..." className="h-9 text-xs" />
              </div>
            </div>
            <Button size="sm" onClick={() => { setSentSuccess(true); setShowCompose(false); }} className="h-8 text-xs font-bold bg-emerald-600 text-white cursor-pointer">
              Send Broadcast Notice
            </Button>
          </div>
        </Panel>
      )}

      {sentSuccess && (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 flex items-center justify-between text-xs font-bold">
          <span>Broadcast notification dispatched successfully to all recipients.</span>
          <Badge className="bg-emerald-600 text-white">Sent</Badge>
        </div>
      )}

      <Panel title={tab === "received" ? "Received Alerts Inbox" : "Sent Broadcast History"} description="Subject, sender/receiver, date, priority, and read status.">
        <div className="space-y-3">
          {(tab === "received" ? receivedMsgs : sentMsgs).map((m) => (
            <div key={m.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[0.65rem]">{m.id}</Badge>
                  <Badge className={m.priority === "High" ? "bg-rose-500/10 text-rose-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                    {m.priority} Priority
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{m.date}</span>
              </div>
              <h4 className="font-bold text-xs text-foreground flex items-center gap-2">
                <Bell className="size-3.5 text-primary" /> {m.subject}
              </h4>
              <p className="text-xs text-muted-foreground font-mono">
                {tab === "received" ? \`Sender: \${m.sender} | Status: \${(m as any).status}\` : \`Receiver: \${(m as any).receiver} | Status: Delivered\`}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
`);

// 13. SETTINGS PAGE (staff.student-dean.settings.tsx)
saveRoute("staff.student-dean.settings.tsx", `import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Lock, Shield, Bell, Globe, Save } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/settings")({
  head: () => ({ meta: [{ title: "Student Dean Portal Settings — EduSuite Pro" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">SYSTEM SETTINGS</Badge>
            <span className="text-xs text-muted-foreground">• Student Dean Configuration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Portal Settings</h1>
          <p className="text-sm text-muted-foreground">Manage profile, security password, notification preferences, language, theme, and read-only role permissions.</p>
        </div>
        <Button onClick={() => setSaved(true)} className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
          <Save className="size-3.5" /> {saved ? "Settings Saved ✓" : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="space-y-1">
          {[
            { id: "profile", label: "Profile Settings", icon: User },
            { id: "security", label: "Password & Security", icon: Lock },
            { id: "notif", label: "Notification Preferences", icon: Bell },
            { id: "theme", label: "Language & Theme", icon: Globe },
            { id: "rbac", label: "Role Permissions (Read Only)", icon: Shield },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={\`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer \${
                activeSection === s.id ? "bg-primary text-primary-foreground font-bold" : "hover:bg-accent text-muted-foreground"
              }\`}
            >
              <s.icon className="size-4" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeSection === "profile" && (
            <Panel title="Profile Settings" description="Update personal and designation details.">
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="font-bold text-muted-foreground">Full Name</label>
                  <Input defaultValue="Prof. Student Dean" className="h-9 text-xs mt-1" />
                </div>
                <div>
                  <label className="font-bold text-muted-foreground">Institutional Email</label>
                  <Input defaultValue="student_dean@edusuite.edu.in" className="h-9 text-xs mt-1" />
                </div>
              </div>
            </Panel>
          )}

          {activeSection === "security" && (
            <Panel title="Password & Security" description="Update account password.">
              <div className="space-y-3 max-w-md text-xs">
                <div>
                  <label className="font-bold text-muted-foreground">Current Password</label>
                  <Input type="password" defaultValue="********" className="h-9 text-xs mt-1" />
                </div>
                <div>
                  <label className="font-bold text-muted-foreground">New Password</label>
                  <Input type="password" placeholder="Enter new password" className="h-9 text-xs mt-1" />
                </div>
              </div>
            </Panel>
          )}

          {activeSection === "rbac" && (
            <Panel title="Role Permissions (Read Only)" description="Assigned RBAC privileges.">
              <div className="space-y-2 text-xs font-bold">
                <div className="p-3 border border-border rounded-xl bg-card flex justify-between">
                  <span>Student Welfare & Grievance Redressal</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600">Full Access</Badge>
                </div>
                <div className="p-3 border border-border rounded-xl bg-card flex justify-between">
                  <span>Scholarships & Freeships Approval</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600">Approval Authority</Badge>
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
`);

console.log("All 13 dedicated Student Dean pages generated.");
