import React, { useState } from "react";
import { toast } from "sonner";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Plus,
  DollarSign,
  XCircle,
  Award,
  Check,
  Send,
  ArrowRight,
  Download,
  UserCheck,
  TrendingUp,
  AlertCircle,
  Bell,
  FileText,
  ChevronRight,
  BarChart3,
  Users,
  BookOpen,
} from "lucide-react";
import { PlacementDriveRequest, AlumniJobItem, PlacementCandidateApplication } from "@/types/alumni";
import { useRole } from "@/context/role-context";
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

interface AlumniPlacementCollaborationViewProps {
  drivesList: PlacementDriveRequest[];
  jobListings: AlumniJobItem[];
  onUpdateDrives?: ((drives: PlacementDriveRequest[]) => void) | undefined;
  onOpenMessagingCenter?: (() => void) | undefined;
}

// ─── RECRUITMENT LIFECYCLE STAGES ─────────────────────────────────────────────
const LIFECYCLE_STAGES = [
  { key: "Applied",          label: "Applied",              color: "text-blue-600",    bg: "bg-blue-500/10 border-blue-300" },
  { key: "Eligible",         label: "Eligibility Verified", color: "text-cyan-600",    bg: "bg-cyan-500/10 border-cyan-300" },
  { key: "Shortlisted",      label: "Shortlisted",          color: "text-amber-600",   bg: "bg-amber-500/10 border-amber-300" },
  { key: "Interviewing",     label: "Interview Scheduled",  color: "text-violet-600",  bg: "bg-violet-500/10 border-violet-300" },
  { key: "Selected",         label: "Offer Letter Issued",  color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-300" },
  { key: "Rejected",         label: "Not Selected",         color: "text-rose-600",    bg: "bg-rose-500/10 border-rose-300" },
];

// ─── ENTERPRISE STATUS BADGE ────────────────────────────────────────────────
const DriveStatusBadge = ({ status }: { status: PlacementDriveRequest["status"] }) => {
  const map: Record<PlacementDriveRequest["status"], { label: string; cls: string }> = {
    "Pending Review": { label: "⏳ Pending Review",      cls: "bg-amber-500/10 text-amber-700 border-amber-300" },
    "Approved":       { label: "✅ Approved & Published", cls: "bg-emerald-500/10 text-emerald-700 border-emerald-300 font-bold" },
    "Scheduled":      { label: "📅 Drive Scheduled",      cls: "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB] font-bold" },
    "Completed":      { label: "🏁 Drive Completed",      cls: "bg-slate-500/10 text-slate-600 border-slate-300" },
    "Rejected":       { label: "❌ Rejected",             cls: "bg-rose-500/10 text-rose-700 border-rose-300" },
  };
  const cfg = map[status] || map["Pending Review"];
  return (
    <Badge variant="outline" className={`font-mono text-[0.65rem] px-2 py-0.5 ${cfg.cls}`}>
      {cfg.label}
    </Badge>
  );
};

// ─── RECRUITMENT LIFECYCLE TIMELINE ─────────────────────────────────────────
const LifecycleTimeline = ({ currentStatus }: { currentStatus: PlacementCandidateApplication["pipelineStatus"] }) => {
  const stages = ["Applied", "Eligible", "Shortlisted", "Interviewing", "Selected"];
  const currentIdx = stages.indexOf(currentStatus);
  const isRejected = currentStatus === "Rejected";

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {stages.map((stage, idx) => {
        const isDone = currentIdx > idx;
        const isCurrent = currentIdx === idx;
        return (
          <React.Fragment key={stage}>
            <div className={`flex flex-col items-center ${isCurrent ? "scale-105" : ""}`}>
              <div
                className={`size-6 rounded-full flex items-center justify-center text-[0.6rem] font-bold border-2 transition-all ${
                  isRejected && idx <= currentIdx
                    ? "bg-rose-500/20 border-rose-400 text-rose-600"
                    : isDone
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : isCurrent
                    ? "bg-[#2563EB] border-[#2563EB] text-white"
                    : "bg-muted border-border text-muted-foreground"
                }`}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span className={`text-[0.55rem] font-mono mt-0.5 text-center leading-tight ${isCurrent ? "text-[#2563EB] font-bold" : "text-muted-foreground"}`}>
                {stage}
              </span>
            </div>
            {idx < stages.length - 1 && (
              <div className={`h-0.5 w-6 rounded-full mb-3 ${isDone ? "bg-emerald-500" : "bg-border"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── NOTIFICATION BANNER ─────────────────────────────────────────────────────
const NotificationBanner = ({ notifications }: { notifications: { id: string; text: string; type: "success" | "info" | "warning" }[] }) => {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = notifications.filter((n) => !dismissed.includes(n.id));
  if (visible.length === 0) return null;
  return (
    <div className="space-y-2">
      {visible.map((n) => (
        <div
          key={n.id}
          className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border font-sans text-xs ${
            n.type === "success"
              ? "bg-emerald-500/10 border-emerald-300 text-emerald-700"
              : n.type === "warning"
              ? "bg-amber-500/10 border-amber-300 text-amber-700"
              : "bg-blue-500/10 border-blue-300 text-blue-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Bell className="size-3.5 shrink-0" />
            <span className="font-bold">{n.text}</span>
          </div>
          <button onClick={() => setDismissed((p) => [...p, n.id])} className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer text-[0.7rem]">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export const AlumniPlacementCollaborationView: React.FC<AlumniPlacementCollaborationViewProps> = ({
  drivesList,
  jobListings,
  onUpdateDrives,
  onOpenMessagingCenter,
}) => {
  const { role, externalPersona } = useRole();
  const isStudent = role === "student";
  const isPlacementOfficer = role === "staff" || role === "super-admin";
  const isAlumni = role === "external-user" || externalPersona === "alumni";

  // Mock student profile for eligibility checks
  const [studentProfile] = useState({
    name: "Aravind Kumar",
    rollNumber: "22CS101",
    branch: "CSE",
    cgpa: 8.9,
    backlogs: 0,
    graduationYear: "Batch of 2026",
  });

  // Parent-controlled drives state (persists across role switches)
  const drives = drivesList;
  const setDrives = (updater: PlacementDriveRequest[] | ((prev: PlacementDriveRequest[]) => PlacementDriveRequest[])) => {
    const updated = typeof updater === "function" ? updater(drivesList) : updater;
    onUpdateDrives?.(updated);
  };

  // Local UI state
  const [activeSubTab, setActiveSubTab] = useState(
    isStudent ? "career-center" : isPlacementOfficer ? "review-queue" : "my-drives"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isLifecycleModalOpen, setIsLifecycleModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<{ drive: PlacementDriveRequest; app: PlacementCandidateApplication } | null>(null);

  // Drive form state
  const [driveForm, setDriveForm] = useState({
    company: "",
    title: "",
    driveType: "On-Campus" as const,
    ctcPackage: "",
    eligibleBranches: "CSE, IT, ECE",
    minCgpa: "8.0",
    maxBacklogs: "0",
    graduationYear: "Batch of 2026",
    driveDate: "",
    description: "",
  });

  // ─── ELIGIBILITY CHECK ────────────────────────────────────────────────────
  const checkEligibility = (drive: PlacementDriveRequest) => {
    const checks = [
      { label: "Branch",          ok: drive.eligibleBranches.includes(studentProfile.branch),             reason: `Requires: ${drive.eligibleBranches.join(", ")}` },
      { label: "Min CGPA",        ok: studentProfile.cgpa >= drive.minCgpa,                                reason: `Min CGPA: ${drive.minCgpa} (Yours: ${studentProfile.cgpa})` },
      { label: "Active Backlogs", ok: studentProfile.backlogs <= drive.maxBacklogsAllowed,                 reason: `Max Backlogs Allowed: ${drive.maxBacklogsAllowed}` },
      { label: "Graduation Batch", ok: studentProfile.graduationYear === drive.graduationYearRequired,     reason: `Required: ${drive.graduationYearRequired}` },
    ];
    return { isEligible: checks.every((c) => c.ok), checks };
  };

  // ─── ALUMNI ACTIONS ───────────────────────────────────────────────────────
  const handlePostDrive = () => {
    if (!driveForm.company.trim() || !driveForm.title.trim()) return;
    const newDrive: PlacementDriveRequest = {
      id: `DRV-${Date.now()}`,
      company: driveForm.company,
      title: driveForm.title,
      driveType: driveForm.driveType,
      ctcPackage: driveForm.ctcPackage || "₹0 LPA",
      eligibleBranches: driveForm.eligibleBranches.split(",").map((s) => s.trim()),
      minCgpa: parseFloat(driveForm.minCgpa) || 8.0,
      maxBacklogsAllowed: parseInt(driveForm.maxBacklogs) || 0,
      graduationYearRequired: driveForm.graduationYear,
      driveDate: driveForm.driveDate || "2026-10-01",
      postedByAlumni: "Sarah Jenkins (You)",
      alumniRole: "Alumni",
      status: "Pending Review",
      registeredStudentsCount: 0,
      description: driveForm.description,
      applicationDeadline: driveForm.driveDate,
      hasApplied: false,
      studentApplications: [],
    };
    setDrives((prev) => [newDrive, ...prev]);
    setIsDriveModalOpen(false);
    setActiveSubTab("my-drives");
    setDriveForm({ company: "", title: "", driveType: "On-Campus", ctcPackage: "", eligibleBranches: "CSE, IT, ECE", minCgpa: "8.0", maxBacklogs: "0", graduationYear: "Batch of 2026", driveDate: "", description: "" });
    toast.success(`Job proposal submitted for ${newDrive.company}!`, {
      description: "📬 Routed to Placement Officer for institutional review. You will be notified once approved.",
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
  };

  // ─── PLACEMENT OFFICER ACTIONS ────────────────────────────────────────────
  const handleApprove = (driveId: string, company: string) => {
    setDrives((prev) => prev.map((d) => d.id === driveId ? { ...d, status: "Approved" } : d));
    toast.success(`🌐 Approved & Shared to students as Off-Campus Opportunity for ${company}!`, {
      description: "Published to Student Career Center under Off-Campus Opportunities.",
    });
  };

  const handleReject = (driveId: string, company: string) => {
    setDrives((prev) => prev.map((d) => d.id === driveId ? { ...d, status: "Rejected" } : d));
    toast.error(`Drive for ${company} rejected and removed from queue.`);
  };

  const handleAdvanceCandidate = (driveId: string, appId: string, newStatus: PlacementCandidateApplication["pipelineStatus"]) => {
    setDrives((prev) =>
      prev.map((d) => {
        if (d.id !== driveId) return d;
        return {
          ...d,
          studentApplications: (d.studentApplications || []).map((app) =>
            app.id === appId
              ? { ...app, pipelineStatus: newStatus, offerPackage: newStatus === "Selected" ? d.ctcPackage : app.offerPackage }
              : app
          ),
        };
      })
    );
    toast.success(`Candidate status updated to ${newStatus}`);
  };

  // ─── STUDENT ACTIONS ──────────────────────────────────────────────────────
  const handleStudentApply = (drive: PlacementDriveRequest) => {
    const { isEligible, checks } = checkEligibility(drive);
    if (!isEligible) {
      const failed = checks.filter((c) => !c.ok).map((c) => c.reason).join(" | ");
      toast.error("❌ Eligibility Check Failed", { description: failed });
      return;
    }
    setDrives((prev) =>
      prev.map((d) =>
        d.id === drive.id
          ? {
              ...d,
              hasApplied: true,
              registeredStudentsCount: d.registeredStudentsCount + 1,
              studentApplications: [
                ...(d.studentApplications || []),
                {
                  id: `APP-${Date.now()}`,
                  studentName: studentProfile.name,
                  studentRoll: studentProfile.rollNumber,
                  studentBranch: studentProfile.branch,
                  cgpa: studentProfile.cgpa,
                  backlogsCount: studentProfile.backlogs,
                  graduationYear: studentProfile.graduationYear,
                  pipelineStatus: "Applied" as const,
                  appliedDate: new Date().toISOString().split("T")[0] || new Date().toDateString(),
                },
              ],
            }
          : d
      )
    );
    toast.success(`🎯 Applied for ${drive.company} — ${drive.title}!`, {
      description: "4-point eligibility verified: Branch ✓ CGPA ✓ Backlogs ✓ Batch ✓",
    });
  };

  const handleDownloadOffer = (drive: PlacementDriveRequest, candidateName: string) => {
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Offer Letter</title>
    <style>body{font-family:Arial,sans-serif;background:#0B132B;color:#fff;padding:40px;display:flex;justify-content:center}
    .letter{background:#0F1B44;border:3px solid #2563EB;border-radius:24px;padding:40px;max-width:680px}
    h2{color:#4D78FF;text-align:center}
    .box{background:#16234F;padding:16px;border-radius:14px;margin:20px 0;font-family:monospace}
    .box p{margin:6px 0;font-size:13px}
    .footer{text-align:center;margin-top:30px;color:#94A3B8;font-size:12px}
    .btn{background:#2563EB;color:white;border:none;padding:12px 24px;border-radius:12px;font-weight:bold;cursor:pointer;margin-top:16px}</style></head>
    <body><div class="letter">
    <h2>OFFICIAL PLACEMENT OFFER LETTER</h2>
    <p style="text-align:center;color:#94A3B8">EduSuite Pro — Directorate of Placement & Corporate Relations</p>
    <p>Dear <strong>${candidateName}</strong>,</p>
    <p>We are pleased to inform you that you have been <strong>selected</strong> following your outstanding performance in the campus placement process.</p>
    <div class="box">
    <p>🏢 <strong>Company:</strong> ${drive.company}</p>
    <p>💼 <strong>Role:</strong> ${drive.title}</p>
    <p>💰 <strong>CTC Package:</strong> ${drive.ctcPackage}</p>
    <p>👤 <strong>Alumni Sponsor:</strong> ${drive.postedByAlumni}</p>
    <p>🎓 <strong>Status:</strong> PLACED & ACCEPTED</p>
    </div>
    <div class="footer">Offer ID: OFF-${drive.id}<br/>
    <button class="btn" onclick="window.print()">Print / Save PDF</button></div>
    </div></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Offer_Letter_${drive.company.replace(/\s+/g, "_")}_${candidateName.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("📄 Offer Letter downloaded!");
  };

  // ─── DERIVED VIEWS ─────────────────────────────────────────────────────────
  const filteredDrives = drives.filter(
    (d) =>
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ALUMNI: only their own drives
  const myDrives = drives.filter((d) => d.postedByAlumni.includes("You"));

  // OFFICER: categorised drives
  const pendingDrives = drives.filter((d) => d.status === "Pending Review");
  const approvedDrives = drives.filter((d) => d.status === "Approved" || d.status === "Scheduled");
  const rejectedDrives = drives.filter((d) => d.status === "Rejected");

  // STUDENT: only approved drives
  const publishedDrives = drives.filter((d) => d.status === "Approved" || d.status === "Scheduled");

  // NOTIFICATIONS ────────────────────────────────────────────────────────────
  const alumniNotifications = myDrives.flatMap((d) => {
    const ns = [];
    if (d.status === "Approved") ns.push({ id: `notif-approved-${d.id}`, text: `Your drive for ${d.company} has been approved and published to students!`, type: "success" as const });
    if (d.status === "Rejected") ns.push({ id: `notif-rejected-${d.id}`, text: `Your drive for ${d.company} was declined by the Placement Officer.`, type: "warning" as const });
    return ns;
  });

  const officerNotifications = pendingDrives.map((d) => ({
    id: `notif-pending-${d.id}`,
    text: `New alumni job proposal received from ${d.postedByAlumni} — ${d.company}.`,
    type: "info" as const,
  }));

  const studentNotifications = publishedDrives.flatMap((d) => {
    const ns = [];
    ns.push({ id: `notif-new-${d.id}`, text: `New campus drive available: ${d.company} — ${d.title}`, type: "info" as const });
    const myApp = (d.studentApplications || []).find((a) => a.studentRoll === studentProfile.rollNumber);
    if (myApp?.pipelineStatus === "Shortlisted") ns.push({ id: `notif-sl-${d.id}`, text: `You have been shortlisted for ${d.company}! Check interview schedule.`, type: "success" as const });
    if (myApp?.pipelineStatus === "Selected") ns.push({ id: `notif-offer-${d.id}`, text: `🎉 Offer letter issued from ${d.company} — ₹ ${d.ctcPackage}!`, type: "success" as const });
    return ns;
  });

  const notifications = isAlumni ? alumniNotifications : isPlacementOfficer ? officerNotifications : studentNotifications;

  // ─── TABS CONFIG BY ROLE ──────────────────────────────────────────────────
  const alumniTabs = [
    { id: "my-drives", label: `My Posted Drives (${myDrives.length})` },
  ];

  const officerTabs = [
    { id: "review-queue",   label: `Review Queue (${pendingDrives.length})` },
    { id: "published-jobs", label: `Approved & Live (${approvedDrives.length})` },
    { id: "candidates",     label: "Candidate Pipeline" },
    { id: "analytics",      label: "Placement Analytics" },
  ];

  const studentTabs = [
    { id: "career-center",    label: `Live Drives (${publishedDrives.length})` },
    { id: "my-applications",  label: "My Applications" },
  ];

  const tabs = isStudent ? studentTabs : isPlacementOfficer ? officerTabs : alumniTabs;

  return (
    <div className="space-y-6 font-sans">

      {/* ─── PAGE HEADER ──────────────────────────────────────────────── */}
      <PageHeader
        title={
          isStudent ? "Student Career Center" :
          isPlacementOfficer ? "Placement Officer Workspace" :
          "Alumni Recruitment Portal"
        }
        subtitle={
          isStudent
            ? "View approved campus drives, verify your eligibility, apply, and track your full recruitment lifecycle."
            : isPlacementOfficer
            ? "Review incoming alumni job proposals, approve or reject, manage candidate pipeline, and generate placement analytics."
            : "Post campus drives and track the approval status of your submitted proposals in real time."
        }
        badgeText="Enterprise Placement Module"
        icon={Briefcase}
        onOpenMessagingCenter={onOpenMessagingCenter}
        actions={
          isAlumni ? (
            <Button
              onClick={() => setIsDriveModalOpen(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
            >
              <Plus className="size-4" /> Post Job / Campus Drive
            </Button>
          ) : undefined
        }
      />

      {/* ─── WORKFLOW PIPELINE BANNER ─────────────────────────────────── */}
      <GlassCard className="p-3.5 bg-[#0F1B44] text-white border border-[#2563EB]/30 font-mono text-[0.68rem]">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { n: 1, label: "Alumni Posts Job",        active: isAlumni },
            { n: 2, label: "Officer Reviews",          active: isPlacementOfficer },
            { n: 3, label: "Approved & Published",     active: isPlacementOfficer },
            { n: 4, label: "Student Career Center",    active: isStudent },
            { n: 5, label: "Apply & Lifecycle Track",  active: isStudent },
          ].map((step, i) => (
            <React.Fragment key={step.n}>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-xl transition-all ${step.active ? "bg-[#2563EB] text-white" : "text-[#94A3B8]"}`}>
                <span className={`size-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold border ${step.active ? "bg-white text-[#2563EB] border-white" : "border-[#94A3B8]"}`}>{step.n}</span>
                <span className="font-bold whitespace-nowrap">{step.label}</span>
              </div>
              {i < 4 && <ArrowRight className="size-3 text-[#4D78FF] hidden sm:block shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </GlassCard>

      {/* ─── NOTIFICATIONS ─────────────────────────────────────────────── */}
      {notifications.length > 0 && <NotificationBanner notifications={notifications} />}

      {/* ─── STAT CARDS ───────────────────────────────────────────────── */}
      {isPlacementOfficer && (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Pending Review" value={pendingDrives.length.toString()} change="Awaiting Officer Decision" icon={Clock} />
          <StatCard title="Approved & Live" value={approvedDrives.length.toString()} change="Published to Students" icon={CheckCircle2} />
          <StatCard title="Rejected Proposals" value={rejectedDrives.length.toString()} change="Declined by Officer" icon={XCircle} />
          <StatCard title="Avg. Package" value="₹37.5 LPA" change="+18.5% YoY Growth" icon={DollarSign} />
        </div>
      )}

      {isStudent && (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Live Drives" value={publishedDrives.length.toString()} change="Open for Applications" icon={Briefcase} />
          <StatCard title="Your Profile" value={`CGPA ${studentProfile.cgpa}`} change={`Branch: ${studentProfile.branch}`} icon={GraduationCap} />
          <StatCard title="Highest Package" value="₹42.0 LPA" change="Qualcomm VLSI Drive" icon={Award} />
          <StatCard title="Placement Rate" value="88.4%" change="Batch of 2026" icon={TrendingUp} />
        </div>
      )}

      {isAlumni && (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="My Posted Drives" value={myDrives.length.toString()} change="Total Proposals Submitted" icon={Briefcase} />
          <StatCard title="Approved & Live" value={myDrives.filter((d) => d.status === "Approved").length.toString()} change="Published to Students" icon={CheckCircle2} />
          <StatCard title="Pending Review" value={myDrives.filter((d) => d.status === "Pending Review").length.toString()} change="Awaiting Officer Approval" icon={Clock} />
        </div>
      )}

      {/* ─── TABS + CONTENT ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 font-mono text-xs">
            {tabs.map((tab) => (
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
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search drives..." />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ALUMNI — MY POSTED DRIVES
        ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === "my-drives" && (
          <div className="space-y-4">
            {myDrives.length === 0 ? (
              <GlassCard className="p-10 text-center space-y-3 font-mono text-xs text-muted-foreground">
                <Briefcase className="size-12 text-muted-foreground/30 mx-auto" />
                <p className="font-extrabold text-foreground text-sm font-sans">No Drives Posted Yet</p>
                <p>Click <strong>"Post Job / Campus Drive"</strong> above to submit a proposal to the Placement Officer for review.</p>
                <Button onClick={() => setIsDriveModalOpen(true)} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer gap-1.5 mx-auto">
                  <Plus className="size-4" /> Post First Drive
                </Button>
              </GlassCard>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myDrives.map((drive) => (
                  <GlassCard key={drive.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#24356B]/30">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 text-[0.65rem] font-mono">{drive.driveType}</Badge>
                        <DriveStatusBadge status={drive.status} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-foreground leading-snug">{drive.title}</h4>
                        <p className="text-primary font-bold font-mono text-xs pt-0.5">{drive.company}</p>
                      </div>
                      <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1 font-mono text-xs">
                        <p>💰 <strong className="text-emerald-600">{drive.ctcPackage}</strong></p>
                        <p>🎓 {drive.eligibleBranches.join(", ")} | Min CGPA: {drive.minCgpa}</p>
                        <p>📅 Drive Date: {drive.driveDate}</p>
                      </div>
                      {drive.status === "Pending Review" && (
                        <div className="p-2.5 bg-amber-500/10 border border-amber-300 rounded-xl font-mono text-[0.68rem] text-amber-700">
                          ⏳ Awaiting Placement Officer review. You will be notified once approved.
                        </div>
                      )}
                      {drive.status === "Approved" && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-300 rounded-xl font-mono text-[0.68rem] text-emerald-700">
                          ✅ Your drive is live! <strong>{drive.registeredStudentsCount}</strong> students have applied.
                        </div>
                      )}
                    </div>
                    <div className="pt-2 border-t border-border/60 font-mono text-xs text-muted-foreground flex items-center justify-between">
                      <span><strong>{drive.registeredStudentsCount}</strong> Students Applied</span>
                      <DriveStatusBadge status={drive.status} />
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PLACEMENT OFFICER — REVIEW QUEUE
        ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === "review-queue" && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
              <Clock className="size-5 text-amber-500" />
              Incoming Alumni Job Proposals Waiting for Review ({pendingDrives.length})
            </h3>
            {pendingDrives.length === 0 ? (
              <GlassCard className="p-10 text-center space-y-2 font-mono text-xs text-muted-foreground">
                <CheckCircle2 className="size-12 text-emerald-500 mx-auto" />
                <p className="font-extrabold text-foreground text-sm font-sans">Queue Empty — All Proposals Reviewed</p>
              </GlassCard>
            ) : (
              pendingDrives.map((drive) => (
                <GlassCard key={drive.id} className="p-5 border border-[#24356B]/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-extrabold text-base text-foreground">{drive.title}</h4>
                        <DriveStatusBadge status={drive.status} />
                      </div>
                      <p className="text-primary font-bold font-mono text-xs">{drive.company} · Package: <strong className="text-emerald-600">{drive.ctcPackage}</strong></p>
                      <p className="text-xs text-muted-foreground font-mono">Alumni Sponsor: <strong>{drive.postedByAlumni}</strong> ({drive.alumniRole})</p>
                      <p className="text-xs text-muted-foreground font-mono">Eligible Branches: <strong>{drive.eligibleBranches.join(", ")}</strong> · Min CGPA: {drive.minCgpa} · Max Backlogs: {drive.maxBacklogsAllowed}</p>
                      {drive.description && <p className="text-xs text-muted-foreground pt-1 italic">{drive.description}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(drive.id, drive.company)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 text-xs rounded-xl cursor-pointer gap-1.5 w-full sm:w-auto"
                      >
                        <Check className="size-3.5" /> Approve &amp; Share as Off-Campus Opportunity
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(drive.id, drive.company)}
                        className="h-9 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl cursor-pointer gap-1.5 w-full sm:w-auto"
                      >
                        <XCircle className="size-3.5" /> Reject Job
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}

            {/* ALSO SHOW APPROVED / REJECTED SUMMARY */}
            {(approvedDrives.length > 0 || rejectedDrives.length > 0) && (
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <GlassCard className="p-4 border-l-4 border-l-emerald-500 space-y-2">
                  <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" />Approved Proposals ({approvedDrives.length})</h4>
                  {approvedDrives.map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-xs font-mono border-b border-border/40 pb-1">
                      <span className="font-bold text-foreground">{d.company}</span>
                      <DriveStatusBadge status={d.status} />
                    </div>
                  ))}
                </GlassCard>
                <GlassCard className="p-4 border-l-4 border-l-rose-500 space-y-2">
                  <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2"><XCircle className="size-4 text-rose-600" />Rejected Proposals ({rejectedDrives.length})</h4>
                  {rejectedDrives.map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-xs font-mono border-b border-border/40 pb-1">
                      <span className="font-bold text-foreground">{d.company}</span>
                      <DriveStatusBadge status={d.status} />
                    </div>
                  ))}
                </GlassCard>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PLACEMENT OFFICER — PUBLISHED JOBS
        ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === "published-jobs" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {approvedDrives.length === 0 ? (
              <GlassCard className="p-10 text-center col-span-3 font-mono text-xs text-muted-foreground">
                <Briefcase className="size-10 mx-auto opacity-30" />
                <p className="mt-2 font-bold">No approved drives yet. Approve proposals from the Review Queue.</p>
              </GlassCard>
            ) : approvedDrives.map((drive) => (
              <GlassCard key={drive.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#24356B]/30">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 text-[0.65rem] font-mono">{drive.driveType}</Badge>
                    <DriveStatusBadge status={drive.status} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{drive.title}</h4>
                    <p className="text-primary font-bold font-mono text-xs">{drive.company}</p>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1 font-mono text-xs">
                    <p>💰 <strong className="text-emerald-600">{drive.ctcPackage}</strong></p>
                    <p>🎓 {drive.eligibleBranches.join(", ")} | CGPA &gt;= {drive.minCgpa}</p>
                    <p>👥 {drive.registeredStudentsCount} Students Applied</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PLACEMENT OFFICER — CANDIDATE PIPELINE
        ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === "candidates" && (
          <div className="space-y-4">
            {approvedDrives.filter((d) => (d.studentApplications || []).length > 0).map((drive) => (
              <GlassCard key={drive.id} className="p-5 space-y-4 border border-[#24356B]/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                    <UserCheck className="size-4 text-[#2563EB]" /> {drive.company} — {drive.title}
                  </h3>
                  <Badge variant="outline" className="font-mono text-[0.65rem]">{drive.ctcPackage}</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 font-mono text-[0.68rem] text-muted-foreground">
                        <th className="p-3">Roll No.</th>
                        <th className="p-3">Student</th>
                        <th className="p-3">Branch</th>
                        <th className="p-3">CGPA</th>
                        <th className="p-3">Recruitment Stage</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(drive.studentApplications || []).map((app) => (
                        <tr key={app.id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="p-3 font-mono font-bold">{app.studentRoll}</td>
                          <td className="p-3 font-bold text-foreground">{app.studentName}</td>
                          <td className="p-3 font-mono">{app.studentBranch}</td>
                          <td className="p-3 font-mono text-emerald-600 font-bold">{app.cgpa}</td>
                          <td className="p-3">
                            <LifecycleTimeline currentStatus={app.pipelineStatus} />
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {app.pipelineStatus === "Applied" && (
                                <Button size="sm" onClick={() => handleAdvanceCandidate(drive.id, app.id, "Eligible")}
                                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-7 text-[0.68rem] rounded-xl cursor-pointer gap-1">
                                  <Check className="size-3" /> Verify Eligible
                                </Button>
                              )}
                              {app.pipelineStatus === "Eligible" && (
                                <Button size="sm" onClick={() => handleAdvanceCandidate(drive.id, app.id, "Shortlisted")}
                                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-7 text-[0.68rem] rounded-xl cursor-pointer gap-1">
                                  <Check className="size-3" /> Shortlist
                                </Button>
                              )}
                              {app.pipelineStatus === "Shortlisted" && (
                                <Button size="sm" onClick={() => handleAdvanceCandidate(drive.id, app.id, "Interviewing")}
                                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold h-7 text-[0.68rem] rounded-xl cursor-pointer gap-1">
                                  <Check className="size-3" /> Schedule Interview
                                </Button>
                              )}
                              {app.pipelineStatus === "Interviewing" && (
                                <>
                                  <Button size="sm" onClick={() => handleAdvanceCandidate(drive.id, app.id, "Selected")}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-7 text-[0.68rem] rounded-xl cursor-pointer gap-1">
                                    <Check className="size-3" /> Select &amp; Issue Offer
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleAdvanceCandidate(drive.id, app.id, "Rejected")}
                                    className="h-7 text-rose-600 hover:bg-rose-50 text-[0.68rem] rounded-xl cursor-pointer gap-1">
                                    <XCircle className="size-3" /> Reject
                                  </Button>
                                </>
                              )}
                              {app.pipelineStatus === "Selected" && drive && (
                                <Button size="sm" variant="outline"
                                  onClick={() => handleDownloadOffer(drive, app.studentName)}
                                  className="h-7 text-[0.68rem] rounded-xl cursor-pointer gap-1">
                                  <Download className="size-3" /> Download Offer
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            ))}
            {approvedDrives.filter((d) => (d.studentApplications || []).length > 0).length === 0 && (
              <GlassCard className="p-10 text-center font-mono text-xs text-muted-foreground">
                <Users className="size-10 mx-auto opacity-30" />
                <p className="mt-2 font-bold">No candidate applications yet. Approve drives so students can apply.</p>
              </GlassCard>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PLACEMENT OFFICER — ANALYTICS
        ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Drives" value={drives.length.toString()} change="All Alumni Proposals" icon={Briefcase} />
              <StatCard title="Students Placed" value="14" change="Offer Letters Issued" icon={CheckCircle2} />
              <StatCard title="Highest Package" value="₹42.0 LPA" change="Qualcomm VLSI Drive" icon={Award} />
              <StatCard title="Avg. Package" value="₹37.5 LPA" change="+18.5% YoY" icon={TrendingUp} />
            </div>

            <GlassCard className="p-5 space-y-4 border border-[#24356B]/30">
              <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                <Building2 className="size-4 text-[#2563EB]" /> Company-wise Placement Breakdown
              </h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 font-mono text-[0.68rem] text-muted-foreground">
                    <th className="p-3">Company</th><th className="p-3">Status</th><th className="p-3">Students Applied</th><th className="p-3">Highest Package</th>
                  </tr>
                </thead>
                <tbody>
                  {drives.map((d) => (
                    <tr key={d.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-3 font-extrabold text-foreground">{d.company}</td>
                      <td className="p-3"><DriveStatusBadge status={d.status} /></td>
                      <td className="p-3 font-mono">{d.registeredStudentsCount}</td>
                      <td className="p-3 font-mono text-emerald-600 font-bold">{d.ctcPackage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>

            <GlassCard className="p-5 space-y-4 border border-[#24356B]/30">
              <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                <GraduationCap className="size-4 text-emerald-600" /> Branch-wise Placement Rate (Batch of 2026)
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { branch: "Computer Science (CSE)", rate: 92.4, placed: 180, total: 195, avg: "₹24.5 LPA" },
                  { branch: "AI & Machine Learning",   rate: 90.1, placed: 110, total: 122, avg: "₹22.0 LPA" },
                  { branch: "Electronics (ECE)",        rate: 86.5, placed: 142, total: 164, avg: "₹18.2 LPA" },
                  { branch: "Electrical (EEE)",         rate: 79.2, placed:  95, total: 120, avg: "₹14.5 LPA" },
                ].map((item) => (
                  <div key={item.branch} className="p-3.5 rounded-2xl bg-card border border-border/70 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-foreground">{item.branch}</span>
                      <span className="font-mono font-bold text-emerald-600">{item.rate}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${item.rate}%` }} />
                    </div>
                    <p className="text-[0.68rem] font-mono text-muted-foreground text-right">Avg: <strong className="text-foreground">{item.avg}</strong></p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STUDENT — CAREER CENTER (LIVE DRIVES ONLY)
        ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === "career-center" && (
          <div className="space-y-4">
            {publishedDrives.length === 0 ? (
              <GlassCard className="p-10 text-center font-mono text-xs text-muted-foreground">
                <Briefcase className="size-10 mx-auto opacity-30" />
                <p className="mt-2 font-bold">No live drives available right now. Check back soon.</p>
              </GlassCard>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {publishedDrives.filter((d) =>
                  d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.title.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((drive) => {
                  const { isEligible, checks } = checkEligibility(drive);
                  const hasApplied = drive.hasApplied || (drive.studentApplications || []).some((a) => a.studentRoll === studentProfile.rollNumber);

                  return (
                    <GlassCard key={drive.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#24356B]/30">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 text-[0.65rem] font-mono">{drive.driveType}</Badge>
                          <DriveStatusBadge status={drive.status} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-foreground leading-snug">{drive.title}</h4>
                          <p className="text-primary font-bold font-mono text-xs pt-0.5">{drive.company}</p>
                        </div>
                        {drive.description && <p className="text-xs text-muted-foreground line-clamp-2">{drive.description}</p>}

                        {/* ELIGIBILITY CHECK WIDGET */}
                        <div className={`p-3 rounded-2xl border font-mono text-[0.68rem] space-y-1.5 ${isEligible ? "bg-emerald-500/10 border-emerald-300" : "bg-rose-500/10 border-rose-300"}`}>
                          <div className={`flex items-center gap-1.5 font-bold ${isEligible ? "text-emerald-700" : "text-rose-700"}`}>
                            {isEligible ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                            {isEligible ? "✅ You are eligible for this drive" : "❌ You do not meet eligibility criteria"}
                          </div>
                          <div className="grid grid-cols-2 gap-1 pt-1">
                            {checks.map((c) => (
                              <div key={c.label} className={`flex items-center gap-1 ${c.ok ? "text-emerald-600" : "text-rose-600"}`}>
                                {c.ok ? <Check className="size-3" /> : <XCircle className="size-3" />}
                                <span>{c.label}</span>
                              </div>
                            ))}
                          </div>
                          {!isEligible && (
                            <div className="pt-1 text-rose-600 space-y-0.5">
                              {checks.filter((c) => !c.ok).map((c) => <p key={c.label}>• {c.reason}</p>)}
                            </div>
                          )}
                        </div>

                        {/* INTERVIEW SCHEDULE */}
                        {(drive.interviewRounds || []).length > 0 && (
                          <div className="space-y-1.5 font-mono text-[0.66rem]">
                            <span className="font-bold text-primary block">📅 Interview Schedule ({drive.interviewRounds!.length} Rounds)</span>
                            {drive.interviewRounds!.map((rnd) => (
                              <div key={rnd.roundNumber} className="p-2 rounded-xl bg-card border border-border flex items-center justify-between gap-2">
                                <span className="truncate">{rnd.roundName}</span>
                                <Badge variant="outline" className="text-[0.6rem] shrink-0">{rnd.date}</Badge>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1 font-mono text-xs">
                          <p>💰 <strong className="text-emerald-600">{drive.ctcPackage}</strong></p>
                          <p>🎓 {drive.eligibleBranches.join(", ")} | Min CGPA {drive.minCgpa} | Max Backlogs {drive.maxBacklogsAllowed}</p>
                          <p>👤 Alumni Sponsor: {drive.postedByAlumni}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2 font-mono text-xs">
                        <span className="text-muted-foreground text-[0.68rem]"><strong>{drive.registeredStudentsCount}</strong> Applied</span>
                        {hasApplied ? (
                          <Badge className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1">Applied ✓</Badge>
                        ) : (
                          <Button
                            size="sm"
                            disabled={!isEligible}
                            onClick={() => handleStudentApply(drive)}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Send className="size-3.5" /> Apply Now
                          </Button>
                        )}
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STUDENT — MY APPLICATIONS (LIFECYCLE TRACKER)
        ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === "my-applications" && (
          <div className="space-y-4">
            {drives
              .filter((d) => (d.studentApplications || []).some((a) => a.studentRoll === studentProfile.rollNumber) || d.hasApplied)
              .length === 0 ? (
              <GlassCard className="p-10 text-center font-mono text-xs text-muted-foreground">
                <BookOpen className="size-10 mx-auto opacity-30" />
                <p className="mt-2 font-bold">No applications yet. Go to Live Drives and click Apply Now.</p>
              </GlassCard>
            ) : (
              drives
                .filter((d) => (d.studentApplications || []).some((a) => a.studentRoll === studentProfile.rollNumber) || d.hasApplied)
                .map((drive) => {
                  const app = (drive.studentApplications || []).find((a) => a.studentRoll === studentProfile.rollNumber);
                  const status: PlacementCandidateApplication["pipelineStatus"] = app?.pipelineStatus || "Applied";

                  return (
                    <GlassCard key={drive.id} className="p-5 space-y-4 border border-[#24356B]/30">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                        <div>
                          <h4 className="font-extrabold text-sm text-foreground">{drive.title}</h4>
                          <p className="text-primary font-bold font-mono text-xs">{drive.company} · {drive.ctcPackage}</p>
                          <p className="text-[0.68rem] text-muted-foreground font-mono">Applied: {app?.appliedDate || "Today"}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs font-bold shrink-0 ${
                            status === "Selected" ? "bg-emerald-500/10 text-emerald-700 border-emerald-400" :
                            status === "Rejected" ? "bg-rose-500/10 text-rose-700 border-rose-400" :
                            "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]"
                          }`}
                        >
                          {status}
                        </Badge>
                      </div>

                      {/* INTERACTIVE LIFECYCLE TIMELINE */}
                      <div className="p-3.5 bg-muted/30 rounded-2xl border border-border">
                        <p className="font-mono text-[0.68rem] text-muted-foreground font-bold mb-3">📊 YOUR RECRUITMENT LIFECYCLE</p>
                        <LifecycleTimeline currentStatus={status} />
                      </div>

                      {/* INTERVIEW SCHEDULE IF SHORTLISTED */}
                      {(status === "Shortlisted" || status === "Interviewing") && (drive.interviewRounds || []).length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-300 space-y-2 font-mono text-[0.68rem]">
                          <p className="font-bold text-violet-700">🗓️ YOUR INTERVIEW SCHEDULE</p>
                          {drive.interviewRounds!.map((rnd) => (
                            <div key={rnd.roundNumber} className="flex items-center justify-between gap-2 p-2 bg-card rounded-xl border border-border">
                              <span className="font-bold text-foreground text-xs">{rnd.roundName}</span>
                              <span className="text-muted-foreground">{rnd.date} · {rnd.time} · {rnd.venueOrLink}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* OFFER LETTER IF SELECTED */}
                      {status === "Selected" && (
                        <div className="p-4 bg-emerald-500/10 border-2 border-emerald-400 rounded-2xl space-y-3 text-center">
                          <p className="font-extrabold text-emerald-700 text-sm">🎉 Congratulations! You are Selected!</p>
                          <p className="font-mono text-xs text-emerald-700">Company: <strong>{drive.company}</strong> · Package: <strong>{drive.ctcPackage}</strong></p>
                          <Button
                            onClick={() => handleDownloadOffer(drive, studentProfile.name)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer gap-1.5 mx-auto"
                          >
                            <Download className="size-4" /> Download Official Offer Letter
                          </Button>
                        </div>
                      )}
                    </GlassCard>
                  );
                })
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ALUMNI — POST DRIVE MODAL
      ════════════════════════════════════════════════════════════════ */}
      <Dialog open={isDriveModalOpen} onOpenChange={setIsDriveModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-base">Post Job / Campus Recruitment Drive</DialogTitle>
            <p className="text-xs text-muted-foreground font-mono">Step 1: Submit to Placement Officer for review and approval.</p>
          </DialogHeader>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1 text-xs">Company Name *</label>
                <Input value={driveForm.company} onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })} placeholder="e.g. Google Cloud India" className="h-9" />
              </div>
              <div>
                <label className="font-bold text-foreground font-sans block mb-1 text-xs">CTC Package</label>
                <Input value={driveForm.ctcPackage} onChange={(e) => setDriveForm({ ...driveForm, ctcPackage: e.target.value })} placeholder="e.g. ₹38.5 LPA" className="h-9" />
              </div>
            </div>
            <div>
              <label className="font-bold text-foreground font-sans block mb-1 text-xs">Job Title / Drive Name *</label>
              <Input value={driveForm.title} onChange={(e) => setDriveForm({ ...driveForm, title: e.target.value })} placeholder="e.g. On-Campus SDE Drive 2026" className="h-9" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1 text-xs">Eligible Branches</label>
                <Input value={driveForm.eligibleBranches} onChange={(e) => setDriveForm({ ...driveForm, eligibleBranches: e.target.value })} className="h-9" />
              </div>
              <div>
                <label className="font-bold text-foreground font-sans block mb-1 text-xs">Min CGPA</label>
                <Input value={driveForm.minCgpa} onChange={(e) => setDriveForm({ ...driveForm, minCgpa: e.target.value })} className="h-9" />
              </div>
              <div>
                <label className="font-bold text-foreground font-sans block mb-1 text-xs">Max Backlogs</label>
                <Input value={driveForm.maxBacklogs} onChange={(e) => setDriveForm({ ...driveForm, maxBacklogs: e.target.value })} className="h-9" />
              </div>
            </div>
            <div>
              <label className="font-bold text-foreground font-sans block mb-1 text-xs">Drive Date</label>
              <Input type="date" value={driveForm.driveDate} onChange={(e) => setDriveForm({ ...driveForm, driveDate: e.target.value })} className="h-9" />
            </div>
            <div>
              <label className="font-bold text-foreground font-sans block mb-1 text-xs">Job Description</label>
              <textarea
                value={driveForm.description}
                onChange={(e) => setDriveForm({ ...driveForm, description: e.target.value })}
                rows={3}
                placeholder="Role details, tech stack, responsibilities..."
                className="w-full p-2.5 rounded-xl border border-input bg-background font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsDriveModalOpen(false)} className="rounded-xl cursor-pointer">Cancel</Button>
            <Button
              type="button"
              onClick={handlePostDrive}
              disabled={!driveForm.company.trim() || !driveForm.title.trim()}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer disabled:opacity-50"
            >
              Submit to Placement Officer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
