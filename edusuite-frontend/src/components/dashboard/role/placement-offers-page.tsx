import { useState } from "react";
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

export function PlacementOffersWorkspace() {
  const [offers, setOffers] = useState<GlobalOfferRecord[]>(INITIAL_OFFERS);
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
                <Badge variant="outline" className="font-mono text-[0.7rem]">
                  14 Released Offers
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Offer Verification & Placement Operations Center
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Upload recruiter offer letters, audit placement policy compliance, release student offers, and confirm joinings.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS — DEDICATED RECRUITMENT WORKFLOW */}
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
            <Button
              variant="outline"
              onClick={() => toast.info("Released offer letters to candidate student portals")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Send className="size-3.5" /> Release Offers
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
            placeholder="Search offer ledger by candidate name, offer ID, or company..."
            className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
          />
        </div>
      </div>

      {/* OFFERS DIRECTORY TABLE */}
      <Panel title="Institutional Offer Letters Ledger">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                <th className="p-3">Offer ID & Candidate</th>
                <th className="p-3">Company & Job Role</th>
                <th className="p-3 text-right">Package CTC</th>
                <th className="p-3">Offer Tier</th>
                <th className="p-3">Verification</th>
                <th className="p-3">Student Acceptance</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {offers.map((o) => (
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
              <p className="font-bold text-xs">Drag & Drop Offer Letter PDF here</p>
              <span className="text-[0.68rem] text-muted-foreground block">Supports PDF, DOCX up to 10MB</span>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer">
                Upload & Audit Offer Letter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
