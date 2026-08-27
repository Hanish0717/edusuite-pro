import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck,
  Award,
  Search,
  Check,
  X,
  UserCheck,
  PlusCircle,
  Info,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Send,
  FileText,
  Paperclip,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ExtraWorkWalletService } from "@/services/extra-work-wallet-service";
import { ExtraWorkItem, ExtraWorkCategory } from "@/types/extra-work-wallet";
import { useRole } from "@/context/role-context";

export function FacultyExtraWorkVerification() {
  const { role, flags, profile, department } = useRole();

  // Determine initial role perspective based on user credentials
  const initialRolePerspective: "HOD" | "DEAN" | "PRINCIPAL" = React.useMemo(() => {
    if (role === "super_admin" || role === "super-admin") return "PRINCIPAL";
    if (flags.includes("isDean") || (profile.externalPersona && profile.externalPersona.toLowerCase().includes("dean"))) return "DEAN";
    return "HOD";
  }, [role, flags, profile]);

  const [items, setItems] = useState<ExtraWorkItem[]>(() => ExtraWorkWalletService.getFacultyExtraWorkItems());
  const [verifierRole, setVerifierRole] = useState<"HOD" | "DEAN" | "PRINCIPAL">(initialRolePerspective);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");

  // Keep verifierRole updated if initial perspective changes
  React.useEffect(() => {
    setVerifierRole(initialRolePerspective);
  }, [initialRolePerspective]);

  // Selected item for Verification Modal
  const [activeItem, setActiveItem] = useState<ExtraWorkItem | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [adjustedPoints, setAdjustedPoints] = useState<string>("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  // Assign Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignFacultyName, setAssignFacultyName] = useState("Dr. Ananya Sharma");
  const [assignTitle, setAssignTitle] = useState("");
  const [assignCategory, setAssignCategory] = useState<ExtraWorkCategory>("EVENTS");
  const [assignRole, setAssignRole] = useState("");
  const [assignDescription, setAssignDescription] = useState("");
  const [assignDate, setAssignDate] = useState("");
  const [assignPoints, setAssignPoints] = useState("50");

  const refreshItems = React.useCallback(() => {
    setItems(ExtraWorkWalletService.getFacultyExtraWorkItems());
  }, []);

  React.useEffect(() => {
    refreshItems();
    const unsubscribe = ExtraWorkWalletService.subscribe(() => {
      refreshItems();
    });
    return () => unsubscribe();
  }, [refreshItems]);

  const getVerifierName = (roleType: "HOD" | "DEAN" | "PRINCIPAL") => {
    if (roleType === "PRINCIPAL") {
      return role === "super_admin" || role === "super-admin"
        ? `${profile.personaName} (Super Admin / Principal)`
        : "Dr. R. V. Ramanan (Principal)";
    }
    if (roleType === "DEAN") {
      return profile.personaName || "Dr. M. S. Swaminathan (Dean Academic)";
    }
    return `${profile.personaName || "Dr. K. S. Sundaram"} (HOD ${department || "CSE"})`;
  };

  const handleVerify = (action: "VERIFY" | "REJECT" | "REQUEST_CORRECTION" | "APPROVE_APPLICATION") => {
    if (!activeItem) return;

    const verifierName = getVerifierName(verifierRole);
    const pointNum = adjustedPoints ? Number(adjustedPoints) : undefined;

    const res = ExtraWorkWalletService.verifyExtraWorkItem(
      activeItem.id,
      action,
      verifierName,
      verifierRole,
      reviewerNotes,
      pointNum,
      adjustmentReason
    );

    alert(res.message);
    refreshItems();
    setActiveItem(null);
    setReviewerNotes("");
    setAdjustedPoints("");
    setAdjustmentReason("");
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle || !assignRole || !assignDate) {
      alert("Please fill in required fields.");
      return;
    }

    const assignerName = getVerifierName(verifierRole);
    const res = ExtraWorkWalletService.assignExtraWork({
      facultyId: "FAC-CSE-101",
      facultyName: assignFacultyName,
      department: department ? `Department of ${department}` : "Computer Science & Engineering",
      title: assignTitle,
      category: assignCategory,
      role: assignRole,
      description: assignDescription,
      startDate: assignDate,
      rewardWWP: Number(assignPoints) || 50,
      assignerName,
      assignerRole: verifierRole,
    });

    alert(res.message);
    refreshItems();
    setIsAssignModalOpen(false);
    setAssignTitle("");
    setAssignRole("");
    setAssignDescription("");
    setAssignDate("");
  };

  // FILTER ITEMS MATCHING TARGET AUTHORITY ROLE EXACTLY
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatusFilter === "ALL" || item.status === selectedStatusFilter;

    // Strict verifier role targeting filter
    let matchesTargetRole = true;
    if (verifierRole === "HOD") {
      matchesTargetRole = !item.targetVerificationAuthority || item.targetVerificationAuthority === "HOD";
    } else if (verifierRole === "DEAN") {
      matchesTargetRole = ["RESEARCH_DEAN", "IQAC_DEAN", "STUDENT_DEAN", "PLACEMENT_HEAD"].includes(item.targetVerificationAuthority);
    } else if (verifierRole === "PRINCIPAL") {
      matchesTargetRole = true; // Principal master control has institution-wide view
    }

    return matchesSearch && matchesStatus && matchesTargetRole;
  });

  const pendingCount = filteredItems.filter((i) => ["SUBMITTED", "UNDER_REVIEW", "APPLIED", "IN_PROGRESS"].includes(i.status)).length;

  // Header copy configuration per active user role
  const roleCopy = React.useMemo(() => {
    if (role === "super_admin" || role === "super-admin") {
      return {
        badge: "Super Admin Governance Console",
        title: "Institutional Faculty Extra Work Audit & Verification",
        description: "Master administrative control: Audit claims across all departments, adjust WWP formulas, and assign direct institutional responsibilities.",
      };
    }
    if (flags.includes("isDean") || (profile.externalPersona && profile.externalPersona.toLowerCase().includes("dean"))) {
      return {
        badge: `${profile.personaMeta || "Dean Portfolio Console"}`,
        title: "Dean Portfolio Extra Work Verification",
        description: "Review and verify research grants, NAAC criteria contributions, and inter-departmental faculty initiatives.",
      };
    }
    return {
      badge: `HOD Console — ${department || "CSE"}`,
      title: "Department Faculty Extra Work Verification",
      description: `Review claims, verify extra event & hackathon efforts, and assign departmental tasks for ${department || "Computer Science & Engineering"}.`,
    };
  }, [role, flags, profile, department]);

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <UserCheck className="size-4 text-primary" />
            <span>{roleCopy.badge}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            {roleCopy.title}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            {roleCopy.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* VERIFIER ROLE TOGGLE */}
          <div className="bg-muted p-1 rounded-xl border border-border flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setVerifierRole("PRINCIPAL")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                verifierRole === "PRINCIPAL" ? "bg-card text-foreground shadow-2xs border border-border" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Principal View
            </button>
            <button
              type="button"
              onClick={() => setVerifierRole("DEAN")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                verifierRole === "DEAN" ? "bg-card text-foreground shadow-2xs border border-border" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dean View
            </button>
            <button
              type="button"
              onClick={() => setVerifierRole("HOD")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                verifierRole === "HOD" ? "bg-card text-foreground shadow-2xs border border-border" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              HOD View
            </button>
          </div>

          <Button
            onClick={() => setIsAssignModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs md:text-sm px-4 py-2 gap-2 rounded-xl shadow-2xs"
          >
            <PlusCircle className="size-4" />
            <span>
              {verifierRole === "PRINCIPAL"
                ? "Assign Institutional Duty"
                : verifierRole === "DEAN"
                ? "Assign Portfolio Task"
                : "Assign Department Task"}
            </span>
          </Button>
        </div>
      </div>

      {/* ROLE-SPECIFIC GOVERNANCE HIGHLIGHT BANNER - CLEAN UI PALETTE */}
      {verifierRole === "PRINCIPAL" && (
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-card-foreground shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Institutional Master Control & WWP Matrix Policy</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Super Admin / Principal Master View: Enforce institutional accreditation rules (NAAC/NIRF), adjust base category weights, or execute master point overrides.
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="font-bold text-xs px-3 py-1 rounded-full self-start md:self-auto shrink-0">
            Multiplier: 1.0x Standard WWP Matrix
          </Badge>
        </div>
      )}

      {verifierRole === "DEAN" && (
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-card-foreground shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Award className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Dean Portfolio Accreditation & Research Governance</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Audit high-impact claims: Patents, IEEE/Scopus publications, Govt research grants, and NAAC Criteria 1–7 documentation.
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="font-bold text-xs px-3 py-1 rounded-full self-start md:self-auto shrink-0">
            Portfolio Scope: All Faculties
          </Badge>
        </div>
      )}

      {verifierRole === "HOD" && (
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-card-foreground shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Building2 className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">HOD Department Verification Console ({department || "CSE"})</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Audit departmental extra work: 24-hour hackathons, student SIH mentoring, technical fests, and local department responsibilities.
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="font-bold text-xs px-3 py-1 rounded-full self-start md:self-auto shrink-0">
            Dept: {department || "CSE"}
          </Badge>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search faculty name, extra work title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 border-border bg-muted/40 text-xs text-foreground rounded-xl placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Badge variant="outline" className="text-xs font-semibold rounded-full border-border">
            Targeted Queue ({verifierRole}): {pendingCount} Pending
          </Badge>

          <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-48 border-border bg-card text-xs text-foreground rounded-xl">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground text-xs">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* QUEUE CARDS TABLE */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs hover:shadow-xs transition-all">
            <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    {item.category.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">
                    {item.source.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant="outline" className="border-border text-primary text-[10px] flex items-center gap-1">
                    <Send className="size-3" />
                    <span>Target: {item.targetVerificationAuthority ? item.targetVerificationAuthority.replace(/_/g, " ") : "HOD"}</span>
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">ID: {item.id}</span>
                </div>

                <h3 className="text-base font-bold text-foreground leading-tight">{item.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Faculty: <strong className="text-foreground">{item.facultyName}</strong> ({item.department}) • Role:{" "}
                  <strong className="text-foreground">{item.role || "Contributor"}</strong>
                </p>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                  <span>Submitted: {new Date(item.submittedAt || item.createdAt).toLocaleDateString()}</span>
                  <span>Evidence Files: <strong className="text-emerald-600 dark:text-emerald-400">{item.evidenceList.length} Attached</strong></span>
                </div>

                {/* ATTACHED PROOF QUICK CHIPS */}
                {item.evidenceList && item.evidenceList.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                    {item.evidenceList.map((ev, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] border-border text-muted-foreground gap-1">
                        <Paperclip className="size-2.5 text-primary" />
                        <span>{ev.title}</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT ACTION CORNER */}
              <div className="flex flex-col md:items-end gap-2 shrink-0 border-t md:border-t-0 border-border pt-3 md:pt-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Claimed Points:</span>
                  <span className="text-xl font-extrabold text-foreground font-mono">+{item.calculation.totalWWP} WWP</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setActiveItem(item);
                      setAdjustedPoints(String(item.calculation.totalWWP));
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-4 font-semibold rounded-xl shadow-2xs"
                  >
                    Inspect & Verify
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-xs border border-dashed border-border rounded-2xl">
            No claims found in queue targeting the {verifierRole} role.
          </div>
        )}
      </div>

      {/* VERIFICATION INSPECT DIALOG */}
      {activeItem && (
        <Dialog open={!!activeItem} onOpenChange={() => setActiveItem(null)}>
          <DialogContent className="bg-card border-border text-card-foreground max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase">
                <FileCheck className="size-4" />
                <span>Verification & Point Audit</span>
              </div>
              <DialogTitle className="text-lg font-bold">{activeItem.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submitted by {activeItem.facultyName} ({activeItem.department}) • Target: {activeItem.targetVerificationAuthority}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-bold text-foreground">{activeItem.category.replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Claimed Date:</span>
                    <p className="font-bold text-foreground">{activeItem.startDate}</p>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Description:</span>
                  <p className="text-foreground mt-0.5">{activeItem.description || "No description provided."}</p>
                </div>
              </div>

              {/* ATTACHED PROOF DOCUMENTS */}
              <div>
                <h4 className="font-bold text-foreground mb-1.5">Attached Evidence Documents ({activeItem.evidenceList.length})</h4>
                {activeItem.evidenceList.length > 0 ? (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {activeItem.evidenceList.map((ev) => (
                      <div key={ev.id} className="p-2 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Paperclip className="size-4 text-primary" />
                          <div>
                            <p className="font-bold text-foreground">{ev.title}</p>
                            <p className="text-[10px] text-muted-foreground">{ev.type}</p>
                          </div>
                        </div>
                        {ev.url && ev.url.startsWith("data:image") && (
                          <img src={ev.url} alt="Proof" className="size-10 object-cover rounded-lg border border-border" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-[11px] italic">No physical proof files attached.</p>
                )}
              </div>

              {/* POINT ADJUSTMENT SECTION */}
              <div className="p-3 bg-muted/50 rounded-xl border border-border space-y-3">
                <h4 className="font-bold text-foreground">Points Engine Audit & Adjustment</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-semibold">Standard Base WWP</label>
                    <p className="text-lg font-mono font-bold text-foreground mt-1">+{activeItem.calculation.totalWWP} WWP</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground font-semibold">Override / Adjusted WWP</label>
                    <Input
                      type="number"
                      value={adjustedPoints}
                      onChange={(e) => setAdjustedPoints(e.target.value)}
                      className="h-8 text-xs font-mono font-bold border-border bg-card mt-1"
                    />
                  </div>
                </div>
                {adjustedPoints && Number(adjustedPoints) !== activeItem.calculation.totalWWP && (
                  <div>
                    <label className="text-muted-foreground font-semibold">Reason for Point Adjustment *</label>
                    <Input
                      placeholder="E.g. Exceptional scope, state-level impact bonus..."
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
                      className="h-8 text-xs border-border bg-card mt-1"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-foreground">Reviewer Verification Notes</label>
                <Textarea
                  placeholder="Enter feedback or approval remarks..."
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="text-xs border-border mt-1 min-h-16"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
              <Button
                variant="outline"
                onClick={() => handleVerify("REJECT")}
                className="text-xs text-destructive border-border hover:bg-destructive/10"
              >
                <XCircle className="size-3.5 mr-1" /> Reject
              </Button>
              <Button
                onClick={() => handleVerify("VERIFY")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl gap-1.5"
              >
                <CheckCircle2 className="size-4" /> Verify & Credit WWP
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ASSIGN TASK MODAL */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Assign Task ({verifierRole})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Directly assign institutional extra duties with pre-allocated WWP credit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground">Faculty Member *</label>
              <Input
                value={assignFacultyName}
                onChange={(e) => setAssignFacultyName(e.target.value)}
                className="h-8 text-xs border-border mt-1"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Task Title *</label>
              <Input
                placeholder="E.g., Co-Convenor NAAC Criteria 3 Documentation"
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                className="h-8 text-xs border-border mt-1"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Category *</label>
                <Select value={assignCategory} onValueChange={(v) => setAssignCategory(v as ExtraWorkCategory)}>
                  <SelectTrigger className="h-8 text-xs border-border mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="EVENTS">Events</SelectItem>
                    <SelectItem value="STUDENT_DEVELOPMENT">Student Dev</SelectItem>
                    <SelectItem value="RESEARCH_INNOVATION">Research</SelectItem>
                    <SelectItem value="INSTITUTIONAL">Institutional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-semibold text-foreground">Role *</label>
                <Input
                  placeholder="E.g., Lead Convenor"
                  value={assignRole}
                  onChange={(e) => setAssignRole(e.target.value)}
                  className="h-8 text-xs border-border mt-1"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Target Date *</label>
                <Input
                  type="date"
                  value={assignDate}
                  onChange={(e) => setAssignDate(e.target.value)}
                  className="h-8 text-xs border-border mt-1"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Reward WWP *</label>
                <Input
                  type="number"
                  value={assignPoints}
                  onChange={(e) => setAssignPoints(e.target.value)}
                  className="h-8 text-xs border-border mt-1"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold">
                Assign & Notify Faculty
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
