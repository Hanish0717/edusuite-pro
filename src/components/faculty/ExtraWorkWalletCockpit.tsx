import React, { useState } from "react";
import {
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  FileText,
  PlusCircle,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users,
  Info,
  TrendingUp,
  Image as ImageIcon,
  Check,
  X,
  FileCheck,
  Star,
  Download,
  Plane,
  Gift,
  Filter,
  Printer,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtraWorkWalletService } from "@/services/extra-work-wallet-service";
import {
  ExtraWorkItem,
  ExtraWorkOpportunity,
  FacultyWalletSummary,
  ExtraWorkCategory,
  EvidenceItem,
  EvidenceType,
  WWPBenefit,
} from "@/types/extra-work-wallet";
import { FacultyTierBadge } from "../extra-work/FacultyTierBadge";

const CATEGORY_META: Record<
  ExtraWorkCategory,
  { label: string; icon: any; color: string; badgeBg: string; barBg: string }
> = {
  EVENTS: {
    label: "Events & Programs",
    icon: Sparkles,
    color: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    barBg: "bg-blue-600",
  },
  STUDENT_DEVELOPMENT: {
    label: "Student Development",
    icon: Users,
    color: "text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
    barBg: "bg-teal-500",
  },
  INSTITUTIONAL: {
    label: "Institutional Extra Work",
    icon: Building2,
    color: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
    barBg: "bg-purple-600",
  },
  RESEARCH_INNOVATION: {
    label: "Research & Innovation",
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    barBg: "bg-emerald-500",
  },
  INDUSTRY_ENGAGEMENT: {
    label: "Industry Engagement",
    icon: Briefcase,
    color: "text-sky-600 dark:text-sky-400",
    badgeBg: "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
    barBg: "bg-sky-500",
  },
  SOCIAL_COMMUNITY: {
    label: "Social & Community",
    icon: ShieldCheck,
    color: "text-pink-600 dark:text-pink-400",
    badgeBg: "bg-pink-50 text-pink-700 border-pink-200/80 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800",
    barBg: "bg-pink-500",
  },
  HIGH_IMPACT_ACHIEVEMENT: {
    label: "High-Impact Achievement",
    icon: Star,
    color: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    barBg: "bg-amber-500",
  },
};

