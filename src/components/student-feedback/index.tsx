import React, { useState } from "react";
import {
  mockFeedbackKPIs,
  mockFacultyList,
  mockCourseList,
  mockActiveSurveys,
  mockPreviousFeedbackHistory,
  initialGrievanceTickets,
} from "./mock-data";
import {
  MessageSquare,
  Star,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  BookOpen,
  ShieldAlert,
  Plus,
  Search,
  ChevronRight,
  Sparkles,
  FileText,
  Award,
  Users,
  ShieldCheck,
  AlertTriangle,
  History,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormDialog, FieldConfig } from "@/components/ui/form-dialog";
import { z } from "zod";
import { useRole } from "@/context/role-context";
import { toast } from "sonner";

// Zod Schema & Fields for Grievance Dialog (Preserved)
const grievanceSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isAnonymous: z.boolean().optional(),
});

const grievanceFields: FieldConfig[] = [
  {
    name: "category",
    label: "Grievance Category",
    type: "select",
    placeholder: "Select category",
    options: [
      { label: "Academic / Internal Evaluation", value: "Academic / Internal Evaluation" },
      { label: "Hostel & Facilities", value: "Hostel & Facilities" },
      { label: "Disciplinary / Anti-Ragging", value: "Disciplinary / Anti-Ragging" },
      { label: "Financial / Fee Discrepancy", value: "Financial / Fee Discrepancy" },
      { label: "General Campus Facilities", value: "General Campus Facilities" },
    ],
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    placeholder: "Brief title of your grievance",
  },
  {
    name: "description",
    label: "Detailed Description",
    type: "textarea",
    placeholder: "Provide complete details, timeline, evidence links and involved parties...",
  },
  {
    name: "isAnonymous",
    label: "Submit Anonymously",
    type: "checkbox",
    description: "Your identity (Roll No / Name) will be hidden from committee members.",
  },
];

