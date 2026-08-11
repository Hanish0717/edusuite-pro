import React, { useEffect, useState } from "react";
import {
  Library,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  BookOpen,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Globe,
  ExternalLink,
  BookMarked,
  Sparkles,
  ShieldCheck,
  Activity,
  Cpu,
  HardDrive,
  Clock,
  Settings,
  FileText,
  Layers,
  PieChart,
  Users,
  UserCheck,
  BarChart3,
  Calendar,
  Bell,
  AlertCircle,
  Award,
  Book,
  ShieldAlert,
  Server,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import {
  fetchLibraryBooks,
  fetchBookIssues,
  INITIAL_BOOKS,
  INITIAL_ISSUES,
  type LibraryBook,
  type BookIssueRecord,
} from "./LibraryService";

const CATEGORIES = ["All Categories", "Computer Science", "Electronics", "Mechanical", "AI & Data Science", "General Science"] as const;

export function LibraryModuleView() {
  const [books, setBooks] = useState<LibraryBook[]>(INITIAL_BOOKS);
  const [issues, setIssues] = useState<BookIssueRecord[]>(INITIAL_ISSUES);
  const [activeTab, setActiveTab] = useState<"governance" | "catalog" | "circulation" | "digital" | "librarians">("governance");

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All Categories");
  const [loading, setLoading] = useState(false);

  // Executive Dialog States
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Configuration Form State
  const [configForm, setConfigForm] = useState({
    borrowingDaysStudent: "14",
    borrowingDaysFaculty: "30",
    maxBooksStudent: "4",
    maxBooksFaculty: "10",
    finePerDay: "5.00",
    lostBookPenalty: "Replacement Cost + 20% Administrative Processing Fee",
    digitalAccess: "Enabled for All Active Enrolled Students & Faculty",
    workingHours: "08:00 AM - 08:00 PM (Mon to Sat)",
    lateReturnPolicy: "Borrowing suspended if unpaid fines exceed ₹100",
  });

  const loadData = async () => {
    setLoading(true);
    const [bks, iss] = await Promise.all([fetchLibraryBooks(), fetchBookIssues()]);
    setBooks(bks);
    setIssues(iss);
    setLoading(false);
    toast.success("Library governance metrics updated with live institutional data!");
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

  const handleExportCSV = () => {
    const headers = ["Book ID", "Accession No", "Title", "Author", "ISBN", "Category", "Total Copies", "Available Copies", "Rack Location"];
    const rows = filteredBooks.map((b) => [b.id, b.accessionNo, `"${b.title}"`, `"${b.author}"`, b.isbn, b.category, b.totalCopies, b.availableCopies, `"${b.rackNo}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Library_Inventory_Governance_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported institutional library catalog inventory!");
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Library institutional policy settings updated successfully!");
    setIsConfigOpen(false);
  };

  const handleScheduleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Physical library inventory stock audit scheduled successfully!");
    setIsAuditModalOpen(false);
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
                Library Governance & Knowledge Resource Center
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Super Admin Oversight Cockpit
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Executive monitoring, institutional policy configuration, circulation audit, and e-journal subscription oversight.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner (EXECUTIVE ACTIONS ONLY - NO DAILY OPERATIONS) */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent">
            <Download className="size-3.5" /> Export Catalog
          </Button>

          {/* REPLACED "ISSUE BOOK" WITH "LIBRARY REPORTS" */}
          <Button size="sm" onClick={() => setIsReportsOpen(true)} variant="outline" className="h-9 border-primary/30 text-primary gap-2 text-xs font-semibold hover:bg-primary/10">
            <FileText className="size-4" /> Library Reports
          </Button>

          {/* REPLACED "ADD BOOK TITLE" WITH "LIBRARY CONFIGURATION" */}
          <Button size="sm" onClick={() => setIsConfigOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow hover:opacity-95">
            <Settings className="size-4" /> Library Configuration
          </Button>
        </div>
      </div>

      {/* TOP KPI CARDS - ROW 1 (EXISTING CARDS PRESERVED) */}
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
          <p className="text-2xl font-bold font-mono text-emerald-600">{issues.filter((i) => i.status === "Issued").length} Active</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">14-day borrowing cycle</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Digital E-Journals</span>
            <Globe className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">850 IEEE / ACM</p>
          <p className="text-[0.68rem] text-muted-foreground">E-Library access enabled</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Overdue Fines</span>
            <AlertTriangle className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">₹1,240 Total Dues</p>
          <p className="text-[0.68rem] text-muted-foreground">Pending return collection</p>
        </div>
      </div>

      {/* TOP KPI CARDS - ROW 2 (ADDITIONAL GOVERNANCE KPI ROW) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Library Members</span>
          <span className="font-mono font-bold text-foreground text-sm block">4,850 Active</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Issued Today</span>
          <span className="font-mono font-bold text-emerald-600 text-sm block">142 Books</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Returned Today</span>
          <span className="font-mono font-bold text-primary text-sm block">128 Books</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Overdue Books</span>
          <span className="font-mono font-bold text-amber-600 text-sm block">18 Volumes</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Reserved Books</span>
          <span className="font-mono font-bold text-purple-600 text-sm block">24 Pending</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Damaged Books</span>
          <span className="font-mono font-bold text-red-600 text-sm block">3 Volumes</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Lost Books</span>
          <span className="font-mono font-bold text-red-600 text-sm block">1 Reported</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Digital Searches</span>
          <span className="font-mono font-bold text-blue-600 text-sm block">1,420 Today</span>
        </div>
      </div>

      {/* EXECUTIVE NAVIGATION TAB SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
        <button onClick={() => setActiveTab("governance")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "governance" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Governance & Health Cockpit
        </button>
        <button onClick={() => setActiveTab("catalog")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "catalog" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Catalog Inventory & Racks ({books.length})
        </button>
        <button onClick={() => setActiveTab("circulation")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "circulation" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          3. Circulation Ledger ({issues.length})
        </button>
        <button onClick={() => setActiveTab("digital")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "digital" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          4. Digital Library Subscriptions
        </button>
        <button onClick={() => setActiveTab("librarians")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "librarians" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          5. Librarian Staff Governance
        </button>
      </div>

      {/* TAB 1: GOVERNANCE & HEALTH COCKPIT */}
      {activeTab === "governance" && (
        <div className="space-y-6">
          {/* LIBRARY HEALTH WIDGET & LIBRARY ALERTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* LIBRARY HEALTH CARD */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Activity className="size-5 text-emerald-500" /> Library Infrastructure & System Health
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
                  Overall Health: 96 / 100 (Optimal)
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">Book Availability</span>
                    <span className="text-emerald-600 font-mono">92.4%</span>
                  </div>
                  <Progress value={92.4} className="h-2" />
                  <p className="text-[0.65rem] text-muted-foreground mt-1">39,270 copies on shelf</p>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">Shelf Occupancy</span>
                    <span className="text-blue-600 font-mono">78.5%</span>
                  </div>
                  <Progress value={78.5} className="h-2" />
                  <p className="text-[0.65rem] text-muted-foreground mt-1">24 Racks in Central Block</p>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">Digital Resources</span>
                    <span className="text-emerald-600 font-mono">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-[0.65rem] text-muted-foreground mt-1">IEEE, Springer & ACM Active</p>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">System Status</span>
                    <span className="text-emerald-600 font-mono font-bold">Online</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-[0.65rem] text-muted-foreground mt-1">OPAC Server Operational</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-border/60 text-xs">
                <div className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">RFID Gate Status:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Operational</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Barcode Scanners:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">12 / 12 Active</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Library Database:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Synced (PostgreSQL)</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Auto Email Alerts:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Active</Badge>
                </div>
              </div>
            </div>

            {/* LIBRARY ALERTS CARD */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <AlertCircle className="size-5 text-amber-500" /> Executive Library Alerts
                </h3>
                <Badge variant="secondary" className="font-mono text-xs">6 Active Alerts</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-red-600">
                    <span>High Overdue Books</span>
                    <Badge className="bg-red-500/20 text-red-700 text-[0.65rem]">Action Required</Badge>
                  </div>
                  <p className="text-muted-foreground text-[0.7rem]">4 books overdue by &gt; 30 days in Mechanical Engineering department.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-amber-600">
                    <span>Shelf Capacity Reached</span>
                    <Badge className="bg-amber-500/20 text-amber-700 text-[0.65rem]">Warning</Badge>
                  </div>
                  <p className="text-muted-foreground text-[0.7rem]">Rack CS-05 in Computer Science section at 94% volume capacity.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-yellow-700 dark:text-yellow-300">
                    <span>Digital License Expiring</span>
                    <Badge className="bg-yellow-500/20 text-yellow-800 text-[0.65rem]">Notice</Badge>
                  </div>
                  <p className="text-muted-foreground text-[0.7rem]">Springer Nature E-Books subscription expiring in 28 days.</p>
                </div>
              </div>
            </div>
          </div>

          {/* EXECUTIVE ANALYTICS & OVERDUE SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* EXECUTIVE ANALYTICS CARD */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <BarChart3 className="size-5 text-primary" /> Executive Library Analytics & Usage Trends
                </h3>
                <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                  Monthly Audit Cycle
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1.5">
                  <span className="font-bold text-foreground block">Most Borrowed Categories</span>
                  <div className="space-y-1 text-[0.72rem] text-muted-foreground font-mono">
                    <div className="flex justify-between"><span>Computer Science & AI</span><strong className="text-emerald-600">42%</strong></div>
                    <div className="flex justify-between"><span>Electronics & Comm.</span><strong className="text-primary">24%</strong></div>
                    <div className="flex justify-between"><span>Mechanical Engg.</span><strong className="text-foreground">18%</strong></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1.5">
                  <span className="font-bold text-foreground block">Circulation Breakdown</span>
                  <div className="space-y-1 text-[0.72rem] text-muted-foreground font-mono">
                    <div className="flex justify-between"><span>Monthly Book Circulation</span><strong className="text-primary">3,420 / mo</strong></div>
                    <div className="flex justify-between"><span>Student Usage Rate</span><strong className="text-emerald-600">88.5%</strong></div>
                    <div className="flex justify-between"><span>Faculty Usage Rate</span><strong className="text-purple-600">94.2%</strong></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1.5">
                  <span className="font-bold text-foreground block">Digital & Traffic Insights</span>
                  <div className="space-y-1 text-[0.72rem] text-muted-foreground font-mono">
                    <div className="flex justify-between"><span>Digital Downloads</span><strong className="text-blue-600">18,450 PDFs</strong></div>
                    <div className="flex justify-between"><span>Peak Library Hours</span><strong className="text-amber-600">04:00 - 06:30 PM</strong></div>
                    <div className="flex justify-between"><span>Least Used Category</span><strong className="text-muted-foreground">Humanities (4%)</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* OVERDUE SUMMARY CARD */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Clock className="size-5 text-amber-500" /> Overdue Summary & Penalties
                </h3>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-mono text-xs">
                  18 Overdue
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground font-sans">Total Books Overdue:</span>
                  <strong className="text-amber-600">18 Volumes</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground font-sans">Total Fine Pending:</span>
                  <strong className="text-red-600">₹1,240 Uncollected</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground font-sans">Longest Overdue:</span>
                  <strong className="text-red-600">42 Days (ACC-38910)</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground font-sans">Critical Overdue (&gt;30d):</span>
                  <strong className="text-red-600">4 Books</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground font-sans">Highest Overdue Dept:</span>
                  <strong className="text-foreground font-sans">Mechanical (38%)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITIES & EXECUTIVE QUICK ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* RECENT ACTIVITIES TIMELINE */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Clock className="size-5 text-primary" /> Institutional Recent Library Activity Feed
                </h3>
                <Badge variant="secondary" className="font-mono text-xs">Real-time Feed</Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { date: "Aug 04 10:15 AM", user: "Registrar Office", action: "IEEE Xplore Digital Resource Subscription Renewed", status: "Success" },
                  { date: "Aug 03 04:30 PM", user: "Head Librarian", action: "Annual Physical Stock Inventory Audit Completed (Racks 01-24)", status: "Completed" },
                  { date: "Aug 02 02:15 PM", user: "Student Service Desk", action: "Book Lost Reported (ACC-41029) - Fine Clearance Initiated", status: "Pending Fee" },
                  { date: "Aug 01 11:00 AM", user: "Tech Team", action: "RFID Security Gate Scanner Firmware Updated to v4.2", status: "System" },
                  { date: "Jul 31 05:00 PM", user: "Library Admin", action: "Library Independence Day Holiday Circular Published", status: "Notification" },
                ].map((act, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[0.68rem] text-primary font-bold">{act.date}</span>
                      <p className="font-bold text-foreground">{act.action}</p>
                      <span className="text-[0.68rem] text-muted-foreground font-mono">By: {act.user}</span>
                    </div>
                    <Badge variant="outline" className="font-mono text-[0.65rem] shrink-0">{act.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* EXECUTIVE QUICK ACTIONS PANEL */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
                  <Zap className="size-5 text-primary" /> Executive Governance Actions
                </h3>

                <div className="space-y-2 mt-3">
                  <Button onClick={() => setIsConfigOpen(true)} className="w-full justify-start text-xs font-semibold gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 h-9">
                    <Settings className="size-4" /> Library Configuration
                  </Button>

                  <Button onClick={() => setIsReportsOpen(true)} className="w-full justify-start text-xs font-semibold gap-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20 h-9">
                    <FileText className="size-4" /> View Library Reports
                  </Button>

                  <Button onClick={handleExportCSV} className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9">
                    <Download className="size-4 text-blue-500" /> Download Inventory Report
                  </Button>

                  <Button onClick={() => setIsAuditModalOpen(true)} className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9">
                    <Calendar className="size-4 text-purple-600" /> Schedule Library Audit
                  </Button>

                  <Button onClick={() => setActiveTab("digital")} className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9">
                    <Globe className="size-4 text-amber-600" /> Manage Digital Subscriptions
                  </Button>

                  <Button onClick={() => setActiveTab("governance")} className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9">
                    <BarChart3 className="size-4 text-teal-600" /> View Library Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOK CATALOG (READ-ONLY GOVERNANCE OVERVIEW) */}
      {activeTab === "catalog" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search catalog by title, author, accession no..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
            </div>

            <Select value={selectedCat} onValueChange={setSelectedCat}>
              <SelectTrigger className="h-9 w-[180px] text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Accession No</th>
                  <th className="py-3 px-3">Book Title</th>
                  <th className="py-3 px-3">Author(s)</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Copies Availability</th>
                  <th className="py-3 px-3">Rack Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {filteredBooks.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/20 transition-colors font-sans">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{b.accessionNo}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{b.title}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{b.author}</td>
                    <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-xs">{b.category}</Badge></td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">{b.availableCopies} / {b.totalCopies} Available</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{b.rackNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CIRCULATION LEDGER (READ-ONLY GOVERNANCE OVERVIEW - NO OPERATIONAL BUTTONS) */}
      {activeTab === "circulation" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <BookOpen className="size-5 text-emerald-500" /> Institutional Circulation Audit Ledger
            </h3>
            <Badge variant="secondary" className="font-mono text-xs">{issues.length} Total Circulation Records</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Issue ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Book Title</th>
                  <th className="py-3 px-3">Issue / Due Date</th>
                  <th className="py-3 px-3">Circulation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {issues.map((i) => (
                  <tr key={i.id} className="hover:bg-muted/20 transition-colors font-sans">
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

      {/* TAB 4: DIGITAL LIBRARY SUBSCRIPTIONS (SECTION 11 REQS) */}
      {activeTab === "digital" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Globe className="size-5 text-blue-500" /> Digital Library Subscriptions & E-Resources
            </h3>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
              6 Active Subscriptions
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "IEEE Xplore Digital Library", status: "Active Subscription", expiry: "2027-03-31", usage: "8,450 Downloads/mo", desc: "Full text access to 5M+ peer-reviewed IEEE journal & conference publications.", url: "https://ieeexplore.ieee.org" },
              { name: "SpringerLink E-Journals", status: "Active Subscription", expiry: "2026-09-01", usage: "4,120 Downloads/mo", desc: "Access to 3,000+ scientific, technical and medical journal titles.", url: "https://link.springer.com" },
              { name: "Elsevier ScienceDirect", status: "Active Subscription", expiry: "2027-01-15", usage: "3,890 Downloads/mo", desc: "Leading platform of peer-reviewed literature across engineering & science.", url: "https://sciencedirect.com" },
              { name: "ACM Digital Library", status: "Active Subscription", expiry: "2026-11-30", usage: "2,150 Downloads/mo", desc: "Full text database of computing literature & ACM transactions.", url: "https://dl.acm.org" },
              { name: "NPTEL Swayam Video Portal", status: "Perpetual National Access", expiry: "National Grant", usage: "12,400 Streams/mo", desc: "MHRD video lectures & web courses for engineering curriculum.", url: "https://nptel.ac.in" },
              { name: "National Digital Library (NDLI)", status: "Perpetual National Access", expiry: "National Grant", usage: "5,600 Searches/mo", desc: "National repository containing educational assets across all disciplines.", url: "https://ndl.iitkgp.ac.in" },
            ].map((sub, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary font-mono text-[0.68rem]">{sub.name}</Badge>
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">{sub.status}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{sub.name}</h4>
                  <p className="text-xs text-muted-foreground">{sub.desc}</p>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Expiry Date:</span>
                    <strong className="text-foreground font-sans">{sub.expiry}</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Usage Volume:</span>
                    <strong className="text-blue-600 font-sans">{sub.usage}</strong>
                  </div>

                  <Button size="sm" asChild className="w-full h-8 text-xs bg-brand-gradient text-white gap-1 mt-1">
                    <a href={sub.url} target="_blank" rel="noreferrer"><ExternalLink className="size-3.5" /> Launch Portal</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: LIBRARIAN STAFF GOVERNANCE (SECTION 12 REQS) */}
      {activeTab === "librarians" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <UserCheck className="size-5 text-purple-500" /> Librarian Staff Governance & Performance
            </h3>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
              3 Staff On Duty Today
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <Badge className="bg-purple-500/10 text-purple-600 font-mono text-xs">Head Librarian</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">On Duty</Badge>
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground">Dr. V. S. Murthy</h4>
                <p className="text-xs text-muted-foreground font-mono">Ph.D. Library & Information Science</p>
              </div>
              <div className="pt-2 border-t border-border/60 text-xs space-y-1 font-mono">
                <div className="flex justify-between"><span>Experience:</span><strong>18 Years</strong></div>
                <div className="flex justify-between"><span>Audit SLA:</span><strong className="text-emerald-600">100% Met</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <Badge className="bg-blue-500/10 text-blue-600 font-mono text-xs">Asst. Librarian (Circulation)</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">On Duty</Badge>
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground">Mrs. R. Lakshmi</h4>
                <p className="text-xs text-muted-foreground font-mono">M.Lib.Sc.</p>
              </div>
              <div className="pt-2 border-t border-border/60 text-xs space-y-1 font-mono">
                <div className="flex justify-between"><span>Shift:</span><strong>Morning (08:00 - 04:00)</strong></div>
                <div className="flex justify-between"><span>Issues Handled:</span><strong className="text-primary">142 Today</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <Badge className="bg-indigo-500/10 text-indigo-600 font-mono text-xs">Asst. Librarian (Digital Resources)</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">On Duty</Badge>
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground">Mr. K. Rajesh</h4>
                <p className="text-xs text-muted-foreground font-mono">M.Sc. Information Tech.</p>
              </div>
              <div className="pt-2 border-t border-border/60 text-xs space-y-1 font-mono">
                <div className="flex justify-between"><span>Shift:</span><strong>Evening (12:00 - 08:00)</strong></div>
                <div className="flex justify-between"><span>Portal Uptime:</span><strong className="text-emerald-600">100% Uptime</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* EXECUTIVE MODAL DIALOGS */}
      {/* --------------------------------------------------------------------- */}

      {/* DIALOG 1: LIBRARY CONFIGURATION MODAL */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Settings className="size-5 text-primary" /> Institutional Library Configuration
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure borrowing periods, fines, digital access, and institutional library policies.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveConfig} className="space-y-3.5 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Student Borrowing Period (Days)</Label>
                <Input value={configForm.borrowingDaysStudent} onChange={(e) => setConfigForm({ ...configForm, borrowingDaysStudent: e.target.value })} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Faculty Borrowing Period (Days)</Label>
                <Input value={configForm.borrowingDaysFaculty} onChange={(e) => setConfigForm({ ...configForm, borrowingDaysFaculty: e.target.value })} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Max Books Per Student</Label>
                <Input value={configForm.maxBooksStudent} onChange={(e) => setConfigForm({ ...configForm, maxBooksStudent: e.target.value })} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Max Books Per Faculty</Label>
                <Input value={configForm.maxBooksFaculty} onChange={(e) => setConfigForm({ ...configForm, maxBooksFaculty: e.target.value })} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Overdue Fine Per Day (₹)</Label>
                <Input value={configForm.finePerDay} onChange={(e) => setConfigForm({ ...configForm, finePerDay: e.target.value })} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Working Hours</Label>
                <Input value={configForm.workingHours} onChange={(e) => setConfigForm({ ...configForm, workingHours: e.target.value })} className="h-9 text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Lost Book Penalty Policy</Label>
              <Input value={configForm.lostBookPenalty} onChange={(e) => setConfigForm({ ...configForm, lostBookPenalty: e.target.value })} className="h-9 text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Late Return Suspension Policy</Label>
              <Input value={configForm.lateReturnPolicy} onChange={(e) => setConfigForm({ ...configForm, lateReturnPolicy: e.target.value })} className="h-9 text-xs" />
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsConfigOpen(false)} className="text-xs">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Save Policy Configuration</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: LIBRARY REPORTS MODAL */}
      <Dialog open={isReportsOpen} onOpenChange={setIsReportsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="size-5 text-emerald-600" /> Executive Library Reports Center
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Generate and export institutional usage, department statistics, and inventory audit reports.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { title: "Monthly Circulation Report", desc: "Detailed monthly issue, return, and fine breakdown.", icon: Calendar },
                { title: "Department-wise Usage", desc: "Circulation volume categorized by academic department.", icon: BarChart3 },
                { title: "Most Borrowed Books List", desc: "Top 50 most frequently checked-out textbooks.", icon: BookOpen },
                { title: "Overdue & Penalty Audit", desc: "Full list of students/faculty with overdue fines.", icon: AlertTriangle },
                { title: "Digital Library Access Log", desc: "IEEE & Springer PDF download telemetry report.", icon: Globe },
                { title: "Stock Audit & Damaged Books", desc: "Physical inventory audit & damaged book list.", icon: Layers },
              ].map((rep, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-muted/40 border border-border/80 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-foreground flex items-center gap-1.5"><rep.icon className="size-4 text-primary" /> {rep.title}</span>
                    <p className="text-[0.68rem] text-muted-foreground mt-0.5">{rep.desc}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Exporting ${rep.title}...`)} className="h-7 text-xs w-full gap-1">
                    <Download className="size-3" /> Download PDF
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={() => setIsReportsOpen(false)} className="w-full text-xs">Close Reports Center</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: SCHEDULE LIBRARY AUDIT MODAL */}
      <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Calendar className="size-5 text-purple-600" /> Schedule Physical Stock Audit
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleScheduleAudit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Audit Target Racks / Sections *</Label>
              <Input required defaultValue="Racks 01 to 24 (All Engineering Sections)" className="h-9 text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Audit Date *</Label>
              <Input type="date" required defaultValue="2026-08-15" className="h-9 text-xs" />
            </div>

            <DialogFooter className="pt-2 border-t border-border flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAuditModalOpen(false)} className="text-xs flex-1">Cancel</Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex-1">Confirm Audit Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
