import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Briefcase, Building2, FileCheck2, Plus, CheckCircle2, GraduationCap, Upload, FileText, X, Loader2, Paperclip } from "lucide-react";
import { AlumniJobItem } from "@/types/alumni";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { JobCard } from "@/components/alumni/cards/JobCard";
import { CompanyCard, CompanyItem } from "@/components/alumni/cards/CompanyCard";
import { StatCard } from "@/components/alumni/cards/StatCard";
import { SearchBar } from "@/components/alumni/shared/SearchBar";
import { DataTable, Column } from "@/components/alumni/tables/DataTable";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
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

interface AlumniCareerViewProps {
  jobListings: AlumniJobItem[];
  onOpenPostJobModal: () => void;
  subTab?: string;
}

export const AlumniCareerView: React.FC<AlumniCareerViewProps> = ({
  jobListings,
  onOpenPostJobModal,
  subTab = "all",
}) => {
  const [activeSubTab, setActiveSubTab] = useState(subTab || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<AlumniJobItem | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const [applicantName, setApplicantName] = useState("Sarah Jenkins");
  const [targetRole, setTargetRole] = useState("Cloud SDE / System Architect");
  const [resumeLink, setResumeLink] = useState("https://drive.google.com/my-resume.pdf");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STATEFUL APPLICATION TRACKING PIPELINE
  const [applications, setApplications] = useState([
    { id: "APP-01", candidate: "Aravind Kumar (Final Year CSE)", job: "Senior Backend Engineer", company: "Google Cloud", status: "Interview Round 2", date: "2026-08-02", attachedFile: "Aravind_CV_Backend.pdf" },
    { id: "APP-02", candidate: "Neha Roy (Batch of 2025)", job: "SDE-2 Azure", company: "Microsoft", status: "Offer Released", date: "2026-07-28", attachedFile: "Neha_Roy_Resume.pdf" },
    { id: "APP-03", candidate: "Siddharth Rao (M.Tech ECE)", job: "Staff VLSI Design Engineer", company: "Qualcomm", status: "Referral Verified", date: "2026-07-26", attachedFile: "Siddharth_VLSI.pdf" },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingFile(true);
      setUploadProgress(30);

      // Simulate upload progress bar animation
      setTimeout(() => setUploadProgress(75), 400);
      setTimeout(() => {
        setUploadProgress(100);
        setIsUploadingFile(false);
        setUploadedFile(file);
        setResumeLink(file.name);
        toast.success(`Successfully uploaded: ${file.name}`, {
          description: `File size: ${(file.size / 1024).toFixed(1)} KB. Ready for submission.`,
          icon: <CheckCircle2 className="size-4 text-emerald-600" />,
        });
      }, 900);
    }
  };

  const companiesList: CompanyItem[] = [
    { id: "CMP-01", name: "Google Cloud", industry: "Cloud & SaaS", location: "Mountain View, CA / Bengaluru", openRolesCount: 14, salaryRange: "₹35 - ₹50 LPA" },
    { id: "CMP-02", name: "Microsoft Corporation", industry: "Enterprise Software", location: "Redmond, WA / Hyderabad", openRolesCount: 22, salaryRange: "₹30 - ₹45 LPA" },
    { id: "CMP-03", name: "Qualcomm India", industry: "Semiconductors & VLSI", location: "Bengaluru, KA", openRolesCount: 12, salaryRange: "₹40 - ₹55 LPA" },
    { id: "CMP-04", name: "Tesla Motors", industry: "Automotive & EV", location: "Austin, TX", openRolesCount: 8, salaryRange: "$140k - $190k" },
    { id: "CMP-05", name: "CloudScale AI", industry: "GenAI Infrastructure", location: "Bengaluru, KA (Remote)", openRolesCount: 15, salaryRange: "₹28 - ₹40 LPA" },
  ];

  const filteredJobs = jobListings.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeSubTab === "jobs") return matchesSearch && (j.jobType === "Full-Time" || j.jobType === "Hybrid");
    if (activeSubTab === "internships") return matchesSearch && j.jobType === "Internship";
    if (activeSubTab === "referrals") return matchesSearch && j.postedBy.length > 0;
    if (activeSubTab === "campus-hiring") return matchesSearch && (j.department.includes("CSE") || j.department.includes("ECE"));
    return matchesSearch;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const fileSource = uploadedFile ? uploadedFile.name : resumeLink;
    const newApp = {
      id: `APP-${Date.now()}`,
      candidate: `${applicantName} (You)`,
      job: selectedJob.title,
      company: selectedJob.company,
      status: "Referral Submitted (Under Review)",
      date: "Today",
      attachedFile: fileSource,
    };

    setApplications((prev) => [newApp, ...prev]);

    toast.success(`Referral application submitted for ${selectedJob.title} at ${selectedJob.company}!`, {
      description: `Attached ${fileSource}. Added to your Live Application Tracking Pipeline below.`,
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
    setIsApplyModalOpen(false);
  };

  const handleResumeReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fileSource = uploadedFile ? uploadedFile.name : resumeLink;
    const newApp = {
      id: `APP-${Date.now()}`,
      candidate: `${applicantName} (You)`,
      job: `Resume Review (${targetRole || "Tech Lead"})`,
      company: "Alumni Mentor Panel",
      status: "Dispatched to Mentors",
      date: "Today",
      attachedFile: fileSource,
    };

    setApplications((prev) => [newApp, ...prev]);

    toast.success("Resume review request dispatched to Alumni Mentor Panel!", {
      description: `Attached ${fileSource}. Track status in your application pipeline below.`,
      icon: <CheckCircle2 className="size-4 text-emerald-600" />,
    });
    setIsResumeModalOpen(false);
  };

  const appColumns: Column<(typeof applications)[0]>[] = [
    { header: "Candidate Name", accessorKey: "candidate" },
    { header: "Position", accessorKey: "job" },
    { header: "Employer / Reviewer", accessorKey: "company" },
    {
      header: "Pipeline Status",
      cell: (item) => (
        <Badge
          variant="outline"
          className={`font-mono text-[0.65rem] ${
            item.status.includes("Offer")
              ? "bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF] border-[#2563EB]"
              : item.status.includes("Submitted") || item.status.includes("Dispatched")
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold"
              : "bg-blue-500/10 text-blue-600 border-blue-300"
          }`}
        >
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Attached File",
      cell: (item) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-mono text-[0.68rem] font-bold border border-primary/20">
          <Paperclip className="size-3" /> {item.attachedFile}
        </span>
      ),
    },
    { header: "Date", accessorKey: "date" },
  ];

  return (
    <div className="space-y-6">
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      <PageHeader
        title="Career Services & Alumni Job Referrals"
        subtitle="Exclusive job referral openings, campus recruitment drives, and resume feedback directly from alumni working in Tier-1 tech enterprises."
        badgeText="Alumni Referral Exchange"
        icon={Briefcase}
        actions={
          <>
            <Button
              onClick={() => setIsResumeModalOpen(true)}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer backdrop-blur-md border border-white/20 gap-1.5"
            >
              <FileCheck2 className="size-3.5" /> Request Resume Review
            </Button>
            <Button
              onClick={onOpenPostJobModal}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
            >
              <Plus className="size-4" /> Share Job Referral
            </Button>
          </>
        }
      />

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Jobs" value="180" change="+14 This Week" icon={Briefcase} />
        <StatCard title="Active Companies" value="45" change="Fortune 500" icon={Building2} />
        <StatCard title="Internships" value="38" change="Stipend: ₹50k/mo" icon={GraduationCap} />
        <StatCard title="Successful Referrals" value="138" change="76.6% Placement" icon={CheckCircle2} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 font-mono text-xs">
            {[
              { id: "all", label: "All Openings" },
              { id: "jobs", label: "Full-Time Jobs" },
              { id: "internships", label: "Internships" },
              { id: "referrals", label: "Alumni Referrals" },
              { id: "companies", label: "Hiring Companies" },
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
            placeholder="Search referral openings..."
          />
        </div>

        {activeSubTab === "companies" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companiesList.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onViewOpenings={(c: CompanyItem) => {
                  setSearchQuery(c.name);
                  setActiveSubTab("jobs");
                }}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onRequestReferral={(j: AlumniJobItem) => {
                  setSelectedJob(j);
                  setIsApplyModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* PIPELINE TABLE SHOWING UPLOADED APPLICATIONS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
            <FileCheck2 className="size-5 text-[#2563EB]" /> Live Application Tracking Pipeline
          </h3>
          <Badge variant="outline" className="font-mono text-xs bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]">
            {applications.length} Total Submissions
          </Badge>
        </div>
        <DataTable data={applications} columns={appColumns} keyExtractor={(a) => a.id} />
      </div>

      {/* APPLY REFERRAL MODAL */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          {selectedJob && (
            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs font-sans">
              <DialogHeader>
                <DialogTitle className="font-extrabold text-base">Request Referral: {selectedJob.title}</DialogTitle>
                <p className="text-xs text-[#2563EB] font-mono font-bold pt-0.5">{selectedJob.company}</p>
              </DialogHeader>

              <div className="space-y-3 font-mono">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Your Full Name</label>
                  <Input value={applicantName} onChange={(e) => setApplicantName(e.target.value)} className="h-9" />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-foreground font-sans block text-[0.72rem]">
                    Attach Resume Document:
                  </label>

                  <div className="p-3.5 bg-muted/40 rounded-2xl border border-dashed border-[#2563EB]/50 flex flex-col items-center justify-center gap-2 text-center">
                    {isUploadingFile ? (
                      <div className="space-y-2 w-full text-center">
                        <div className="flex items-center justify-center gap-2 text-[#2563EB] font-bold text-xs font-mono">
                          <Loader2 className="size-4 animate-spin text-[#2563EB]" /> Uploading file... {uploadProgress}%
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2563EB] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    ) : uploadedFile ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-sans">
                        <FileText className="size-4" />
                        <span className="truncate max-w-[200px]">{uploadedFile.name}</span>
                        <span className="text-[0.65rem] text-muted-foreground font-mono">
                          ({(uploadedFile.size / 1024).toFixed(0)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          className="text-rose-500 hover:text-rose-700 ml-1 cursor-pointer"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30 hover:bg-[#2563EB] hover:text-white font-bold h-8 text-xs rounded-xl gap-1.5 cursor-pointer"
                        >
                          <Upload className="size-3.5" /> Upload from Device (PDF, DOCX)
                        </Button>
                        <span className="text-[0.68rem] text-muted-foreground">or paste online resume link below:</span>
                      </>
                    )}
                  </div>

                  <Input
                    placeholder="https://drive.google.com/my-resume.pdf"
                    value={resumeLink}
                    onChange={(e) => setResumeLink(e.target.value)}
                    className="h-9 font-mono text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsApplyModalOpen(false)} className="rounded-xl cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer">
                  Submit Referral Request
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* RESUME REVIEW MODAL */}
      <Dialog open={isResumeModalOpen} onOpenChange={setIsResumeModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <form onSubmit={handleResumeReviewSubmit} className="space-y-4 text-xs font-sans">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-base">Request 1-on-1 Alumni Resume Review</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 font-mono">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Target Industry / Role</label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="E.g., Cloud SDE / System Architect"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-foreground font-sans block text-[0.72rem]">
                  Attach Resume Document:
                </label>

                <div className="p-3.5 bg-muted/40 rounded-2xl border border-dashed border-[#2563EB]/50 flex flex-col items-center justify-center gap-2 text-center">
                  {isUploadingFile ? (
                    <div className="space-y-2 w-full text-center">
                      <div className="flex items-center justify-center gap-2 text-[#2563EB] font-bold text-xs font-mono">
                        <Loader2 className="size-4 animate-spin text-[#2563EB]" /> Uploading file... {uploadProgress}%
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : uploadedFile ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-sans">
                      <FileText className="size-4" />
                      <span className="truncate max-w-[200px]">{uploadedFile.name}</span>
                      <span className="text-[0.65rem] text-muted-foreground font-mono">
                        ({(uploadedFile.size / 1024).toFixed(0)} KB)
                      </span>
                      <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        className="text-rose-500 hover:text-rose-700 ml-1 cursor-pointer"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30 hover:bg-[#2563EB] hover:text-white font-bold h-8 text-xs rounded-xl gap-1.5 cursor-pointer"
                      >
                        <Upload className="size-3.5" /> Upload from Device (PDF, DOCX)
                      </Button>
                      <span className="text-[0.68rem] text-muted-foreground">or paste online resume link below:</span>
                    </>
                  )}
                </div>

                <Input
                  placeholder="https://drive.google.com/my-resume.pdf"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  className="h-9 font-mono text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsResumeModalOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer">
                Dispatch to Mentors
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
