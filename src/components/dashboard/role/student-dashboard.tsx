import {
  Award,
  CalendarCheck,
  IndianRupee,
  ListChecks,
  BookOpen,
  Calendar,
  CreditCard,
  Sparkles,
  Search,
  MessageSquare,
  Send,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ChartLegend, DonutChart, TrendLineChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  AiInsightsWidget,
  ScheduleWidget,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { attendanceSplit, semesterProgress } from "@/data/mock";

export function StudentDashboard() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hi! I am your EduSuite AI Assistant. Ask me anything about your academic progress, classes, or attendance.",
    },
  ]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    // Simulate AI response based on questions
    setTimeout(() => {
      let aiResponse =
        "I'm analyzing your request. You currently have a CGPA of 8.45 and 88% overall attendance. Let me know how I can help!";

      const q = userMsg.toLowerCase();
      if (q.includes("attendance")) {
        aiResponse =
          "Your overall attendance is 88%. You are well above the 75% limit. However, your attendance in 'Digital Logic Design' is 74%, which is slightly below the cutoff. Try attending the next two lectures to clear the warning.";
      } else if (q.includes("exam") || q.includes("timetable")) {
        aiResponse =
          "Your next exam is 'Theory of Computation' on August 8, 2026. It is scheduled in Block-B, Room 302, starting at 10:00 AM.";
      } else if (q.includes("fee") || q.includes("due")) {
        aiResponse =
          "Great news! You have no outstanding fees for the current semester. Your next invoice will be generated on November 1st.";
      } else if (q.includes("cgpa") || q.includes("grade") || q.includes("gpa")) {
        aiResponse =
          "Your current CGPA is 8.45. To reach an 8.6 by the end of this semester, you'll need to secure at least an 'A' grade in your core subjects: Distributed Systems and Cryptography.";
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Student Hub</h2>
          <p className="text-sm text-muted-foreground">
            Welcome back, Aditya Verma. Track your academic standing.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary w-fit">STUDENT — B.TECH CSE (Y4)</Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto bg-background/50 border border-border p-1 gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="exams">Exams & Marks</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="ai-assistant">
            <Sparkles className="size-3.5 mr-1 text-primary animate-pulse" /> AI Assistant
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Attendance"
              value="88%"
              icon={CalendarCheck}
              delta="2%"
              tone="success"
            />
            <KpiCard label="CGPA" value="8.45" icon={Award} delta="0.08" />
            <KpiCard label="Backlogs" value="0" icon={ListChecks} tone="info" />
            <KpiCard label="Fee Due" value="Rs 0" icon={IndianRupee} tone="success" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ScheduleWidget title="Today's Timetable" />
            <UpcomingWidget />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="Subject Wise Attendance" description="Current semester">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <DonutChart data={attendanceSplit} centerLabel="88%" />
                <ChartLegend items={attendanceSplit} />
              </div>
            </Panel>
            <Panel title="Academic Progress" description="SGPA vs CGPA" className="lg:col-span-2">
              <TrendLineChart
                data={semesterProgress}
                xKey="term"
                series={[
                  { key: "sgpa", label: "SGPA" },
                  { key: "cgpa", label: "CGPA" },
                ]}
              />
            </Panel>
          </div>

          <QuickActionsWidget
            actions={["Submit pending assignment", "Apply for Leave", "Search Library Catalog"]}
          />
        </TabsContent>

        {/* TAB 2: COURSES */}
        <TabsContent value="courses" className="space-y-6">
          <Panel title="Enrolled Subjects" description="Syllabus, faculty details and credits">
            <div className="space-y-4">
              {[
                {
                  code: "CS401",
                  title: "Distributed Systems",
                  faculty: "Dr. Ramesh Nair",
                  credits: 4,
                  progress: 85,
                },
                {
                  code: "CS402",
                  title: "Cryptography & Network Security",
                  faculty: "Prof. Sarah Paul",
                  credits: 4,
                  progress: 70,
                },
                {
                  code: "CS403",
                  title: "Theory of Computation",
                  faculty: "Dr. Ravi Shankar",
                  credits: 3,
                  progress: 95,
                },
                {
                  code: "CS404",
                  title: "Digital Logic Design",
                  faculty: "Mrs. Priya Sen",
                  credits: 3,
                  progress: 60,
                },
              ].map((sub, idx) => (
                <div
                  key={idx}
                  className="border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {sub.code}
                    </span>
                    <h4 className="text-sm font-semibold">{sub.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Faculty: {sub.faculty} | Credits: {sub.credits}
                    </p>
                  </div>
                  <div className="w-full sm:max-w-[200px] space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Syllabus Covered</span>
                      <span>{sub.progress}%</span>
                    </div>
                    <Progress value={sub.progress} className="h-1.5" />
                  </div>
                  <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                    <FileText className="size-3.5" /> Syllabus
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 3: ATTENDANCE */}
        <TabsContent value="attendance" className="space-y-6">
          <Panel
            title="Subject-wise Attendance Score"
            description="Requires min. 75% for exam eligibility"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Classes Conducted</TableHead>
                  <TableHead>Classes Attended</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    code: "CS401",
                    title: "Distributed Systems",
                    conducted: 40,
                    attended: 36,
                    pct: 90,
                  },
                  {
                    code: "CS402",
                    title: "Cryptography & Net Sec",
                    conducted: 38,
                    attended: 34,
                    pct: 89,
                  },
                  {
                    code: "CS403",
                    title: "Theory of Computation",
                    conducted: 35,
                    attended: 32,
                    pct: 91,
                  },
                  {
                    code: "CS404",
                    title: "Digital Logic Design",
                    conducted: 42,
                    attended: 31,
                    pct: 74,
                  },
                ].map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs font-bold">{item.code}</TableCell>
                    <TableCell className="font-medium text-xs">{item.title}</TableCell>
                    <TableCell className="text-xs">{item.conducted}</TableCell>
                    <TableCell className="text-xs">{item.attended}</TableCell>
                    <TableCell className="text-xs font-semibold">{item.pct}%</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.pct >= 75 ? "secondary" : "destructive"}
                        className="text-[0.65rem] px-2 py-0"
                      >
                        {item.pct >= 75 ? "Eligible" : "Risk: Low Attendance"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </TabsContent>

        {/* TAB 4: EXAMS & MARKS */}
        <TabsContent value="exams" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              title="Upcoming Examinations"
              description="End-Semester Schedule"
              className="lg:col-span-2"
            >
              <div className="space-y-4">
                {[
                  {
                    subject: "Theory of Computation",
                    date: "Aug 08, 2026",
                    time: "10:00 AM - 01:00 PM",
                    room: "Block B - Room 302",
                  },
                  {
                    subject: "Distributed Systems",
                    date: "Aug 10, 2026",
                    time: "10:00 AM - 01:00 PM",
                    room: "Block B - Room 302",
                  },
                  {
                    subject: "Cryptography",
                    date: "Aug 12, 2026",
                    time: "10:00 AM - 01:00 PM",
                    room: "Block B - Room 304",
                  },
                ].map((exam, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-xl p-3 flex justify-between items-center text-xs"
                  >
                    <div>
                      <h4 className="font-semibold">{exam.subject}</h4>
                      <p className="text-muted-foreground mt-0.5">
                        {exam.date} | {exam.time}
                      </p>
                    </div>
                    <Badge variant="outline">{exam.room}</Badge>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Internal Assessment Score" description="Out of 30 marks">
              <div className="space-y-4">
                {[
                  { title: "Distributed Systems", score: 27 },
                  { title: "Cryptography", score: 25 },
                  { title: "Theory of Computation", score: 28 },
                  { title: "Digital Logic Design", score: 22 },
                ].map((score, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{score.title}</span>
                      <span className="font-bold">{score.score}/30</span>
                    </div>
                    <Progress value={(score.score / 30) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </TabsContent>

        {/* TAB 5: FEES */}
        <TabsContent value="fees" className="space-y-6">
          <Panel title="Invoices & Transaction Ledger" description="Current balance details">
            <div className="rounded-xl border border-emerald-550/20 bg-emerald-550/5 p-4 mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  All fees are fully paid!
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your next outstanding statement will be issued on November 01, 2026.
                </p>
              </div>
              <Badge className="bg-emerald-500 hover:bg-emerald-600">Zero Balance Due</Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date Paid</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: "INV-90812",
                    desc: "Year 4 Tuition Semester 7",
                    date: "Jul 12, 2026",
                    amt: "Rs 1,20,000",
                    status: "Paid",
                  },
                  {
                    id: "INV-90145",
                    desc: "Hostel & Food Service - Term 1",
                    date: "Jul 12, 2026",
                    amt: "Rs 45,000",
                    status: "Paid",
                  },
                  {
                    id: "INV-89512",
                    desc: "Annual Laboratory & Tech fees",
                    date: "Jul 10, 2026",
                    amt: "Rs 12,500",
                    status: "Paid",
                  },
                ].map((inv, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                    <TableCell className="text-xs">{inv.desc}</TableCell>
                    <TableCell className="text-xs">{inv.date}</TableCell>
                    <TableCell className="text-xs">{inv.amt}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[0.65rem]">
                        {inv.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </TabsContent>

        {/* TAB 6: AI ASSISTANT */}
        <TabsContent value="ai-assistant" className="space-y-6">
          <Panel
            title="Personal AI Study Coach"
            description="Get customized feedback based on your academic calendar and standing."
          >
            <div className="flex flex-col h-[400px] border border-border rounded-xl bg-card overflow-hidden">
              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted text-foreground rounded-tl-none border border-border"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Toolbar */}
              <div className="border-t border-border p-3 bg-muted/20 flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about attendance criteria, grades target, or exam timings..."
                  className="rounded-xl h-10 flex-1 text-sm bg-background"
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                />
                <Button onClick={handleSendChat} size="icon" className="size-10 rounded-xl">
                  <Send className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-semibold my-auto">
                Suggestions:
              </span>
              {[
                "Calculate attendance status",
                "Next exam room details",
                "Fee status",
                "How to increase CGPA",
              ].map((sug) => (
                <button
                  key={sug}
                  onClick={() => {
                    setChatInput(sug);
                  }}
                  className="text-[0.7rem] bg-accent/50 hover:bg-accent border border-border px-2.5 py-1 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                  {sug}
                </button>
              ))}
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
