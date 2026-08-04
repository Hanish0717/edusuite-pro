import React, { useState } from "react";
import { toast } from "sonner";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Plus,
  Users,
  DollarSign,
  Calendar,
  XCircle,
  Award,
  Check,
  Send,
  ArrowRight,
  FileCheck2,
} from "lucide-react";
import { PlacementDriveRequest, AlumniJobItem } from "@/types/alumni";
import { useRole } from "@/context/role-context";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { StatCard } from "@/components/alumni/cards/StatCard";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
import { SearchBar } from "@/components/alumni/shared/SearchBar";
import { DataTable, Column } from "@/components/alumni/tables/DataTable";
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
  onOpenMessagingCenter?: (() => void) | undefined;
}

export const AlumniPlacementCollaborationView: React.FC<AlumniPlacementCollaborationViewProps> = ({
  drivesList,
  jobListings,
  onOpenMessagingCenter,
}) => {
  const { role, externalPersona } = useRole();
  const isStudent = role === "student";
  const isPlacementOfficer = role === "staff" || role === "super-admin";
  const isAlumni = role === "external-user" || externalPersona === "alumni";

  const [drives, setDrives] = useState<PlacementDriveRequest[]>(drivesList);
  const [activeSubTab, setActiveSubTab] = useState(
    isStudent ? "approved-jobs" : isPlacementOfficer ? "officer-queue" : "my-drives"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // Campus Drive Request Form State
  const [driveForm, setDriveForm] = useState({
    company: "Google Cloud",
    title: "On-Campus Software Engineer Drive 2026",
    driveType: "On-Campus" as const,
    ctcPackage: "₹38.5 LPA",
    eligibleBranches: "CSE, IT, ECE",
    minCgpa: "8.0",
    driveDate: "2026-09-15",
    alumniRole: "Senior Staff Engineer",
    description: "Full-time software development roles for cloud microservices, gRPC infrastructure, and distributed storage engines.",
  });

  const handleDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDrive: PlacementDriveRequest = {
      id: `DRV-${Date.now()}`,
      company: driveForm.company,
      title: driveForm.title,
      driveType: driveForm.driveType,
      ctcPackage: driveForm.ctcPackage,
      eligibleBranches: driveForm.eligibleBranches.split(",").map((s) => s.trim()),
      minCgpa: parseFloat(driveForm.minCgpa) || 8.0,
      driveDate: driveForm.driveDate,
      postedByAlumni: "Sarah Jenkins (You)",
      alumniRole: driveForm.alumniRole,
      status: "Pending Review",
      registeredStudentsCount: 0,
      description: driveForm.description,
      applicationDeadline: "2026-09-10",
      hasApplied: false,
    };

    setDrives((prev) => [newDrive, ...prev]);
    toast.success(`Campus recruitment drive request submitted for ${driveForm.company}!`, {
      description: "Step 1 complete. Routed to Placement Officer for institutional approval.",
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
    setIsDriveModalOpen(false);
  };

  const handleApproveDrive = (id: string, company: string) => {
    setDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Approved" } : d))
    );
    toast.success(`Approved campus drive for ${company}!`, {
      description: "Published to Student Career Center. Students can now apply directly.",
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
  };

  const handleRejectDrive = (id: string, company: string) => {
    setDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Rejected" } : d))
    );
    toast.error(`Rejected drive request for ${company}.`);
  };

  const handleStudentApply = (drive: PlacementDriveRequest) => {
    setDrives((prev) =>
      prev.map((d) =>
        d.id === drive.id
          ? {
              ...d,
              hasApplied: true,
              registeredStudentsCount: d.registeredStudentsCount + 1,
            }
          : d
      )
    );
    toast.success(`Application submitted for ${drive.company} — ${drive.title}!`, {
      description: "Application received by Placement Cell & Alumni Sponsor.",
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
  };

  const filteredDrives = drives.filter(
    (d) =>
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingApprovalsCount = drives.filter((d) => d.status === "Pending Review").length;
  const approvedJobsCount = drives.filter((d) => d.status === "Approved" || d.status === "Scheduled").length;

  return (
    <div className="space-y-6 font-sans">
      {/* PAGE HEADER */}
      <PageHeader
        title={
          isStudent
            ? "Student Career Center — Placement Drives"
            : isPlacementOfficer
            ? "Placement Officer Review Workspace"
            : "Alumni Placement & Recruitment Portal"
        }
        subtitle={
          isStudent
            ? "Apply directly to approved alumni-sponsored campus recruitment drives & job openings."
            : isPlacementOfficer
            ? "Review, approve, and schedule incoming alumni campus recruitment drives before publishing to students."
            : "Post campus recruitment drives, refer batchmates, and collaborate with the Placement Cell."
        }
        badgeText="Placement Cell & Alumni Hub"
        icon={Briefcase}
        onOpenMessagingCenter={onOpenMessagingCenter}
        actions={
          !isStudent ? (
            <Button
              onClick={() => setIsDriveModalOpen(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
            >
              <Plus className="size-4" /> Post Job / Campus Drive
            </Button>
          ) : undefined
        }
      />

      {/* 4-STAGE WORKFLOW BANNER */}
      <GlassCard className="p-4 bg-[#0F1B44] text-white border border-[#2563EB]/40 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-[0.7rem]">1</span>
            <span className="font-bold">Alumni Posts Job</span>
          </div>
          <ArrowRight className="size-4 text-[#4D78FF] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-[0.7rem]">2</span>
            <span className="font-bold">Placement Officer Reviews</span>
          </div>
          <ArrowRight className="size-4 text-[#4D78FF] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[0.7rem]">3</span>
            <span className="font-bold">Approved &amp; Published</span>
          </div>
          <ArrowRight className="size-4 text-[#4D78FF] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[0.7rem]">4</span>
            <span className="font-bold">Students Apply</span>
          </div>
        </div>
      </GlassCard>

      {/* EXECUTIVE STAT CARDS */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Approved Jobs Live" value={approvedJobsCount.toString()} change="Ready for Student Applications" icon={CheckCircle2} />
        <StatCard title="Pending Review" value={pendingApprovalsCount.toString()} change="Requires Placement Cell Action" icon={Clock} />
        <StatCard title="Active Companies" value="45" change="Tier-1 Alumni Employers" icon={Building2} />
        <StatCard title="Average CTC Package" value="₹18.5 LPA" change="+15% YoY CTC Growth" icon={DollarSign} />
      </div>

      {/* SUB-NAVIGATION PILLS & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 font-mono text-xs">
            {isStudent
              ? [
                  { id: "approved-jobs", label: `Live Placement Drives (${approvedJobsCount})` },
                  { id: "my-applications", label: "My Applications" },
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
                ))
              : [
                  { id: "officer-queue", label: `Placement Officer Approval Queue (${pendingApprovalsCount})` },
                  { id: "approved-jobs", label: `Approved & Published Jobs (${approvedJobsCount})` },
                  { id: "my-drives", label: "All Drives & Referrals" },
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
            placeholder="Search drives by company or title..."
          />
        </div>

        {/* ================= STEP 2: PLACEMENT OFFICER APPROVAL QUEUE ================= */}
        {activeSubTab === "officer-queue" && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
              <Clock className="size-5 text-amber-500" /> Incoming Alumni Job Proposals Queue ({pendingApprovalsCount})
            </h3>

            {drives.filter((d) => d.status === "Pending Review").length === 0 ? (
              <GlassCard className="p-8 text-center space-y-2 font-mono text-xs text-muted-foreground">
                <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
                <p className="font-bold text-foreground text-sm font-sans">No Pending Drive Approvals</p>
                <p>All alumni campus recruitment drive requests have been reviewed by the Placement Officer.</p>
              </GlassCard>
            ) : (
              drives
                .filter((d) => d.status === "Pending Review")
                .map((drive) => (
                  <GlassCard key={drive.id} className="p-5 space-y-3 font-sans border border-[#24356B]/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-extrabold text-base text-foreground">{drive.title}</h4>
                          <Badge variant="outline" className="text-[0.65rem] font-mono bg-amber-500/10 text-amber-600 border-amber-300">
                            Pending Officer Review
                          </Badge>
                        </div>
                        <p className="text-primary font-bold font-mono text-xs pt-0.5">
                          {drive.company} • Package: <strong className="text-emerald-600">{drive.ctcPackage}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground font-mono pt-1">
                          Sponsoring Alumni: <strong>{drive.postedByAlumni}</strong> ({drive.alumniRole})
                        </p>
                        <p className="text-xs font-mono text-muted-foreground pt-0.5">
                          Eligible: <strong>{drive.eligibleBranches.join(", ")}</strong> (Min CGPA: {drive.minCgpa})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveDrive(drive.id, drive.company)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                        >
                          <CheckCircle2 className="size-3.5" /> Approve &amp; Publish to Students
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectDrive(drive.id, drive.company)}
                          className="h-8 text-xs text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer gap-1"
                        >
                          <XCircle className="size-3.5" /> Reject Job
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))
            )}
          </div>
        )}

        {/* ================= STEP 3 & 4: APPROVED JOBS & STUDENT CAREER CENTER ================= */}
        {(activeSubTab === "approved-jobs" || activeSubTab === "my-drives") && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDrives
              .filter((d) => (activeSubTab === "approved-jobs" ? d.status === "Approved" || d.status === "Scheduled" : true))
              .map((drive) => (
                <GlassCard key={drive.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#24356B]/30 font-sans">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 text-[0.65rem] font-mono">
                        {drive.driveType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[0.65rem] font-mono ${
                          drive.status === "Approved" || drive.status === "Scheduled"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold"
                            : "bg-amber-500/10 text-amber-600 border-amber-300"
                        }`}
                      >
                        {drive.status === "Approved" ? "Approved & Live" : drive.status}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base text-foreground leading-snug">{drive.title}</h4>
                      <p className="text-primary font-bold font-mono text-xs pt-0.5">{drive.company}</p>
                    </div>

                    <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1 font-mono text-xs">
                      <p>💰 Package: <strong className="text-emerald-600">{drive.ctcPackage}</strong></p>
                      <p>🎓 Eligible: <strong>{drive.eligibleBranches.join(", ")}</strong> (CGPA &gt;= {drive.minCgpa})</p>
                      <p>👤 Alumni Sponsor: <strong>{drive.postedByAlumni}</strong></p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2 font-mono text-xs">
                    <span className="text-muted-foreground text-[0.68rem]">
                      <strong>{drive.registeredStudentsCount}</strong> Students Applied
                    </span>

                    {isStudent ? (
                      drive.hasApplied ? (
                        <Badge className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1">
                          Applied ✓
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleStudentApply(drive)}
                          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                        >
                          <Send className="size-3.5" /> Apply Now
                        </Button>
                      )
                    ) : (
                      <Badge variant="outline" className="text-[0.65rem] text-muted-foreground">
                        {drive.status}
                      </Badge>
                    )}
                  </div>
                </GlassCard>
              ))}
          </div>
        )}
      </div>

      {/* POST CAMPUS DRIVE MODAL */}
      <Dialog open={isDriveModalOpen} onOpenChange={setIsDriveModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <form onSubmit={handleDriveSubmit} className="space-y-3.5 text-xs font-sans">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-base">Post Alumni Job / Campus Recruitment Drive</DialogTitle>
              <p className="text-xs text-muted-foreground font-mono">Step 1 of Workflow: Submit for Placement Officer Review</p>
            </DialogHeader>

            <div className="space-y-2.5 font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Company Name</label>
                  <Input
                    value={driveForm.company}
                    onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })}
                    className="h-9 font-sans"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">CTC Package Offered</label>
                  <Input
                    value={driveForm.ctcPackage}
                    onChange={(e) => setDriveForm({ ...driveForm, ctcPackage: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Job Title / Drive Name</label>
                <Input
                  value={driveForm.title}
                  onChange={(e) => setDriveForm({ ...driveForm, title: e.target.value })}
                  className="h-9 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Eligible Branches</label>
                  <Input
                    value={driveForm.eligibleBranches}
                    onChange={(e) => setDriveForm({ ...driveForm, eligibleBranches: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Minimum CGPA</label>
                  <Input
                    value={driveForm.minCgpa}
                    onChange={(e) => setDriveForm({ ...driveForm, minCgpa: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Job Description &amp; Requirements</label>
                <textarea
                  value={driveForm.description}
                  onChange={(e) => setDriveForm({ ...driveForm, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-input bg-background font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDriveModalOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer">
                Submit to Placement Officer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
