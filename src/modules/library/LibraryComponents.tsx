import React, { useEffect, useState } from "react";
import {
  Library,
  RefreshCw,
  Download,
  BookOpen,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Globe,
  ExternalLink,
  BookMarked,
  Sliders,
  BarChart3,
  Activity,
  Calendar,
  Clock,
  UserCheck,
  ShieldCheck,
  Zap,
  BellRing,
  PieChart,
  FileText,
  ShieldAlert,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  fetchLibraryBooks,
  fetchBookIssues,
  INITIAL_BOOKS,
  INITIAL_ISSUES,
  DEFAULT_LIBRARY_CONFIG,
  DEFAULT_LIBRARY_HEALTH,
  DEFAULT_OVERDUE_SUMMARY,
  DEFAULT_DIGITAL_SUBSCRIPTIONS,
  INITIAL_ALERTS,
  INITIAL_ACTIVITIES,
  DEFAULT_STAFF_SUMMARY,
  type LibraryBook,
  type BookIssueRecord,
  type LibraryConfig,
  type LibraryHealthStatus,
  type OverdueSummary,
  type DigitalSubscription,
  type LibraryAlert,
  type LibraryActivityLog,
  type LibrarianStaffSummary,
} from "./LibraryService";

const CATEGORIES = ["All Categories", "Computer Science", "Electronics", "Mechanical", "AI & Data Science", "General Science"] as const;

