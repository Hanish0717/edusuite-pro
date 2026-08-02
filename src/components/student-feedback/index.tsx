import React, { useState } from "react";
import {
  mockFeedbackKPIs,
  mockFacultyList,
  mockCourseList,
  mockActiveSurveys,
  mockGrievanceCategories,
  mockStudentServices,
  mockGrievancesList,
  mockHistoryRecords,
} from "./mock-data";
import {
  GrievanceCategoryItem,
  StudentServiceItem,
  HistoryRecord,
} from "./types";
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
  GraduationCap,
  Library,
  Home,
  Bus,
  CreditCard,
  Wrench,
  HelpCircle,
  FileCheck,
  Eye,
  Filter,
  Paperclip,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Icon Map helper for Category & Service Cards
const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  Library,
  Home,
  Bus,
  CreditCard,
  Award,
  ShieldAlert,
  Wrench,
  HelpCircle,
  FileCheck,
  FileText,
  ShieldCheck,
  Users,
};

export function StudentFeedbackModule() {
  const [activeTab, setActiveTab] = useState("overview");

  // State Datasets
  const [historyList, setHistoryList] = useState<HistoryRecord[]>(mockHistoryRecords);
  const [surveys, setSurveys] = useState(mockActiveSurveys);

  // Search & Filters for History Tab
  const [searchHistory, setSearchHistory] = useState("");
  const [historyTypeFilter, setHistoryTypeFilter] = useState("All");
  const [historyDeptFilter, setHistoryDeptFilter] = useState("All");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("All");

  // Faculty Form State
  const [selectedFacultyId, setSelectedFacultyId] = useState(mockFacultyList[0].id);
  const [facultySemester, setFacultySemester] = useState("Semester 5");
  const [facultyRatings, setFacultyRatings] = useState({
    teachingQuality: 5,
    communication: 5,
    punctuality: 5,
    courseCoverage: 5,
  });
  const [facultyComments, setFacultyComments] = useState("");

  // Course Form State
  const [selectedCourseCode, setSelectedCourseCode] = useState(mockCourseList[0].code);
  const [courseRatings, setCourseRatings] = useState({
    laboratory: 5,
    assignments: 4,
    courseMaterial: 5,
    difficulty: 3,
    overallRating: 5,
  });
  const [courseRemarks, setCourseRemarks] = useState("");

  // Modals
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);
  const [selectedGrievanceCategory, setSelectedGrievanceCategory] = useState("Academic");
  const [grievancePriority, setGrievancePriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");
  const [grievanceTitle, setGrievanceTitle] = useState("");
  const [grievanceDescription, setGrievanceDescription] = useState("");
  const [grievanceFile, setGrievanceFile] = useState<string | null>(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<StudentServiceItem | null>(null);
  const [serviceDeliveryMode, setServiceDeliveryMode] = useState("Digital Copy (PDF)");
  const [serviceRemarks, setServiceRemarks] = useState("");

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedHistoryDetail, setSelectedHistoryDetail] = useState<HistoryRecord | null>(null);

  // Quick Action Modal Triggers
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  // Form Handlers
  const handleFacultyFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fac = mockFacultyList.find((f) => f.id === selectedFacultyId);
    const newRecord: HistoryRecord = {
      id: `HIST-${Date.now().toString().slice(-4)}`,
      type: "Faculty Feedback",
      title: `${fac?.name || "Faculty"} — ${fac?.subject || "Subject"}`,
      date: new Date().toISOString().split("T")[0],
      status: "Submitted",
      department: fac?.department || "Academic Section",
      referenceId: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      details: `Submitted rating for ${facultySemester}. Comments: ${facultyComments || "None"}`,
    };

    setHistoryList([newRecord, ...historyList]);
    toast.success(`Feedback for ${fac?.name} submitted successfully!`);
    setFacultyComments("");
    setIsFacultyModalOpen(false);
    setActiveTab("history");
  };

  const handleCourseFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const crs = mockCourseList.find((c) => c.code === selectedCourseCode);
    const newRecord: HistoryRecord = {
      id: `HIST-${Date.now().toString().slice(-4)}`,
      type: "Course Feedback",
      title: `${crs?.title || "Course Evaluation"}`,
      date: new Date().toISOString().split("T")[0],
      status: "Submitted",
      department: crs?.dept || "Computer Science",
      referenceId: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      details: `Overall rating: ${courseRatings.overallRating} Stars. Remarks: ${courseRemarks || "None"}`,
    };

    setHistoryList([newRecord, ...historyList]);
    toast.success(`Course feedback for ${crs?.title} submitted!`);
    setCourseRemarks("");
    setIsCourseModalOpen(false);
    setActiveTab("history");
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceTitle.trim() || !grievanceDescription.trim()) {
      toast.error("Please enter a title and description for your grievance.");
      return;
    }

    const refId = `GRV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: HistoryRecord = {
      id: `HIST-${Date.now().toString().slice(-4)}`,
      type: "Grievance",
      title: grievanceTitle,
      date: new Date().toISOString().split("T")[0],
      status: "In Progress",
      department: selectedGrievanceCategory.includes("Hostel") ? "Hostel Committee" : "Academic Appeals",
      referenceId: refId,
      details: `Priority: ${grievancePriority}. Category: ${selectedGrievanceCategory}. Description: ${grievanceDescription}`,
    };

    setHistoryList([newRecord, ...historyList]);
    toast.success(`Grievance ticket ${refId} submitted successfully!`);
    setIsGrievanceModalOpen(false);
    setGrievanceTitle("");
    setGrievanceDescription("");
    setGrievanceFile(null);
    setActiveTab("history");
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const refId = `REQ-${selectedService.id.slice(-3)}-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: HistoryRecord = {
      id: `HIST-${Date.now().toString().slice(-4)}`,
      type: "Service Request",
      title: `${selectedService.title} Request`,
      date: new Date().toISOString().split("T")[0],
      status: "In Progress",
      department: selectedService.department,
      referenceId: refId,
      details: `Mode: ${serviceDeliveryMode}. Fee: ${selectedService.fee}. Est: ${selectedService.estimatedDays}. Remarks: ${serviceRemarks || "None"}`,
    };

    setHistoryList([newRecord, ...historyList]);
    toast.success(`Service Request ${refId} submitted! Track status in History tab.`);
    setIsServiceModalOpen(false);
    setServiceRemarks("");
    setActiveTab("history");
  };

  // Filtered History
  const filteredHistory = historyList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchHistory.toLowerCase()) ||
      item.referenceId.toLowerCase().includes(searchHistory.toLowerCase()) ||
      item.department.toLowerCase().includes(searchHistory.toLowerCase());

    const matchesType =
      historyTypeFilter === "All" ||
      (historyTypeFilter === "Feedback" && (item.type === "Faculty Feedback" || item.type === "Course Feedback")) ||
      (historyTypeFilter === "Grievance" && item.type === "Grievance") ||
      (historyTypeFilter === "Service Requests" && item.type === "Service Request");

    const matchesDept = historyDeptFilter === "All" || item.department === historyDeptFilter;
    const matchesStatus = historyStatusFilter === "All" || item.status === historyStatusFilter;

    return matchesSearch && matchesType && matchesDept && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-5 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
              <MessageSquare className="h-6 w-6" />
            </div>
            Feedback Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Submit faculty and course feedback, raise grievances, request services, and track all requests.
          </p>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="flex flex-wrap h-auto p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl gap-1 border border-slate-200 dark:border-slate-800">
          <TabsTrigger
            value="overview"
            className="rounded-lg text-xs font-bold py-2.5 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Overview
          </TabsTrigger>

          <TabsTrigger
            value="faculty"
            className="rounded-lg text-xs font-bold py-2.5 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
          >
            <UserCheck className="h-4 w-4" /> Faculty Feedback
          </TabsTrigger>

          <TabsTrigger
            value="course"
            className="rounded-lg text-xs font-bold py-2.5 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-600 shadow-2xs gap-1.5"
          >
            <BookOpen className="h-4 w-4" /> Course Feedback
          </TabsTrigger>

          <TabsTrigger
            value="grievance"
            className="rounded-lg text-xs font-bold py-2.5 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-rose-600 shadow-2xs gap-1.5"
          >
            <ShieldAlert className="h-4 w-4" /> Grievance
          </TabsTrigger>

          <TabsTrigger
            value="services"
            className="rounded-lg text-xs font-bold py-2.5 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 shadow-2xs gap-1.5"
          >
            <FileCheck className="h-4 w-4" /> Student Services
          </TabsTrigger>

          <TabsTrigger
            value="history"
            className="rounded-lg text-xs font-bold py-2.5 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white shadow-2xs gap-1.5"
          >
            <History className="h-4 w-4" /> History
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: OVERVIEW TAB */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="overview" className="space-y-6">
          {/* TOP SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Faculty Feedback Submitted"
              value={String(mockFeedbackKPIs.facultyFeedbackSubmitted)}
              icon={CheckCircle2}
              tone="success"
            />
            <KpiCard
              label="Pending Feedback"
              value={String(mockFeedbackKPIs.pendingFeedback)}
              icon={Clock}
              tone="warning"
            />
            <KpiCard
              label="Open Grievances"
              value={String(mockFeedbackKPIs.openGrievances)}
              icon={ShieldAlert}
              tone="danger"
            />
            <KpiCard
              label="Service Requests"
              value={String(mockFeedbackKPIs.serviceRequests)}
              icon={FileCheck}
              tone="info"
            />
          </div>

          {/* ACTIVE FEEDBACK SURVEYS SECTION */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                    Active Feedback Surveys ({surveys.length})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Complete pending midterm & end-term survey evaluations.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-xs text-purple-600 border-purple-200">
                Fall Semester 2026
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {surveys.map((survey) => (
                <div
                  key={survey.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`text-[10px] font-mono ${
                          survey.type === "Faculty"
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }`}
                      >
                        {survey.type} Survey
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${
                          survey.status === "Pending" ? "text-amber-600 border-amber-300" : "text-emerald-600 border-emerald-300"
                        }`}
                      >
                        {survey.status}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                      {survey.title}
                    </h4>

                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-medium pt-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Faculty:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{survey.facultyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subject:</span>
                        <span className="font-medium">{survey.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Semester:</span>
                        <span className="font-mono text-slate-500">{survey.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Due Date:</span>
                        <span className="font-mono text-rose-500 font-bold">{survey.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (survey.type === "Faculty") {
                        setActiveTab("faculty");
                      } else {
                        setActiveTab("course");
                      }
                    }}
                    size="sm"
                    className="w-full rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold h-9 gap-1.5 shadow-2xs"
                  >
                    Fill Survey <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: FACULTY FEEDBACK TAB */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="faculty">
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-6 max-w-3xl mx-auto">
            <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-purple-600" /> Faculty Performance Rating & Evaluation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rate faculty members across core parameters to help improve academic standards.
              </p>
            </div>

            <form onSubmit={handleFacultyFeedbackSubmit} className="space-y-6">
              {/* Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Faculty</label>
                  <select
                    value={selectedFacultyId}
                    onChange={(e) => setSelectedFacultyId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs px-3 font-semibold text-slate-900 dark:text-white"
                  >
                    {mockFacultyList.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject</label>
                  <Input
                    readOnly
                    value={mockFacultyList.find((f) => f.id === selectedFacultyId)?.subject || ""}
                    className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs font-medium text-slate-600"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Semester</label>
                  <select
                    value={facultySemester}
                    onChange={(e) => setFacultySemester(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs px-3 font-semibold text-slate-900 dark:text-white"
                  >
                    {["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* STAR RATINGS */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Evaluation Parameters (1 to 5 Stars)</h4>

                {[
                  { key: "teachingQuality", label: "Teaching Quality & Pedagogy" },
                  { key: "communication", label: "Communication & Language Command" },
                  { key: "punctuality", label: "Punctuality & Lecture Timelines" },
                  { key: "courseCoverage", label: "Course Coverage & Syllabus Depth" },
                ].map((param) => (
                  <div key={param.key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs border-b pb-2 border-slate-100 dark:border-slate-800/60 last:border-0 last:pb-0">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{param.label}</span>
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

              {/* COMMENTS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Comments & Constructive Feedback</label>
                <textarea
                  rows={4}
                  value={facultyComments}
                  onChange={(e) => setFacultyComments(e.target.value)}
                  placeholder="Share details regarding strengths, Doubt resolution, or recommendations..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 h-10 gap-1.5 shadow-md">
                  <Send className="h-4 w-4" /> Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: COURSE FEEDBACK TAB */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="course">
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-6 max-w-3xl mx-auto">
            <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" /> Academic Course & Curriculum Feedback
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rate course curriculum, laboratory experiments, assignments, and learning resources.
              </p>
            </div>

            <form onSubmit={handleCourseFeedbackSubmit} className="space-y-6">
              {/* Course Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Course</label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => setSelectedCourseCode(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs px-3 font-semibold text-slate-900 dark:text-white"
                >
                  {mockCourseList.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.title} ({c.sem})
                    </option>
                  ))}
                </select>
              </div>

              {/* STAR RATINGS */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Course Parameters (1 to 5 Stars)</h4>

                {[
                  { key: "laboratory", label: "Laboratory & Practical Work" },
                  { key: "assignments", label: "Assignments & Homework Quality" },
                  { key: "courseMaterial", label: "Course Material & Textbooks Provided" },
                  { key: "difficulty", label: "Appropriate Level of Difficulty & Rigor" },
                  { key: "overallRating", label: "Overall Course Rating" },
                ].map((param) => (
                  <div key={param.key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs border-b pb-2 border-slate-100 dark:border-slate-800/60 last:border-0 last:pb-0">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{param.label}</span>
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

              {/* REMARKS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Remarks & Improvement Recommendations</label>
                <textarea
                  rows={4}
                  value={courseRemarks}
                  onChange={(e) => setCourseRemarks(e.target.value)}
                  placeholder="Provide suggestions for syllabus updates or software tools..."
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

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: GRIEVANCE TAB */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="grievance" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20">
            <div>
              <h3 className="text-base font-black text-rose-900 dark:text-rose-200 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600" /> Formal Grievance Redressal Categories
              </h3>
              <p className="text-xs text-rose-700/80 dark:text-rose-300/80 font-medium mt-0.5">
                Select a category below to open the formal grievance ticket submission form.
              </p>
            </div>

            <Button
              onClick={() => {
                setSelectedGrievanceCategory("Academic");
                setIsGrievanceModalOpen(true);
              }}
              className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold h-9 px-4 gap-1.5 shadow-sm shrink-0"
            >
              <Plus className="h-4 w-4" /> Direct Ticket
            </Button>
          </div>

          {/* 10 CATEGORY CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mockGrievanceCategories.map((cat) => {
              const IconComponent = iconMap[cat.iconName] || HelpCircle;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedGrievanceCategory(cat.name);
                    setIsGrievanceModalOpen(true);
                  }}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md hover:border-rose-300 dark:hover:border-rose-800 cursor-pointer transition-all flex flex-col justify-between group space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono text-slate-500 border-slate-200">
                        {cat.badge}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                      {cat.name}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400 border-t border-slate-100 dark:border-slate-800">
                    <span>Raise Issue</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 5: STUDENT SERVICES TAB */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <div>
              <h3 className="text-base font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-600" /> Student Administrative Services Catalog
              </h3>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 font-medium mt-0.5">
                Apply for certificates, transcripts, bus passes, and official clearance letters.
              </p>
            </div>

            <Badge className="bg-emerald-600 text-white font-mono text-xs">
              10 Services Active
            </Badge>
          </div>

          {/* 10 SERVICE CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockStudentServices.map((svc) => {
              const IconComponent = iconMap[svc.iconName] || FileText;
              return (
                <div
                  key={svc.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] font-mono text-slate-500">
                          {svc.estimatedDays}
                        </Badge>
                        <Badge className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          {svc.fee}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {svc.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {svc.description}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <span>Dept:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{svc.department}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      onClick={() => {
                        setSelectedService(svc);
                        setIsServiceModalOpen(true);
                      }}
                      size="sm"
                      className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 gap-1 shadow-2xs"
                    >
                      Apply Now
                    </Button>

                    <Button
                      onClick={() => {
                        setActiveTab("history");
                        setSearchHistory(svc.title);
                      }}
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs font-semibold h-9 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" /> Track
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 6: HISTORY TAB */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="history" className="space-y-6">
          {/* SEARCH & FILTERS BAR */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* SEARCH */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search requests, reference ID, title..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  className="pl-9 h-10 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
                />
              </div>

              {/* TYPE FILTER BUTTONS */}
              <div className="flex flex-wrap items-center gap-1.5">
                {["All", "Feedback", "Grievance", "Service Requests"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setHistoryTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      historyTypeFilter === type
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* FILTER DROPDOWNS */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-500">
                <Filter className="h-3.5 w-3.5" /> Filters:
              </div>

              <select
                value={historyDeptFilter}
                onChange={(e) => setHistoryDeptFilter(e.target.value)}
                className="h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs px-3 font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="All">All Departments</option>
                <option value="Academic Section">Academic Section</option>
                <option value="Controller of Exams">Controller of Exams</option>
                <option value="Hostel Committee">Hostel Committee</option>
                <option value="Transport Cell">Transport Cell</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Central Library">Central Library</option>
              </select>

              <select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                className="h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs px-3 font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Approved">Approved</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>

              {(searchHistory || historyTypeFilter !== "All" || historyDeptFilter !== "All" || historyStatusFilter !== "All") && (
                <Button
                  onClick={() => {
                    setSearchHistory("");
                    setHistoryTypeFilter("All");
                    setHistoryDeptFilter("All");
                    setHistoryStatusFilter("All");
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* HISTORY TABLE / EMPTY STATE */}
          {filteredHistory.length === 0 ? (
            <div className="p-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <EmptyState
                title={`No ${historyTypeFilter !== "All" ? historyTypeFilter : "Requests"} Found`}
                description="There are no records matching your current filter choices or search term."
                actionLabel="Reset All Filters"
                onAction={() => {
                  setSearchHistory("");
                  setHistoryTypeFilter("All");
                  setHistoryDeptFilter("All");
                  setHistoryStatusFilter("All");
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-2xs">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                  <TableRow>
                    <TableHead className="font-bold text-xs text-slate-900 dark:text-white">Ref ID</TableHead>
                    <TableHead className="font-bold text-xs text-slate-900 dark:text-white">Type</TableHead>
                    <TableHead className="font-bold text-xs text-slate-900 dark:text-white">Title</TableHead>
                    <TableHead className="font-bold text-xs text-slate-900 dark:text-white">Date</TableHead>
                    <TableHead className="font-bold text-xs text-slate-900 dark:text-white">Department</TableHead>
                    <TableHead className="font-bold text-xs text-slate-900 dark:text-white">Status</TableHead>
                    <TableHead className="text-right font-bold text-xs text-slate-900 dark:text-white">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      <TableCell className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {item.referenceId}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] font-mono ${
                            item.type.includes("Feedback")
                              ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                              : item.type === "Grievance"
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          }`}
                        >
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-xs text-slate-900 dark:text-white max-w-xs truncate">
                        {item.title}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-slate-500">{item.date}</TableCell>
                      <TableCell className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {item.department}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] font-mono ${
                            item.status === "Approved" || item.status === "Resolved"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : item.status === "In Progress"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : item.status === "Submitted"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            setSelectedHistoryDetail(item);
                            setIsDetailsModalOpen(true);
                          }}
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" /> Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ==================================================================== */}
      {/* MODAL 1: RAISE GRIEVANCE MODAL */}
      {/* ==================================================================== */}
      <Dialog open={isGrievanceModalOpen} onOpenChange={setIsGrievanceModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
              <ShieldAlert className="h-5 w-5" /> Raise Grievance Ticket
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Formal institutional submission. Confidential review by the oversight committee.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGrievanceSubmit} className="space-y-4 my-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={selectedGrievanceCategory}
                  onChange={(e) => setSelectedGrievanceCategory(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 font-semibold"
                >
                  {mockGrievanceCategories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Priority Level</label>
                <select
                  value={grievancePriority}
                  onChange={(e) => setGrievancePriority(e.target.value as any)}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 font-semibold"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Grievance Title</label>
              <Input
                placeholder="Brief summary of your grievance..."
                value={grievanceTitle}
                onChange={(e) => setGrievanceTitle(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Detailed Description</label>
              <textarea
                rows={4}
                placeholder="Provide timeline, incident details, involved parties..."
                value={grievanceDescription}
                onChange={(e) => setGrievanceDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Attachment Upload (Optional)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={(e) => setGrievanceFile(e.target.files?.[0]?.name || null)}
                  className="h-9 text-xs rounded-xl cursor-pointer"
                />
              </div>
              {grievanceFile && (
                <p className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                  <Check className="h-3 w-3" /> Attached: {grievanceFile}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsGrievanceModalOpen(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold">
                Submit Grievance
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================================================================== */}
      {/* MODAL 2: SERVICE REQUEST MODAL */}
      {/* ==================================================================== */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-emerald-600">
              <FileCheck className="h-5 w-5" /> Request Student Service: {selectedService?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleServiceSubmit} className="space-y-4 my-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Processing Fee:</span>
                <span className="font-bold text-emerald-600">{selectedService?.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedService?.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Processing Time:</span>
                <span className="font-semibold text-purple-600">{selectedService?.estimatedDays}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Delivery Mode</label>
              <select
                value={serviceDeliveryMode}
                onChange={(e) => setServiceDeliveryMode(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 font-semibold"
              >
                <option value="Digital Copy (PDF)">Digital Copy (Signed PDF Download)</option>
                <option value="Hard Copy (Pickup at Counter)">Hard Copy (Physical Counter Pickup)</option>
                <option value="Postal Delivery (Registered Speedpost)">Postal Speedpost Delivery (+₹50)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Purpose / Remarks</label>
              <textarea
                rows={3}
                placeholder="Mention passport no, bank name, or purpose..."
                value={serviceRemarks}
                onChange={(e) => setServiceRemarks(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsServiceModalOpen(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================================================================== */}
      {/* MODAL 3: REQUEST DETAILS MODAL */}
      {/* ==================================================================== */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" /> Request Details — {selectedHistoryDetail?.referenceId}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Audit timeline and status updates for this request.
            </DialogDescription>
          </DialogHeader>

          {selectedHistoryDetail && (
            <div className="space-y-4 my-2 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedHistoryDetail.type}
                  </Badge>
                  <Badge
                    className={`text-xs font-mono ${
                      selectedHistoryDetail.status === "Approved" || selectedHistoryDetail.status === "Resolved"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : selectedHistoryDetail.status === "In Progress"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}
                  >
                    {selectedHistoryDetail.status}
                  </Badge>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedHistoryDetail.title}
                </h4>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date Submitted:</span>
                    <span className="font-mono font-semibold">{selectedHistoryDetail.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Department:</span>
                    <span className="font-semibold">{selectedHistoryDetail.department}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Notes & Updates:</span>
                    <p className="mt-0.5 font-medium">{selectedHistoryDetail.details || "Request is under active processing by the department officer."}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDetailsModalOpen(false)} className="w-full rounded-xl text-xs font-bold">
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
