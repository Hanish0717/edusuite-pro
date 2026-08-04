import React, { useState } from "react";
import { toast } from "sonner";
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Building2,
  FileText,
  Users,
  Award,
  Video,
  Check,
  Paperclip,
} from "lucide-react";
import { GuestLectureSession, DepartmentAlumniCoordinator } from "@/types/alumni";
import { DEPARTMENT_COORDINATORS_MAP } from "@/data/alumniData";
import { ProposalStatusTimeline } from "@/components/alumni/widgets/ProposalStatusTimeline";
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

interface DepartmentCoordinatorGuestLecturesViewProps {
  sessions: GuestLectureSession[];
  onUpdateSessionStatus: (
    id: string,
    newStatus: GuestLectureSession["status"],
    updatedData?: Partial<GuestLectureSession>
  ) => void;
}

export const DepartmentCoordinatorGuestLecturesView: React.FC<DepartmentCoordinatorGuestLecturesViewProps> = ({
  sessions,
  onUpdateSessionStatus,
}) => {
  const [selectedDept, setSelectedDept] = useState("Artificial Intelligence & Machine Learning (AI & ML)");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSessionForSchedule, setSelectedSessionForSchedule] = useState<GuestLectureSession | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Schedule Modal Form
  const [scheduleForm, setScheduleForm] = useState({
    scheduledDate: "2026-08-28",
    scheduledTime: "04:00 PM IST",
    venueOrLink: "Main University Auditorium (Capacity: 1,200)",
    maxCapacity: 500,
  });

  const activeCoordinator = DEPARTMENT_COORDINATORS_MAP[selectedDept];

  // Department-isolated filtering
  const deptSessions = sessions.filter((s) => {
    const matchesDept = selectedDept === "All" || s.targetDepartment === selectedDept;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speakerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const pendingProposalsCount = deptSessions.filter(
    (s) => s.status === "Submitted" || s.status === "Assigned" || s.status === "Under Review"
  ).length;

  const handleApprove = (session: GuestLectureSession) => {
    onUpdateSessionStatus(session.id, "Approved");
    toast.success(`Approved guest lecture proposal for ${session.speakerName}!`, {
      description: "Coordinator review complete. Ready for session scheduling.",
    });
  };

  const handleReject = (session: GuestLectureSession) => {
    onUpdateSessionStatus(session.id, "Rejected");
    toast.error(`Rejected proposal for ${session.speakerName}.`);
  };

  const handleRequestChanges = (session: GuestLectureSession) => {
    onUpdateSessionStatus(session.id, "Changes Requested");
    toast.info(`Requested changes from ${session.speakerName}.`);
  };

  const handlePublishScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionForSchedule) return;

    onUpdateSessionStatus(selectedSessionForSchedule.id, "Published", {
      scheduledDate: scheduleForm.scheduledDate,
      scheduledTime: scheduleForm.scheduledTime,
      venueOrLink: scheduleForm.venueOrLink,
      maxCapacity: scheduleForm.maxCapacity,
    });

    toast.success(`Published guest lecture: ${selectedSessionForSchedule.title}!`, {
      description: `Venue allocated: ${scheduleForm.venueOrLink}. Published to student portals.`,
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });

    setIsScheduleModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ACTIVE COORDINATOR PROFILE BANNER */}
      {activeCoordinator && (
        <GlassCard className="p-5 border border-[#2563EB]/40 bg-[#0F1B44] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={activeCoordinator.avatar}
              alt={activeCoordinator.coordinatorName}
              className="size-14 rounded-2xl object-cover border-2 border-[#4D78FF] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">{activeCoordinator.coordinatorName}</h3>
                <Badge className="bg-[#2563EB] text-white font-mono text-[0.65rem] px-2">
                  Department Alumni Coordinator
                </Badge>
              </div>
              <p className="text-xs font-mono text-[#4D78FF] font-bold">{activeCoordinator.title}</p>
              <p className="text-xs text-slate-300 font-mono pt-0.5">{activeCoordinator.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs w-full sm:w-auto justify-end">
            <span className="text-slate-300">Switch Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-9 p-2 rounded-xl border border-white/20 bg-slate-900 text-white font-mono text-xs focus:outline-none"
            >
              {Object.keys(DEPARTMENT_COORDINATORS_MAP).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
              <option value="All">All Departments (Super Admin)</option>
            </select>
          </div>
        </GlassCard>
      )}

      {/* KPI STAT CARDS */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Pending Proposals" value={pendingProposalsCount.toString()} change="Requires Coordinator Action" icon={Clock} />
        <StatCard title="Approved Sessions" value={deptSessions.filter((s) => s.status === "Approved").length.toString()} change="Awaiting Hall Schedule" icon={CheckCircle2} />
        <StatCard title="Published Sessions" value={deptSessions.filter((s) => s.status === "Published").length.toString()} change="Live on Student Portal" icon={Calendar} />
        <StatCard title="Completed Sessions" value={deptSessions.filter((s) => s.status === "Completed").length.toString()} change="With Certificates" icon={Award} />
        <StatCard title="Total Attendees" value={deptSessions.reduce((acc, s) => acc + s.registeredCount, 0).toString()} change="Registered Students" icon={Users} />
      </div>

      {/* PROPOSALS QUEUE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
            <UserCheck className="size-5 text-[#2563EB]" /> Department Proposal Review Queue ({deptSessions.length})
          </h3>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search proposals by title or speaker..."
          />
        </div>

        {deptSessions.length === 0 ? (
          <GlassCard className="p-8 text-center space-y-2 font-mono text-xs text-muted-foreground">
            <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
            <p className="font-bold text-foreground text-sm font-sans">No Pending Guest Lecture Proposals</p>
            <p>No proposals currently assigned to {selectedDept}.</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {deptSessions.map((session) => (
              <GlassCard key={session.id} className="p-5 space-y-4 border border-[#24356B]/30 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img src={session.speakerAvatar} alt={session.speakerName} className="size-12 rounded-2xl object-cover border border-primary/30" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-foreground">{session.speakerName}</h4>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 font-mono text-[0.65rem]">
                          {session.sessionType}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`font-mono text-[0.65rem] ${
                            session.status === "Published"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold"
                              : "bg-amber-500/10 text-amber-600 border-amber-300"
                          }`}
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-primary font-bold font-mono text-xs pt-0.5">
                        {session.speakerRole} @ {session.speakerCompany} ({session.speakerBatch})
                      </p>
                    </div>
                  </div>

                  {session.presentationFile && (
                    <div className="flex items-center gap-1.5 p-2 px-3 bg-card rounded-xl border border-border text-xs font-mono text-muted-foreground">
                      <Paperclip className="size-3.5 text-[#2563EB]" />
                      <span className="truncate max-w-[180px]">{session.presentationFile}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-foreground leading-snug">{session.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{session.description}</p>
                </div>

                {/* 7-STAGE STATUS TIMELINE */}
                <ProposalStatusTimeline session={session} />

                {/* ACTION BUTTONS */}
                <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[0.68rem] font-mono text-muted-foreground">
                    Preferred Date: <strong>{session.scheduledDate} ({session.scheduledTime})</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {session.status !== "Published" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedSessionForSchedule(session);
                          setIsScheduleModalOpen(true);
                        }}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                      >
                        <Calendar className="size-3.5" /> Schedule &amp; Publish Session
                      </Button>
                    )}

                    {session.status !== "Approved" && session.status !== "Published" && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(session)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                      >
                        <Check className="size-3.5" /> Approve
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRequestChanges(session)}
                      className="h-8 text-xs rounded-xl cursor-pointer"
                    >
                      Request Changes
                    </Button>

                    {session.status !== "Rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(session)}
                        className="h-8 text-xs text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer gap-1"
                      >
                        <XCircle className="size-3.5" /> Reject
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* SCHEDULE & PUBLISH MODAL */}
      {selectedSessionForSchedule && (
        <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 font-sans">
            <form onSubmit={handlePublishScheduleSubmit} className="space-y-3.5 text-xs font-sans">
              <DialogHeader>
                <DialogTitle className="font-extrabold text-base">
                  Schedule &amp; Publish Guest Lecture
                </DialogTitle>
                <p className="text-xs font-mono text-primary font-bold">{selectedSessionForSchedule.title}</p>
              </DialogHeader>

              <div className="space-y-2.5 font-mono">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-foreground font-sans block mb-1">Confirmed Date</label>
                    <Input
                      type="date"
                      value={scheduleForm.scheduledDate}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-foreground font-sans block mb-1">Confirmed Time</label>
                    <Input
                      value={scheduleForm.scheduledTime}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">College Event Venue / Hall</label>
                  <select
                    value={scheduleForm.venueOrLink}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, venueOrLink: e.target.value })}
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
                  <label className="font-bold text-foreground font-sans block mb-1">Max Student Seating Capacity</label>
                  <Input
                    type="number"
                    value={scheduleForm.maxCapacity}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, maxCapacity: parseInt(e.target.value) || 500 })}
                    className="h-9"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl">
                  Publish Session Live
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
