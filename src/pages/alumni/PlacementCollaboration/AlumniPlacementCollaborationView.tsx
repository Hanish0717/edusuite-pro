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
  FileCheck2,
  Calendar,
  XCircle,
  HelpCircle,
  BarChart3,
  Award,
} from "lucide-react";
import { PlacementDriveRequest, AlumniJobItem } from "@/types/alumni";
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
  onUpdateDrives?: React.Dispatch<React.SetStateAction<PlacementDriveRequest[]>> | undefined;
  onOpenMessagingCenter?: (() => void) | undefined;
}

export const AlumniPlacementCollaborationView: React.FC<AlumniPlacementCollaborationViewProps> = ({
  drivesList,
  jobListings,
  onUpdateDrives,
  onOpenMessagingCenter,
}) => {
  const [drives, setDrives] = useState<PlacementDriveRequest[]>(drivesList);
  const [activeSubTab, setActiveSubTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // Campus Drive Request Form State
  const [driveForm, setDriveForm] = useState({
    company: "Google Cloud",
    title: "On-Campus Software Engineer Drive 2026",
    ctcPackage: "₹38.5 LPA",
    eligibleBranches: "CSE, IT, ECE",
    minCgpa: "8.0",
    driveDate: "2026-09-15",
    alumniRole: "Senior Staff Engineer",
  });

  const handleDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDrive: PlacementDriveRequest = {
      id: `DRV-${Date.now()}`,
      company: driveForm.company,
      title: driveForm.title,
      driveType: "On-Campus",
      ctcPackage: driveForm.ctcPackage,
      eligibleBranches: driveForm.eligibleBranches.split(",").map((s) => s.trim()),
      minCgpa: parseFloat(driveForm.minCgpa) || 8.0,
      driveDate: driveForm.driveDate,
      postedByAlumni: "Sarah Jenkins (You)",
      alumniRole: driveForm.alumniRole,
      status: "Pending Review",
      registeredStudentsCount: 0,
    };

    setDrives((prev) => [newDrive, ...prev]);
    toast.success(`Campus recruitment drive request submitted for ${driveForm.company}!`, {
      description: "Submitted to Placement Officer for institutional approval and scheduling.",
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
    setIsDriveModalOpen(false);
  };

  const handleApproveDrive = (id: string, company: string) => {
    setDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Approved" } : d))
    );
    toast.success(`Approved campus drive for ${company}!`, {
      description: "Drive is now published to eligible student portals for registration.",
    });
  };

  const handleRejectDrive = (id: string, company: string) => {
    setDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Rejected" } : d))
    );
    toast.error(`Rejected drive request for ${company}.`);
  };

  const filteredDrives = drives.filter(
    (d) =>
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingApprovalsCount = drives.filter((d) => d.status === "Pending Review").length;

  const studentApplications = [
    { id: "APP-101", studentName: "Aravind Kumar (Final Year CSE)", drive: "On-Campus SDE Drive", company: "Google Cloud", ctc: "₹38.5 LPA", status: "Shortlisted for HR Round", date: "2026-08-02" },
    { id: "APP-102", studentName: "Neha Roy (Batch of 2025)", drive: "Azure Cloud & AI Talent Drive", company: "Microsoft", ctc: "₹32.0 LPA", status: "Offer Released", date: "2026-07-28" },
    { id: "APP-103", studentName: "Siddharth Rao (M.Tech ECE)", drive: "VLSI Systems Recruitment", company: "Qualcomm", ctc: "₹42.0 LPA", status: "Technical Interview Round 2", date: "2026-07-26" },
  ];

  const appColumns: Column<(typeof studentApplications)[0]>[] = [
    { header: "Student Name", accessorKey: "studentName" },
    { header: "Campus Drive Title", accessorKey: "drive" },
    { header: "Company", accessorKey: "company" },
    { header: "CTC Package", accessorKey: "ctc" },
    {
      header: "Pipeline Status",
      cell: (item) => (
        <Badge
          variant="outline"
          className={`font-mono text-[0.65rem] ${
            item.status.includes("Offer")
              ? "bg-[#4D78FF]/10 text-[#2563EB] border-[#2563EB] font-bold"
              : "bg-blue-500/10 text-blue-600 border-blue-300"
          }`}
        >
          {item.status}
        </Badge>
      ),
    },
    { header: "Date", accessorKey: "date" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placement Collaboration Portal"
        subtitle="Alumni-driven campus recruitment drives, placement cell approvals, and direct student hiring pipelines."
        badgeText="Placement Cell & Alumni Hub"
        icon={Briefcase}
        onOpenMessagingCenter={onOpenMessagingCenter}
        actions={
          <>
            <Button
              onClick={() => setIsDriveModalOpen(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
            >
              <Plus className="size-4" /> Request Campus Drive
            </Button>
          </>
        }
      />

      {/* 8 EXECUTIVE KPI CARDS GRID */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Alumni Jobs" value="180" change="+14 This Week" icon={Briefcase} />
        <StatCard title="Internship Opportunities" value="38" change="Stipend: ₹50k/mo" icon={GraduationCap} />
        <StatCard title="Active Companies" value="45" change="Tier-1 Enterprises" icon={Building2} />
        <StatCard title="Campus Drives" value={drives.length.toString()} change="Scheduled This Season" icon={Calendar} />
        <StatCard title="Students Hired" value="138" change="76.6% Placement Rate" icon={CheckCircle2} />
        <StatCard title="Pending Approvals" value={pendingApprovalsCount.toString()} change="Requires Placement Cell Review" icon={Clock} />
        <StatCard title="Successful Referrals" value="138" change="Direct Candidate Referrals" icon={Award} />
        <StatCard title="Average Package" value="₹18.5 LPA" change="+15% YoY CTC Growth" icon={DollarSign} />
      </div>

      {/* SUB-NAVIGATION PILLS & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 font-mono text-xs">
            {[
              { id: "dashboard", label: "Placement Dashboard" },
              { id: "drives", label: "Campus Drive Requests" },
              { id: "approvals", label: `Placement Approvals (${pendingApprovalsCount})` },
              { id: "applications", label: "Student Applications" },
              { id: "analytics", label: "Placement Analytics" },
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

        {/* APPROVALS QUEUE VIEW */}
        {activeSubTab === "approvals" ? (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
              <Clock className="size-5 text-amber-500" /> Placement Officer Approval Queue
            </h3>
            {drives.filter((d) => d.status === "Pending Review").length === 0 ? (
              <GlassCard className="p-8 text-center space-y-2 font-mono text-xs text-muted-foreground">
                <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
                <p className="font-bold text-foreground text-sm font-sans">No Pending Drive Approvals</p>
                <p>All alumni campus recruitment drive requests have been reviewed.</p>
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
                            {drive.status}
                          </Badge>
                        </div>
                        <p className="text-primary font-bold font-mono text-xs pt-0.5">
                          {drive.company} • Proposed Date: <strong>{drive.driveDate}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground font-mono pt-1">
                          Posted by Alumni: <strong>{drive.postedByAlumni}</strong> ({drive.alumniRole})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveDrive(drive.id, drive.company)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                        >
                          <CheckCircle2 className="size-3.5" /> Approve Drive
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectDrive(drive.id, drive.company)}
                          className="h-8 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl cursor-pointer gap-1"
                        >
                          <XCircle className="size-3.5" /> Reject
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))
            )}
          </div>
        ) : (
          /* CAMPUS DRIVES GRID */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDrives.map((drive) => (
              <GlassCard key={drive.id} className="p-5 space-y-3.5 flex flex-col justify-between border border-[#24356B]/30 font-sans">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 text-[0.65rem] font-mono">
                      {drive.driveType}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[0.65rem] font-mono ${
                        drive.status === "Approved" || drive.status === "Scheduled"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                          : "bg-amber-500/10 text-amber-600 border-amber-300"
                      }`}
                    >
                      {drive.status}
                    </Badge>
                  </div>

                  <h3 className="font-extrabold text-base text-foreground leading-snug">{drive.title}</h3>
                  <p className="text-primary font-mono font-bold text-xs">{drive.company}</p>

                  <div className="space-y-1 font-mono text-[0.72rem] text-muted-foreground pt-1">
                    <p>💰 CTC Package: <strong className="text-foreground">{drive.ctcPackage}</strong></p>
                    <p>🎓 Eligible: <strong className="text-foreground">{drive.eligibleBranches.join(", ")}</strong> (Min CGPA: {drive.minCgpa})</p>
                    <p>📅 Drive Date: <strong className="text-[#2563EB]">{drive.driveDate}</strong></p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between font-mono text-[0.68rem] text-muted-foreground">
                  <span>Alumni HR: {drive.postedByAlumni.split(" ")[0]}</span>
                  <span className="font-bold text-[#2563EB]">{drive.registeredStudentsCount} Registered</span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* STUDENT APPLICATIONS TABLE */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
          <FileCheck2 className="size-5 text-[#2563EB]" /> Live Campus Placement Applications
        </h3>
        <DataTable data={studentApplications} columns={appColumns} keyExtractor={(a) => a.id} />
      </div>

      {/* REQUEST CAMPUS DRIVE MODAL */}
      <Dialog open={isDriveModalOpen} onOpenChange={setIsDriveModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <form onSubmit={handleDriveSubmit} className="space-y-3.5 text-xs font-sans">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-base">Request Campus Recruitment Drive</DialogTitle>
            </DialogHeader>

            <div className="space-y-2.5 font-mono">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Hiring Company Name</label>
                <Input
                  value={driveForm.company}
                  onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })}
                  className="h-9"
                />
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Campus Drive Title</label>
                <Input
                  value={driveForm.title}
                  onChange={(e) => setDriveForm({ ...driveForm, title: e.target.value })}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">CTC Package Offered</label>
                  <Input
                    value={driveForm.ctcPackage}
                    onChange={(e) => setDriveForm({ ...driveForm, ctcPackage: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Min Cutoff CGPA</label>
                  <Input
                    value={driveForm.minCgpa}
                    onChange={(e) => setDriveForm({ ...driveForm, minCgpa: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Eligible Branches (Comma separated)</label>
                <Input
                  value={driveForm.eligibleBranches}
                  onChange={(e) => setDriveForm({ ...driveForm, eligibleBranches: e.target.value })}
                  className="h-9"
                />
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Proposed Drive Date</label>
                <Input
                  type="date"
                  value={driveForm.driveDate}
                  onChange={(e) => setDriveForm({ ...driveForm, driveDate: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDriveModalOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer">
                Submit Drive Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
