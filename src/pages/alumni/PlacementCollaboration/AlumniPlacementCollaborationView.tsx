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
  Download,
  Filter,
  BarChart3,
  FileCheck2,
  UserCheck,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileText,
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

  // Mock Student Profile for Eligibility Checking
  const [studentProfile] = useState({
    name: "Aravind Kumar",
    rollNumber: "22CS101",
    branch: "CSE",
    cgpa: 8.9,
    backlogs: 0,
    graduationYear: "Batch of 2026",
  });

  const [drives, setDrives] = useState<PlacementDriveRequest[]>(drivesList);
  const [activeSubTab, setActiveSubTab] = useState(
    isStudent ? "approved-jobs" : isPlacementOfficer ? "officer-queue font-bold" : "approved-jobs"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriveForDetail, setSelectedDriveForDetail] = useState<PlacementDriveRequest | null>(null);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // Drive Form State
  const [driveForm, setDriveForm] = useState({
    company: "Google Cloud India",
    title: "On-Campus Software Engineer Drive 2026",
    driveType: "On-Campus" as const,
    ctcPackage: "₹38.5 LPA",
    eligibleBranches: "CSE, IT, ECE",
    minCgpa: "8.0",
    maxBacklogs: "0",
    graduationYear: "Batch of 2026",
    driveDate: "2026-09-15",
    alumniRole: "Senior Staff Engineer",
    description: "Full-time software development roles for cloud microservices, gRPC infrastructure, and distributed storage engines.",
  });

  // Eligibility Evaluation Function
  const checkStudentEligibility = (drive: PlacementDriveRequest) => {
    const isBranchEligible = drive.eligibleBranches.includes(studentProfile.branch);
    const isCgpaEligible = studentProfile.cgpa >= drive.minCgpa;
    const isBacklogEligible = studentProfile.backlogs <= drive.maxBacklogsAllowed;
    const isYearEligible = studentProfile.graduationYear === drive.graduationYearRequired;

    const reasons: string[] = [];
    if (!isBranchEligible) reasons.push(`Requires branch: ${drive.eligibleBranches.join(", ")}`);
    if (!isCgpaEligible) reasons.push(`Min CGPA: ${drive.minCgpa} (Your CGPA: ${studentProfile.cgpa})`);
    if (!isBacklogEligible) reasons.push(`Max Backlogs: ${drive.maxBacklogsAllowed} (Your Backlogs: ${studentProfile.backlogs})`);
    if (!isYearEligible) reasons.push(`Requires Batch: ${drive.graduationYearRequired}`);

    return {
      isEligible: isBranchEligible && isCgpaEligible && isBacklogEligible && isYearEligible,
      reasons,
    };
  };

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
      maxBacklogsAllowed: parseInt(driveForm.maxBacklogs) || 0,
      graduationYearRequired: driveForm.graduationYear,
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
      description: "Submitted to Placement Officer for institutional review and shortlisting.",
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
    setIsDriveModalOpen(false);
  };

  const handleApproveDrive = (id: string, company: string) => {
    setDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Approved" } : d))
    );
    toast.success(`Approved campus drive for ${company}!`, {
      description: "Published to Student Career Center. Students can now verify eligibility and apply.",
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
    const { isEligible, reasons } = checkStudentEligibility(drive);
    if (!isEligible) {
      toast.error("Ineligible to apply for this drive", {
        description: reasons.join(" • "),
      });
      return;
    }

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
    toast.success(`Applied for ${drive.company} — ${drive.title}!`, {
      description: "Automated Eligibility Verified: CGPA, Branch & Backlog checks passed.",
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
  };

  const handleUpdateCandidateStatus = (
    driveId: string,
    candidateId: string,
    newStatus: PlacementCandidateApplication["pipelineStatus"]
  ) => {
    setDrives((prev) =>
      prev.map((d) => {
        if (d.id !== driveId) return d;
        const updatedApps = (d.studentApplications || []).map((app) =>
          app.id === candidateId
            ? {
                ...app,
                pipelineStatus: newStatus,
                offerPackage: newStatus === "Selected" ? d.ctcPackage : app.offerPackage,
                isOfferAccepted: newStatus === "Selected" ? true : app.isOfferAccepted,
              }
            : app
        );
        return { ...d, studentApplications: updatedApps };
      })
    );

    toast.success(`Updated candidate status to ${newStatus}!`);
  };

  const handleDownloadOfferLetter = (drive: PlacementDriveRequest, candidateName: string) => {
    const offerHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Placement Offer Letter - ${drive.company}</title>
  <style>
    body { font-family: 'Arial', sans-serif; background: #0B132B; color: #FFFFFF; padding: 40px; display: flex; justify-content: center; }
    .letter { background: #0F1B44; border: 3px solid #2563EB; border-radius: 24px; padding: 40px; max-width: 680px; box-shadow: 0 25px 60px rgba(0,0,0,0.6); }
    .hdr { text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 20px; margin-bottom: 25px; }
    .hdr h2 { color: #4D78FF; margin: 0; font-size: 24px; }
    .hdr p { color: #94A3B8; font-size: 13px; margin-top: 4px; }
    .body-txt { font-size: 14px; line-height: 1.7; color: #E2E8F0; }
    .box { background: #16234F; border: 1px border-[#2563EB]; padding: 16px; border-radius: 14px; margin: 20px 0; font-family: monospace; }
    .box p { margin: 4px 0; font-size: 13px; }
    .footer { margin-top: 30px; pt-20px; border-top: 1px dashed rgba(255,255,255,0.2); text-align: center; font-size: 12px; color: #94A3B8; }
    .btn { background: #2563EB; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="letter">
    <div class="hdr">
      <h2>OFFICIAL SELECTION &amp; CAMPUS OFFER LETTER</h2>
      <p>Directorate of Placement &amp; Corporate Relations — EduSuite Pro</p>
    </div>
    <div class="body-txt">
      <p>Dear <strong>${candidateName}</strong>,</p>
      <p>We are thrilled to inform you that following your outstanding performance in the multi-round campus recruitment process, you have been selected for employment at <strong>${drive.company}</strong>!</p>
      <div class="box">
        <p>🏢 <strong>Company:</strong> ${drive.company}</p>
        <p>💼 <strong>Role:</strong> ${drive.title}</p>
        <p>💰 <strong>CTC Package Offered:</strong> ${drive.ctcPackage}</p>
        <p>👤 <strong>Alumni Sponsor:</strong> ${drive.postedByAlumni} (${drive.alumniRole})</p>
        <p>🎓 <strong>Status:</strong> PLACED &amp; ACCEPTED</p>
      </div>
      <p>Please review your onboard instructions sent to your official university email.</p>
    </div>
    <div class="footer">
      Verified Placement Offer ID: OFF-${drive.id}
      <br/><button class="btn" onclick="window.print()">Print / Save Offer Letter PDF</button>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([offerHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Offer_Letter_${drive.company.replace(/\s+/g, "_")}_${candidateName.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded Official Offer Letter for ${drive.company}!`);
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
      {/* HEADER */}
      <PageHeader
        title={
          isStudent
            ? "Student Career Center — Placement & Hiring Portal"
            : isPlacementOfficer
            ? "Placement Cell Executive Operations Workspace"
            : "Alumni Recruitment & Campus Collaboration"
        }
        subtitle={
          isStudent
            ? "Automated 4-point eligibility check, multi-round interview schedules, offer letter downloads, and placed status tracking."
            : isPlacementOfficer
            ? "Candidate shortlisting funnel, multi-round interview scheduling, offer letter generation, and branch-wise placement analytics."
            : "Post campus drives, refer candidates, and collaborate with Placement Officers."
        }
        badgeText="Enterprise Placement Module"
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

      {/* 5-STAGE WORKFLOW PIPELINE BANNER */}
      <GlassCard className="p-4 bg-[#0F1B44] text-white border border-[#2563EB]/40 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-[0.7rem]">1</span>
            <span className="font-bold">Post Job</span>
          </div>
          <ArrowRight className="size-4 text-[#4D78FF] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-[0.7rem]">2</span>
            <span className="font-bold">Officer Approval</span>
          </div>
          <ArrowRight className="size-4 text-[#4D78FF] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[0.7rem]">3</span>
            <span className="font-bold">Eligibility Check &amp; Apply</span>
          </div>
          <ArrowRight className="size-4 text-[#4D78FF] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-[0.7rem]">4</span>
            <span className="font-bold">Multi-Round Interviews</span>
          </div>
          <ArrowRight className="size-4 text-[#4D78FF] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-[#4D78FF] text-white font-bold flex items-center justify-center text-[0.7rem]">5</span>
            <span className="font-bold">Offer Letter &amp; Placed</span>
          </div>
        </div>
      </GlassCard>

      {/* EXECUTIVE STAT CARDS */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Approved Jobs Live" value={approvedJobsCount.toString()} change="Ready for Student Applications" icon={CheckCircle2} />
        <StatCard title="Total Placement Rate" value="88.4%" change="Target: 95.0% Season Total" icon={TrendingUp} />
        <StatCard title="Highest Package Offered" value="₹42.0 LPA" change="Qualcomm VLSI Drive" icon={Award} />
        <StatCard title="Average Package" value="₹37.5 LPA" change="+18.5% YoY Placement Growth" icon={DollarSign} />
      </div>

      {/* SUB-NAVIGATION PILLS & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 font-mono text-xs">
            {[
              { id: "approved-jobs", label: `Live Placement Drives (${approvedJobsCount})` },
              { id: "officer-queue", label: `Officer Review Queue (${pendingApprovalsCount})` },
              { id: "funnel", label: "Candidate Pipeline & Funnel" },
              { id: "analytics", label: "Placement Analytics & Reports" },
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

        {/* ================= 1. LIVE PLACEMENT DRIVES & AUTOMATED ELIGIBILITY CHECK ================= */}
        {activeSubTab === "approved-jobs" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDrives
              .filter((d) => d.status === "Approved" || d.status === "Scheduled")
              .map((drive) => {
                const eligibility = checkStudentEligibility(drive);

                return (
                  <GlassCard key={drive.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#24356B]/30 font-sans">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 text-[0.65rem] font-mono">
                          {drive.driveType}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-600 border-emerald-300 font-mono text-[0.65rem] font-bold"
                        >
                          Approved &amp; Published
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-base text-foreground leading-snug">{drive.title}</h4>
                        <p className="text-primary font-bold font-mono text-xs pt-0.5">{drive.company}</p>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">{drive.description}</p>

                      {/* 4-POINT AUTOMATED ELIGIBILITY CHECK WIDGET */}
                      {isStudent && (
                        <div
                          className={`p-3 rounded-2xl border font-mono text-xs space-y-1 ${
                            eligibility.isEligible
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold">
                            {eligibility.isEligible ? (
                              <>
                                <CheckCircle2 className="size-4 text-emerald-600" />
                                <span>✅ You are eligible for this drive.</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="size-4 text-rose-600" />
                                <span>❌ You do not meet the eligibility criteria.</span>
                              </>
                            )}
                          </div>

                          {!eligibility.isEligible && (
                            <div className="text-[0.68rem] text-muted-foreground space-y-0.5 pt-1 pl-5">
                              {eligibility.reasons.map((r, i) => (
                                <p key={i}>• {r}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1 font-mono text-xs">
                        <p>💰 Package: <strong className="text-emerald-600">{drive.ctcPackage}</strong></p>
                        <p>🎓 Target: <strong>{drive.eligibleBranches.join(", ")}</strong> (Min CGPA: {drive.minCgpa})</p>
                        <p>🚫 Backlogs Allowed: <strong>Max {drive.maxBacklogsAllowed}</strong></p>
                        <p>👤 Alumni Sponsor: <strong>{drive.postedByAlumni}</strong></p>
                      </div>

                      {/* MULTI-ROUND INTERVIEW SCHEDULE PREVIEW */}
                      {drive.interviewRounds && drive.interviewRounds.length > 0 && (
                        <div className="space-y-1.5 pt-1 font-mono text-[0.68rem]">
                          <span className="font-bold text-primary block">📅 INTERVIEW ROUNDS SCHEDULE ({drive.interviewRounds.length})</span>
                          {drive.interviewRounds.map((rnd) => (
                            <div key={rnd.roundNumber} className="p-2 rounded-xl bg-card border border-border flex items-center justify-between">
                              <span>{rnd.roundName}</span>
                              <Badge variant="outline" className="text-[0.6rem] px-1 py-0">{rnd.date}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2 font-mono text-xs">
                      <span className="text-muted-foreground text-[0.68rem]">
                        <strong>{drive.registeredStudentsCount}</strong> Candidates Applied
                      </span>

                      {isStudent ? (
                        drive.hasApplied ? (
                          <div className="flex items-center gap-1.5">
                            <Badge className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1">
                              Applied ✓
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadOfferLetter(drive, studentProfile.name)}
                              className="h-8 text-xs rounded-xl cursor-pointer gap-1"
                            >
                              <Download className="size-3" /> Offer Letter
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            disabled={!eligibility.isEligible}
                            onClick={() => handleStudentApply(drive)}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1 disabled:opacity-50"
                          >
                            <Send className="size-3.5" /> Apply Now
                          </Button>
                        )
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDriveForDetail(drive)}
                          className="h-8 text-xs rounded-xl cursor-pointer gap-1"
                        >
                          View Applicants ({drive.studentApplications?.length || 0})
                        </Button>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
          </div>
        )}

        {/* ================= 2. PLACEMENT OFFICER APPROVAL QUEUE ================= */}
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
                          Eligible Branches: <strong>{drive.eligibleBranches.join(", ")}</strong> (Min CGPA: {drive.minCgpa})
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

        {/* ================= 3. CANDIDATE SHORTLISTING PIPELINE FUNNEL ================= */}
        {activeSubTab === "funnel" && (
          <div className="space-y-4 font-sans">
            {/* FUNNEL METRICS GRID */}
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              <GlassCard className="p-4 border-l-4 border-l-blue-500 space-y-1">
                <span className="text-[0.68rem] font-mono text-muted-foreground block">STEP 1: APPLIED CANDIDATES</span>
                <h3 className="font-extrabold text-xl text-foreground">120 Students</h3>
                <p className="text-xs text-blue-600 font-mono font-bold">100% Total Applications</p>
              </GlassCard>

              <GlassCard className="p-4 border-l-4 border-l-amber-500 space-y-1">
                <span className="text-[0.68rem] font-mono text-muted-foreground block">STEP 2: ELIGIBLE CANDIDATES</span>
                <h3 className="font-extrabold text-xl text-foreground">85 Students</h3>
                <p className="text-xs text-amber-600 font-mono font-bold">Passed CGPA &amp; Backlog Checks</p>
              </GlassCard>

              <GlassCard className="p-4 border-l-4 border-l-[#2563EB] space-y-1">
                <span className="text-[0.68rem] font-mono text-muted-foreground block">STEP 3: SHORTLISTED FOR INTERVIEWS</span>
                <h3 className="font-extrabold text-xl text-foreground">40 Students</h3>
                <p className="text-xs text-[#2563EB] font-mono font-bold">Advanced to Technical Rounds</p>
              </GlassCard>

              <GlassCard className="p-4 border-l-4 border-l-emerald-500 space-y-1">
                <span className="text-[0.68rem] font-mono text-muted-foreground block">STEP 4: SELECTED &amp; PLACED</span>
                <h3 className="font-extrabold text-xl text-foreground">14 Students</h3>
                <p className="text-xs text-emerald-600 font-mono font-bold">Offer Letters Issued &amp; Accepted</p>
              </GlassCard>
            </div>

            {/* CANDIDATES TABLE FOR GOOGLE CLOUD DRIVE */}
            <GlassCard className="p-5 space-y-4 border border-[#24356B]/30">
              <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                <UserCheck className="size-5 text-[#2563EB]" /> Candidate Shortlisting &amp; Offer Pipeline — Google Cloud Drive
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 font-mono text-[0.68rem] text-muted-foreground">
                      <th className="p-3">Roll Number</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">CGPA</th>
                      <th className="p-3">Backlogs</th>
                      <th className="p-3">Current Pipeline Stage</th>
                      <th className="p-3 text-right">Officer Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drives[0]?.studentApplications?.map((app) => (
                      <tr key={app.id} className="border-b border-border/60 hover:bg-muted/20">
                        <td className="p-3 font-mono font-bold text-foreground">{app.studentRoll}</td>
                        <td className="p-3 font-bold text-foreground">{app.studentName}</td>
                        <td className="p-3 font-mono">{app.studentBranch}</td>
                        <td className="p-3 font-mono text-emerald-600 font-bold">{app.cgpa}</td>
                        <td className="p-3 font-mono">{app.backlogsCount}</td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={`font-mono text-[0.65rem] ${
                              app.pipelineStatus === "Selected"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold"
                                : app.pipelineStatus === "Shortlisted"
                                ? "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB] font-bold"
                                : app.pipelineStatus === "Rejected"
                                ? "bg-rose-500/10 text-rose-600 border-rose-300"
                                : "bg-amber-500/10 text-amber-600 border-amber-300"
                            }`}
                          >
                            {app.pipelineStatus} ({app.currentRound || "Stage 1"})
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {app.pipelineStatus !== "Selected" && drives[0] && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateCandidateStatus(drives[0]!.id, app.id, "Selected")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-7 text-[0.68rem] rounded-xl cursor-pointer gap-1"
                              >
                                <Check className="size-3" /> Select &amp; Issue Offer
                              </Button>
                            )}

                            {app.pipelineStatus === "Selected" && drives[0] && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadOfferLetter(drives[0]!, app.studentName)}
                                className="h-7 text-[0.68rem] rounded-xl cursor-pointer gap-1"
                              >
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
          </div>
        )}

        {/* ================= 4. PLACEMENT ANALYTICS DASHBOARD ================= */}
        {activeSubTab === "analytics" && (
          <div className="space-y-6 font-sans">
            {/* COMPANY-WISE PLACEMENTS TABLE */}
            <GlassCard className="p-5 space-y-4 border border-[#24356B]/30">
              <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                <Building2 className="size-5 text-[#2563EB]" /> Company-wise Placements &amp; Highest Package Breakdown
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 font-mono text-[0.68rem] text-muted-foreground">
                      <th className="p-3">Recruiting Company</th>
                      <th className="p-3">Drive Type</th>
                      <th className="p-3">Alumni Sponsor</th>
                      <th className="p-3">Students Placed</th>
                      <th className="p-3">Highest CTC Package</th>
                      <th className="p-3">Average CTC Package</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { company: "Google Cloud India", type: "On-Campus Drive", sponsor: "Sarah Jenkins", hires: 42, maxCtc: "₹38.5 LPA", avgCtc: "₹34.0 LPA" },
                      { company: "Microsoft India", type: "Virtual Drive", sponsor: "Karthik Subramanian", hires: 38, maxCtc: "₹32.0 LPA", avgCtc: "₹28.5 LPA" },
                      { company: "Qualcomm Semiconductors", type: "On-Campus Drive", sponsor: "Vikram Malhotra", hires: 26, maxCtc: "₹42.0 LPA", avgCtc: "₹38.0 LPA" },
                      { company: "Amazon AWS", type: "Off-Campus Referral", sponsor: "Ananya Sharma", hires: 18, maxCtc: "₹44.0 LPA", avgCtc: "₹39.0 LPA" },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-border/60 hover:bg-muted/20">
                        <td className="p-3 font-extrabold text-foreground">{row.company}</td>
                        <td className="p-3 font-mono">{row.type}</td>
                        <td className="p-3 font-mono text-primary font-bold">{row.sponsor}</td>
                        <td className="p-3 font-mono font-bold text-foreground">{row.hires} Hired</td>
                        <td className="p-3 font-mono text-emerald-600 font-bold">{row.maxCtc}</td>
                        <td className="p-3 font-mono">{row.avgCtc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* BRANCH-WISE PLACEMENTS PROGRESS BAR WIDGET */}
            <GlassCard className="p-5 space-y-4 border border-[#24356B]/30 font-sans">
              <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                <GraduationCap className="size-5 text-emerald-600" /> Branch-wise Placement Rate Statistics (Batch of 2026)
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { branch: "Computer Science (CSE)", rate: 92.4, placed: 180, total: 195, avg: "₹24.5 LPA" },
                  { branch: "AI & Machine Learning", rate: 90.1, placed: 110, total: 122, avg: "₹22.0 LPA" },
                  { branch: "Electronics & Communication (ECE)", rate: 86.5, placed: 142, total: 164, avg: "₹18.2 LPA" },
                  { branch: "Electrical & Electronics (EEE)", rate: 79.2, placed: 95, total: 120, avg: "₹14.5 LPA" },
                  { branch: "Mechanical Engineering (ME)", rate: 71.0, placed: 78, total: 110, avg: "₹11.8 LPA" },
                  { branch: "Civil Engineering (CE)", rate: 68.5, placed: 65, total: 95, avg: "₹10.2 LPA" },
                ].map((item) => (
                  <div key={item.branch} className="p-3.5 rounded-2xl bg-card border border-border/70 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-foreground">{item.branch}</span>
                      <span className="font-mono font-bold text-emerald-600">{item.rate}% Placed ({item.placed}/{item.total})</span>
                    </div>

                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${item.rate}%` }} />
                    </div>

                    <p className="text-[0.68rem] font-mono text-muted-foreground text-right">Average Package: <strong className="text-foreground">{item.avg}</strong></p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* POST CAMPUS DRIVE MODAL */}
      <Dialog open={isDriveModalOpen} onOpenChange={setIsDriveModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <form onSubmit={handleDriveSubmit} className="space-y-3.5 text-xs font-sans">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-base">Post Alumni Job / Campus Recruitment Drive</DialogTitle>
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

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Eligible Branches</label>
                  <Input
                    value={driveForm.eligibleBranches}
                    onChange={(e) => setDriveForm({ ...driveForm, eligibleBranches: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Min CGPA</label>
                  <Input
                    value={driveForm.minCgpa}
                    onChange={(e) => setDriveForm({ ...driveForm, minCgpa: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Max Backlogs</label>
                  <Input
                    value={driveForm.maxBacklogs}
                    onChange={(e) => setDriveForm({ ...driveForm, maxBacklogs: e.target.value })}
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
