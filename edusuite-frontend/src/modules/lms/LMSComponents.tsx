import React, { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  Video,
  FileCheck,
  HelpCircle,
  MessageSquare,
  VideoIcon,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  GraduationCap,
  Play,
  Award,
  Calendar,
  ExternalLink,
  MessageCircle,
  Send,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  fetchLMSSyllabus,
  fetchLMSResources,
  fetchLMSVideos,
  fetchLMSAssignments,
  fetchLMSQuizzes,
  fetchLMSForum,
  fetchLMSClasses,
  createLMSResource,
  createLMSVideo,
  createLMSAssignment,
  createLMSClass,
  INITIAL_SYLLABUS,
  INITIAL_RESOURCES,
  INITIAL_VIDEOS,
  INITIAL_ASSIGNMENTS,
  INITIAL_QUIZZES,
  INITIAL_FORUM,
  INITIAL_CLASSES,
} from "./LMSService";

import type {
  ResourceItem,
  VideoLecture,
  AssignmentItem,
  QuizItem,
  ForumPost,
  ClassItem,
  SyllabusSubject,
} from "./types";

const SUBPARTS = [
  { id: "curriculum", label: "1. Curriculum & Syllabus", icon: BookOpen },
  { id: "notes", label: "2. Study Notes & PDFs", icon: FileText },
  { id: "videos", label: "3. Video Lectures", icon: Video },
  { id: "assignments", label: "4. Assignments Hub", icon: FileCheck },
  { id: "quizzes", label: "5. Quizzes & Tests", icon: HelpCircle },
  { id: "forum", label: "6. Discussion Forum", icon: MessageSquare },
  { id: "classes", label: "7. Virtual Classes", icon: VideoIcon },
] as const;

