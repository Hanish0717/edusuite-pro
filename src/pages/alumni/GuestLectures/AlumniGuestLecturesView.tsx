import React, { useState } from "react";
import { toast } from "sonner";
import {
  Award,
  Video,
  UserCheck,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  Plus,
  Download,
  Users,
  Building2,
  FileCheck2,
} from "lucide-react";
import { GuestLectureSession } from "@/types/alumni";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { StatCard } from "@/components/alumni/cards/StatCard";
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

interface AlumniGuestLecturesViewProps {
  sessionsList: GuestLectureSession[];
  onOpenMessagingCenter?: (() => void) | undefined;
}

export const AlumniGuestLecturesView: React.FC<AlumniGuestLecturesViewProps> = ({
  sessionsList,
  onOpenMessagingCenter,
}) => {
  const [sessions, setSessions] = useState<GuestLectureSession[]>(sessionsList);
  const [activeSubTab, setActiveSubTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<GuestLectureSession | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Offer Session Form State
  const [offerForm, setOfferForm] = useState({
    title: "Building Large-Scale Distributed Cloud Microservices",
    sessionType: "Technical Workshop" as const,
    targetDepartment: "Computer Science & IT",
    scheduledDate: "2026-08-28",
    scheduledTime: "04:00 PM IST",
    venueOrLink: "Main University Auditorium (Capacity: 1,200)",
    description: "Hands-on masterclass covering gRPC, Kubernetes microservices, and fault-tolerant architecture.",
  });

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: GuestLectureSession = {
      id: `LEC-${Date.now()}`,
      speakerName: "Sarah Jenkins (You)",
      speakerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      speakerRole: "Senior Staff Engineer",
      speakerCompany: "Google Cloud",
      speakerBatch: "Batch of 2020",
      title: offerForm.title,
      sessionType: offerForm.sessionType,
      targetDepartment: offerForm.targetDepartment,
      scheduledDate: offerForm.scheduledDate,
      scheduledTime: offerForm.scheduledTime,
      venueOrLink: offerForm.venueOrLink,
      status: "Proposed",
      registeredCount: 0,
      description: offerForm.description,
    };

    setSessions((prev) => [newSession, ...prev]);
    toast.success(`Offered guest lecture: ${offerForm.title}!`, {
      description: `Submitted for review. Reserved Venue: ${offerForm.venueOrLink}`,
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
    setIsOfferModalOpen(false);
  };

  const handleStudentRegister = (session: GuestLectureSession) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === session.id ? { ...s, registeredCount: s.registeredCount + 1 } : s
      )
    );
    toast.success(`Registered for ${session.title}!`, {
      description: `Access link & calendar invite sent. Venue: ${session.venueOrLink}`,
    });
    setIsRegisterModalOpen(false);
  };

  const handleDownloadCertificate = (session: GuestLectureSession) => {
    const certHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Guest Lecture Certificate - ${session.title}</title>
  <style>
    body { font-family: 'Georgia', serif; background: #0B132B; color: #FFFFFF; padding: 40px; display: flex; justify-content: center; }
    .cert { background: linear-gradient(135deg, #0F1B44 0%, #1A285D 50%, #2563EB 100%); border: 4px double #4D78FF; border-radius: 28px; padding: 40px; max-width: 650px; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.6); }
    .org { font-size: 14px; font-weight: bold; letter-spacing: 3px; color: #4D78FF; text-transform: uppercase; }
    h1 { font-size: 26px; margin: 15px 0 10px 0; color: #FFFFFF; }
    p { font-size: 14px; color: #CBD5E1; line-height: 1.6; }
    .name { font-size: 22px; font-weight: bold; color: #4D78FF; text-decoration: underline; margin: 10px 0; }
    .footer { margin-top: 30px; pt-20px; border-top: 1px dashed rgba(255,255,255,0.2); font-size: 12px; color: #94A3B8; }
    .btn { background: #2563EB; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; font-family: sans-serif; cursor: pointer; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="cert">
    <div class="org">EduSuite Pro University — Directorate of Academic Affairs</div>
    <h1>CERTIFICATE OF INDUSTRY SPEAKER EXCELLENCE</h1>
    <p>This certificate is proudly awarded to</p>
    <div class="name">${session.speakerName} (${session.speakerCompany})</div>
    <p>for delivering an outstanding technical lecture titled</p>
    <p><strong>"${session.title}"</strong></p>
    <p>Target Audience: ${session.targetDepartment} • Conducted on: ${session.scheduledDate}</p>
    <div class="footer">
      Verified Certificate ID: CERT-GUEST-${session.id}
      <br/><button class="btn" onclick="window.print()">Print / Save Certificate PDF</button>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([certHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Certificate_Guest_Lecture_${session.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded Official Speaker Certificate for ${session.title}!`);
  };

  const handleScheduleSession = (id: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Scheduled" } : s))
    );
    toast.success(`Faculty & Admin approved and scheduled: ${title}!`, {
      description: "College campus hall allocated & event published to student portals.",
    });
  };

  const filteredSessions = sessions.filter((s) => {
    if (activeSubTab === "requests") {
      return s.status === "Proposed" || s.status === "Approved";
    }
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speakerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sessionType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guest Lectures & Industry Sessions"
        subtitle="Alumni guest speakers, technical workshops, career guidance keynotes, and student certificates."
        badgeText="Faculty & Alumni Academic Hub"
        icon={Award}
        onOpenMessagingCenter={onOpenMessagingCenter}
        actions={
          <Button
            onClick={() => setIsOfferModalOpen(true)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
          >
            <Plus className="size-4" /> Offer a Guest Session
          </Button>
        }
      />

      {/* SUB-DASHBOARD STATISTICS CARDS */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Upcoming Sessions" value="8" change="Scheduled This Month" icon={Calendar} />
        <StatCard title="Total Speakers" value="42" change="Verified Alumni Leaders" icon={UserCheck} />
        <StatCard title="Registered Students" value="650" change="Active Registrations" icon={Users} />
        <StatCard title="Average Rating" value="4.9 / 5.0" change="From Feedback Forms" icon={Star} />
        <StatCard title="Certificates Issued" value="420" change="Verified PDFs" icon={FileCheck2} />
      </div>

      {/* SUB-NAVIGATION PILLS & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 font-mono text-xs">
            {[
              { id: "upcoming", label: "Upcoming Sessions" },
              { id: "requests", label: "Session Requests & Offers" },
              { id: "webinars", label: "Webinar History" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`p-2 px-3.5 rounded-xl border font-bold whitespace-nowrap cursor-pointer transition-all ${
                  activeSubTab === tab.id
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
            placeholder="Search sessions by topic or speaker..."
          />
        </div>

        {/* SESSIONS GRID */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map((session) => (
            <GlassCard key={session.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#24356B]/30 font-sans">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 text-[0.65rem] font-mono">
                    {session.sessionType}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[0.65rem] font-mono ${
                      session.status === "Scheduled" || session.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                        : "bg-amber-500/10 text-amber-600 border-amber-300"
                    }`}
                  >
                    {session.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <img src={session.speakerAvatar} alt={session.speakerName} className="size-11 rounded-2xl object-cover border border-primary/20" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-sm text-foreground truncate">{session.speakerName}</h4>
                    <p className="text-primary font-bold font-mono text-[0.72rem] truncate">
                      {session.speakerRole} @ {session.speakerCompany}
                    </p>
                    <span className="text-[0.65rem] text-muted-foreground font-mono">{session.speakerBatch}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-foreground leading-snug">{session.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{session.description}</p>
                </div>

                <div className="space-y-1 font-mono text-[0.72rem] text-muted-foreground pt-1 border-t border-border/60">
                  <p>📅 Date: <strong className="text-foreground">{session.scheduledDate}</strong> ({session.scheduledTime})</p>
                  <p>📍 Venue/Link: <strong className="text-[#2563EB]">{session.venueOrLink}</strong></p>
                  <p>👥 Target: <strong className="text-foreground">{session.targetDepartment}</strong></p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/60">
                <span className="text-[0.68rem] font-mono text-muted-foreground">
                  <strong>{session.registeredCount}</strong> Students Registered
                </span>

                <div className="flex items-center gap-1.5">
                  {session.status !== "Scheduled" && (
                    <Button
                      size="sm"
                      onClick={() => handleScheduleSession(session.id, session.title)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                    >
                      <CheckCircle2 className="size-3.5" /> Schedule &amp; Assign Hall
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedSession(session);
                      setIsRegisterModalOpen(true);
                    }}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-8 text-xs rounded-xl cursor-pointer"
                  >
                    Register
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadCertificate(session)}
                    className="h-8 text-xs rounded-xl cursor-pointer gap-1"
                  >
                    <Download className="size-3" /> Certificate
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* OFFER GUEST SESSION MODAL */}
      <Dialog open={isOfferModalOpen} onOpenChange={setIsOfferModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <form onSubmit={handleOfferSubmit} className="space-y-3.5 text-xs font-sans">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-base">Offer an Alumni Guest Session</DialogTitle>
            </DialogHeader>

            <div className="space-y-2.5 font-mono">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Session Title / Topic</label>
                <Input
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Target Department</label>
                  <Input
                    value={offerForm.targetDepartment}
                    onChange={(e) => setOfferForm({ ...offerForm, targetDepartment: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Proposed Date</label>
                  <Input
                    type="date"
                    value={offerForm.scheduledDate}
                    onChange={(e) => setOfferForm({ ...offerForm, scheduledDate: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">College Event Venue / Hall</label>
                <select
                  value={offerForm.venueOrLink}
                  onChange={(e) => setOfferForm({ ...offerForm, venueOrLink: e.target.value })}
                  className="w-full h-9 p-2 rounded-xl border border-input bg-background font-mono text-xs"
                >
                  <option value="Main University Auditorium (Capacity: 1,200)">Main University Auditorium (Capacity: 1,200)</option>
                  <option value="Central Science Seminar Hall (Capacity: 450)">Central Science Seminar Hall (Capacity: 450)</option>
                  <option value="Incubation Center Conference Room (Capacity: 250)">Incubation Center Conference Room (Capacity: 250)</option>
                  <option value="ECE Smart Classroom 302 (Capacity: 120)">ECE Smart Classroom 302 (Capacity: 120)</option>
                  <option value="Mechanical Engineering Workshop Hall (Capacity: 300)">Mechanical Engineering Workshop Hall (Capacity: 300)</option>
                  <option value="Virtual Campus Webcast (Zoom Live Stream)">Virtual Campus Webcast (Zoom Live Stream)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Session Abstract / Details</label>
                <textarea
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-input bg-background font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsOfferModalOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer">
                Submit Session Offer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* STUDENT REGISTRATION MODAL */}
      {selectedSession && (
        <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6">
            <div className="space-y-4 font-sans text-xs">
              <DialogHeader>
                <DialogTitle className="font-extrabold text-base">Register for {selectedSession.title}</DialogTitle>
                <p className="text-xs text-primary font-mono font-bold">Speaker: {selectedSession.speakerName} ({selectedSession.speakerCompany})</p>
              </DialogHeader>

              <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1 font-mono">
                <p>📅 Date &amp; Time: <strong>{selectedSession.scheduledDate} ({selectedSession.scheduledTime})</strong></p>
                <p>📍 Location: <strong>{selectedSession.venueOrLink}</strong></p>
                <p>🎓 Target: <strong>{selectedSession.targetDepartment}</strong></p>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsRegisterModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={() => handleStudentRegister(selectedSession)} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl">
                  Confirm Registration
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
