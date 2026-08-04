import React, { useState } from "react";
import { Webinar } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Users,
  UserCheck,
  Check,
  Radio,
  Share2,
  Bookmark,
  Sparkles,
  MessageSquare,
  Send,
  Building,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface WebinarDetailModalProps {
  webinar: Webinar | null;
  isOpen: boolean;
  onClose: () => void;
  onRegisterToggle: (webinarId: string) => void;
  onJoinLive: (webinar: Webinar) => void;
  newlyRegisteredIds?: string[];
  registeringId?: string | null;
}

export function WebinarDetailModal({
  webinar,
  isOpen,
  onClose,
  onRegisterToggle,
  onJoinLive,
  newlyRegisteredIds = [],
  registeringId = null,
}: WebinarDetailModalProps) {
  const [userQuestion, setUserQuestion] = useState("");
  const [questions, setQuestions] = useState([
    { id: "q1", author: "Rohan V.", question: "Will the source code and slide deck be shared afterwards?", votes: 14 },
    { id: "q2", author: "Ananya K.", question: "How does LoRA fine-tuning compare with full parameter fine-tuning in production?", votes: 9 },
  ]);

  if (!webinar) return null;

  const seatsLeft = webinar.totalSeats - webinar.registeredCount;
  const percentFilled = Math.min(100, Math.round((webinar.registeredCount / webinar.totalSeats) * 100));

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setQuestions([
      ...questions,
      { id: `q-${Date.now()}`, author: "You (Student)", question: userQuestion.trim(), votes: 1 },
    ]);
    setUserQuestion("");
    toast.success("Question submitted to speaker queue!");
  };

  const handleUpvote = (id: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q)));
    toast.info("Upvoted question!");
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Webinar link copied to clipboard!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[24px] p-0 border border-border bg-card text-card-foreground shadow-2xl">
        {/* Top Header Banner */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-950">
          <img
            src={webinar.bannerImage}
            alt={webinar.title}
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge className="bg-indigo-600 text-white font-semibold text-xs">
              {webinar.category}
            </Badge>
            {webinar.status === "live" && (
              <Badge className="bg-red-600 text-white font-bold text-xs animate-pulse">
                <Radio className="size-3 mr-1" /> LIVE NOW
              </Badge>
            )}
          </div>

          <button
            onClick={handleShare}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md transition-colors"
            title="Share Webinar"
          >
            <Share2 className="size-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white">
              {webinar.title}
            </h2>
            <p className="text-xs text-slate-300 line-clamp-1">{webinar.subtitle || webinar.description}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-muted/60 border border-border/50 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Date</span>
              <span className="font-bold text-foreground">{webinar.startDate ? new Date(webinar.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ""}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Time</span>
              <span className="font-bold text-foreground">{webinar.displayTime.split("-")[0]}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Duration</span>
              <span className="font-bold text-foreground">{webinar.duration}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Available Seats</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{seatsLeft} left</span>
            </div>
          </div>

          {/* Registration Box */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Seat Availability
              </span>
              <p className="text-xs text-muted-foreground">
                {webinar.registeredCount} of {webinar.totalSeats} students registered ({percentFilled}% filled)
              </p>
              <Progress value={percentFilled} className="h-1.5 w-48 mt-1" />
            </div>

            {webinar.status === "live" ? (
              <Button
                onClick={() => {
                  onClose();
                  onJoinLive(webinar);
                }}
                className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                <Radio className="size-4 mr-2 animate-pulse" /> Join Live Stream Now
              </Button>
            ) : (
              <Button
                disabled={webinar.isRegistered || registeringId === webinar.id}
                onClick={() => onRegisterToggle(webinar.id)}
                className={`h-11 px-6 rounded-xl font-bold text-xs shadow-md transition-all ${
                  webinar.isRegistered
                    ? "bg-emerald-600 text-white opacity-95 cursor-default pointer-events-none"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {registeringId === webinar.id ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" /> Loading...
                  </>
                ) : webinar.isRegistered ? (
                  newlyRegisteredIds.includes(webinar.id) ? (
                    <>
                      <Check className="size-4 mr-2" /> Registered ✓
                    </>
                  ) : (
                    <>
                      <Check className="size-4 mr-2" /> Already Registered
                    </>
                  )
                ) : (
                  <>
                    <UserCheck className="size-4 mr-2" /> Reserve My Spot
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Speaker Info */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Featured Speaker
            </h3>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60">
              <img
                src={webinar.speaker.avatar}
                alt={webinar.speaker.name}
                className="size-14 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">{webinar.speaker.name}</h4>
                  <Badge variant="outline" className="text-[10px] text-indigo-600 dark:text-indigo-400 border-indigo-500/30">
                    <Building className="size-3 mr-1" /> {webinar.speaker.organization}
                  </Badge>
                </div>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {webinar.speaker.role}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {webinar.speaker.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Agenda List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Session Agenda & Key Takeaways
            </h3>
            <div className="space-y-2">
              {(webinar.agenda || []).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 text-xs">
                  <span className="flex items-center justify-center size-5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ask Speaker Q&A Section */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Audience Questions & Pre-Queries</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">{questions.length} questions</span>
            </h3>

            <form onSubmit={handleAddQuestion} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask the speaker a question in advance..."
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-muted border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <Button type="submit" size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-4">
                <Send className="size-3.5 mr-1" /> Ask
              </Button>
            </form>

            <div className="space-y-2">
              {questions.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">{q.author}</span>
                    <p className="text-foreground font-medium">{q.question}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpvote(q.id)}
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-indigo-600"
                  >
                    ▲ {q.votes}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