export function LMSModuleView() {
  const [activeTab, setActiveTab] = useState<(typeof SUBPARTS)[number]["id"]>("curriculum");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Data states
  const [syllabus, setSyllabus] = useState<SyllabusSubject[]>(INITIAL_SYLLABUS);
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [videos, setVideos] = useState<VideoLecture[]>(INITIAL_VIDEOS);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [quizzes, setQuizzes] = useState<QuizItem[]>(INITIAL_QUIZZES);
  const [forum, setForum] = useState<ForumPost[]>(INITIAL_FORUM);
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);

  // Dialog States
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);

  // Form States
  const [resForm, setResForm] = useState<Partial<ResourceItem>>({
    title: "",
    subject: "CS401: Advanced AI",
    department: "CSE",
  });
  const [vidForm, setVidForm] = useState<Partial<VideoLecture>>({
    title: "",
    subject: "CS401: Advanced AI",
    department: "CSE",
    duration: "45 mins",
    instructor: "Dr. K. Sai Teja",
    videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
  });
  const [asnForm, setAsnForm] = useState<Partial<AssignmentItem>>({
    title: "",
    subject: "CS401: Advanced AI",
    department: "CSE",
    dueDate: "2026-08-15",
    description: "",
  });
  const [clsForm, setClsForm] = useState<Partial<ClassItem>>({
    subject: "CS401: Advanced AI",
    department: "CSE",
    topic: "",
    instructor: "Dr. K. Sai Teja",
    date: new Date().toISOString().split("T")[0],
    time: "04:00 PM - 05:00 PM",
    link: "https://meet.google.com/abc-defg-hij",
  });

  const loadAllLMS = async () => {
    setLoading(true);
    const [syl, res, vid, asn, qz, frm, cls] = await Promise.all([
      fetchLMSSyllabus(),
      fetchLMSResources(),
      fetchLMSVideos(),
      fetchLMSAssignments(),
      fetchLMSQuizzes(),
      fetchLMSForum(),
      fetchLMSClasses(),
    ]);
    setSyllabus(syl);
    setResources(res);
    setVideos(vid);
    setAssignments(asn);
    setQuizzes(qz);
    setForum(frm);
    setClasses(cls);
    setLoading(false);
  };

  useEffect(() => {
    loadAllLMS();
  }, []);

  // Handlers for Add
  const handleAddResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.title) return toast.error("Enter document title");
    const created = await createLMSResource(resForm);
    setResources((prev) => [created, ...prev]);
    setIsAddResourceOpen(false);
    toast.success(`Study Note "${created.title}" uploaded!`);
  };

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidForm.title) return toast.error("Enter video lecture title");
    const created = await createLMSVideo(vidForm);
    setVideos((prev) => [created, ...prev]);
    setIsAddVideoOpen(false);
    toast.success(`Video Lecture "${created.title}" added!`);
  };

  const handleAddAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asnForm.title) return toast.error("Enter assignment title");
    const created = await createLMSAssignment(asnForm);
    setAssignments((prev) => [created, ...prev]);
    setIsAddAssignmentOpen(false);
    toast.success(`Assignment "${created.title}" launched!`);
  };

  const handleAddClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clsForm.topic) return toast.error("Enter class stream topic");
    const created = await createLMSClass(clsForm);
    setClasses((prev) => [created, ...prev]);
    setIsAddClassOpen(false);
    toast.success(`Virtual Class "${created.topic}" scheduled!`);
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `LMS_${activeTab.toUpperCase()}_${new Date().toISOString().split("T")[0]}.csv`;

    if (activeTab === "curriculum") {
      headers = ["Subject Code", "Subject Name", "Department", "Semester", "Coverage %", "Credits"];
      rows = syllabus.map((s) => [s.code, `"${s.name}"`, s.department, `"${s.semester}"`, `${s.coveragePct}%`, s.credits]);
    } else if (activeTab === "notes") {
      headers = ["ID", "Title", "Type", "Subject", "Department", "Size", "Uploaded By"];
      rows = resources.map((r) => [r.id, `"${r.title}"`, r.type, `"${r.subject}"`, r.department, r.size, `"${r.uploadedBy}"`]);
    } else if (activeTab === "videos") {
      headers = ["ID", "Title", "Subject", "Duration", "Instructor", "URL"];
      rows = videos.map((v) => [v.id, `"${v.title}"`, `"${v.subject}"`, v.duration, `"${v.instructor}"`, v.videoUrl]);
    } else {
      headers = ["ID", "Title/Topic", "Subject", "Department", "Date/Time"];
      rows = classes.map((c) => [c.id, `"${c.topic}"`, `"${c.subject}"`, c.department, `"${c.date} ${c.time}"`]);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported LMS data to CSV!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <BookOpen className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Learning Management System (LMS)
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Super Admin Institutional Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Course notes, video streams, assignments grading, MCQ online quizzes, doubts forum, and live classes.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllLMS}
            disabled={loading}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <Download className="size-3.5" /> Export LMS Summary
          </Button>

          {activeTab === "notes" && (
            <Button size="sm" onClick={() => setIsAddResourceOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow">
              <Plus className="size-4" /> Upload Study Note
            </Button>
          )}

          {activeTab === "videos" && (
            <Button size="sm" onClick={() => setIsAddVideoOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow">
              <Plus className="size-4" /> Add Video Lecture
            </Button>
          )}

          {activeTab === "assignments" && (
            <Button size="sm" onClick={() => setIsAddAssignmentOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow">
              <Plus className="size-4" /> Launch Assignment
            </Button>
          )}

          {activeTab === "classes" && (
            <Button size="sm" onClick={() => setIsAddClassOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow">
              <Plus className="size-4" /> Schedule Stream
            </Button>
          )}
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Study Notes & PDFs</span>
            <FileText className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{resources.length} Documents</p>
          <p className="text-[0.68rem] text-muted-foreground">PDF Study Materials</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Video Lectures</span>
            <Video className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">{videos.length} Lectures</p>
          <p className="text-[0.68rem] text-muted-foreground">Recorded Video Library</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Assignments & Submissions</span>
            <FileCheck className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">{assignments.length} Assignments</p>
          <p className="text-[0.68rem] text-muted-foreground">Worksheets & Grading</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Live Virtual Classes</span>
            <VideoIcon className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">{classes.length} Classes</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">Google Meet & Zoom Streams</p>
        </div>
      </div>

      {/* 7 LMS SUBPARTS TAB SWITCHER */}
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
        <div className="flex items-center gap-1.5 w-full">
          {SUBPARTS.map((sp) => {
            const Icon = sp.icon;
            return (
              <button
                key={sp.id}
                onClick={() => setActiveTab(sp.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === sp.id
                    ? "bg-card text-primary shadow-sm border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                {sp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBMODULE 1: CURRICULUM & SYLLABUS */}
      {activeTab === "curriculum" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syllabus.map((s) => (
              <div key={s.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/10 text-primary font-mono text-xs">{s.code}</Badge>
                  <Badge variant="outline" className="font-mono text-xs">{s.regulation}</Badge>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{s.name}</h3>
                  <p className="text-xs text-muted-foreground">{s.department} &middot; {s.semester}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground font-sans">Syllabus Completion Coverage:</span>
                    <span className="font-bold text-primary">{s.coveragePct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${s.coveragePct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMODULE 2: STUDY NOTES & PDF CATALOG */}
      {activeTab === "notes" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <FileText className="size-4 text-primary" /> Study Notes & Official PDF Catalog
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Resource Title</th>
                  <th className="py-3 px-3">Subject & Dept</th>
                  <th className="py-3 px-3">File Size</th>
                  <th className="py-3 px-3">Uploaded By</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground">{r.title}</td>
                    <td className="py-3 px-3">{r.subject} ({r.department})</td>
                    <td className="py-3 px-3 font-mono text-primary font-semibold">{r.size}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{r.uploadedBy}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{r.createdAt}</td>
                    <td className="py-3 px-3 text-right pr-4">
                      <Button size="sm" onClick={() => toast.success(`Downloading "${r.title}"...`)} className="h-7 text-xs bg-brand-gradient text-white gap-1">
                        <Download className="size-3" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBMODULE 3: VIDEO LECTURES */}
      {activeTab === "videos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="aspect-video w-full rounded-xl bg-black overflow-hidden relative group">
                <iframe src={v.videoUrl} title={v.title} className="w-full h-full border-0" allowFullScreen />
              </div>
              <div>
                <Badge variant="outline" className="font-mono text-xs text-primary mb-1">{v.subject}</Badge>
                <h3 className="text-sm font-bold text-foreground">{v.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Instructor: {v.instructor} &middot; Duration: <span className="font-mono">{v.duration}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBMODULE 4: ASSIGNMENTS HUB */}
      {activeTab === "assignments" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <FileCheck className="size-4 text-primary" /> Assignments & Grading Ledger
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Assignment Title</th>
                  <th className="py-3 px-3">Subject & Dept</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3">Submissions</th>
                  <th className="py-3 px-3">Status / Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground">{a.title}</td>
                    <td className="py-3 px-3">{a.subject} ({a.department})</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{a.dueDate}</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{a.submissionCount} / {a.totalStudents} Submitted</td>
                    <td className="py-3 px-3">
                      {a.grade ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-xs">Graded: {a.grade}</Badge>
                      ) : (
                        <Badge variant="outline" className="font-mono text-xs">{a.status}</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBMODULE 5: QUIZZES & TESTS */}
      {activeTab === "quizzes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((qz) => (
            <div key={qz.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-purple-500/10 text-purple-600 font-mono text-xs">{qz.subject}</Badge>
                <Badge variant="outline" className="font-mono text-xs">{qz.durationMins} Mins</Badge>
              </div>
              <h3 className="text-base font-bold text-foreground">{qz.title}</h3>
              <p className="text-xs text-muted-foreground">Total Questions: <span className="font-bold text-foreground">{qz.questionsCount} MCQs</span> &middot; Date: {qz.date}</p>
              {qz.score && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-700 font-sans">Average Class Score:</span>
                  <span className="font-bold text-sm text-emerald-700">{qz.score}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SUBMODULE 6: DISCUSSION FORUM */}
      {activeTab === "forum" && (
        <div className="space-y-4">
          {forum.map((post) => (
            <div key={post.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary font-mono text-xs">{post.category}</Badge>
                <span className="text-xs text-muted-foreground font-mono">{post.date}</span>
              </div>
              <h3 className="text-base font-bold text-foreground">{post.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{post.content}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                <span className="font-medium text-foreground">Posted by {post.author} ({post.role})</span>
                <span className="text-primary font-bold">{post.comments.length} Responses</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBMODULE 7: VIRTUAL CLASSES */}
      {activeTab === "classes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary font-mono text-xs">{c.subject}</Badge>
                <Badge className={c.status === "Live" ? "bg-red-500/10 text-red-600 border-red-500/20 font-bold animate-pulse" : "bg-blue-500/10 text-blue-600"}>
                  {c.status}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-foreground">{c.topic}</h3>
              <p className="text-xs text-muted-foreground">Instructor: <span className="font-semibold text-foreground">{c.instructor}</span></p>
              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs font-mono">
                <span className="text-muted-foreground">{c.date} ({c.time})</span>
                <Button size="sm" asChild className="h-7 text-xs bg-brand-gradient text-white gap-1">
                  <a href={c.link} target="_blank" rel="noreferrer">
                    <ExternalLink className="size-3" /> Join Stream
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DIALOG: UPLOAD RESOURCE MODAL */}
      <Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Upload Study Note / PDF
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddResourceSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Title *</Label><Input required placeholder="Unit 1 Study Notes PDF" value={resForm.title || ""} onChange={(e) => setResForm({ ...resForm, title: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Subject</Label><Input placeholder="CS401: Advanced AI" value={resForm.subject || ""} onChange={(e) => setResForm({ ...resForm, subject: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddResourceOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Upload Document</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: ADD VIDEO MODAL */}
      <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Add Video Lecture URL
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddVideoSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Lecture Title *</Label><Input required placeholder="CNN Masterclass" value={vidForm.title || ""} onChange={(e) => setVidForm({ ...vidForm, title: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Video Embed URL</Label><Input placeholder="https://www.youtube.com/embed/..." value={vidForm.videoUrl || ""} onChange={(e) => setVidForm({ ...vidForm, videoUrl: e.target.value })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddVideoOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Save Video</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: LAUNCH ASSIGNMENT MODAL */}
      <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Launch New Assignment
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAssignmentSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Assignment Title *</Label><Input required placeholder="Assignment 1: PyTorch CNN" value={asnForm.title || ""} onChange={(e) => setAsnForm({ ...asnForm, title: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Due Date</Label><Input type="date" value={asnForm.dueDate || ""} onChange={(e) => setAsnForm({ ...asnForm, dueDate: e.target.value })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddAssignmentOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Launch Assignment</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: SCHEDULE CLASS STREAM MODAL */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Schedule Google Meet / Zoom Stream
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddClassSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Topic *</Label><Input required placeholder="Live Lecture: Llama-3 Fine-tuning" value={clsForm.topic || ""} onChange={(e) => setClsForm({ ...clsForm, topic: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Stream Link (Google Meet / Zoom)</Label><Input placeholder="https://meet.google.com/..." value={clsForm.link || ""} onChange={(e) => setClsForm({ ...clsForm, link: e.target.value })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddClassOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Schedule Stream</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
