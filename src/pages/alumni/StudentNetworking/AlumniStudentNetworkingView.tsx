import React, { useState } from "react";
import { toast } from "sonner";
import {
  MessageSquare,
  ThumbsUp,
  UserCheck,
  Search,
  Plus,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  Building2,
  GraduationCap,
  Briefcase,
  Check,
  X,
  Send,
  UserPlus,
  Clock,
  BookOpen,
} from "lucide-react";
import { StudentNetworkQuestion, AlumniProfileItem } from "@/types/alumni";
import { INITIAL_ALUMNI_PROFILES } from "@/data/alumniData";
import { useRole } from "@/context/role-context";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
import { SearchBar } from "@/components/alumni/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ConnectionRequest {
  id: string;
  studentName: string;
  studentAvatar: string;
  studentDept: string;
  studentYear: string;
  alumniId: string;
  alumniName: string;
  alumniRole: string;
  alumniCompany: string;
  status: "Pending" | "Accepted" | "Rejected";
  requestedDate: string;
  note?: string;
}

interface AlumniStudentNetworkingViewProps {
  questionsList: StudentNetworkQuestion[];
  onOpenMessagingCenter?: (() => void) | undefined;
}

export const AlumniStudentNetworkingView: React.FC<AlumniStudentNetworkingViewProps> = ({
  questionsList,
  onOpenMessagingCenter,
}) => {
  const { role, externalPersona } = useRole();
  const isStudent = role === "student";
  const isAlumni = role === "external-user" || externalPersona === "alumni" || role === "staff";

  // Navigation State
  const [activeTab, setActiveTab] = useState(isStudent ? "browse" : "requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");

  // Data State
  const [questions, setQuestions] = useState<StudentNetworkQuestion[]>(questionsList);
  const [alumniProfiles] = useState<AlumniProfileItem[]>(INITIAL_ALUMNI_PROFILES);

  // Connection Requests State
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([
    {
      id: "REQ-01",
      studentName: "Aravind Kumar",
      studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      studentDept: "Computer Science (CSE)",
      studentYear: "Final Year",
      alumniId: "ALM-2020-001",
      alumniName: "Sarah Jenkins",
      alumniRole: "Senior Staff Engineer",
      alumniCompany: "Google Cloud",
      status: "Pending",
      requestedDate: "2 Hours ago",
      note: "Hi Sarah, I would love guidance on preparing for System Design interviews at Google Cloud.",
    },
    {
      id: "REQ-02",
      studentName: "Priya Patel",
      studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      studentDept: "AI & Machine Learning",
      studentYear: "3rd Year",
      alumniId: "ALM-2020-001",
      alumniName: "Sarah Jenkins",
      alumniRole: "Senior Staff Engineer",
      alumniCompany: "Google Cloud",
      status: "Accepted",
      requestedDate: "1 Day ago",
      note: "Looking for mentorship on LoRA fine-tuning and LLM deployment models.",
    },
  ]);

  // Dialog States
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<StudentNetworkQuestion | null>(null);

  // Ask Question Form State
  const [questionForm, setQuestionForm] = useState({
    title: "",
    category: "Interview Tips" as const,
    detail: "",
  });

  // Reply Answer Form State
  const [replyText, setReplyText] = useState("");

  // Handlers
  const handleSendConnectionRequest = (alumni: AlumniProfileItem) => {
    const existing = connectionRequests.find((r) => r.alumniId === alumni.id);
    if (existing) {
      toast.info(`Connection request to ${alumni.name} is already ${existing.status.toLowerCase()}.`);
      return;
    }

    const newReq: ConnectionRequest = {
      id: `REQ-${Date.now()}`,
      studentName: "Current Student (You)",
      studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      studentDept: "Computer Science (CSE)",
      studentYear: "Final Year",
      alumniId: alumni.id,
      alumniName: alumni.name,
      alumniRole: alumni.designation,
      alumniCompany: alumni.company,
      status: "Pending",
      requestedDate: "Just now",
      note: "Hello! I am requesting mentorship for career guidance.",
    };

    setConnectionRequests((prev) => [newReq, ...prev]);
    toast.success(`Connection request sent to ${alumni.name}!`, {
      description: "You will be notified once the alumni accepts your request.",
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
  };

  const handleAcceptRequest = (reqId: string, studentName: string) => {
    setConnectionRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: "Accepted" } : r))
    );
    toast.success(`Accepted connection request from ${studentName}!`, {
      description: "Private 1-on-1 chat and mentorship channels are now enabled.",
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
  };

  const handleRejectRequest = (reqId: string, studentName: string) => {
    setConnectionRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: "Rejected" } : r))
    );
    toast.info(`Declined request from ${studentName}.`);
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.title.trim()) return;

    const newQuestion: StudentNetworkQuestion = {
      id: `QNA-${Date.now()}`,
      studentName: "Aravind Kumar (You)",
      studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      studentYear: "Final Year",
      studentDept: "Computer Science (CSE)",
      category: questionForm.category,
      questionTitle: questionForm.title,
      questionDetail: questionForm.detail,
      askedDate: "Just now",
      upvotesCount: 1,
      answers: [],
    };

    setQuestions((prev) => [newQuestion, ...prev]);
    toast.success("Career question posted to Alumni Network!", {
      description: "Notified verified alumni members in your stream to answer.",
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
    setQuestionForm({ title: "", category: "Interview Tips", detail: "" });
    setIsAskModalOpen(false);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !replyText.trim()) return;

    const newAnswer = {
      id: `ANS-${Date.now()}`,
      alumniName: "Sarah Jenkins (You)",
      alumniAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      alumniRole: "Senior Staff Engineer",
      alumniCompany: "Google Cloud",
      alumniBatch: "Batch of 2020",
      answeredDate: "Just now",
      answerText: replyText,
      upvotes: 1,
    };

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedQuestion.id ? { ...q, answers: [...q.answers, newAnswer] } : q
      )
    );

    toast.success("Posted verified alumni answer!", {
      description: `Answered question for ${selectedQuestion.studentName}.`,
    });

    setReplyText("");
    setIsReplyModalOpen(false);
  };

  const handleUpvoteQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, upvotesCount: q.upvotesCount + 1 } : q))
    );
  };

  // Filtered Alumni Directory
  const filteredAlumni = alumniProfiles.filter((a) => {
    const matchesDept = selectedDept === "All" || a.dept === selectedDept;
    const matchesCompany = selectedCompany === "All" || a.company === selectedCompany;
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesCompany && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* DYNAMIC ROLE-BASED PAGE HEADER */}
      <PageHeader
        title={isStudent ? "Student ↔ Alumni Networking" : "Student Engagement Center"}
        subtitle={
          isStudent
            ? "Connect with verified alumni leaders, ask career & interview questions, and request 1-on-1 mentorship."
            : "Manage incoming student connection requests, answer career forum questions, view active mentees, and start private chats."
        }
        badgeText={isStudent ? "Student Career Bridge" : "Alumni Engagement Hub"}
        icon={MessageSquare}
        onOpenMessagingCenter={onOpenMessagingCenter}
        actions={
          isStudent ? (
            <Button
              onClick={() => setIsAskModalOpen(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
            >
              <Plus className="size-4" /> Ask Alumni a Question
            </Button>
          ) : undefined
        }
      />

      {/* SUB-NAVIGATION TABS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 font-mono text-xs">
            {isStudent
              ? [
                  { id: "browse", label: "Browse Alumni Mentors" },
                  { id: "qa", label: "Career Q&A Forum" },
                  { id: "connections", label: "My Connections & Chats" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-2 px-3.5 rounded-xl border font-bold whitespace-nowrap cursor-pointer transition-all ${
                      activeTab === tab.id
                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                        : "bg-card border-[#24356B]/30 hover:border-[#4D78FF]/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))
              : [
                  { id: "requests", label: `Student Requests (${connectionRequests.filter((r) => r.status === "Pending").length})` },
                  { id: "qa", label: "Answer Career Questions" },
                  { id: "mentees", label: `My Mentees (${connectionRequests.filter((r) => r.status === "Accepted").length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-2 px-3.5 rounded-xl border font-bold whitespace-nowrap cursor-pointer transition-all ${
                      activeTab === tab.id
                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                        : "bg-card border-[#24356B]/30 hover:border-[#4D78FF]/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={activeTab === "browse" ? "Search alumni by name, company, skill..." : "Search questions..."}
          />
        </div>

        {/* ================= STUDENT VIEW: BROWSE ALUMNI ================= */}
        {activeTab === "browse" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAlumni.map((alumni) => {
                const request = connectionRequests.find((r) => r.alumniId === alumni.id);

                return (
                  <GlassCard key={alumni.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#24356B]/30 font-sans">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={alumni.avatar} alt={alumni.name} className="size-12 rounded-2xl object-cover border border-primary/30" />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-sm text-foreground truncate">{alumni.name}</h4>
                          <p className="text-primary font-bold font-mono text-[0.72rem] truncate">
                            {alumni.designation}
                          </p>
                          <span className="text-[0.65rem] text-muted-foreground font-mono">{alumni.company} ({alumni.batch})</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">{alumni.bio}</p>

                      {/* SKILL PILLS */}
                      <div className="flex flex-wrap gap-1 font-mono text-[0.65rem]">
                        {alumni.skills.map((skill) => (
                          <span key={skill} className="p-1 px-2 rounded-lg bg-muted text-foreground border border-border">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                      <span className="text-[0.65rem] font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Verified Alumni
                      </span>

                      {request ? (
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs ${
                            request.status === "Accepted"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                              : "bg-amber-500/10 text-amber-600 border-amber-300"
                          }`}
                        >
                          {request.status === "Accepted" ? "Connected" : "Pending Request"}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleSendConnectionRequest(alumni)}
                          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                        >
                          <UserPlus className="size-3.5" /> Connect
                        </Button>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= ALUMNI VIEW: STUDENT REQUESTS QUEUE ================= */}
        {activeTab === "requests" && (
          <div className="space-y-3">
            {connectionRequests.length === 0 ? (
              <GlassCard className="p-8 text-center space-y-2 font-mono text-xs text-muted-foreground">
                <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
                <p className="font-bold text-foreground text-sm font-sans">No Pending Student Requests</p>
                <p>All student connection requests have been reviewed.</p>
              </GlassCard>
            ) : (
              connectionRequests.map((req) => (
                <GlassCard key={req.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#24356B]/30 font-sans">
                  <div className="flex items-center gap-3.5">
                    <img src={req.studentAvatar} alt={req.studentName} className="size-11 rounded-2xl object-cover border border-primary/20" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-foreground">{req.studentName}</h4>
                        <Badge variant="outline" className="font-mono text-[0.65rem] bg-blue-500/10 text-blue-600 border-blue-200">
                          {req.studentYear}
                        </Badge>
                      </div>
                      <p className="text-xs text-primary font-bold font-mono">{req.studentDept}</p>
                      {req.note && <p className="text-xs text-muted-foreground pt-1 italic">"{req.note}"</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {req.status === "Pending" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(req.id, req.studentName)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                        >
                          <Check className="size-3.5" /> Accept Request
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectRequest(req.id, req.studentName)}
                          className="h-8 text-xs text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer gap-1"
                        >
                          <X className="size-3.5" /> Decline
                        </Button>
                      </>
                    ) : (
                      <Badge
                        variant="outline"
                        className={`font-mono text-xs ${
                          req.status === "Accepted"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold"
                            : "bg-rose-500/10 text-rose-600 border-rose-300"
                        }`}
                      >
                        {req.status}
                      </Badge>
                    )}
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {/* ================= CAREER Q&A FORUM (SHARED) ================= */}
        {activeTab === "qa" && (
          <div className="space-y-4">
            {questions.map((q) => (
              <GlassCard key={q.id} className="p-5 space-y-4 border border-[#24356B]/30 font-sans">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 font-mono">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 text-[0.65rem]">
                        {q.category}
                      </Badge>
                      <span className="text-[0.68rem] text-muted-foreground">Asked by <strong>{q.studentName}</strong></span>
                    </div>
                    <span className="text-[0.65rem] text-muted-foreground">{q.askedDate}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-foreground leading-snug">{q.questionTitle}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{q.questionDetail}</p>
                </div>

                {/* VERIFIED ALUMNI ANSWERS */}
                {q.answers.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-border/60">
                    <span className="font-mono text-[0.68rem] font-bold text-primary block">
                      ✓ VERIFIED ALUMNI RESPONSE ({q.answers.length})
                    </span>

                    {q.answers.map((ans) => (
                      <div key={ans.id} className="p-3.5 rounded-2xl bg-card border border-border/70 space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img src={ans.alumniAvatar} alt={ans.alumniName} className="size-8 rounded-xl object-cover" />
                            <div>
                              <h4 className="font-extrabold text-xs text-foreground font-sans flex items-center gap-1.5">
                                {ans.alumniName}
                                <Badge className="bg-[#2563EB] text-white text-[0.6rem] px-1 py-0 h-4">Verified Alumni</Badge>
                              </h4>
                              <p className="text-[0.65rem] font-mono text-primary font-bold">
                                {ans.alumniRole} @ {ans.alumniCompany} ({ans.alumniBatch})
                              </p>
                            </div>
                          </div>
                          <span className="text-[0.62rem] font-mono text-muted-foreground">{ans.answeredDate}</span>
                        </div>

                        <p className="text-foreground leading-relaxed font-sans pl-1">{ans.answerText}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ACTION BAR */}
                <div className="pt-2 flex items-center justify-between border-t border-border/50 text-xs">
                  <button
                    onClick={() => handleUpvoteQuestion(q.id)}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary font-mono cursor-pointer transition-colors"
                  >
                    <ThumbsUp className="size-3.5" /> Upvote ({q.upvotesCount})
                  </button>

                  {isAlumni && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedQuestion(q);
                        setIsReplyModalOpen(true);
                      }}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                    >
                      <MessageSquare className="size-3.5" /> Reply to Question
                    </Button>
                  )}

                  {isStudent && onOpenMessagingCenter && (
                    <button
                      onClick={onOpenMessagingCenter}
                      className="flex items-center gap-1.5 text-[#2563EB] font-bold font-mono cursor-pointer hover:underline"
                    >
                      <MessageCircle className="size-3.5" /> Start Private 1-on-1 Chat
                    </button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* ================= ALUMNI VIEW: MY MENTEES ROSTER ================= */}
        {activeTab === "mentees" && (
          <div className="space-y-3">
            {connectionRequests.filter((r) => r.status === "Accepted").map((mentee) => (
              <GlassCard key={mentee.id} className="p-4 flex items-center justify-between gap-4 border border-[#24356B]/30 font-sans">
                <div className="flex items-center gap-3.5">
                  <img src={mentee.studentAvatar} alt={mentee.studentName} className="size-11 rounded-2xl object-cover border border-primary/20" />
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{mentee.studentName}</h4>
                    <p className="text-xs text-primary font-bold font-mono">{mentee.studentDept} ({mentee.studentYear})</p>
                    <span className="text-[0.65rem] text-muted-foreground font-mono">Mentorship Active since {mentee.requestedDate}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={onOpenMessagingCenter}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                >
                  <Send className="size-3.5" /> Send Message
                </Button>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* ASK QUESTION MODAL */}
      <Dialog open={isAskModalOpen} onOpenChange={setIsAskModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <form onSubmit={handleAskSubmit} className="space-y-3.5 text-xs font-sans">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-base">Ask Alumni Network a Question</DialogTitle>
            </DialogHeader>

            <div className="space-y-2.5 font-mono">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Question Category</label>
                <select
                  value={questionForm.category}
                  onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value as any })}
                  className="w-full h-9 p-2 rounded-xl border border-input bg-background text-xs font-mono"
                >
                  <option value="Interview Tips">Interview Tips</option>
                  <option value="Career Guidance">Career Guidance</option>
                  <option value="Higher Studies">Higher Studies</option>
                  <option value="Tech Stack">Tech Stack</option>
                  <option value="Resume Feedback">Resume Feedback</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Question Title</label>
                <Input
                  placeholder="E.g., How should I prepare for Google System Design rounds?"
                  value={questionForm.title}
                  onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                  className="h-9 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Detailed Description / Context</label>
                <textarea
                  placeholder="Provide background information or specific topics you need help with..."
                  value={questionForm.detail}
                  onChange={(e) => setQuestionForm({ ...questionForm, detail: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-input bg-background font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAskModalOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer">
                Post Question
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* REPLY TO QUESTION MODAL FOR ALUMNI */}
      {selectedQuestion && (
        <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6">
            <form onSubmit={handleReplySubmit} className="space-y-3.5 text-xs font-sans">
              <DialogHeader>
                <DialogTitle className="font-extrabold text-base">Reply as Verified Alumni</DialogTitle>
                <p className="text-xs text-primary font-mono font-bold">{selectedQuestion.questionTitle}</p>
              </DialogHeader>

              <div className="space-y-2.5 font-mono">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Your Professional Answer</label>
                  <textarea
                    placeholder="Provide actionable career guidance or interview preparation advice..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 rounded-xl border border-input bg-background font-sans text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsReplyModalOpen(false)} className="rounded-xl cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer">
                  Submit Verified Answer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
