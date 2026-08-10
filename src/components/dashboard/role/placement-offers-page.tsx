import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Upload,
  ShieldCheck,
  Send,
  Download,
  Search,
  CheckCircle2,
  Eye,
  Building,
  DollarSign,
  FileBadge,
  Sparkles,
  RefreshCw,
  Briefcase,
  Clock,
  Check,
  XCircle,
  Award,
  Share2,
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

export interface GlobalOfferRecord {
  id: string;
  offerId: string;
  candidateName: string;
  rollNo: string;
  department: string;
  company: string;
  role: string;
  ctc: string;
  tier: "Super Dream" | "Dream" | "Regular";
  verificationStatus: "Verified" | "Pending Verification";
  acceptanceStatus: "Accepted" | "Pending Review";
  avatar: string;
}

interface AlumniProposalRecord {
  id: string;
  company: string;
  title: string;
  ctcPackage: string;
  postedByAlumni: string;
  alumniRole: string;
  eligibleBranches: string[];
  minCgpa: number;
  status: "Pending Review" | "Approved" | "Shared to Students" | "Rejected";
}

const INITIAL_OFFERS: GlobalOfferRecord[] = [
  {
    id: "OFF-301",
    offerId: "GGL-OFF-2026-01",
    candidateName: "Aditya Sharma",
    rollNo: "2022CSE188",
    department: "CSE",
    company: "Google Cloud India",
    role: "Software Engineer I",
    ctc: "₹32.0 LPA",
    tier: "Super Dream",
    verificationStatus: "Verified",
    acceptanceStatus: "Accepted",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "OFF-302",
    offerId: "MSF-OFF-2026-02",
    candidateName: "Sneha Reddy",
    rollNo: "2022ECE042",
    department: "ECE",
    company: "Microsoft",
    role: "Cloud Solution Associate",
    ctc: "₹28.0 LPA",
    tier: "Super Dream",
    verificationStatus: "Verified",
    acceptanceStatus: "Pending Review",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
];

const INITIAL_ALUMNI_PROPOSALS: AlumniProposalRecord[] = [
  {
    id: "ALM-PROP-101",
    company: "Google Cloud India",
    title: "On-Campus Software Engineer Drive 2026",
    ctcPackage: "₹38.5 LPA",
    postedByAlumni: "Sarah Jenkins",
    alumniRole: "Senior Staff Engineer",
    eligibleBranches: ["CSE", "IT", "ECE"],
    minCgpa: 8.0,
    status: "Pending Review",
  },
  {
    id: "ALM-PROP-102",
    company: "Microsoft IDC",
    title: "SDE-1 Campus Hiring 2026",
    ctcPackage: "₹42.0 LPA",
    postedByAlumni: "Rajesh Varma",
    alumniRole: "Principal Architect",
    eligibleBranches: ["CSE", "AI/ML", "IT"],
    minCgpa: 8.5,
    status: "Approved",
  },
  {
    id: "ALM-PROP-103",
    company: "Qualcomm India",
    title: "Hardware Systems Engineering Drive",
    ctcPackage: "₹22.0 LPA",
    postedByAlumni: "Ananya Rao",
    alumniRole: "Lead Systems Engineer",
    eligibleBranches: ["ECE", "EEE"],
    minCgpa: 7.5,
    status: "Shared to Students",
  },
];

export function PlacementOffersWorkspace() {
  const [offers, setOffers] = useState<GlobalOfferRecord[]>(INITIAL_OFFERS);
  const [alumniProposals, setAlumniProposals] = useState<AlumniProposalRecord[]>(INITIAL_ALUMNI_PROPOSALS);
  const [activeTab, setActiveTab] = useState<"recruiter_offers" | "alumni_offers">("alumni_offers");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload Offer Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [candName, setCandName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [ctcAmount, setCtcAmount] = useState("");
  const [tierType, setTierType] = useState<"Super Dream" | "Dream" | "Regular">("Super Dream");

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: GlobalOfferRecord = {
      id: `OFF-${Date.now().toString().slice(-3)}`,
      offerId: `OFF-2026-${Date.now().toString().slice(-4)}`,
      candidateName: candName || "Candidate",
      rollNo: "2022CSE210",
      department: "CSE",
      company: companyName || "Google Cloud",
      role: jobRole || "Software Engineer",
      ctc: ctcAmount ? `₹${ctcAmount} LPA` : "₹24.0 LPA",
      tier: tierType,
      verificationStatus: "Pending Verification",
      acceptanceStatus: "Pending Review",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    };
    setOffers([newOffer, ...offers]);
    setIsUploadModalOpen(false);
    toast.success(`Uploaded official recruiter offer letter for ${newOffer.candidateName}`);
  };

  // Step 1: Approve Proposal
  const handleApproveProposal = (id: string, company: string) => {
    setAlumniProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
    );
    toast.success(`✅ Approved alumni proposal for ${company}!`, {
      description: "Next step: Click 'Share to Students' to publish it as an Off-Campus Opportunity.",
    });
  };

  // Step 2: Share to Students
  const handleShareProposal = (id: string, company: string) => {
    setAlumniProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Shared to Students" } : p))
    );
    toast.success(`📢 Shared to students as Off-Campus Opportunity for ${company}!`, {
      description: "Published to Student Career Center. Students can now apply.",
    });
  };

  const handleRejectProposal = (id: string, company: string) => {
    setAlumniProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p))
    );
    toast.error(`Rejected alumni job proposal for ${company}`);
  };

  const pendingCount = alumniProposals.filter((p) => p.status === "Pending Review" || p.status === "Approved").length;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-brand-gradient text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0">
              <FileBadge className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-purple-600 text-white font-mono text-[0.7rem]">
                  Institutional Offer Ledger
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem] bg-amber-500/10 border-amber-300 text-amber-700 font-bold">
                  {pendingCount} Pending / To Share
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Offer Verification &amp; Placement Operations Center
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Approve alumni job proposals, share off-campus opportunities to students, upload recruiter offer letters, and audit compliance.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Upload className="size-4" /> Upload Offer Letter
            </Button>
            <Button
              onClick={() => toast.success("Verified all pending offer letters against policy engine")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <ShieldCheck className="size-4" /> Verify Offers
            </Button>
          </div>
        </div>
      </div>

      {/* TABS SWITCHER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab("alumni_offers")}
            className={`p-2.5 px-4 rounded-xl border font-bold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === "alumni_offers"
                ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                : "bg-card border-border hover:border-primary text-muted-foreground"
            }`}
          >
            <Briefcase className="size-4" /> Alumni Offers &amp; Proposals ({alumniProposals.length})
            {pendingCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded-full text-[0.65rem]">
                {pendingCount} To Action
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("recruiter_offers")}
            className={`p-2.5 px-4 rounded-xl border font-bold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === "recruiter_offers"
                ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                : "bg-card border-border hover:border-primary text-muted-foreground"
            }`}
          >
            <Award className="size-4" /> Recruiter Offer Letters Ledger ({offers.length})
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offers or proposals..."
            className="h-9 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
          />
        </div>
      </div>

      {/* ================= ALUMNI OFFERS & PROPOSALS SECTION ================= */}
      {activeTab === "alumni_offers" && (
        <div className="space-y-4">
          <Panel title="Alumni Job Proposals — Approve & Share to Students Workflow">
            <div className="space-y-3 p-1">
              {alumniProposals
                .filter(
                  (p) =>
                    p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((proposal) => (
                  <div
                    key={proposal.id}
                    className="p-4 rounded-2xl border border-border bg-card space-y-3 font-sans"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-base text-foreground">{proposal.title}</h4>
                          <Badge
                            variant="outline"
                            className={`font-mono text-[0.65rem] ${
                              proposal.status === "Shared to Students"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-300 font-bold"
                                : proposal.status === "Approved"
                                ? "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB] font-bold"
                                : proposal.status === "Rejected"
                                ? "bg-rose-500/10 text-rose-700 border-rose-300"
                                : "bg-amber-500/10 text-amber-700 border-amber-300 font-bold"
                            }`}
                          >
                            {proposal.status === "Pending Review"
                              ? "⏳ Pending Review"
                              : proposal.status === "Approved"
                              ? "✅ Approved (Ready to Share)"
                              : proposal.status === "Shared to Students"
                              ? "📢 Shared to Students"
                              : "❌ Rejected"}
                          </Badge>
                        </div>
                        <p className="text-primary font-bold font-mono text-xs">
                          {proposal.company} · CTC Package: <strong className="text-emerald-600">{proposal.ctcPackage}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          Alumni Sponsor: <strong>{proposal.postedByAlumni}</strong> ({proposal.alumniRole})
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          Eligible: <strong>{proposal.eligibleBranches.join(", ")}</strong> (Min CGPA: {proposal.minCgpa})
                        </p>
                      </div>

                      {/* 2-STEP APPROVAL & SHARE ACTIONS */}
                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
                        {/* STEP 1: Pending Review -> Approve */}
                        {proposal.status === "Pending Review" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveProposal(proposal.id, proposal.company)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 text-xs rounded-xl cursor-pointer gap-1.5 flex-1 sm:flex-none"
                            >
                              <Check className="size-3.5" /> Approve Proposal
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectProposal(proposal.id, proposal.company)}
                              className="h-9 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl cursor-pointer gap-1.5 flex-1 sm:flex-none"
                            >
                              <XCircle className="size-3.5" /> Reject
                            </Button>
                          </>
                        )}

                        {/* STEP 2: Approved -> Share to Students */}
                        {proposal.status === "Approved" && (
                          <Button
                            size="sm"
                            onClick={() => handleShareProposal(proposal.id, proposal.company)}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 text-xs rounded-xl cursor-pointer gap-1.5 shadow-md flex-1 sm:flex-none"
                          >
                            <Share2 className="size-3.5" /> Share to Students
                          </Button>
                        )}

                        {/* FINAL STEP: Shared to Students */}
                        {proposal.status === "Shared to Students" && (
                          <Badge className="bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs gap-1.5">
                            <CheckCircle2 className="size-3.5" /> Shared to Students
                          </Badge>
                        )}

                        {proposal.status === "Rejected" && (
                          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-300 font-bold px-3 py-1.5 rounded-xl">
                            ❌ Proposal Rejected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Panel>
        </div>
      )}

      {/* ================= RECRUITER OFFERS LEDGER ================= */}
      {activeTab === "recruiter_offers" && (
        <Panel title="Institutional Recruiter Offer Letters Ledger">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                  <th className="p-3">Offer ID &amp; Candidate</th>
                  <th className="p-3">Company &amp; Job Role</th>
                  <th className="p-3 text-right">Package CTC</th>
                  <th className="p-3">Offer Tier</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Student Acceptance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-medium">
                {offers
                  .filter(
                    (o) =>
                      o.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      o.company.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((o) => (
                    <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 border border-border">
                            <AvatarImage src={o.avatar} />
                            <AvatarFallback>{o.candidateName.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-foreground text-xs">{o.candidateName}</p>
                            <span className="text-[0.65rem] font-mono text-primary font-bold">{o.offerId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono">
                        <p className="font-bold text-foreground">{o.company}</p>
                        <span className="text-[0.68rem] text-muted-foreground">{o.role}</span>
                      </td>
                      <td className="p-3 text-right font-mono font-extrabold text-emerald-600 text-sm">
                        {o.ctc}
                      </td>
                      <td className="p-3 font-mono">
                        <Badge className={o.tier === "Super Dream" ? "bg-purple-600 text-white" : "bg-blue-600 text-white"}>
                          {o.tier}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={o.verificationStatus === "Verified" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                          {o.verificationStatus}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono">
                        <Badge variant="outline" className={o.acceptanceStatus === "Accepted" ? "text-emerald-600 border-emerald-500/30" : "text-amber-600"}>
                          {o.acceptanceStatus}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => toast.info(`Released offer for ${o.candidateName}`)} className="h-7 text-xs rounded-xl cursor-pointer">
                          Release Offer
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* UPLOAD OFFER DEDICATED MODAL */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Upload Recruiter Offer Letter PDF</DialogTitle>
            <DialogDescription>Attach candidate offer letter, CTC package details, and policy tier.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-3 pt-2 text-xs">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-semibold">Candidate Name</label>
                <Input value={candName} onChange={(e) => setCandName(e.target.value)} placeholder="e.g. Aditya Sharma" required className="h-9 text-xs rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Company Name</label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Google Cloud India" required className="h-9 text-xs rounded-xl" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-semibold">Job Role</label>
                <Input value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="e.g. Software Engineer I" required className="h-9 text-xs rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Total CTC (LPA)</label>
                <Input value={ctcAmount} onChange={(e) => setCtcAmount(e.target.value)} placeholder="e.g. 32.0" required className="h-9 text-xs rounded-xl" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Offer Tier Category</label>
              <select value={tierType} onChange={(e) => setTierType(e.target.value as any)} className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold">
                <option value="Super Dream">Super Dream (≥₹20 LPA)</option>
                <option value="Dream">Dream (₹10–20 LPA)</option>
                <option value="Regular">Regular (&lt;₹10 LPA)</option>
              </select>
            </div>

            <div className="p-4 border-2 border-dashed border-border rounded-2xl text-center space-y-1 bg-muted/20">
              <Upload className="size-6 text-muted-foreground mx-auto" />
              <p className="font-bold text-xs">Drag &amp; Drop Offer Letter PDF here</p>
              <span className="text-[0.68rem] text-muted-foreground block">Supports PDF, DOCX up to 10MB</span>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer">
                Upload &amp; Audit Offer Letter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
