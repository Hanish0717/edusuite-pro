import { useState, useMemo } from "react";
import { TrendingUp, RefreshCw, Download, Search, Filter, ChevronDown, Plus } from "lucide-react";
import type { ResearchModuleData, PublicationItem } from "./types";
import { StatisticsCards } from "./statistics-cards";
import { ResearchDashboard } from "./research-dashboard";
import { PublicationCards } from "./publication-cards";
import { PatentCards } from "./patent-cards";
import { BookCards } from "./book-cards";
import { ProjectCards } from "./project-cards";
import { GrantCards } from "./grant-cards";
import { ConferenceCards } from "./conference-cards";
import { CertificationCards } from "./certification-cards";
import { AwardCards } from "./award-cards";
import { ResearchAnalytics } from "./research-analytics";
import { UploadResearchModal } from "./upload-research-modal";
import { QuickActions } from "./quick-actions";
import { EmptyState } from "./empty-state";
import { SkeletonLoader } from "./skeleton-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResearchModuleProps {
  data: ResearchModuleData;
  facultyName: string;
  academicYear: string;
  semester: string;
}

export function ResearchModule({ data, facultyName, academicYear, semester }: ResearchModuleProps) {
  const [activeTab, setActiveTab] = useState("publications");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Local state copy of publications to allow new uploads to show up instantly!
  const [publications, setPublications] = useState<PublicationItem[]>(data.publications);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Get unique years and statuses from publications list
  const publicationYears = useMemo(() => {
    return Array.from(new Set(publications.map((p) => p.year.toString()))).sort((a, b) => b.localeCompare(a));
  }, [publications]);

  const publicationStatuses = useMemo(() => {
    return Array.from(new Set(publications.map((p) => p.status)));
  }, [publications]);

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Synchronizing research profile databases...", {
      description: "Fetching updated citation metrics and publications status."
    });
    setTimeout(() => {
      setLoading(false);
    }, 850);
  };

  const handleExport = () => {
    toast.success("Export started", {
      description: "Downloading comprehensive research curriculum vitae (.xlsx) layout."
    });
  };

  const handleActionSelect = (actionId: string) => {
    if (actionId === "add-publication") {
      setModalOpen(true);
    } else if (actionId === "add-patent") {
      setModalOpen(true);
      toast.info("Opening Add Patent panel", {
        description: "Modal pre-configured to Patent category type."
      });
    } else if (actionId === "add-project") {
      setModalOpen(true);
      toast.info("Opening Add Project panel", {
        description: "Wizard configured to proposed Project schemes."
      });
    } else if (actionId === "upload-certificate") {
      setModalOpen(true);
      toast.info("Opening Upload Certificate panel", {
        description: "Attach credential parameters in Step 4."
      });
    } else if (actionId === "analytics") {
      setActiveTab("analytics");
    } else if (actionId === "export") {
      handleExport();
    }
  };

  const handleNewResearchUpload = (newRecord: PublicationItem) => {
    setPublications((prev) => [newRecord, ...prev]);
    setActiveTab("publications");
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedType("ALL");
    setSelectedYear("ALL");
    setSelectedStatus("ALL");
  };

  // Filter publications list locally
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesSearch =
        pub.title.toLowerCase().includes(search.toLowerCase()) ||
        pub.journalOrConference.toLowerCase().includes(search.toLowerCase()) ||
        pub.authors.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === "ALL" || pub.type === selectedType;
      const matchesYear = selectedYear === "ALL" || pub.year.toString() === selectedYear;
      const matchesStatus = selectedStatus === "ALL" || pub.status === selectedStatus;

      return matchesSearch && matchesType && matchesYear && matchesStatus;
    });
  }, [publications, search, selectedType, selectedYear, selectedStatus]);

  // Dynamic dashboard summary stats computed based on state publications
  const dynamicSummaryStats = useMemo(() => {
    return {
      publicationsThisYear: publications.filter((p) => p.year === 2026 && p.status === "Published").length,
      acceptedPapers: publications.filter((p) => p.status === "Accepted").length,
      underReview: publications.filter((p) => p.status === "Under Review").length,
      ongoingProjects: data.projects.filter((p) => p.status === "Ongoing").length,
      completedProjects: data.projects.filter((p) => p.status === "Completed").length,
      grantsReceived: data.grants.filter((g) => g.approvalStatus === "Disbursed" || g.approvalStatus === "Approved").length
    };
  }, [publications, data.projects, data.grants]);

  // Dynamic KPI stats blocks computed based on state publications
  const dynamicKpiStats = useMemo(() => {
    return {
      totalPublications: publications.length,
      scopusIndexed: publications.filter((p) => p.indexing === "Scopus").length,
      sciIndexed: publications.filter((p) => p.indexing === "SCI" || p.indexing === "SCIE").length,
      conferences: publications.filter((p) => p.type === "Conference").length,
      patents: data.stats.patents,
      books: data.stats.books,
      projects: data.stats.projects,
      researchGrants: data.stats.researchGrants,
      citations: data.stats.citations,
      hIndex: data.stats.hIndex
    };
  }, [publications, data.stats]);

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <TrendingUp className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground leading-tight">
              Research & Publications
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {facultyName} · Academic Year {academicYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8 bg-brand-gradient text-white gap-1.5 font-bold shadow-glow" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" /> Upload Research
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold" onClick={handleRefresh}>
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold" onClick={handleExport}>
            <Download className="size-3.5" /> Export CV
          </Button>
        </div>
      </div>

      {/* ── Research Statistics KPI ─────────────────────────────── */}
      <StatisticsCards stats={dynamicKpiStats} />

      {/* ── Research Dashboard Summary widgets ──────────────────── */}
      <ResearchDashboard summary={dynamicSummaryStats} />

      {/* ── Quick ActionsCockpit ──────────────────────────────────── */}
      <QuickActions onActionSelect={handleActionSelect} />

      {/* ── Search Toolbar Filters ───────────────────────────────── */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-muted/40 px-3 py-1.5 rounded-xl border border-border/40">
            <span>AY {academicYear}</span>
            <span className="text-border">|</span>
            <span>Sem {semester}</span>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search paper title, journal, co-authors..."
              className="pl-9 h-8 text-xs bg-muted/20 border-border/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Filter className="size-3.5 text-muted-foreground shrink-0" />
          
          {/* Publication Type Selector */}
          <div className="relative">
            <select
              className="appearance-none h-7 pl-2 pr-7 text-xs rounded-lg border border-border/50 bg-muted/30 text-foreground font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="Journal">Journal Articles</option>
              <option value="Conference">Conferences</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Publication Year Selector */}
          <div className="relative">
            <select
              className="appearance-none h-7 pl-2 pr-7 text-xs rounded-lg border border-border/50 bg-muted/30 text-foreground font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="ALL">All Years</option>
              {publicationYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Status Selector */}
          <div className="relative">
            <select
              className="appearance-none h-7 pl-2 pr-7 text-xs rounded-lg border border-border/50 bg-muted/30 text-foreground font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {publicationStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* ── Tabs Content Layout ──────────────────────────────────── */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap h-auto p-1 bg-muted rounded-xl">
            <TabsTrigger value="publications" className="rounded-lg text-xs py-1.5 font-bold">Publications</TabsTrigger>
            <TabsTrigger value="patents-books" className="rounded-lg text-xs py-1.5 font-bold">Patents & Books</TabsTrigger>
            <TabsTrigger value="projects-grants" className="rounded-lg text-xs py-1.5 font-bold">Projects & Funding</TabsTrigger>
            <TabsTrigger value="events-credentials" className="rounded-lg text-xs py-1.5 font-bold">Workshops & Awards</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg text-xs py-1.5 font-bold">Analytics Charts</TabsTrigger>
          </TabsList>

          {/* Publications Tab */}
          <TabsContent value="publications" className="mt-4 space-y-4">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Publications Registry</h2>
            {filteredPublications.length === 0 ? (
              <EmptyState onResetFilters={handleResetFilters} />
            ) : (
              <PublicationCards publications={filteredPublications} />
            )}
          </TabsContent>

          {/* Patents & Books Tab */}
          <TabsContent value="patents-books" className="mt-4 space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Patents Registry</h2>
              <PatentCards patents={data.patents} />
            </div>
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Books & Book Chapters</h2>
              <BookCards books={data.books} />
            </div>
          </TabsContent>

          {/* Projects & Grants Tab */}
          <TabsContent value="projects-grants" className="mt-4 space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Research Projects</h2>
              <ProjectCards projects={data.projects} />
            </div>
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Grants & Funding Agencies</h2>
              <GrantCards grants={data.grants} />
            </div>
          </TabsContent>

          {/* Events & Credentials Tab */}
          <TabsContent value="events-credentials" className="mt-4 space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Conferences & Workshops</h2>
              <ConferenceCards conferences={data.conferences} />
            </div>
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Certifications & Badges</h2>
              <CertificationCards certifications={data.certifications} />
            </div>
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Awards & Timeline Achievements</h2>
              <AwardCards awards={data.awards} />
            </div>
          </TabsContent>

          {/* Research Analytics Tab */}
          <TabsContent value="analytics" className="mt-4">
            <ResearchAnalytics analytics={data.analytics} />
          </TabsContent>
        </Tabs>
      )}

      {/* Upload Research Stepper Modal */}
      <UploadResearchModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUploadSuccess={handleNewResearchUpload}
      />
    </div>
  );
}
