import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  Award,
  Clock,
  TrendingUp,
  FileCheck2,
  PlusCircle,
  Settings,
  AlertCircle,
  History,
  CheckCircle2,
  FileText,
  Lock,
  Filter,
  Search,
  UserCheck,
  ChevronRight,
  Download,
  Eye,
  Edit3,
  Calendar,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Paperclip,
  Check,
  X,
  XCircle,
  Layers,
  Send,
  UserCheck2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ExtraWorkWalletService } from "@/services/extra-work-wallet-service";
import { ExtraWorkCategory, ExtraWorkItem, VerificationAuthority } from "@/types/extra-work-wallet";
import { FacultyTierBadge, TierLevel } from "./FacultyTierBadge";

export function InstitutionExtraWorkGovernance() {
  // State for service data updates
  const [summary, setSummary] = useState(ExtraWorkWalletService.getInstitutionSummary());
  const [policy, setPolicy] = useState(ExtraWorkWalletService.getPointPolicy());
  const [auditLogs, setAuditLogs] = useState(ExtraWorkWalletService.getAuditLog());
  const [allClaims, setAllClaims] = useState<ExtraWorkItem[]>(ExtraWorkWalletService.getAllLedgerItems());

  const refreshData = () => {
    setSummary(ExtraWorkWalletService.getInstitutionSummary());
    setPolicy(ExtraWorkWalletService.getPointPolicy());
    setAuditLogs([...ExtraWorkWalletService.getAuditLog()]);
    setAllClaims(ExtraWorkWalletService.getAllLedgerItems());
  };

  useEffect(() => {
    const unsubscribe = ExtraWorkWalletService.subscribe(refreshData);
    return () => unsubscribe();
  }, []);

  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "ROLE_QUEUES" | "DEPARTMENTS" | "POLICY" | "AUDIT">("ROLE_QUEUES");

  // ROLE PERSPECTIVE FILTER FOR SUPER ADMIN
  const [rolePerspectiveFilter, setRolePerspectiveFilter] = useState<"ALL" | "HOD" | "DEAN_ACADEMIC" | "RESEARCH_DEAN" | "IQAC_DEAN" | "PRINCIPAL">("ALL");

  // FILTERS
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [auditSearchQuery, setAuditSearchQuery] = useState<string>("");

  // Notification Banner
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const showBanner = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(null), 5000);
  };

  // ----------------------------------------------------
  // 1. POINT OVERRIDE MODAL STATE
  // ----------------------------------------------------
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideItemId, setOverrideItemId] = useState("EW-2026-001");
  const [overrideItemTitle, setOverrideItemTitle] = useState("National 24-Hour Campus AI Hackathon 2026");
  const [overrideFacultyName, setOverrideFacultyName] = useState("Dr. Ananya Sharma");
  const [overrideDepartment, setOverrideDepartment] = useState("Computer Science & Engineering");
  const [overrideOriginalWWP, setOverrideOriginalWWP] = useState("80");
  const [overrideAdjustedWWP, setOverrideAdjustedWWP] = useState("100");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideRequestedBy, setOverrideRequestedBy] = useState("Dean Academic");
  const [overrideAuthorizedBy, setOverrideAuthorizedBy] = useState("Dr. R. V. Ramanan (Principal)");

  // ----------------------------------------------------
  // 2. ASSIGN INSTITUTIONAL DUTY MODAL STATE
  // ----------------------------------------------------
  const [isAssignDutyModalOpen, setIsAssignDutyModalOpen] = useState(false);
  const [dutyFacultyId, setDutyFacultyId] = useState("FAC-CSE-101");
  const [dutyFacultyName, setDutyFacultyName] = useState("Dr. Ananya Sharma");
  const [dutyDepartment, setDutyDepartment] = useState("CSE");
  const [dutyTitle, setDutyTitle] = useState("");
  const [dutyCategory, setDutyCategory] = useState<ExtraWorkCategory>("INSTITUTIONAL_GOVERNANCE");
  const [dutyWWPPoints, setDutyWWPPoints] = useState("50");
  const [dutyDescription, setDutyDescription] = useState("");
  const [dutyDeadline, setDutyDeadline] = useState("2026-09-30");
  const [dutyTargetAuthority, setDutyTargetAuthority] = useState<VerificationAuthority>("DEAN_ACADEMIC");

  // ----------------------------------------------------
  // 3. FACULTY DETAIL & CLAIMS MODAL STATE
  // ----------------------------------------------------
  const [isFacultyDetailModalOpen, setIsFacultyDetailModalOpen] = useState(false);
  const [selectedFacultyDetail, setSelectedFacultyDetail] = useState<any>(null);

  // ----------------------------------------------------
  // 4. CLAIM VERIFICATION INSPECT DIALOG STATE
  // ----------------------------------------------------
  const [activeInspectClaim, setActiveInspectClaim] = useState<ExtraWorkItem | null>(null);
  const [verifyReviewerNotes, setVerifyReviewerNotes] = useState("");
  const [verifyAdjustedPoints, setVerifyAdjustedPoints] = useState<string>("");
  const [verifyAdjustmentReason, setVerifyAdjustmentReason] = useState("");

  // ----------------------------------------------------
  // 5. EDIT POLICY MATRIX MODAL STATE
  // ----------------------------------------------------
  const [isEditPolicyModalOpen, setIsEditPolicyModalOpen] = useState(false);
  const [policyRulesEdit, setPolicyRulesEdit] = useState<any[]>([]);

  // Dataset of Faculty
  const allFacultyData = [
    { facultyId: "FAC-CSE-101", facultyName: "Dr. Ananya Sharma", branch: "CSE", designation: "Professor", totalWWP: 370, pendingClaims: 2, verifiedItems: 4, topCategory: "Research & Innovation", status: "BRONZE" as TierLevel },
    { facultyId: "FAC-CSE-102", facultyName: "Prof. Rajesh Kumar", branch: "CSE", designation: "Associate Professor", totalWWP: 580, pendingClaims: 1, verifiedItems: 3, topCategory: "Events & Programs", status: "SILVER" as TierLevel },
    { facultyId: "FAC-CSE-103", facultyName: "Dr. Meera Nambiar", branch: "CSE", designation: "Assistant Professor", totalWWP: 1240, pendingClaims: 4, verifiedItems: 8, topCategory: "Student Development", status: "GOLD" as TierLevel },
    { facultyId: "FAC-ECE-201", facultyName: "Dr. Suresh Varma", branch: "ECE", designation: "Professor & Head", totalWWP: 2150, pendingClaims: 0, verifiedItems: 12, topCategory: "Research & Innovation", status: "PLATINUM" as TierLevel },
    { facultyId: "FAC-ECE-202", facultyName: "Prof. Lakshmi Narayan", branch: "ECE", designation: "Associate Professor", totalWWP: 710, pendingClaims: 2, verifiedItems: 5, topCategory: "Institutional Work", status: "SILVER" as TierLevel },
    { facultyId: "FAC-MECH-301", facultyName: "Dr. K. R. Venkatesh", branch: "MECH", designation: "Professor", totalWWP: 3620, pendingClaims: 1, verifiedItems: 18, topCategory: "Industry Engagement", status: "DIAMOND" as TierLevel },
    { facultyId: "FAC-MECH-302", facultyName: "Prof. Arvind Swamy", branch: "MECH", designation: "Assistant Professor", totalWWP: 180, pendingClaims: 0, verifiedItems: 2, topCategory: "Social & Community", status: "BRONZE" as TierLevel },
    { facultyId: "FAC-CIVIL-401", facultyName: "Dr. Sunita Deshmukh", branch: "CIVIL", designation: "Professor & Head", totalWWP: 1340, pendingClaims: 3, verifiedItems: 9, topCategory: "Institutional Work", status: "GOLD" as TierLevel },
    { facultyId: "FAC-MBA-501", facultyName: "Dr. Ramesh Adani", branch: "MBA", designation: "Professor", totalWWP: 860, pendingClaims: 1, verifiedItems: 6, topCategory: "Industry Engagement", status: "SILVER" as TierLevel },
  ];

  // Filtered Claims based on Role Perspective
  const filteredClaimsByRole = allClaims.filter((claim) => {
    const matchesRole =
      rolePerspectiveFilter === "ALL" ||
      claim.targetVerificationAuthority === rolePerspectiveFilter ||
      (rolePerspectiveFilter === "HOD" && !claim.targetVerificationAuthority) ||
      (rolePerspectiveFilter === "PRINCIPAL" && (claim.targetVerificationAuthority === "PRINCIPAL" || claim.source === "ASSIGNED_BY_PRINCIPAL"));
    const matchesSearch =
      claim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Filtered Faculty List
  const filteredFaculty = allFacultyData.filter((f) => {
    const matchesBranch = selectedBranch === "ALL" || f.branch === selectedBranch;
    const matchesSearch =
      f.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const q = auditSearchQuery.toLowerCase();
    return (
      log.facultyName.toLowerCase().includes(q) ||
      log.itemTitle.toLowerCase().includes(q) ||
      log.reason.toLowerCase().includes(q) ||
      log.department.toLowerCase().includes(q)
    );
  });

  // Role Claims Count Summary
  const countByRole = {
    ALL: allClaims.length,
    HOD: allClaims.filter((c) => !c.targetVerificationAuthority || c.targetVerificationAuthority === "HOD").length,
    DEAN_ACADEMIC: allClaims.filter((c) => c.targetVerificationAuthority === "DEAN_ACADEMIC" || c.targetVerificationAuthority === "STUDENT_DEAN").length,
    RESEARCH_DEAN: allClaims.filter((c) => c.targetVerificationAuthority === "RESEARCH_DEAN").length,
    IQAC_DEAN: allClaims.filter((c) => c.targetVerificationAuthority === "IQAC_DEAN").length,
    PRINCIPAL: allClaims.filter((c) => c.targetVerificationAuthority === "PRINCIPAL" || c.source === "ASSIGNED_BY_PRINCIPAL").length,
  };

  // ----------------------------------------------------
  // SUBMIT HANDLERS
  // ----------------------------------------------------
  const handleVerifyClaimAction = (action: "VERIFY" | "REJECT") => {
    if (!activeInspectClaim) return;

    const pointNum = verifyAdjustedPoints ? Number(verifyAdjustedPoints) : undefined;
    const res = ExtraWorkWalletService.verifyExtraWorkItem(
      activeInspectClaim.id,
      action,
      "Dr. R. V. Ramanan (Super Admin / Principal)",
      "PRINCIPAL",
      verifyReviewerNotes,
      pointNum,
      verifyAdjustmentReason
    );

    showBanner(res.message);
    setActiveInspectClaim(null);
    setVerifyReviewerNotes("");
    setVerifyAdjustedPoints("");
    setVerifyAdjustmentReason("");
    refreshData();
  };

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason || !overrideAdjustedWWP) {
      alert("Please enter a mandatory justification reason and adjusted WWP points.");
      return;
    }

    const res = ExtraWorkWalletService.createPointOverride({
      itemId: overrideItemId,
      itemTitle: overrideItemTitle,
      facultyName: overrideFacultyName,
      department: overrideDepartment,
      originalWWP: Number(overrideOriginalWWP),
      adjustedWWP: Number(overrideAdjustedWWP),
      reason: overrideReason,
      requestedBy: overrideRequestedBy,
      authorizedBy: overrideAuthorizedBy,
    });

    showBanner(res.message);
    setIsOverrideModalOpen(false);
    setOverrideReason("");
    refreshData();
  };

  const handleAssignDutySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dutyTitle || !dutyWWPPoints) {
      alert("Please enter a duty title and allocated WWP points.");
      return;
    }

    const res = ExtraWorkWalletService.assignInstitutionalDuty({
      facultyId: dutyFacultyId,
      facultyName: dutyFacultyName,
      department: dutyDepartment,
      title: dutyTitle,
      category: dutyCategory,
      wwpPoints: Number(dutyWWPPoints),
      description: dutyDescription || "Super Admin Institutional Duty Assignment",
      deadlineDate: dutyDeadline,
      targetVerificationAuthority: dutyTargetAuthority,
      assignedBy: "Dr. R. V. Ramanan (Principal / Super Admin)",
    });

    showBanner(res.message);
    setIsAssignDutyModalOpen(false);
    setDutyTitle("");
    setDutyDescription("");
    refreshData();
  };

  const handleOpenEditPolicyModal = () => {
    setPolicyRulesEdit([...(policy?.rules || [])]);
    setIsEditPolicyModalOpen(true);
  };

  const handleSavePolicyRules = () => {
    const res = ExtraWorkWalletService.updatePointPolicy(policyRulesEdit);
    showBanner(res.message);
    setIsEditPolicyModalOpen(false);
    refreshData();
  };

  const handleExportAuditTrailCSV = () => {
    const headers = "Audit ID,Item Title,Faculty Name,Department,Original WWP,Adjusted WWP,Difference,Reason,Authorized By,Timestamp\n";
    const rows = auditLogs
      .map(
        (l) =>
          `"${l.id}","${l.itemTitle}","${l.facultyName}","${l.department}",${l.originalWWP},${l.adjustedWWP},${l.difference},"${l.reason}","${l.authorizedBy}","${l.timestamp}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Institutional_ExtraWork_AuditTrail_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    showBanner("Audit Trail CSV exported successfully!");
  };

  const openOverrideForFaculty = (f: any) => {
    setOverrideFacultyName(f.facultyName);
    setOverrideDepartment(f.branch);
    setOverrideItemId(`EW-2026-${Math.floor(100 + Math.random() * 900)}`);
    setOverrideItemTitle(`Extra Contribution Override - ${f.topCategory}`);
    setOverrideOriginalWWP(String(f.totalWWP));
    setOverrideAdjustedWWP(String(f.totalWWP + 50));
    setIsOverrideModalOpen(true);
  };

  const openAssignDutyForFaculty = (f: any) => {
    setDutyFacultyId(f.facultyId);
    setDutyFacultyName(f.facultyName);
    setDutyDepartment(f.branch);
    setIsAssignDutyModalOpen(true);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* SUCCESS / ACTION NOTIFICATION BANNER */}
      {bannerMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fade-in-soft">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{bannerMessage}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setBannerMessage(null)}
            className="h-6 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <ShieldCheck className="size-4 text-primary" />
            <span>Institutional Governance • Principal & Super Admin</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Institutional Extra Work Governance
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Role-based request queues (HOD, Deans, Principal), branch-wise faculty drill-down, policy engine, and audit log
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setIsOverrideModalOpen(true)}
            variant="outline"
            className="text-xs font-semibold rounded-xl gap-2 border-border shadow-2xs hover:bg-muted"
          >
            <Lock className="size-4 text-primary" />
            <span>Log Point Override</span>
          </Button>
          <Button
            onClick={() => setIsAssignDutyModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 py-2 gap-2 rounded-xl shadow-2xs"
          >
            <PlusCircle className="size-4" />
            <span>Assign Institutional Duty</span>
          </Button>
        </div>
      </div>

      {/* SUPER ADMIN ROLE PERSPECTIVE SELECTOR BAR */}
      <Card className="border border-primary/20 bg-primary/5 dark:bg-primary/10 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck2 className="size-5 text-primary shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Super Admin Role Request Filter</h3>
              <p className="text-xs text-muted-foreground">Filter requests categorized by their designated Verification Authority</p>
            </div>
          </div>

          {/* ROLE PILLS */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              size="sm"
              variant={rolePerspectiveFilter === "ALL" ? "default" : "outline"}
              onClick={() => {
                setRolePerspectiveFilter("ALL");
                setActiveTab("ROLE_QUEUES");
              }}
              className="text-xs font-semibold rounded-xl h-8 px-3"
            >
              All Roles ({countByRole.ALL})
            </Button>
            <Button
              size="sm"
              variant={rolePerspectiveFilter === "HOD" ? "default" : "outline"}
              onClick={() => {
                setRolePerspectiveFilter("HOD");
                setActiveTab("ROLE_QUEUES");
              }}
              className="text-xs font-semibold rounded-xl h-8 px-3 border-border"
            >
              HOD Queue ({countByRole.HOD})
            </Button>
            <Button
              size="sm"
              variant={rolePerspectiveFilter === "RESEARCH_DEAN" ? "default" : "outline"}
              onClick={() => {
                setRolePerspectiveFilter("RESEARCH_DEAN");
                setActiveTab("ROLE_QUEUES");
              }}
              className="text-xs font-semibold rounded-xl h-8 px-3 border-border"
            >
              Research Dean ({countByRole.RESEARCH_DEAN})
            </Button>
            <Button
              size="sm"
              variant={rolePerspectiveFilter === "IQAC_DEAN" ? "default" : "outline"}
              onClick={() => {
                setRolePerspectiveFilter("IQAC_DEAN");
                setActiveTab("ROLE_QUEUES");
              }}
              className="text-xs font-semibold rounded-xl h-8 px-3 border-border"
            >
              IQAC Dean ({countByRole.IQAC_DEAN})
            </Button>
            <Button
              size="sm"
              variant={rolePerspectiveFilter === "PRINCIPAL" ? "default" : "outline"}
              onClick={() => {
                setRolePerspectiveFilter("PRINCIPAL");
                setActiveTab("ROLE_QUEUES");
              }}
              className="text-xs font-semibold rounded-xl h-8 px-3 border-border"
            >
              Principal Orders ({countByRole.PRINCIPAL})
            </Button>
          </div>
        </div>
      </Card>

      {/* INSTITUTIONAL KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground">Total Verified WWP</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-foreground">
              {summary?.totalVerifiedWWP || 18420} <span className="text-xs font-normal text-muted-foreground">WWP</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">Institutional Total</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground">Active Faculty</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-foreground">
              {summary?.activeFacultyCount || 248} <span className="text-xs font-normal text-muted-foreground">Contributors</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">Participating Members</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground">Pending Approval</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-amber-600 dark:text-amber-400">
              {allClaims.filter((c) => ["SUBMITTED", "UNDER_REVIEW"].includes(c.status)).length}{" "}
              <span className="text-xs font-normal text-muted-foreground">Claims</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">In Verification Queues</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground">Total Direct Duty</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-foreground">
              {summary?.assignedOpportunitiesCount || 1284} <span className="text-xs font-normal text-muted-foreground">Assigned</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">Institutional Orders</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground">Audited Overrides</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-foreground">
              {auditLogs.length} <span className="text-xs font-normal text-muted-foreground">Logged</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">Audit-Trail Backed</p>
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        <Button
          onClick={() => setActiveTab("ROLE_QUEUES")}
          variant={activeTab === "ROLE_QUEUES" ? "default" : "ghost"}
          className={`text-xs font-semibold rounded-xl shrink-0 gap-1.5 ${
            activeTab === "ROLE_QUEUES" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          <FileCheck2 className="size-4" />
          <span>Role Verification Queues ({filteredClaimsByRole.length})</span>
        </Button>
        <Button
          onClick={() => setActiveTab("OVERVIEW")}
          variant={activeTab === "OVERVIEW" ? "default" : "ghost"}
          className={`text-xs font-semibold rounded-xl shrink-0 ${
            activeTab === "OVERVIEW" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Branch-wise Faculty Drill-Down ({filteredFaculty.length})
        </Button>
        <Button
          onClick={() => setActiveTab("DEPARTMENTS")}
          variant={activeTab === "DEPARTMENTS" ? "default" : "ghost"}
          className={`text-xs font-semibold rounded-xl shrink-0 ${
            activeTab === "DEPARTMENTS" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Department Summary ({summary?.departmentContributions?.length || 0})
        </Button>
        <Button
          onClick={() => setActiveTab("POLICY")}
          variant={activeTab === "POLICY" ? "default" : "ghost"}
          className={`text-xs font-semibold rounded-xl shrink-0 ${
            activeTab === "POLICY" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Institutional Policy ({policy?.version || "v1.2"})
        </Button>
        <Button
          onClick={() => setActiveTab("AUDIT")}
          variant={activeTab === "AUDIT" ? "default" : "ghost"}
          className={`text-xs font-semibold rounded-xl shrink-0 ${
            activeTab === "AUDIT" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Governance Audit Log ({auditLogs.length})
        </Button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: ROLE VERIFICATION QUEUES (ROLES-BASED REQUESTS) */}
      {/* ---------------------------------------------------- */}
      {activeTab === "ROLE_QUEUES" && (
        <Card className="border border-border bg-card text-card-foreground rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Role-Based Extra Work Claims Verification Queue
              </h3>
              <p className="text-xs text-muted-foreground">
                Showing claims targeting role authority: <strong>{rolePerspectiveFilter}</strong>
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search claims or faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl border-border bg-muted/40"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredClaimsByRole.map((item) => (
              <Card key={item.id} className="border border-border bg-card text-card-foreground rounded-2xl p-4 shadow-2xs hover:border-primary/40 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px] font-semibold">
                        {item.category.replace(/_/g, " ")}
                      </Badge>
                      <Badge variant="outline" className="border-border text-primary text-[10px] flex items-center gap-1 font-bold">
                        <Send className="size-3" />
                        <span>Target: {item.targetVerificationAuthority ? item.targetVerificationAuthority.replace(/_/g, " ") : "HOD"}</span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          item.status === "VERIFIED"
                            ? "text-emerald-600 border-emerald-300"
                            : item.status === "REJECTED"
                            ? "text-rose-600 border-rose-300"
                            : "text-amber-600 border-amber-300"
                        }`}
                      >
                        {item.status}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-mono">ID: {item.id}</span>
                    </div>

                    <h4 className="text-base font-bold text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Faculty: <strong className="text-foreground">{item.facultyName}</strong> ({item.department}) • Role:{" "}
                      <strong className="text-foreground">{item.role || "Contributor"}</strong>
                    </p>

                    {item.evidenceList && item.evidenceList.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        <span className="text-[11px] text-muted-foreground font-semibold">Attached Proofs ({item.evidenceList.length}):</span>
                        {item.evidenceList.map((ev, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] border-border text-muted-foreground gap-1">
                            <Paperclip className="size-3 text-primary" />
                            <span>{ev.title || ev.name}</span>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end gap-2 shrink-0 border-t md:border-t-0 border-border pt-3 md:pt-0">
                    <span className="text-xl font-extrabold text-primary font-mono">+{item.calculation.totalWWP} WWP</span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setActiveInspectClaim(item);
                        setVerifyAdjustedPoints(String(item.calculation.totalWWP));
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl h-8 px-4"
                    >
                      Inspect & Verify
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {filteredClaimsByRole.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-xs border border-dashed border-border rounded-2xl">
                No extra work claims found matching the active filter.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: BRANCH-WISE FACULTY DRILL DOWN TABLE */}
      {/* ---------------------------------------------------- */}
      {activeTab === "OVERVIEW" && (
        <Card className="border border-border bg-card text-card-foreground rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-foreground">Faculty Extra Work Contribution Drill-Down</h3>
              <p className="text-xs text-muted-foreground">Showing {filteredFaculty.length} faculty members for branch: <strong>{selectedBranch}</strong></p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {filteredFaculty.length} Faculty Selected
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
                  <th className="p-3">Faculty Name & Branch</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3 text-right">Total Verified WWP</th>
                  <th className="p-3 text-center">Verified</th>
                  <th className="p-3 text-center">Pending</th>
                  <th className="p-3">Animated Tier Badge</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredFaculty.map((f) => (
                  <tr key={f.facultyId} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{f.facultyName}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="outline" className="border-border text-[10px] font-bold px-1.5 py-0">
                          {f.branch}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-mono">{f.facultyId}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{f.designation}</td>
                    <td className="p-3 text-right font-mono font-extrabold text-primary text-sm">
                      +{f.totalWWP} WWP
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {f.verifiedItems}
                    </td>
                    <td className="p-3 text-center font-bold text-amber-600 dark:text-amber-400">
                      {f.pendingClaims}
                    </td>
                    <td className="p-3">
                      <FacultyTierBadge level={f.status} totalWWP={f.totalWWP} size="sm" />
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedFacultyDetail(f);
                          setIsFacultyDetailModalOpen(true);
                        }}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <Eye className="size-3.5" />
                        <span>View</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openAssignDutyForFaculty(f)}
                        className="h-7 px-2 text-xs gap-1 border-border"
                      >
                        <PlusCircle className="size-3.5 text-primary" />
                        <span>Assign</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openOverrideForFaculty(f)}
                        className="h-7 px-2 text-xs gap-1 border-border text-amber-600 dark:text-amber-400"
                      >
                        <Lock className="size-3.5" />
                        <span>Override</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: DEPARTMENT SUMMARY TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === "DEPARTMENTS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(summary?.departmentContributions || []).map((dept) => (
            <Card
              key={dept.department}
              className="border border-border bg-card text-card-foreground rounded-2xl p-5 shadow-2xs space-y-4 hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => {
                setSelectedBranch(dept.department);
                setActiveTab("OVERVIEW");
              }}
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-border font-bold text-xs">
                  {dept.department} Department
                </Badge>
                <span className="text-xl font-extrabold font-mono text-primary">+{dept.totalWWP} WWP</span>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-border text-xs text-muted-foreground">
                <p className="flex justify-between">
                  <span>Participating Faculty:</span>
                  <strong className="text-foreground">{dept.facultyCount} Members</strong>
                </p>
                <p className="flex justify-between">
                  <span>Verified Activities:</span>
                  <strong className="text-foreground">{dept.verifiedItemsCount} Items</strong>
                </p>
                <p className="flex justify-between">
                  <span>Top Contributor:</span>
                  <strong className="text-foreground">{dept.topContributor}</strong>
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold rounded-xl gap-2 border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all"
              >
                <span>Drill Into {dept.department} Faculty</span>
                <ChevronRight className="size-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: POLICY MATRIX TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === "POLICY" && (
        <Card className="border border-border bg-card text-card-foreground rounded-2xl p-5 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">{policy?.policyTitle || "Institutional Extra Work Merit Policy Matrix"}</h3>
              <p className="text-xs text-muted-foreground">
                Version <strong>{policy?.version || "v1.2"}</strong> • Effective: {policy?.effectiveDate || "01 Jan 2026"} • Modified by {policy?.modifiedBy}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-bold text-xs">Active Policy Matrix</Badge>
              <Button
                size="sm"
                onClick={handleOpenEditPolicyModal}
                className="bg-primary text-primary-foreground font-semibold text-xs rounded-xl gap-1.5"
              >
                <Edit3 className="size-3.5" />
                <span>Edit Policy Rules</span>
              </Button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Award className="size-4 text-primary" />
              <span>Standard Base Points & Category Limits</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(policy?.rules || []).map((rule) => (
                <div key={rule.ruleId || rule.activityType} className="p-4 bg-muted/40 rounded-2xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-border text-[10px] font-bold">
                      {rule.ruleId}
                    </Badge>
                    <span className="font-mono font-extrabold text-sm text-primary">+{rule.basePoints} WWP</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">{rule.activityType}</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Category: {rule.category.replace(/_/g, " ")}</p>
                  </div>
                  <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground flex justify-between">
                    <span>Max Limit: {rule.maxAnnualLimit || rule.maxPointsCap} WWP</span>
                    <span>Auth: {rule.verificationAuthority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: GOVERNANCE AUDIT LOG TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === "AUDIT" && (
        <Card className="border border-border bg-card text-card-foreground rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Point Adjustment & Override Audit Trail</h3>
              <p className="text-xs text-muted-foreground">Immutable audit records of all Principal & Super Admin point overrides</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search audit log..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs rounded-xl border-border bg-muted/40"
                />
              </div>
              <Button
                size="sm"
                onClick={handleExportAuditTrailCSV}
                variant="outline"
                className="h-8 text-xs font-semibold rounded-xl gap-1.5 border-border"
              >
                <Download className="size-3.5 text-primary" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-muted/40 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] font-bold border-border">
                      {log.id}
                    </Badge>
                    <span className="font-bold text-foreground">{log.itemTitle}</span>
                  </div>
                  <p className="text-muted-foreground">
                    Faculty: <strong>{log.facultyName}</strong> ({log.department})
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-card p-2 rounded-xl border border-border mt-1">
                    Justification: {log.reason}
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className="font-mono font-extrabold text-sm text-amber-600 dark:text-amber-400">
                    {log.originalWWP} WWP ➔ {log.adjustedWWP} WWP ({log.difference > 0 ? `+${log.difference}` : log.difference} WWP)
                  </div>
                  <p className="text-[10px] text-muted-foreground">Auth: {log.authorizedBy}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ---------------------------------------------------- */}
      {/* INSPECT & VERIFY CLAIM DIALOG */}
      {/* ---------------------------------------------------- */}
      {activeInspectClaim && (
        <Dialog open={!!activeInspectClaim} onOpenChange={() => setActiveInspectClaim(null)}>
          <DialogContent className="bg-card border-border text-card-foreground max-w-lg rounded-2xl p-6">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase">
                <FileCheck2 className="size-4" />
                <span>Super Admin Claim Verification</span>
              </div>
              <DialogTitle className="text-base font-bold">{activeInspectClaim.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submitted by {activeInspectClaim.facultyName} ({activeInspectClaim.department}) • Target Authority: {activeInspectClaim.targetVerificationAuthority || "HOD"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs my-2">
              <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-1.5">
                <p>Category: <strong className="text-foreground">{activeInspectClaim.category.replace(/_/g, " ")}</strong></p>
                <p>Role: <strong className="text-foreground">{activeInspectClaim.role || "Contributor"}</strong></p>
                <p>Description: <span className="text-muted-foreground">{activeInspectClaim.description}</span></p>
              </div>

              {/* ATTACHED EVIDENCE */}
              {activeInspectClaim.evidenceList && activeInspectClaim.evidenceList.length > 0 && (
                <div>
                  <h5 className="font-bold text-foreground mb-1">Attached Evidence Documents:</h5>
                  <div className="space-y-1.5">
                    {activeInspectClaim.evidenceList.map((ev, i) => (
                      <div key={i} className="p-2 bg-muted/30 rounded-xl border border-border flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">{ev.title || ev.name}</span>
                        <Badge variant="outline" className="text-[10px]">Attachment</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-foreground">Points Engine Audit & Adjustment</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Claimed WWP</span>
                    <p className="font-mono font-bold text-sm text-primary">+{activeInspectClaim.calculation.totalWWP} WWP</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Override WWP</span>
                    <Input
                      type="number"
                      value={verifyAdjustedPoints}
                      onChange={(e) => setVerifyAdjustedPoints(e.target.value)}
                      className="h-8 text-xs font-mono font-bold border-border bg-card"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground">Reviewer Verification Notes</label>
                <Textarea
                  placeholder="Enter approval or rejection remarks..."
                  value={verifyReviewerNotes}
                  onChange={(e) => setVerifyReviewerNotes(e.target.value)}
                  className="text-xs border-border mt-1 min-h-16"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
              <Button
                variant="outline"
                onClick={() => handleVerifyClaimAction("REJECT")}
                className="text-xs text-rose-600 border-border hover:bg-rose-50 dark:hover:bg-rose-950"
              >
                <XCircle className="size-3.5 mr-1" /> Reject Claim
              </Button>
              <Button
                onClick={() => handleVerifyClaimAction("VERIFY")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl gap-1.5"
              >
                <CheckCircle2 className="size-4" /> Verify & Credit WWP
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL 1: POINT OVERRIDE MODAL */}
      <Dialog open={isOverrideModalOpen} onOpenChange={setIsOverrideModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Lock className="size-5 text-primary" />
              <span>Log Governance Point Override</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Principal / Super Admin Master Override: Audit logged and immutably stored.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleOverrideSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-foreground">Select Faculty Member</label>
              <Select
                value={overrideFacultyName}
                onValueChange={(val) => {
                  setOverrideFacultyName(val);
                  const f = allFacultyData.find((item) => item.facultyName === val);
                  if (f) {
                    setOverrideDepartment(f.branch);
                    setOverrideOriginalWWP(String(f.totalWWP));
                    setOverrideAdjustedWWP(String(f.totalWWP + 50));
                  }
                }}
              >
                <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-card mt-1">
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  {allFacultyData.map((f) => (
                    <SelectItem key={f.facultyId} value={f.facultyName}>
                      {f.facultyName} ({f.branch}) — {f.totalWWP} WWP
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="font-semibold text-foreground">Activity / Claim Title</label>
              <Input
                value={overrideItemTitle}
                onChange={(e) => setOverrideItemTitle(e.target.value)}
                className="h-9 text-xs border-border mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Standard Base WWP</label>
                <Input
                  type="number"
                  value={overrideOriginalWWP}
                  onChange={(e) => setOverrideOriginalWWP(e.target.value)}
                  className="h-9 text-xs border-border bg-muted/50 mt-1 font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Adjusted WWP *</label>
                <Input
                  type="number"
                  value={overrideAdjustedWWP}
                  onChange={(e) => setOverrideAdjustedWWP(e.target.value)}
                  className="h-9 text-xs border-border mt-1 font-mono font-bold text-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">Mandatory Justification Reason *</label>
              <Textarea
                placeholder="State policy exception, extraordinary contribution or institutional impact justification..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="text-xs border-border mt-1 min-h-20"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsOverrideModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold rounded-xl">
                Authorize & Log Override
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: ASSIGN INSTITUTIONAL DUTY MODAL */}
      <Dialog open={isAssignDutyModalOpen} onOpenChange={setIsAssignDutyModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <PlusCircle className="size-5 text-primary" />
              <span>Assign Direct Institutional Extra Work Duty</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Directly assign institutional responsibilities to faculty with allocated WWP credit points.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignDutySubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Select Faculty Member *</label>
                <Select
                  value={dutyFacultyId}
                  onValueChange={(val) => {
                    const f = allFacultyData.find((item) => item.facultyId === val);
                    if (f) {
                      setDutyFacultyId(f.facultyId);
                      setDutyFacultyName(f.facultyName);
                      setDutyDepartment(f.branch);
                    }
                  }}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-card mt-1">
                    <SelectValue placeholder="Select Faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {allFacultyData.map((f) => (
                      <SelectItem key={f.facultyId} value={f.facultyId}>
                        {f.facultyName} ({f.branch})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-semibold text-foreground">Work Category</label>
                <Select
                  value={dutyCategory}
                  onValueChange={(val) => setDutyCategory(val as ExtraWorkCategory)}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-card mt-1">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INSTITUTIONAL_GOVERNANCE">Institutional Governance</SelectItem>
                    <SelectItem value="EVENTS_ORGANIZATION">Events & Program Organization</SelectItem>
                    <SelectItem value="RESEARCH_INNOVATION">Research & Innovation</SelectItem>
                    <SelectItem value="STUDENT_MENTORSHIP">Student Mentorship & Development</SelectItem>
                    <SelectItem value="ACCREDITATION_COMPLIANCE">Accreditation & NAAC/NIRF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">Duty Title *</label>
              <Input
                placeholder="e.g. NAAC Criterion 3 Steering Convenor 2026"
                value={dutyTitle}
                onChange={(e) => setDutyTitle(e.target.value)}
                className="h-9 text-xs border-border mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Allocated WWP Credit *</label>
                <Input
                  type="number"
                  placeholder="50"
                  value={dutyWWPPoints}
                  onChange={(e) => setDutyWWPPoints(e.target.value)}
                  className="h-9 text-xs border-border font-mono font-bold text-primary mt-1"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Target Completion Deadline</label>
                <Input
                  type="date"
                  value={dutyDeadline}
                  onChange={(e) => setDutyDeadline(e.target.value)}
                  className="h-9 text-xs border-border mt-1"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">Verification Authority</label>
              <Select
                value={dutyTargetAuthority}
                onValueChange={(val) => setDutyTargetAuthority(val as VerificationAuthority)}
              >
                <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-card mt-1">
                  <SelectValue placeholder="Select Authority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEAN_ACADEMIC">Dean Academic Console</SelectItem>
                  <SelectItem value="DEAN_RESEARCH">Dean Research Console</SelectItem>
                  <SelectItem value="IQAC_DEAN">IQAC Steering Console</SelectItem>
                  <SelectItem value="HOD">Department HOD Console</SelectItem>
                  <SelectItem value="PRINCIPAL">Principal Master Console</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="font-semibold text-foreground">Description & Scope</label>
              <Textarea
                placeholder="Specify duties, deliverables, and institutional objectives..."
                value={dutyDescription}
                onChange={(e) => setDutyDescription(e.target.value)}
                className="text-xs border-border mt-1 min-h-16"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAssignDutyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold rounded-xl">
                Assign Order & Issue Notice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: FACULTY CLAIMS & BADGE DETAIL MODAL */}
      <Dialog open={isFacultyDetailModalOpen} onOpenChange={setIsFacultyDetailModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-xl rounded-2xl p-6">
          {selectedFacultyDetail && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-border font-bold text-xs">
                    {selectedFacultyDetail.branch} Department
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">ID: {selectedFacultyDetail.facultyId}</span>
                </div>
                <DialogTitle className="text-xl font-extrabold mt-1">
                  {selectedFacultyDetail.facultyName}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {selectedFacultyDetail.designation} • {selectedFacultyDetail.topCategory} Specialist
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2">
                <div className="p-4 bg-muted/40 rounded-2xl border border-border flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Current Merit Status</span>
                    <h4 className="text-lg font-extrabold text-foreground mt-0.5">{selectedFacultyDetail.totalWWP} WWP Earned</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Verified Activities: <strong>{selectedFacultyDetail.verifiedItems}</strong> | Pending: <strong>{selectedFacultyDetail.pendingClaims}</strong>
                    </p>
                  </div>

                  <FacultyTierBadge level={selectedFacultyDetail.status} totalWWP={selectedFacultyDetail.totalWWP} size="md" />
                </div>
              </div>

              <DialogFooter className="pt-2 flex justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFacultyDetailModalOpen(false);
                    openOverrideForFaculty(selectedFacultyDetail);
                  }}
                  className="text-xs font-semibold rounded-xl text-amber-600 dark:text-amber-400 border-border"
                >
                  <Lock className="size-3.5 mr-1" /> Override Points
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsFacultyDetailModalOpen(false);
                    openAssignDutyForFaculty(selectedFacultyDetail);
                  }}
                  className="bg-primary text-primary-foreground font-semibold text-xs rounded-xl"
                >
                  <PlusCircle className="size-3.5 mr-1" /> Assign Duty
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 4: EDIT POLICY RULES MODAL */}
      <Dialog open={isEditPolicyModalOpen} onOpenChange={setIsEditPolicyModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Edit3 className="size-5 text-primary" />
              <span>Edit Institutional Point Matrix Policy Rules</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Adjust standard base points, annual caps, and verification authorities for version {policy?.version}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {policyRulesEdit.map((rule, idx) => (
              <div key={idx} className="p-3 bg-muted/40 rounded-xl border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <Input
                    value={rule.activityType}
                    onChange={(e) => {
                      const copy = [...policyRulesEdit];
                      copy[idx].activityType = e.target.value;
                      setPolicyRulesEdit(copy);
                    }}
                    className="h-8 text-xs font-bold border-border"
                  />
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {rule.ruleId}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold">Base WWP</label>
                    <Input
                      type="number"
                      value={rule.basePoints}
                      onChange={(e) => {
                        const copy = [...policyRulesEdit];
                        copy[idx].basePoints = Number(e.target.value);
                        setPolicyRulesEdit(copy);
                      }}
                      className="h-7 text-xs font-mono border-border"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold">Annual Cap</label>
                    <Input
                      type="number"
                      value={rule.maxAnnualLimit || rule.maxPointsCap}
                      onChange={(e) => {
                        const copy = [...policyRulesEdit];
                        copy[idx].maxAnnualLimit = Number(e.target.value);
                        setPolicyRulesEdit(copy);
                      }}
                      className="h-7 text-xs font-mono border-border"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold">Authority</label>
                    <Input
                      value={rule.verificationAuthority}
                      onChange={(e) => {
                        const copy = [...policyRulesEdit];
                        copy[idx].verificationAuthority = e.target.value;
                        setPolicyRulesEdit(copy);
                      }}
                      className="h-7 text-xs border-border"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsEditPolicyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSavePolicyRules} className="bg-primary text-primary-foreground font-semibold rounded-xl">
              Publish & Increment Policy Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
