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
  Share2,
} from "lucide-react";
import { StudentNetworkQuestion } from "@/types/alumni";
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

interface AlumniStudentNetworkingViewProps {
  questionsList: StudentNetworkQuestion[];
  onOpenMessagingCenter?: (() => void) | undefined;
}

export const AlumniStudentNetworkingView: React.FC<AlumniStudentNetworkingViewProps> = ({
  questionsList,
  onOpenMessagingCenter,
}) => {
  const [questions, setQuestions] = useState<StudentNetworkQuestion[]>(questionsList);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  // Ask Question Form State
  const [questionForm, setQuestionForm] = useState({
    title: "",
    category: "Interview Tips" as const,
    detail: "",
  });

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

  const handleUpvoteQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, upvotesCount: q.upvotesCount + 1 } : q))
    );
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory = activeCategory === "All" || q.category === activeCategory;
    const matchesSearch =
      q.questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionDetail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Student ↔ Alumni Networking & Q&A Forum"
        subtitle="Ask career questions, get verified advice from alumni leaders, and build 1-on-1 professional connections."
        badgeText="Student Career Bridge"
        icon={MessageSquare}
        onOpenMessagingCenter={onOpenMessagingCenter}
        actions={
          <Button
            onClick={() => setIsAskModalOpen(true)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
          >
            <Plus className="size-4" /> Ask Alumni a Question
          </Button>
        }
      />

      {/* CATEGORIES & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 font-mono text-xs">
          {["All", "Interview Tips", "Career Guidance", "Higher Studies", "Tech Stack", "Resume Feedback"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`p-2 px-3.5 rounded-xl border font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeCategory === cat
                  ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                  : "bg-card border-[#24356B]/30 hover:border-[#4D78FF]/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search questions by topic..."
        />
      </div>

      {/* QUESTIONS & ANSWERS THREADS */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
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

              {onOpenMessagingCenter && (
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
    </div>
  );
};
