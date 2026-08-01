import { useState } from "react";
import {
  Video,
  Users,
  Send,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  Building,
  Calendar,
  Sparkles,
  RefreshCw,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface GlobalInterviewRecord {
  id: string;
  candidateName: string;
  rollNo: string;
  department: string;
  company: string;
  roundType: "Technical Round 1" | "Technical Round 2" | "HR Round";
  panelName: string;
  interviewer: string;
  slotTime: string;
  roomLink: string;
  status: "Scheduled" | "Completed" | "Pending Feedback";
  rating: number;
  avatar: string;
}

const INITIAL_INTERVIEWS: GlobalInterviewRecord[] = [
  {
    id: "INT-201",
    candidateName: "Aditya Sharma",
    rollNo: "2022CSE188",
    department: "CSE",
    company: "Google Cloud India",
    roundType: "Technical Round 1",
    panelName: "Panel A (Core Systems)",
    interviewer: "Dr. Ravi Kumar",
    slotTime: "09:30 AM IST",
    roomLink: "TPO Boardroom 1 / Meet 1",
    status: "Completed",
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "INT-202",
    candidateName: "Sneha Reddy",
    rollNo: "2022ECE042",
    department: "ECE",
    company: "Microsoft",
    roundType: "HR Round",
    panelName: "Panel C (University HR)",
    interviewer: "David Miller",
    slotTime: "11:30 AM IST",
    roomLink: "Executive Suite A / Meet 3",
    status: "Scheduled",
    rating: 4.6,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
];

export function PlacementInterviewsWorkspace() {
  const [interviews, setInterviews] = useState<GlobalInterviewRecord[]>(INITIAL_INTERVIEWS);
  const [searchQuery, setSearchQuery] = useState("");

  // Schedule Interview Dedicated Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [candName, setCandName] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [roundType, setRoundType] = useState<"Technical Round 1" | "Technical Round 2" | "HR Round">("Technical Round 1");
  const [panelName, setPanelName] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [roomLink, setRoomLink] = useState("");

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInt: GlobalInterviewRecord = {
      id: `INT-${Date.now().toString().slice(-3)}`,
      candidateName: candName || "Candidate",
      rollNo: "2022CSE200",
      department: "CSE",
      company: targetCompany || "Google Cloud",
      roundType,
      panelName: panelName || "Panel A",
      interviewer: interviewerName || "Interviewer",
      slotTime: slotTime || "10:00 AM IST",
      roomLink: roomLink || "Google Meet Link",
      status: "Scheduled",
      rating: 4.5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    };
    setInterviews([newInt, ...interviews]);
    setIsScheduleModalOpen(false);
    toast.success(`Scheduled interview slot for ${newInt.candidateName}`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-brand-gradient text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0">
              <Video className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-600 text-white font-mono text-[0.7rem] animate-pulse">
                  ● Live Interview Sessions
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem]">
                  68 Shortlisted Candidates
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Global Interview Management Center
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Schedule candidate rounds, assign corporate interview panels, allocate virtual/physical rooms, and track ratings.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS — DEDICATED RECRUITMENT WORKFLOW */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setIsScheduleModalOpen(true)}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Video className="size-4" /> Schedule Interview
            </Button>
            <Button
              onClick={() => toast.info("Assigned corporate recruiter panels")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Users className="size-4" /> Assign Panel
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Notified candidates with interview links & slots")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Send className="size-3.5" /> Notify Candidates
            </Button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interview roster by candidate, company, or panel..."
            className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
          />
        </div>
      </div>

      {/* INTERVIEWS DIRECTORY TABLE */}
      <Panel title="Global Candidate Interview Roster & Panels">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                <th className="p-3">Candidate</th>
                <th className="p-3">Company & Round</th>
                <th className="p-3">Assigned Panel</th>
                <th className="p-3">Interviewer</th>
                <th className="p-3">Time Slot & Room</th>
                <th className="p-3 text-center">Score Rating</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {interviews.map((i) => (
                <tr key={i.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 border border-border">
                        <AvatarImage src={i.avatar} />
                        <AvatarFallback>{i.candidateName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-foreground text-xs">{i.candidateName}</p>
                        <span className="text-[0.65rem] font-mono text-muted-foreground">{i.rollNo}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono">
                    <p className="font-bold text-foreground">{i.company}</p>
                    <span className="text-[0.68rem] text-primary font-semibold">{i.roundType}</span>
                  </td>
                  <td className="p-3 font-mono text-muted-foreground font-semibold">{i.panelName}</td>
                  <td className="p-3 font-mono font-bold text-foreground">{i.interviewer}</td>
                  <td className="p-3 font-mono">
                    <p className="font-bold text-purple-600">{i.slotTime}</p>
                    <span className="text-[0.65rem] text-muted-foreground">{i.roomLink}</span>
                  </td>
                  <td className="p-3 text-center font-mono font-extrabold text-amber-500">
                    ⭐ {i.rating} / 5.0
                  </td>
                  <td className="p-3 font-mono">
                    <Badge className={i.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"}>
                      {i.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => toast.info(`Rescheduled slot for ${i.candidateName}`)} className="h-7 text-xs rounded-xl cursor-pointer">
                      Reschedule
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* SCHEDULE INTERVIEW DEDICATED MODAL */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Candidate Interview Session</DialogTitle>
            <DialogDescription>Assign candidate, interview round, corporate panel, and meeting location.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleSubmit} className="space-y-3 pt-2 text-xs">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-semibold">Candidate Name</label>
                <Input value={candName} onChange={(e) => setCandName(e.target.value)} placeholder="e.g. Aditya Sharma" required className="h-9 text-xs rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Corporate Company</label>
                <Input value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)} placeholder="e.g. Google Cloud India" required className="h-9 text-xs rounded-xl" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-semibold">Round Type</label>
                <select value={roundType} onChange={(e) => setRoundType(e.target.value as any)} className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold">
                  <option value="Technical Round 1">Technical Round 1</option>
                  <option value="Technical Round 2">Technical Round 2</option>
                  <option value="HR Round">HR Round</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Panel Name</label>
                <Input value={panelName} onChange={(e) => setPanelName(e.target.value)} placeholder="e.g. Panel A (Core Software)" required className="h-9 text-xs rounded-xl" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-semibold">Interviewer Name / Email</label>
                <Input value={interviewerName} onChange={(e) => setInterviewerName(e.target.value)} placeholder="e.g. Dr. Ravi Kumar" required className="h-9 text-xs rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Time Slot</label>
                <Input value={slotTime} onChange={(e) => setSlotTime(e.target.value)} placeholder="e.g. 10:30 AM IST" required className="h-9 text-xs rounded-xl" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Physical Room / Virtual Link</label>
              <Input value={roomLink} onChange={(e) => setRoomLink(e.target.value)} placeholder="e.g. TPO Boardroom 1 / https://meet.google.com/abc-xyz" required className="h-9 text-xs rounded-xl" />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer">
                Confirm & Schedule Interview
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