export function LibraryModuleView() {
  const [books, setBooks] = useState<LibraryBook[]>(INITIAL_BOOKS);
  const [issues, setIssues] = useState<BookIssueRecord[]>(INITIAL_ISSUES);
  const [activeTab, setActiveTab] = useState<"catalog" | "issues" | "ejournals" | "overdue" | "staff">("catalog");

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All Categories");
  const [loading, setLoading] = useState(false);

  // Executive Modals State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const [configTab, setConfigTab] = useState<"borrowing" | "policies" | "timings">("borrowing");
  const [configForm, setConfigForm] = useState<LibraryConfig>(DEFAULT_LIBRARY_CONFIG);

  // Governance Data States
  const [healthStatus] = useState<LibraryHealthStatus>(DEFAULT_LIBRARY_HEALTH);
  const [overdueSummary] = useState<OverdueSummary>(DEFAULT_OVERDUE_SUMMARY);
  const [digitalSubs] = useState<DigitalSubscription[]>(DEFAULT_DIGITAL_SUBSCRIPTIONS);
  const [alerts] = useState<LibraryAlert[]>(INITIAL_ALERTS);
  const [activities] = useState<LibraryActivityLog[]>(INITIAL_ACTIVITIES);
  const [staffSummary] = useState<LibrarianStaffSummary>(DEFAULT_STAFF_SUMMARY);

  const loadData = async () => {
    setLoading(true);
    const [bks, iss] = await Promise.all([fetchLibraryBooks(), fetchBookIssues()]);
    setBooks(bks);
    setIssues(iss);
    setLoading(false);
    toast.success("Library governance telemetry synchronized");
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.accessionNo.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === "All Categories" || b.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfigOpen(false);
    toast.success("Library Rules & Governance Configuration updated successfully!");
  };

  const handleExportCSV = () => {
    const headers = ["Book ID", "Accession No", "Title", "Author", "ISBN", "Category", "Total Copies", "Available Copies", "Rack Location"];
    const rows = filteredBooks.map((b) => [b.id, b.accessionNo, `"${b.title}"`, `"${b.author}"`, b.isbn, b.category, b.totalCopies, b.availableCopies, `"${b.rackNo}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Library_Executive_Catalog_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported executive library catalog to CSV!");
  };

  const handleScheduleAudit = () => {
    toast.info("Institutional Library Physical Audit scheduled for coming Thursday 10:00 AM.");
  };

  const handleDownloadInventory = () => {
    toast.success("Library Physical Stock & E-Resource Inventory Report generated (PDF initialized).");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Library className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Library & Knowledge Resource Governance
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Super Admin Executive Portal
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Executive oversight of catalog volume, digital subscriptions, policy configuration, overdue compliance, health metrics, and analytics.
            </p>
          </div>
        </div>

        {/* Action Buttons - Executive Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Catalog
          </Button>
          <Button size="sm" onClick={() => setIsReportsOpen(true)} variant="outline" className="h-9 border-primary/30 text-primary gap-2 text-xs font-semibold">
            <BarChart3 className="size-4" /> Library Reports
          </Button>
          <Button size="sm" onClick={() => setIsConfigOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Sliders className="size-4" /> Library Configuration
          </Button>
        </div>
      </div>

      {/* TOP KPI SECTION - ROW 1: PRIMARY KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Catalog Volume</span>
            <Library className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">42,500 Volumes</p>
          <p className="text-[0.68rem] text-muted-foreground">Hardcover & Softcover Textbooks</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Active Issues</span>
            <BookOpen className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">{issues.filter((i) => i.status === "Issued").length + 248} Active</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">14-day borrowing cycle</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Digital E-Journals</span>
            <Globe className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">6 Subscriptions</p>
          <p className="text-[0.68rem] text-muted-foreground">IEEE, Springer, Elsevier, ACM, NPTEL, NDLI</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Overdue Fines</span>
            <AlertTriangle className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">₹{overdueSummary.finePending} Dues</p>
          <p className="text-[0.68rem] text-muted-foreground">{overdueSummary.booksOverdue} overdue books</p>
        </div>
      </div>

      {/* TOP KPI SECTION - ROW 2: EXECUTIVE RESPONSIVE ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Registered Members</span>
          <span className="text-lg font-bold font-mono text-primary">3,450</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Issued Today</span>
          <span className="text-lg font-bold font-mono text-emerald-600">42 Books</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Returned Today</span>
          <span className="text-lg font-bold font-mono text-blue-600">38 Books</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Overdue Books</span>
          <span className="text-lg font-bold font-mono text-amber-600">{overdueSummary.booksOverdue}</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Reserved Books</span>
          <span className="text-lg font-bold font-mono text-purple-600">8 Titles</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Damaged Books</span>
          <span className="text-lg font-bold font-mono text-destructive">5 Books</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Lost Books</span>
          <span className="text-lg font-bold font-mono text-muted-foreground">2 Books</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Digital Usage</span>
          <span className="text-lg font-bold font-mono text-emerald-600">1.28k Sessions</span>
        </div>
      </div>

      {/* GOVERNANCE WIDGETS GRID: LIBRARY HEALTH & DIGITAL SUBSCRIPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LIBRARY HEALTH WIDGET */}
        <div className="md:col-span-2 rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Activity className="size-4 text-emerald-500" /> Library Health & Infrastructure Telemetry
            </h3>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
              Health Score: {healthStatus.overallHealthScore} / 100
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Overall Library System & Resource Health Score</span>
              <span className="text-emerald-600 font-mono font-bold">{healthStatus.overallHealthScore}% Operational Uptime</span>
            </div>
            <Progress value={healthStatus.overallHealthScore} className="h-2 bg-muted" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-primary" /> Book Availability
              </span>
              <p className="text-xs font-bold text-foreground">{healthStatus.bookAvailability}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
                <PieChart className="size-3.5 text-blue-500" /> Shelf Occupancy
              </span>
              <p className="text-xs font-bold text-foreground">{healthStatus.shelfOccupancy}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
                <Globe className="size-3.5 text-emerald-500" /> Digital Availability
              </span>
              <p className="text-xs font-bold text-foreground">{healthStatus.digitalResourceAvailability}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500" /> ERP System Status
              </span>
              <p className="text-xs font-bold text-foreground">{healthStatus.systemStatus}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-500" /> RFID Smart Gates
              </span>
              <p className="text-xs font-bold text-foreground">{healthStatus.rfidStatus}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
                <FileCheck className="size-3.5 text-purple-500" /> Barcode Scanners
              </span>
              <p className="text-xs font-bold text-foreground">{healthStatus.barcodeScannerStatus}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
                <Activity className="size-3.5 text-blue-600" /> Library DB Cluster
              </span>
              <p className="text-xs font-bold text-foreground">{healthStatus.libraryDatabaseStatus}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
                <Users className="size-3.5 text-primary" /> Member Services
              </span>
              <p className="text-xs font-bold text-emerald-600">Active & Online</p>
            </div>
          </div>
        </div>

        {/* DIGITAL LIBRARY SUBSCRIPTIONS SUMMARY */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Globe className="size-4 text-blue-500" /> Digital Subscriptions Summary
            </h3>
            <Badge variant="outline" className="text-[0.65rem] font-mono">6 Portals</Badge>
          </div>

          <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 text-xs">
            {digitalSubs.map((sub) => (
              <div key={sub.id} className="p-2.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">{sub.name}</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.6rem] px-1.5 py-0">Active</Badge>
                </div>
                <div className="flex justify-between text-[0.68rem] text-muted-foreground">
                  <span>Publisher: {sub.publisher}</span>
                  <span className="font-mono">Exp: {sub.expiryDate}</span>
                </div>
                <p className="text-[0.68rem] font-semibold text-primary">{sub.usageStats}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOSTEL ANALYTICS & OVERDUE SUMMARY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* EXECUTIVE LIBRARY ANALYTICS */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <PieChart className="size-4 text-primary" /> Executive Library Analytics
            </h3>
            <span className="text-xs text-muted-foreground font-mono">Academic Year 2025 - 2026</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground uppercase font-semibold">Most Borrowed</span>
              <p className="text-sm font-bold text-primary">Computer Science</p>
              <p className="text-[0.65rem] text-muted-foreground">42% Total Circulation</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground uppercase font-semibold">Least Borrowed</span>
              <p className="text-sm font-bold text-foreground">General Science</p>
              <p className="text-[0.65rem] text-muted-foreground">7% Total Circulation</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground uppercase font-semibold">Monthly Circulation</span>
              <p className="text-xl font-bold font-mono text-emerald-600">1,840</p>
              <p className="text-[0.65rem] text-muted-foreground">Volumes / Month</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <span className="text-[0.68rem] text-muted-foreground uppercase font-semibold">Peak Library Hours</span>
              <p className="text-xs font-bold text-foreground">11 AM - 1 PM | 4 PM - 6 PM</p>
              <p className="text-[0.65rem] text-muted-foreground">Highest Footfall</p>
            </div>
          </div>

          {/* Usage ratio progress bars */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Student vs Faculty Circulation Usage</span>
                <span className="font-mono text-primary">84% Students | 16% Faculty</span>
              </div>
              <Progress value={84} className="h-2 bg-muted" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Digital E-Journal Access (42,500 Views / Month)</span>
                <span className="font-mono text-emerald-600">92% Remote VPN & Campus IP</span>
              </div>
              <Progress value={92} className="h-2 bg-muted" />
            </div>
          </div>
        </div>

        {/* OVERDUE SUMMARY */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" /> Overdue & Compliance Governance
            </h3>
            <Badge className="bg-amber-500/10 text-amber-600 text-[0.65rem]">Overdue Summary</Badge>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="text-[0.65rem] font-semibold text-amber-700 uppercase block">Overdue Books</span>
                <span className="text-lg font-bold font-mono text-amber-700">{overdueSummary.booksOverdue} Books</span>
              </div>

              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                <span className="text-[0.65rem] font-semibold text-red-700 uppercase block">Pending Fine</span>
                <span className="text-lg font-bold font-mono text-red-700">₹{overdueSummary.finePending}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Longest Overdue Title:</span>
                <span className="font-bold font-mono text-destructive">{overdueSummary.longestOverdue}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Critical Overdue (&gt;30 Days):</span>
                <span className="font-bold font-mono text-amber-600">{overdueSummary.criticalOverdue} Books</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Highest Overdue Depts:</span>
                <span className="font-semibold text-foreground">{overdueSummary.departmentsWithHighestOverdue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS & ALERTS & ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* EXECUTIVE QUICK ACTIONS */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Zap className="size-4 text-primary" /> Executive Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" onClick={() => setIsConfigOpen(true)} className="justify-start gap-2.5 h-10 text-xs font-semibold">
              <Sliders className="size-4 text-primary" /> Library Rules & Policy Configuration
            </Button>

            <Button variant="outline" onClick={() => setIsReportsOpen(true)} className="justify-start gap-2.5 h-10 text-xs font-semibold">
              <BarChart3 className="size-4 text-emerald-600" /> View Comprehensive Institutional Reports
            </Button>

            <Button variant="outline" onClick={handleDownloadInventory} className="justify-start gap-2.5 h-10 text-xs font-semibold">
              <FileText className="size-4 text-blue-600" /> Download Stock & Inventory Ledger
            </Button>

            <Button variant="outline" onClick={handleScheduleAudit} className="justify-start gap-2.5 h-10 text-xs font-semibold">
              <ShieldCheck className="size-4 text-purple-600" /> Schedule Institutional Library Audit
            </Button>

            <Button variant="outline" onClick={() => setActiveTab("ejournals")} className="justify-start gap-2.5 h-10 text-xs font-semibold">
              <Globe className="size-4 text-amber-600" /> Manage Digital Resource Subscriptions
            </Button>

            <Button variant="outline" onClick={() => setActiveTab("staff")} className="justify-start gap-2.5 h-10 text-xs font-semibold">
              <UserCheck className="size-4 text-emerald-600" /> View Librarian Staff Roster & Summary
            </Button>
          </div>
        </div>

        {/* LIBRARY GOVERNANCE ALERTS */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <BellRing className="size-4 text-amber-500" /> Governance Alerts
            </h3>
            <Badge className="bg-amber-500/10 text-amber-600 text-[0.65rem]">{alerts.length} Active</Badge>
          </div>

          <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    {alt.severity === "high" ? (
                      <ShieldAlert className="size-3.5 text-destructive shrink-0" />
                    ) : alt.severity === "medium" ? (
                      <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <BellRing className="size-3.5 text-primary shrink-0" />
                    )}
                    {alt.title}
                  </span>
                  <span className="text-[0.62rem] text-muted-foreground font-mono">{alt.timestamp}</span>
                </div>
                <p className="text-[0.72rem] text-muted-foreground leading-snug">{alt.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT LIBRARY ACTIVITIES TIMELINE */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Clock className="size-4 text-primary" /> Audit Trail & Recent Activities
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
            {activities.map((act) => (
              <div key={act.id} className="p-2 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
                <div className="flex justify-between text-[0.68rem] text-muted-foreground">
                  <span className="font-mono">{act.date}</span>
                  <Badge variant="secondary" className="text-[0.6rem] px-1.5 py-0">{act.category}</Badge>
                </div>
                <p className="text-xs font-semibold text-foreground">{act.action}</p>
                <p className="text-[0.68rem] text-muted-foreground">By: {act.user}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXECUTIVE VIEW TABS SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
        <button onClick={() => setActiveTab("catalog")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "catalog" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Book Catalog & Racks ({books.length})
        </button>
        <button onClick={() => setActiveTab("issues")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "issues" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Book Issues & Circulation ({issues.length})
        </button>
        <button onClick={() => setActiveTab("ejournals")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "ejournals" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          3. Digital E-Journals ({digitalSubs.length})
        </button>
        <button onClick={() => setActiveTab("overdue")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "overdue" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          4. Overdue & Fines Log
        </button>
        <button onClick={() => setActiveTab("staff")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "staff" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          5. Librarian Staff Summary
        </button>
      </div>

      {/* TAB 1: BOOK CATALOG */}
      {activeTab === "catalog" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Library className="size-4 text-primary" /> Institutional Book Catalog Overview
            </h3>
            <span className="text-xs text-muted-foreground">Governance View (Edits & entries managed by Librarian)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Accession No</th>
                  <th className="py-3 px-3">Book Title</th>
                  <th className="py-3 px-3">Author(s)</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Copies Available</th>
                  <th className="py-3 px-3">Rack Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredBooks.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{b.accessionNo}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{b.title}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{b.author}</td>
                    <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-xs">{b.category}</Badge></td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{b.availableCopies} / {b.totalCopies} Available</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{b.rackNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ISSUES (READ-ONLY CIRCULATION FOR SUPER ADMIN) */}
      {activeTab === "issues" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <BookOpen className="size-4 text-emerald-500" /> Book Circulation Ledger
            </h3>
            <span className="text-xs text-muted-foreground">Read-Only Governance (Daily circulation processed by Librarian)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Issue ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Book Title</th>
                  <th className="py-3 px-3">Issue / Due Date</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {issues.map((i) => (
                  <tr key={i.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{i.issueId}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{i.studentName} ({i.rollNo})</td>
                    <td className="py-3 px-3 font-medium text-foreground">{i.bookTitle}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{i.issueDate} to {i.dueDate}</td>
                    <td className="py-3 px-3">
                      <Badge className={i.status === "Returned" ? "bg-emerald-500/10 text-emerald-600" : i.status === "Issued" ? "bg-blue-500/10 text-blue-600" : "bg-red-500/10 text-red-600"}>
                        {i.status} {i.fineAmount > 0 && `(Fine: ₹${i.fineAmount})`}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EJOURNALS */}
      {activeTab === "ejournals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {digitalSubs.map((sub) => (
            <div key={sub.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary font-mono text-xs">{sub.publisher}</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">Active Subscription</Badge>
              </div>
              <h3 className="text-base font-bold text-foreground">{sub.name}</h3>
              <p className="text-xs text-muted-foreground">Expiry Date: <span className="font-mono font-semibold">{sub.expiryDate}</span></p>
              <p className="text-xs font-semibold text-primary">{sub.usageStats}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: OVERDUE LOG */}
      {activeTab === "overdue" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" /> Overdue Books & Fine Collection Oversight
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Issue ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Book Title</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3">Days Overdue</th>
                  <th className="py-3 px-3">Calculated Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {issues
                  .filter((i) => i.status === "Overdue" || i.fineAmount > 0)
                  .map((i) => (
                    <tr key={i.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{i.issueId}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{i.studentName} ({i.rollNo})</td>
                      <td className="py-3 px-3 font-medium text-foreground">{i.bookTitle}</td>
                      <td className="py-3 px-3 font-mono text-destructive font-bold">{i.dueDate}</td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-600">10 Days</td>
                      <td className="py-3 px-3 font-mono font-bold text-destructive">₹{i.fineAmount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: LIBRARIAN STAFF SUMMARY */}
      {activeTab === "staff" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <UserCheck className="size-4 text-purple-600" /> Librarian Management & Staff Performance Summary
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold uppercase block">Chief Librarian</span>
              <p className="font-bold text-foreground">{staffSummary.currentLibrarian}</p>
              <p className="text-[0.7rem] text-emerald-600 font-semibold">On Duty</p>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold uppercase block">Assistant Librarians</span>
              <p className="font-bold text-foreground font-mono">{staffSummary.assistantLibrariansCount} Officers</p>
              <p className="text-[0.7rem] text-muted-foreground">Catalog & Circulation Desks</p>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold uppercase block">Staff Availability</span>
              <p className="font-bold text-foreground">{staffSummary.staffAvailability}</p>
              <p className="text-[0.7rem] text-muted-foreground">{staffSummary.pendingLeaveRequests} Pending Leave Request</p>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold uppercase block">Performance Summary</span>
              <p className="font-bold text-primary">{staffSummary.staffPerformanceSummary}</p>
              <p className="text-[0.7rem] text-emerald-600 font-semibold">Compliant</p>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG 1: LIBRARY CONFIGURATION */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sliders className="size-5 text-primary" /> Institutional Library Policy & Governance Rules
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure borrowing periods, maximum allowances, daily fines, lost book rules, digital access, working hours, and notifications.
            </DialogDescription>
          </DialogHeader>

          {/* Configuration Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-2 pt-1">
            <button
              type="button"
              onClick={() => setConfigTab("borrowing")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${configTab === "borrowing" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              1. Borrowing & Allowances
            </button>
            <button
              type="button"
              onClick={() => setConfigTab("policies")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${configTab === "policies" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              2. Fines & Lost Book Policies
            </button>
            <button
              type="button"
              onClick={() => setConfigTab("timings")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${configTab === "timings" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              3. Hours, Holidays & Alerts
            </button>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4 pt-2">
            {/* TAB 1: BORROWING & ALLOWANCES */}
            {configTab === "borrowing" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Circulation Limits & Allowances</h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Borrowing Period (Days)</Label>
                    <Input
                      type="number"
                      value={configForm.borrowingPeriodDays}
                      onChange={(e) => setConfigForm({ ...configForm, borrowingPeriodDays: Number(e.target.value) })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Max Books (Student)</Label>
                    <Input
                      type="number"
                      value={configForm.maxBooksPerStudent}
                      onChange={(e) => setConfigForm({ ...configForm, maxBooksPerStudent: Number(e.target.value) })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Max Books (Faculty)</Label>
                    <Input
                      type="number"
                      value={configForm.maxBooksPerFaculty}
                      onChange={(e) => setConfigForm({ ...configForm, maxBooksPerFaculty: Number(e.target.value) })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Fine Per Day (₹)</Label>
                    <Input
                      type="number"
                      value={configForm.finePerDay}
                      onChange={(e) => setConfigForm({ ...configForm, finePerDay: Number(e.target.value) })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Book Reservation Policy</Label>
                  <Input value={configForm.reservationPolicy} onChange={(e) => setConfigForm({ ...configForm, reservationPolicy: e.target.value })} className="h-9 text-xs" />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Digital Library Access Policy</Label>
                  <Input value={configForm.digitalLibraryAccess} onChange={(e) => setConfigForm({ ...configForm, digitalLibraryAccess: e.target.value })} className="h-9 text-xs" />
                </div>
              </div>
            )}

            {/* TAB 2: FINES & POLICIES */}
            {configTab === "policies" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Lost Book & Late Return Enforcement</h4>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Lost Book Penalty Policy</Label>
                  <Textarea rows={2} value={configForm.lostBookPolicy} onChange={(e) => setConfigForm({ ...configForm, lostBookPolicy: e.target.value })} className="text-xs" />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Late Return & Privilege Suspension Policy</Label>
                  <Textarea rows={2} value={configForm.lateReturnPolicy} onChange={(e) => setConfigForm({ ...configForm, lateReturnPolicy: e.target.value })} className="text-xs" />
                </div>
              </div>
            )}

            {/* TAB 3: HOURS & TIMINGS */}
            {configTab === "timings" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Working Hours & Reminders</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Library Working Hours</Label>
                    <Input value={configForm.workingHours} onChange={(e) => setConfigForm({ ...configForm, workingHours: e.target.value })} className="h-9 text-xs" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Holiday Calendar Rules</Label>
                    <Input value={configForm.holidayCalendar} onChange={(e) => setConfigForm({ ...configForm, holidayCalendar: e.target.value })} className="h-9 text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Automated Notification Rules</Label>
                  <Textarea rows={2} value={configForm.notificationRules} onChange={(e) => setConfigForm({ ...configForm, notificationRules: e.target.value })} className="text-xs" />
                </div>
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsConfigOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold gap-1.5">
                <CheckCircle2 className="size-3.5" /> Save Configuration
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: LIBRARY REPORTS */}
      <Dialog open={isReportsOpen} onOpenChange={setIsReportsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" /> Institutional Library Executive Reports
            </DialogTitle>
            <DialogDescription className="text-xs">
              Generate and download comprehensive library utilization, overdue, catalog, and inventory reports.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => toast.success("Monthly Book Utilization Report generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <FileText className="size-4 text-primary" /> Monthly Circulation Report
            </Button>

            <Button variant="outline" onClick={() => toast.success("Yearly Library Performance Report generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <BarChart3 className="size-4 text-emerald-600" /> Yearly Performance Audit
            </Button>

            <Button variant="outline" onClick={() => toast.success("Department-wise Usage Report generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <PieChart className="size-4 text-blue-600" /> Department-wise Usage Breakdown
            </Button>

            <Button variant="outline" onClick={() => toast.success("Most/Least Borrowed Titles Report generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <BookOpen className="size-4 text-purple-600" /> Most & Least Borrowed Titles
            </Button>

            <Button variant="outline" onClick={() => toast.success("Overdue & Fine Recovery Report generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <AlertTriangle className="size-4 text-amber-600" /> Overdue & Fine Recovery Audit
            </Button>

            <Button variant="outline" onClick={() => toast.success("Physical Stock Inventory Audit generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <ShieldCheck className="size-4 text-emerald-600" /> Physical Stock Inventory Report
            </Button>
          </div>

          <DialogFooter className="pt-3 border-t border-border">
            <Button variant="outline" onClick={() => setIsReportsOpen(false)} className="text-xs">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