export function StudentFeedbackModule() {
  const { hasFlag, role } = useRole();
  const [mainTab, setMainTab] = useState("dashboard");

  // Grievance State (Preserved)
  const [grievanceTickets, setGrievanceTickets] = useState(initialGrievanceTickets);
  const [grievanceSearch, setGrievanceSearch] = useState("");
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);
  const [grievanceSubTab, setGrievanceSubTab] = useState("tickets");

  // Faculty Feedback Form State
  const [selectedFaculty, setSelectedFaculty] = useState(mockFacultyList[0].id);
  const [facultyRatings, setFacultyRatings] = useState({
    teachingQuality: 5,
    communication: 5,
    knowledge: 5,
    interaction: 4,
    punctuality: 5,
  });
  const [facultyComments, setFacultyComments] = useState("");

  // Course Feedback Form State
  const [selectedCourse, setSelectedCourse] = useState(mockCourseList[0].code);
  const [courseRatings, setCourseRatings] = useState({
    courseContent: 5,
    lab: 4,
    assignments: 4,
    resources: 5,
    difficulty: 3,
    overallExperience: 5,
  });
  const [courseSuggestions, setCourseSuggestions] = useState("");

  const isCommitteeMember =
    role === "super-admin" ||
    hasFlag("isDisciplinaryCommittee") ||
    hasFlag("isHod");

  // Handlers
  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fac = mockFacultyList.find((f) => f.id === selectedFaculty);
    toast.success(`Feedback for ${fac?.name || "Faculty"} submitted successfully! Thank you.`);
    setFacultyComments("");
    setMainTab("dashboard");
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const crs = mockCourseList.find((c) => c.code === selectedCourse);
    toast.success(`Course feedback for ${crs?.title || "Course"} submitted successfully!`);
    setCourseSuggestions("");
    setMainTab("dashboard");
  };

  const handleAddGrievance = (values: any) => {
    const newId = `GRV-2026-0${Math.floor(84 + Math.random() * 100)}`;
    const newTicket = {
      id: newId,
      category: values.category,
      subject: values.subject,
      raisedBy: values.isAnonymous ? "Student (Anonymous)" : "Student (Roll 22CS101)",
      date: new Date().toISOString().split("T")[0] ?? "2026-08-01",
      committee: values.category.includes("Academic")
        ? "Academic Appeals Committee"
        : values.category.includes("Hostel")
        ? "Hostel Oversight Committee"
        : "Disciplinary Committee",
      status: "Under Review",
      sla: "48 Hours",
    };

    setGrievanceTickets((prev) => [newTicket, ...prev]);
    toast.success(`Grievance ticket ${newId} submitted successfully!`);
  };

  const handleResolveGrievance = (id: string) => {
    setGrievanceTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Resolved", sla: "Closed" } : t))
    );
    toast.success(`Grievance ticket ${id} marked as Resolved!`);
  };

  const filteredGrievances = grievanceTickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(grievanceSearch.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* HEADER & QUICK ACTIONS */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-purple-600" /> Feedback & Grievance Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Submit faculty ratings, course evaluations, and track formal institutional grievances.
            </p>
          </div>

          {/* QUICK ACTIONS BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setMainTab("faculty")}
              className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold h-9 gap-1.5 shadow-xs"
            >
              <UserCheck className="h-4 w-4" /> Faculty Feedback
            </Button>
            <Button
              onClick={() => setMainTab("course")}
              className="rounded-xl text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 gap-1.5 shadow-xs"
            >
              <BookOpen className="h-4 w-4" /> Course Feedback
            </Button>
            <Button
              onClick={() => {
                setMainTab("grievance");
                setIsGrievanceModalOpen(true);
              }}
              variant="outline"
              className="rounded-xl text-xs font-semibold h-9 border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1.5"
            >
              <ShieldAlert className="h-4 w-4" /> Raise Grievance
            </Button>
            <Button
              onClick={() => setMainTab("dashboard")}
              variant="ghost"
              className="rounded-xl text-xs font-semibold h-9 text-slate-600 dark:text-slate-400 gap-1"
            >
              <History className="h-4 w-4" /> Previous Feedback
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN TABS CONTAINER */}
      <Tabs value={activeTabState(mainTab)} onValueChange={setMainTab} className="w-full space-y-6">
        <TabsList className="flex flex-wrap h-auto p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl gap-1 border border-slate-200 dark:border-slate-800">
          <TabsTrigger
            value="dashboard"
            className="rounded-lg text-xs font-bold py-2.5 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> 1. Feedback Dashboard
          </TabsTrigger>

          <TabsTrigger
            value="faculty"
            className="rounded-lg text-xs font-bold py-2.5 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
          >
            <UserCheck className="h-4 w-4" /> 2. Faculty Feedback
          </TabsTrigger>

          <TabsTrigger
            value="course"
            className="rounded-lg text-xs font-bold py-2.5 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
          >
            <BookOpen className="h-4 w-4" /> 3. Course Feedback
          </TabsTrigger>

          <TabsTrigger
            value="grievance"
            className="rounded-lg text-xs font-bold py-2.5 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-rose-600 shadow-2xs gap-1.5"
          >
            <ShieldAlert className="h-4 w-4" /> 4. Grievance Redressal
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: FEEDBACK DASHBOARD */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* FEEDBACK KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Feedback Submitted" value={String(mockFeedbackKPIs.feedbackSubmitted)} icon={CheckCircle2} tone="success" />
            <KpiCard label="Pending Feedback" value={String(mockFeedbackKPIs.pendingFeedback)} icon={Clock} tone="warning" />
            <KpiCard label="Average Rating Given" value={`${mockFeedbackKPIs.averageRating} / 5.0`} icon={Star} tone="info" />
            <KpiCard label="Active Surveys" value={String(mockFeedbackKPIs.activeSurveys)} icon={Sparkles} tone="default" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ACTIVE FEEDBACK SURVEYS (2 COLS) */}
            <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    Active Feedback Surveys ({mockActiveSurveys.length})
                  </h3>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] text-purple-600 border-purple-200">
                  Semester Fall 2026
                </Badge>
              </div>

              <div className="space-y-3">
                {mockActiveSurveys.map((survey) => (
                  <div
                    key={survey.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[9px] font-mono ${
                            survey.type === "Faculty"
                              ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                              : survey.type === "Course"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          }`}
                        >
                          {survey.type} Survey
                        </Badge>
                        <span className="text-[11px] font-mono text-slate-400">Due: {survey.dueDate}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{survey.title}</h4>
                      <p className="text-[11px] text-slate-500">{survey.target}</p>
                    </div>

                    <Button
                      onClick={() => setMainTab(survey.type === "Faculty" ? "faculty" : "course")}
                      size="sm"
                      className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold h-8 shrink-0"
                    >
                      Fill Survey
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* PREVIOUS SUBMISSIONS LEDGER (1 COL) */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-purple-600" />
                  <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    Submission History
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {mockPreviousFeedbackHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 space-y-1 text-xs"
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>{item.id} • {item.date}</span>
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="h-3 w-3 fill-amber-500" /> {item.rating}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h5>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">{item.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: FACULTY FEEDBACK */}
        <TabsContent value="faculty">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-6 max-w-3xl mx-auto">
            <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-600" /> Faculty Performance Rating & Assessment
              </h3>
              <p className="text-xs text-slate-500">
                Evaluate teaching methodology, communication, subject mastery, and classroom punctuality.
              </p>
            </div>

            <form onSubmit={handleFacultySubmit} className="space-y-5">
              {/* Faculty & Subject Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Faculty</label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs px-3 font-semibold text-slate-900 dark:text-white"
                  >
                    {mockFacultyList.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject / Course</label>
                  <Input
                    readOnly
                    value={mockFacultyList.find((f) => f.id === selectedFaculty)?.subject || ""}
                    className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs font-medium text-slate-600"
                  />
                </div>
              </div>

              {/* Star Rating Parameters */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Rating Parameters (1 to 5 Stars)</h4>

                {[
                  { key: "teachingQuality", label: "Teaching Quality & Clarity of Explanation" },
                  { key: "communication", label: "Communication & Language Command" },
                  { key: "knowledge", label: "Subject Knowledge & Preparation" },
                  { key: "interaction", label: "Student Interaction & Doubt Resolution" },
                  { key: "punctuality", label: "Punctuality & Lecture Timelines" },
                ].map((param) => (
                  <div key={param.key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{param.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFacultyRatings((prev) => ({
                              ...prev,
                              [param.key]: star,
                            }))
                          }
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= (facultyRatings as any)[param.key]
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comments */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Detailed Feedback & Comments</label>
                <textarea
                  rows={4}
                  value={facultyComments}
                  onChange={(e) => setFacultyComments(e.target.value)}
                  placeholder="Share constructive feedback, strengths, or suggestions for faculty..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 h-10 gap-1.5 shadow-md">
                  <Send className="h-4 w-4" /> Submit Faculty Feedback
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* TAB 3: COURSE FEEDBACK */}
        <TabsContent value="course">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-6 max-w-3xl mx-auto">
            <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" /> Academic Course & Curriculum Evaluation
              </h3>
              <p className="text-xs text-slate-500">
                Rate course syllabus depth, practical lab relevance, assignment quality, and learning resources.
              </p>
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-5">
              {/* Course Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs px-3 font-semibold text-slate-900 dark:text-white"
                >
                  {mockCourseList.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.title} ({c.sem})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Parameters */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Course Criteria (1 to 5 Stars)</h4>

                {[
                  { key: "courseContent", label: "Course Content & Syllabus Relevance" },
                  { key: "lab", label: "Practical Lab Work & Hands-on Exercises" },
                  { key: "assignments", label: "Assignment Design & Problem Depth" },
                  { key: "resources", label: "Learning Resources & Textbooks Provided" },
                  { key: "difficulty", label: "Appropriate Level of Rigor & Difficulty" },
                  { key: "overallExperience", label: "Overall Course Learning Experience" },
                ].map((param) => (
                  <div key={param.key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{param.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setCourseRatings((prev) => ({
                              ...prev,
                              [param.key]: star,
                            }))
                          }
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= (courseRatings as any)[param.key]
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Suggestions for Course Improvement</label>
                <textarea
                  rows={4}
                  value={courseSuggestions}
                  onChange={(e) => setCourseSuggestions(e.target.value)}
                  placeholder="Provide recommendations for syllabus updates, software tools, or lab equipment..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 h-10 gap-1.5 shadow-md">
                  <Send className="h-4 w-4" /> Submit Course Evaluation
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* TAB 4: GRIEVANCE REDRESSAL (EXACT EXISTING GRIEVANCE MODULE PRESERVED) */}
        <TabsContent value="grievance" className="space-y-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                <ShieldAlert className="size-6" />
              </span>
              <div>
                <h2 className="font-display text-xl font-extrabold sm:text-2xl">
                  Grievance Redressal Module
                </h2>
                <p className="text-sm text-muted-foreground">
                  Anonymous and identified ticketing, Grievance Committee assignment, and SLA tracking.
                </p>
              </div>
            </div>
            <Badge className="bg-brand-gradient text-white font-mono">
              {isCommitteeMember ? "Grievance Committee Member" : "User Portal"}
            </Badge>
          </header>

          {/* KPIS */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Total Tickets (FY26)" value={String(139 + grievanceTickets.length)} icon={MessageSquare} />
            <KpiCard label="Resolved SLA Rate" value="96.2%" icon={CheckCircle2} tone="success" />
            <KpiCard label="Pending Committee Review" value={String(grievanceTickets.filter((t) => t.status !== "Resolved").length)} icon={Clock} tone="warning" />
            <KpiCard label="Avg Resolution Time" value="34 Hours" icon={ShieldAlert} tone="info" />
          </div>

          <Tabs value={grievanceSubTab} onValueChange={setGrievanceSubTab} className="space-y-6">
            <TabsList className="bg-background/50 border border-border p-1">
              <TabsTrigger value="tickets">Grievance Tickets</TabsTrigger>
              <TabsTrigger value="committee">Disciplinary Committee</TabsTrigger>
              <TabsTrigger value="antiragging">Anti-Ragging Squad</TabsTrigger>
            </TabsList>

            <TabsContent value="tickets">
              <Panel
                title="Submitted Grievances"
                description="Students and staff can submit grievances. Disciplinary Committee members process cases with strict audit trails."
                action={
                  <Button
                    onClick={() => setIsGrievanceModalOpen(true)}
                    className="bg-brand-gradient shadow-glow gap-1.5 cursor-pointer"
                  >
                    <Plus className="size-4" /> Raise New Grievance
                  </Button>
                }
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search ticket subject or ID..."
                      value={grievanceSearch}
                      onChange={(e) => setGrievanceSearch(e.target.value)}
                      className="pl-8 h-9"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto border border-border rounded-xl">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Raised By</TableHead>
                        <TableHead>Assigned Committee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGrievances.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-mono text-xs font-semibold">{t.id}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{t.category}</TableCell>
                          <TableCell className="font-semibold text-sm">{t.subject}</TableCell>
                          <TableCell className="text-xs">{t.raisedBy}</TableCell>
                          <TableCell className="text-xs font-mono">{t.committee}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                t.status === "Resolved"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              }
                            >
                              {t.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {t.status !== "Resolved" && isCommitteeMember ? (
                              <Button
                                size="sm"
                                onClick={() => handleResolveGrievance(t.id)}
                                className="h-8 bg-brand-gradient text-xs cursor-pointer"
                              >
                                Resolve Ticket
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground font-mono">
                                {t.status}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Panel>
            </TabsContent>

            <TabsContent value="committee">
              <Panel title="Disciplinary Committee Members" description="Appointed faculty and staff members handling escalated hearings.">
                <p className="text-sm text-muted-foreground">
                  All hearing minutes and resolution reports are locked with digital signatures.
                </p>
              </Panel>
            </TabsContent>

            <TabsContent value="antiragging">
              <Panel title="Anti-Ragging Squad & Portal" description="24x7 emergency helpline logs and campus monitoring squad assignments.">
                <p className="text-sm text-muted-foreground">
                  Compliant with UGC & AICTE Anti-Ragging Directives.
                </p>
              </Panel>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Raise New Grievance Modal (Preserved) */}
      <FormDialog
        isOpen={isGrievanceModalOpen}
        onClose={() => setIsGrievanceModalOpen(false)}
        title="Raise New Grievance"
        description="Submit a formal grievance ticket to the institutional oversight committee."
        schema={grievanceSchema}
        defaultValues={{
          category: "Academic / Internal Evaluation",
          subject: "",
          description: "",
          isAnonymous: false,
        }}
        fields={grievanceFields}
        onSubmit={handleAddGrievance}
        submitText="Submit Grievance"
      />
    </div>
  );
}

function activeTabState(tab: string) {
  return tab;
}