export function ExtraWorkWalletCockpit() {
  const [summary, setSummary] = useState<FacultyWalletSummary>(() => ExtraWorkWalletService.getFacultyWalletSummary());
  const [ledgerItems, setLedgerItems] = useState<ExtraWorkItem[]>(() => ExtraWorkWalletService.getFacultyExtraWorkItems());
  const [opportunities, setOpportunities] = useState<ExtraWorkOpportunity[]>(() => ExtraWorkWalletService.getOpportunities());
  const [evidenceVault, setEvidenceVault] = useState<EvidenceItem[]>(() => ExtraWorkWalletService.getEvidenceVault());
  const [benefitsList, setBenefitsList] = useState<WWPBenefit[]>(() => ExtraWorkWalletService.getWWPBenefits());

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");

  // Dialog States
  const [selectedItemForAudit, setSelectedItemForAudit] = useState<ExtraWorkItem | null>(null);
  const [selectedItemForEvidence, setSelectedItemForEvidence] = useState<ExtraWorkItem | null>(null);
  const [previewEvidenceImage, setPreviewEvidenceImage] = useState<EvidenceItem | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // New Claim Form State
  const [claimTitle, setClaimTitle] = useState("");
  const [claimCategory, setClaimCategory] = useState<ExtraWorkCategory>("EVENTS");
  const [claimRole, setClaimRole] = useState("");
  const [claimDescription, setClaimDescription] = useState("");
  const [claimStartDate, setClaimStartDate] = useState("");
  const [claimHours, setClaimHours] = useState("");
  const [claimStudents, setClaimStudents] = useState("");
  const [claimEvidenceTitle, setClaimEvidenceTitle] = useState("");
  const [claimEvidenceUrl, setClaimEvidenceUrl] = useState("");
  const [claimEvidenceType, setClaimEvidenceType] = useState<EvidenceType>("CERTIFICATE");
  const [claimFeedbackMsg, setClaimFeedbackMsg] = useState<{ success: boolean; text: string } | null>(null);

  const refreshData = () => {
    const sum = ExtraWorkWalletService.getFacultyWalletSummary();
    setSummary(sum);
    setLedgerItems(ExtraWorkWalletService.getFacultyExtraWorkItems());
    setOpportunities(ExtraWorkWalletService.getOpportunities());
    setEvidenceVault(ExtraWorkWalletService.getEvidenceVault());
    setBenefitsList(ExtraWorkWalletService.getWWPBenefits(sum.totalWWP));
  };

  const handleApplyOpportunity = (oppId: string) => {
    const res = ExtraWorkWalletService.applyForOpportunity(oppId);
    if (res.success) {
      refreshData();
    }
    alert(res.message);
  };

  const handleFilterByCategory = (categoryKey: string) => {
    setSelectedCategoryFilter(categoryKey);
    setActiveTab("ledger");
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTitle || !claimRole || !claimStartDate) {
      setClaimFeedbackMsg({ success: false, text: "Please fill in all required fields (Title, Role, Date)." });
      return;
    }

    const evidenceList: EvidenceItem[] = [];
    if (claimEvidenceUrl) {
      evidenceList.push({
        id: `EV-CLAIM-${Date.now()}`,
        type: claimEvidenceType,
        title: claimEvidenceTitle || `${claimTitle} Proof`,
        url: claimEvidenceUrl,
        uploadedAt: new Date().toISOString(),
      });
    }

    const res = ExtraWorkWalletService.claimExtraWork({
      title: claimTitle,
      category: claimCategory,
      role: claimRole,
      description: claimDescription,
      startDate: claimStartDate,
      durationHours: claimHours ? Number(claimHours) : undefined,
      studentCount: claimStudents ? Number(claimStudents) : undefined,
      evidenceItems: evidenceList,
    });

    setClaimFeedbackMsg({ success: res.success, text: res.message });

    if (res.success) {
      refreshData();
      setTimeout(() => {
        setIsClaimModalOpen(false);
        setClaimTitle("");
        setClaimRole("");
        setClaimDescription("");
        setClaimStartDate("");
        setClaimHours("");
        setClaimStudents("");
        setClaimEvidenceUrl("");
        setClaimFeedbackMsg(null);
      }, 1200);
    }
  };

  // Filtered Ledger Items
  const filteredLedger = ledgerItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === "ALL" || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const reportData = ExtraWorkWalletService.generateAnnualContributionReport();

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            <Award className="size-4" />
            <span>Faculty Contribution Ecosystem</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Faculty Extra Work Wallet
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Recognizing & rewarding verified extra contributions beyond regular duties • 100% Points Based
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsClaimModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm gap-2 text-xs md:text-sm px-4 py-2 rounded-xl"
          >
            <PlusCircle className="size-4" />
            <span>+ Log Extra Work Claim</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsReportModalOpen(true)}
            className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 gap-2 text-xs md:text-sm px-4 py-2 rounded-xl font-medium shadow-xs"
          >
            <Download className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>Annual Report</span>
          </Button>
        </div>
      </div>

      {/* TOP STATS DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL VERIFIED WWP CARD WITH ANIMATED BADGE */}
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Total Verified WWP
              </span>
              <FacultyTierBadge
                level={summary.levelInfo.currentLevel}
                totalWWP={summary.totalWWP}
                size="sm"
              />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {summary.totalWWP}
              </span>
              <span className="text-xs font-bold font-mono bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md">
                WWP
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Level: <strong className="text-slate-900 dark:text-white">{summary.levelInfo.levelName}</strong></span>
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              {summary.levelInfo.pointsToNextLevel > 0 ? `${summary.levelInfo.pointsToNextLevel} WWP to ${summary.levelInfo.nextLevelName}` : "Top Tier Reached"}
            </span>
          </div>
        </Card>

        {/* THIS MONTH WWP */}
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                This Month Earned
              </span>
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-5" />
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                +{summary.thisMonthWWP}
              </span>
              <span className="text-xs font-medium text-slate-400 font-mono">WWP</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Last Credit Date:</span>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{summary.lastCreditedDate}</span>
          </div>
        </Card>

        {/* ACADEMIC YEAR TARGET */}
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Academic Year Target
              </span>
              <span className="grid size-9 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Award className="size-5" />
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                {summary.thisAcademicYearWWP}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {summary.targetAcademicYearWWP} WWP</span>
            </div>
          </div>
          <div className="space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
            <Progress value={Math.min(100, Math.round((summary.thisAcademicYearWWP / summary.targetAcademicYearWWP) * 100))} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Goal Progress</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{Math.round((summary.thisAcademicYearWWP / summary.targetAcademicYearWWP) * 100)}%</span>
            </div>
          </div>
        </Card>

        {/* PENDING VERIFICATION */}
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Pending Verification
              </span>
              <span className="grid size-9 place-items-center rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                <Clock className="size-5" />
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-purple-600 dark:text-purple-400">
                {summary.pendingItemsCount}
              </span>
              <span className="text-xs font-semibold text-slate-500">Claims</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Awaiting Credit:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">~{summary.pendingWWPEstimate} WWP</span>
          </div>
        </Card>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Quick Actions:</span>
        <Button
          onClick={() => setIsClaimModalOpen(true)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-8 rounded-xl"
        >
          <PlusCircle className="size-3.5 mr-1.5" /> + Log Extra Work
        </Button>
        <Button
          onClick={() => setActiveTab("opportunities")}
          size="sm"
          variant="outline"
          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs font-semibold h-8 rounded-xl"
        >
          <Sparkles className="size-3.5 mr-1.5 text-amber-500" /> View Opportunities
        </Button>
        <Button
          onClick={() => setActiveTab("evidence")}
          size="sm"
          variant="outline"
          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs font-semibold h-8 rounded-xl"
        >
          <FileCheck className="size-3.5 mr-1.5 text-emerald-500" /> Evidence Vault
        </Button>
        <Button
          onClick={() => setIsReportModalOpen(true)}
          size="sm"
          variant="outline"
          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs font-semibold h-8 rounded-xl"
        >
          <Download className="size-3.5 mr-1.5 text-purple-500" /> My Annual Report
        </Button>
      </div>

      {/* TABS NAVIGATION */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 p-1.5 rounded-2xl w-full flex justify-start overflow-x-auto no-scrollbar gap-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs text-xs md:text-sm px-4 py-2 font-semibold rounded-xl"
          >
            Overview & Breakdown
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs text-xs md:text-sm px-4 py-2 font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Gift className="size-3.5 text-amber-500" />
            <span>My WWP Benefits ({benefitsList.filter(b=>b.unlocked).length} Unlocked)</span>
          </TabsTrigger>
          <TabsTrigger
            value="ledger"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs text-xs md:text-sm px-4 py-2 font-semibold rounded-xl"
          >
            Extra Work Ledger ({ledgerItems.length})
          </TabsTrigger>
          <TabsTrigger
            value="opportunities"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs text-xs md:text-sm px-4 py-2 font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Sparkles className="size-3.5 text-amber-500" />
            <span>Opportunities ({opportunities.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="evidence"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs text-xs md:text-sm px-4 py-2 font-semibold rounded-xl flex items-center gap-1.5"
          >
            <FileCheck className="size-3.5 text-emerald-500" />
            <span>Evidence Vault ({evidenceVault.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CATEGORY BREAKDOWN BARS (COMPACT & CLICKABLE) */}
            <Card className="lg:col-span-2 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-sm">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="size-5 text-blue-600 dark:text-blue-400" />
                    Extra Contribution Category Distribution
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Click any category to filter your Extra Work Ledger
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-semibold text-slate-400 border-slate-200 dark:border-slate-700">
                  <Filter className="size-3 mr-1" /> Clickable Filter
                </Badge>
              </CardHeader>
              <CardContent className="pt-5 space-y-3.5">
                {(Object.keys(CATEGORY_META) as ExtraWorkCategory[]).map((catKey) => {
                  const meta = CATEGORY_META[catKey];
                  const catPoints = summary.categoryBreakdown[catKey] || 0;
                  const percentage = summary.totalWWP > 0 ? Math.round((catPoints / summary.totalWWP) * 100) : 0;
                  const IconComponent = meta.icon;

                  return (
                    <div
                      key={catKey}
                      onClick={() => handleFilterByCategory(catKey)}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`size-4 ${meta.color}`} />
                          <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {meta.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-400 text-[11px]">{percentage}%</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">+{catPoints} WWP</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${meta.barBg} transition-all duration-500 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* MY WWP BENEFITS PREVIEW CARD */}
            <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-sm flex flex-col justify-between">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Gift className="size-5 text-amber-500" />
                    My WWP Benefits
                  </CardTitle>
                  <Button
                    variant="link"
                    onClick={() => setActiveTab("benefits")}
                    className="text-xs text-blue-600 dark:text-blue-400 p-0 h-auto font-semibold"
                  >
                    View All
                  </Button>
                </div>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  What your verified WWP points unlock for your professional growth
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3.5 text-xs">
                {benefitsList.slice(0, 3).map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white leading-snug">{b.title}</span>
                      {b.unlocked ? (
                        <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold rounded-md shrink-0">
                          ✓ Available
                        </Badge>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{b.requiredWWP} WWP</span>
                      )}
                    </div>
                    {!b.unlocked && (
                      <div className="space-y-1">
                        <Progress value={b.progressPercentage} className="h-1.5 bg-slate-200 dark:bg-slate-700" />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>{summary.totalWWP} / {b.requiredWWP} WWP</span>
                          <span>{b.progressPercentage}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* AVAILABLE EXTRA WORK OPPORTUNITIES PREVIEW DIRECTLY ON OVERVIEW */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" />
                <span>Recommended Open Extra Work Opportunities</span>
              </h3>
              <Button
                variant="link"
                onClick={() => setActiveTab("opportunities")}
                className="text-xs text-blue-600 dark:text-blue-400 p-0 h-auto gap-1 font-semibold"
              >
                <span>Browse All Roles ({opportunities.length})</span>
                <ChevronRight className="size-3" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.slice(0, 2).map((opp) => {
                const isApplied = opp.appliedFacultyIds.includes("FAC-CSE-101");
                return (
                  <Card key={opp.id} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold">
                          +{opp.rewardWWP} WWP
                        </Badge>
                        <span className="text-[11px] text-slate-400">Est. {opp.expectedDurationHours} Hours</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{opp.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{opp.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[11px] text-slate-400">{opp.positionsAvailable - opp.positionsFilled} spots remaining</span>
                      {isApplied ? (
                        <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">Applied</Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleApplyOpportunity(opp.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-7 px-3 rounded-xl"
                        >
                          Apply for Role
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* RECENT EXTRA WORK CONTRIBUTIONS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Recent Extra Work Cards
              </h3>
              <Button
                variant="link"
                onClick={() => setActiveTab("ledger")}
                className="text-xs text-blue-600 dark:text-blue-400 p-0 h-auto gap-1 font-semibold"
              >
                <span>View Complete Ledger</span>
                <ChevronRight className="size-3" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ledgerItems.slice(0, 4).map((item) => (
                <RenderExtraWorkCard
                  key={item.id}
                  item={item}
                  onViewAudit={() => setSelectedItemForAudit(item)}
                  onViewEvidence={() => setSelectedItemForEvidence(item)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 2. WWP BENEFITS TAB */}
        <TabsContent value="benefits" className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gift className="size-5 text-amber-500" />
              WWP Benefits & Institutional Recognition Unlocks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your verified extra contribution points directly translate into institutional support, grants, and workload benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefitsList.map((b) => (
              <Card key={b.id} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] font-bold border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                      {b.category}
                    </Badge>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{b.requiredWWP} WWP Required</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug mt-1">{b.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{b.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {b.unlocked ? (
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold rounded-full px-3 py-1">
                        ✓ Unlocked & Eligible
                      </Badge>
                      <Button size="sm" onClick={() => alert(`Claim request submitted for "${b.title}". The Dean's office will get in touch.`)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 px-4 rounded-xl">
                        Claim Benefit
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>Current Progress</span>
                        <span className="text-amber-600 dark:text-amber-400">{summary.totalWWP} / {b.requiredWWP} WWP ({b.progressPercentage}%)</span>
                      </div>
                      <Progress value={b.progressPercentage} className="h-2 bg-slate-100 dark:bg-slate-800" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 3. EXTRA WORK LEDGER TAB */}
        <TabsContent value="ledger" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search extra work, role, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger className="h-9 w-full sm:w-56 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white rounded-xl">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs">
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {(Object.keys(CATEGORY_META) as ExtraWorkCategory[]).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_META[cat].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* LEDGER CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLedger.map((item) => (
              <RenderExtraWorkCard
                key={item.id}
                item={item}
                onViewAudit={() => setSelectedItemForAudit(item)}
                onViewEvidence={() => setSelectedItemForEvidence(item)}
              />
            ))}
          </div>

          {filteredLedger.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-sm">
              No extra work items match your search filter.
            </div>
          )}
        </TabsContent>

        {/* 4. OPPORTUNITIES TAB */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="size-5 text-amber-500" />
              Available Extra Work Opportunities Board
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              HOD and Principal published tasks. Volunteer for extra responsibilities and earn official WWP recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp) => {
              const meta = CATEGORY_META[opp.category];
              const isApplied = opp.appliedFacultyIds.includes("FAC-CSE-101");
              const isFull = opp.positionsFilled >= opp.positionsAvailable;

              return (
                <Card key={opp.id} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge className={meta.badgeBg}>{meta.label}</Badge>
                      <Badge variant="outline" className="border-amber-200/80 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold rounded-lg">
                        +{opp.rewardWWP} WWP
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                      {opp.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {opp.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs">
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Role Required</span>
                        <strong className="text-slate-900 dark:text-white text-xs">{opp.roleRequired}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Published By</span>
                        <strong className="text-slate-700 dark:text-slate-300 text-xs">{opp.publishedBy}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Positions</span>
                        <strong className="text-slate-900 dark:text-white">{opp.positionsFilled} / {opp.positionsAvailable} Filled</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Est. Duration</span>
                        <strong className="text-slate-700 dark:text-slate-300">{opp.expectedDurationHours} Hours</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500">Deadline: {opp.deadlineDate}</span>
                      {isApplied ? (
                        <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 gap-1 text-xs font-semibold rounded-full">
                          <Check className="size-3" /> Application Submitted
                        </Badge>
                      ) : (
                        <Button
                          disabled={isFull}
                          onClick={() => handleApplyOpportunity(opp.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-8 px-4 rounded-xl shadow-xs"
                        >
                          {isFull ? "Positions Full" : "Apply for Role"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* 5. EVIDENCE VAULT TAB */}
        <TabsContent value="evidence" className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
              Faculty Evidence Vault
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Centralized gallery of verified certificates, photos, student lists, reports, patents, and official letters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {evidenceVault.map((ev) => (
              <Card key={ev.id} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all">
                <div className="relative h-36 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {ev.url ? (
                    <img
                      src={ev.url}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ImageIcon className="size-10 text-slate-400" />
                  )}
                  <Badge className="absolute top-2 left-2 bg-slate-900/80 text-white border-none text-[10px] rounded-md">
                    {ev.type}
                  </Badge>
                </div>
                <CardContent className="p-3 text-xs space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{ev.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{ev.caption || "Official proof document attached."}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 text-[10px] text-slate-400">
                    <span>Uploaded: {new Date(ev.uploadedAt).toLocaleDateString()}</span>
                    <Button
                      variant="link"
                      onClick={() => setPreviewEvidenceImage(ev)}
                      className="text-blue-600 dark:text-blue-400 text-xs p-0 h-auto gap-1 font-semibold"
                    >
                      <span>Preview</span>
                      <ExternalLink className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ================= MODALS & DIALOGS ================= */}

      {/* 1. AUDIT POINT FORMULA DIALOG ("Why did I get these points?") */}
      {selectedItemForAudit && (
        <Dialog open={!!selectedItemForAudit} onOpenChange={() => setSelectedItemForAudit(null)}>
          <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-w-lg rounded-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase">
                <Info className="size-4" />
                <span>Points Calculation Audit Engine</span>
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {selectedItemForAudit.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Institutional Rule Code: <code className="text-blue-600 dark:text-blue-400 font-mono">{selectedItemForAudit.calculation.calculationRuleId}</code>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2 text-xs">
              {/* SOURCE MODULE TAG */}
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500">Source Module & Traceability:</span>
                <Badge variant="outline" className="font-mono text-[11px] border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                  {selectedItemForAudit.sourceModule || "CAMPUS_EVENTS"} → {selectedItemForAudit.referenceId || "REF-2026"}
                </Badge>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Base Contribution Points</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">+{selectedItemForAudit.calculation.basePoints} WWP</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Role Bonus ({selectedItemForAudit.role || "Contributor"})</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{selectedItemForAudit.calculation.roleBonus} WWP</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Impact & Scope Bonus</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">+{selectedItemForAudit.calculation.impactBonus} WWP</span>
                </div>
                {selectedItemForAudit.calculation.outcomeBonus > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700 bg-amber-50/50 dark:bg-amber-950/20 px-2 rounded-lg">
                    <span className="text-amber-800 dark:text-amber-300 font-semibold">Outcome / Win Bonus (e.g. 1st Prize Win)</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">+{selectedItemForAudit.calculation.outcomeBonus} WWP</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 text-sm font-bold text-slate-900 dark:text-white">
                  <span>TOTAL VERIFIED WWP</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono text-base">+{selectedItemForAudit.calculation.totalWWP} WWP</span>
                </div>
              </div>

              {/* VERIFIER DETAILS */}
              <div className="bg-slate-100/70 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="text-[11px] text-slate-400 block">Verified By Authority:</span>
                <strong className="text-slate-900 dark:text-white block text-xs">{selectedItemForAudit.verifiedBy || "Under Verification Queue"}</strong>
                {selectedItemForAudit.reviewerNotes && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 italic mt-1 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    "{selectedItemForAudit.reviewerNotes}"
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedItemForAudit(null)} className="bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-xl">
                Close Audit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 2. VIEW EVIDENCE MODAL */}
      {selectedItemForEvidence && (
        <Dialog open={!!selectedItemForEvidence} onOpenChange={() => setSelectedItemForEvidence(null)}>
          <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-w-xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                Attached Proof Documents ({selectedItemForEvidence.evidenceList.length})
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                {selectedItemForEvidence.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 my-2 max-h-96 overflow-y-auto pr-1">
              {selectedItemForEvidence.evidenceList.map((ev) => (
                <div key={ev.id} className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                  {ev.url ? (
                    <img src={ev.url} alt={ev.title} className="size-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                  ) : (
                    <div className="size-16 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <FileText className="size-8 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-xs">
                    <h5 className="font-bold text-slate-900 dark:text-white truncate">{ev.title}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{ev.caption || "Official proof document."}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <Badge className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-none text-[9px]">{ev.type}</Badge>
                      <span>Uploaded: {new Date(ev.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}

              {selectedItemForEvidence.evidenceList.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No proof documents uploaded for this claim yet.
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedItemForEvidence(null)} className="bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-xl">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 3. ANNUAL CONTRIBUTION REPORT DIALOG */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="size-5 text-blue-600 dark:text-blue-400" />
                Annual Faculty Extra Contribution Report
              </DialogTitle>
              <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold">
                AY 2025-26
              </Badge>
            </div>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Audit-ready summary for annual performance appraisal, NAAC Criterion 3 & 4, and NIRF documentation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2 text-xs">
            {/* FACULTY PROFILE SUMMARY BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Faculty Member</span>
                <strong className="text-slate-900 dark:text-white">{reportData.facultyName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Employee ID</span>
                <strong className="text-slate-700 dark:text-slate-300 font-mono">{reportData.employeeCode}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Department</span>
                <strong className="text-slate-700 dark:text-slate-300">{reportData.department}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Verified WWP</span>
                <strong className="text-amber-600 dark:text-amber-400 font-mono font-extrabold">+{reportData.totalVerifiedWWP} WWP</strong>
              </div>
            </div>

            {/* AUDIT TABLE */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2.5">Extra Work Title</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5 text-right">WWP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {reportData.items.map((i) => (
                    <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">{i.title}</td>
                      <td className="p-2.5 text-slate-500">{i.category.replace("_", " ")}</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-300">{i.role}</td>
                      <td className="p-2.5 text-slate-400 font-mono">{i.date}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-amber-600 dark:text-amber-400">+{i.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center pt-2">
            <span className="text-[10px] text-slate-400">Generated on {reportData.generatedAt} • Official EduSuite Pro Audit Document</span>
            <Button
              onClick={() => {
                alert("Annual Report PDF exported successfully for NAAC/NIRF audit compliance!");
                setIsReportModalOpen(false);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 rounded-xl gap-1.5"
            >
              <Printer className="size-3.5" /> Download Official PDF Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. LOG EXTRA WORK CLAIM MODAL */}
      <Dialog open={isClaimModalOpen} onOpenChange={setIsClaimModalOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="size-5 text-blue-600 dark:text-blue-400" />
              Log Extra Work Contribution Claim
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Submit your unassigned / self-initiated extra work with proof for HOD / Principal verification.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs my-2">
            {claimFeedbackMsg && (
              <div
                className={`p-3 rounded-xl border text-xs ${
                  claimFeedbackMsg.success
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                }`}
              >
                {claimFeedbackMsg.text}
              </div>
            )}

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Extra Work Title *</label>
              <Input
                placeholder="e.g. Lead Coordinator - 24hr Campus Hackathon 2026"
                value={claimTitle}
                onChange={(e) => setClaimTitle(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Category *</label>
                <Select value={claimCategory} onValueChange={(val: ExtraWorkCategory) => setClaimCategory(val)}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs">
                    {(Object.keys(CATEGORY_META) as ExtraWorkCategory[]).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_META[cat].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Your Role *</label>
                <Input
                  placeholder="e.g. Lead Convener / Mentor"
                  value={claimRole}
                  onChange={(e) => setClaimRole(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Start Date *</label>
                <Input
                  type="date"
                  value={claimStartDate}
                  onChange={(e) => setClaimStartDate(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Duration (Hrs)</label>
                <Input
                  type="number"
                  placeholder="e.g. 24"
                  value={claimHours}
                  onChange={(e) => setClaimHours(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Student Count</label>
                <Input
                  type="number"
                  placeholder="e.g. 120"
                  value={claimStudents}
                  onChange={(e) => setClaimStudents(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Detailed Contribution Description</label>
              <Textarea
                placeholder="Briefly describe your role, outputs, and impact..."
                value={claimDescription}
                onChange={(e) => setClaimDescription(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl min-h-[70px]"
              />
            </div>

            {/* EVIDENCE SECTION */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider">Proof / Evidence Upload</span>
              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1">Evidence Title</label>
                <Input
                  placeholder="e.g. Official Completion Certificate / Photo Link"
                  value={claimEvidenceTitle}
                  onChange={(e) => setClaimEvidenceTitle(e.target.value)}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 dark:text-slate-400 block mb-1">Document Type</label>
                  <Select value={claimEvidenceType} onValueChange={(val: EvidenceType) => setClaimEvidenceType(val)}>
                    <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs">
                      <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                      <SelectItem value="PHOTO">Photo</SelectItem>
                      <SelectItem value="REPORT">Report</SelectItem>
                      <SelectItem value="STUDENT_LIST">Student List</SelectItem>
                      <SelectItem value="OFFICIAL_LETTER">Official Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400 block mb-1">Proof Image/Document URL</label>
                  <Input
                    placeholder="https://..."
                    value={claimEvidenceUrl}
                    onChange={(e) => setClaimEvidenceUrl(e.target.value)}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono rounded-xl"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsClaimModalOpen(false)} className="text-slate-500 text-xs rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 rounded-xl">
                Submit Claim for Verification
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* FOOTER */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-400">
        © 2026 EduSuite Pro. All rights reserved.
      </div>
    </div>
  );
}

// SUB-COMPONENT: RENDER EXTRA WORK CARD
function RenderExtraWorkCard({
  item,
  onViewAudit,
  onViewEvidence,
}: {
  item: ExtraWorkItem;
  onViewAudit: () => void;
  onViewEvidence: () => void;
}) {
  const meta = CATEGORY_META[item.category];

  const isVerified = item.status === "VERIFIED";
  const isPending = ["SUBMITTED", "UNDER_REVIEW", "APPLIED", "IN_PROGRESS"].includes(item.status);

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl flex flex-col justify-between hover:shadow-md transition-all shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className={meta.badgeBg}>{meta.label}</Badge>
          <div className="flex items-center gap-1.5 font-mono text-base font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 px-2.5 py-0.5 rounded-xl">
            <span>+{item.calculation.totalWWP}</span>
            <span className="text-xs text-slate-400 font-normal">WWP</span>
          </div>
        </div>

        <CardTitle className="text-base font-bold text-slate-900 dark:text-white mt-2 leading-snug">
          {item.title}
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          {item.description || "Verified extra work contribution."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 text-xs">
        {/* CARD META DETAILS */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
          <div>
            <span className="text-[11px] text-slate-400 block">Role</span>
            <strong className="text-slate-900 dark:text-white text-xs">{item.role || "Contributor"}</strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Date</span>
            <strong className="text-slate-700 dark:text-slate-300 text-xs font-mono">{item.startDate}</strong>
          </div>
          {item.durationHours !== undefined && item.durationHours > 0 && (
            <div>
              <span className="text-[11px] text-slate-400 block">Duration</span>
              <strong className="text-slate-700 dark:text-slate-300">{item.durationHours} Hours</strong>
            </div>
          )}
          {item.studentCount !== undefined && item.studentCount > 0 && (
            <div>
              <span className="text-[11px] text-slate-400 block">Students</span>
              <strong className="text-slate-700 dark:text-slate-300">{item.studentCount} Participants</strong>
            </div>
          )}
        </div>

        {/* SOURCE TRACEABILITY TAG */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Source Trace:</span>
          <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">{item.sourceModule || "CAMPUS_EVENTS"} → {item.referenceId || item.id}</span>
        </div>

        {/* POINT ENGINE CALCULATION BREAKDOWN SUMMARY */}
        <div
          onClick={onViewAudit}
          className="bg-slate-100/70 dark:bg-slate-800/90 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 cursor-pointer hover:border-amber-400 transition-colors flex items-center justify-between text-[11px]"
        >
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono">
            <Info className="size-3.5 text-amber-500" />
            <span>Formula: Base ({item.calculation.basePoints}) + Role ({item.calculation.roleBonus}) + Impact ({item.calculation.impactBonus}) {item.calculation.outcomeBonus > 0 ? `+ Outcome (${item.calculation.outcomeBonus})` : ""}</span>
          </div>
          <ChevronRight className="size-3 text-slate-400" />
        </div>

        {/* CARD FOOTER WITH STATUS AND EVIDENCE BUTTONS */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            {isVerified && (
              <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 gap-1 text-[11px] font-semibold rounded-full">
                <CheckCircle2 className="size-3" /> Verified
              </Badge>
            )}
            {isPending && (
              <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 gap-1 text-[11px] font-semibold rounded-full">
                <Clock className="size-3" /> {item.status.replace("_", " ")}
              </Badge>
            )}
            {item.status === "REJECTED" && (
              <Badge className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 gap-1 text-[11px] font-semibold rounded-full">
                <X className="size-3" /> Rejected
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewEvidence}
              className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-200 h-7 px-2.5 gap-1 rounded-xl shadow-xs"
            >
              <FileCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>Evidence ({item.evidenceList.length})</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
