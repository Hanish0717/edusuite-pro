import React, { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
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
  ArrowLeft,
  Loader2,
  Edit,
  RotateCcw,
  Eye,
  FileSpreadsheet,
  Printer,
  Check,
  X,
  Building,
  TrendingUp,
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

const CATEGORIES = [
  "All Categories",
  "Computer Science",
  "Electronics",
  "Mechanical",
  "AI & Data Science",
  "General Science",
] as const;

const DEPARTMENTS = [
  "All Departments",
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil Engineering",
  "AI & Data Science",
] as const;

export function LibraryModuleView() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab");

  const [books, setBooks] = useState<LibraryBook[]>(INITIAL_BOOKS);
  const [issues, setIssues] = useState<BookIssueRecord[]>(INITIAL_ISSUES);
  const [activeTab, setActiveTab] = useState<"catalog" | "issues" | "ejournals" | "overdue" | "staff">("catalog");

  useEffect(() => {
    if (tabFromUrl === "catalog") setActiveTab("catalog");
    else if (tabFromUrl === "issues") setActiveTab("issues");
    else if (tabFromUrl === "ejournals") setActiveTab("ejournals");
    else if (tabFromUrl === "overdue") setActiveTab("overdue");
    else if (tabFromUrl === "staff") setActiveTab("staff");
  }, [tabFromUrl]);

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All Categories");
  const [loading, setLoading] = useState(false);

  // Executive Modals & Panels State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isDigitalOpen, setIsDigitalOpen] = useState(false);
  const [showAnalyticsView, setShowAnalyticsView] = useState(false);

  // 1. Config Form State
  const [configTab, setConfigTab] = useState<
    "borrowing" | "fines" | "digital" | "hours" | "reservation" | "notifications" | "lostbook"
  >("borrowing");
  const [configForm, setConfigForm] = useState<LibraryConfig>(DEFAULT_LIBRARY_CONFIG);
  const [configLoading, setConfigLoading] = useState(false);

  // 2. Reports State
  const [selectedReport, setSelectedReport] = useState<
    "monthly" | "yearly" | "utilization" | "department" | "overdue" | "digital" | "inventory"
  >("monthly");
  const [reportDeptFilter, setReportDeptFilter] = useState("All Departments");
  const [reportDateFilter, setReportDateFilter] = useState("August 2026");
  const [reportCategoryFilter, setReportCategoryFilter] = useState("All Categories");
  const [reportExporting, setReportExporting] = useState<string | null>(null);

  // 3. Download Inventory State
  const [inventoryLoading, setInventoryLoading] = useState(false);

  // 4. Audit Form State
  const [auditForm, setAuditForm] = useState({
    auditDate: "2026-08-15",
    auditTime: "10:00",
    auditType: "Physical Stock Audit",
    auditor: "Dr. K. V. Ramanathan & Internal Committee",
    remarks: "Annual physical inventory and RFID tag verification across all department stacks.",
  });
  const [auditLoading, setAuditLoading] = useState(false);

  // 5. Digital Resources State
  const [digitalSubs, setDigitalSubs] = useState<DigitalSubscription[]>(DEFAULT_DIGITAL_SUBSCRIPTIONS);
  const [selectedDigitalSub, setSelectedDigitalSub] = useState<DigitalSubscription | null>(null);
  const [isViewSubOpen, setIsViewSubOpen] = useState(false);
  const [isEditSubOpen, setIsEditSubOpen] = useState(false);
  const [editSubForm, setEditSubForm] = useState<Partial<DigitalSubscription>>({});
  const [digitalActionLoading, setDigitalActionLoading] = useState<string | null>(null);

  // Governance & Log States
  const [healthStatus] = useState<LibraryHealthStatus>(DEFAULT_LIBRARY_HEALTH);
  const [overdueSummary] = useState<OverdueSummary>(DEFAULT_OVERDUE_SUMMARY);
  const [alerts, setAlerts] = useState<LibraryAlert[]>(INITIAL_ALERTS);
  const [activities, setActivities] = useState<LibraryActivityLog[]>(INITIAL_ACTIVITIES);
  const [staffSummary] = useState<LibrarianStaffSummary>(DEFAULT_STAFF_SUMMARY);

  const addActivityLog = (action: string, category: string) => {
    const newLog: LibraryActivityLog = {
      id: `ACT-${Date.now()}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: "Super Admin (Executive)",
      action,
      category,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

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

  // Action 1: Save Configuration
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigLoading(true);
    setTimeout(() => {
      setConfigLoading(false);
      setIsConfigOpen(false);
      addActivityLog("Updated Library Rules & Policy Configuration", "Configuration");
      toast.success("Library Rules & Policy Configuration saved successfully!");
    }, 400);
  };

  const handleResetConfig = () => {
    setConfigForm(DEFAULT_LIBRARY_CONFIG);
    toast.info("Library Configuration reset to default parameters!");
  };

  // Action 2: Export Report
  const handleExportReport = (format: "PDF" | "Excel" | "CSV") => {
    setReportExporting(format);
    setTimeout(() => {
      const dateStr = new Date().toISOString().split("T")[0];
      const reportTitle = `Library_${selectedReport.toUpperCase()}_Report_${dateStr}`;

      if (format === "CSV") {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += `INSTITUTIONAL LIBRARY ${selectedReport.toUpperCase()} REPORT\n`;
        csvContent += `Generated On,${dateStr}\n`;
        csvContent += `Department Filter,${reportDeptFilter}\n`;
        csvContent += `Category Filter,${reportCategoryFilter}\n\n`;
        csvContent += `Accession No,Book Title,Author,ISBN,Category,Available Copies,Total Copies,Rack Location\n`;

        books.forEach((b) => {
          csvContent += `${b.accessionNo},"${b.title.replace(/"/g, '""')}","${b.author.replace(/"/g, '""')}",${b.isbn},${b.category},${b.availableCopies},${b.totalCopies},"${b.rackNo}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${reportTitle}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === "Excel") {
        let xlsContent = "data:application/vnd.ms-excel;charset=utf-8,";
        xlsContent += `INSTITUTIONAL LIBRARY ${selectedReport.toUpperCase()} REPORT\nDate: ${dateStr}\tDept: ${reportDeptFilter}\tCategory: ${reportCategoryFilter}\n\n`;
        xlsContent += `Accession No\tTitle\tAuthor\tCategory\tAvailable Copies\tTotal Copies\n`;
        books.forEach((b) => {
          xlsContent += `${b.accessionNo}\t${b.title}\t${b.author}\t${b.category}\t${b.availableCopies}\t${b.totalCopies}\n`;
        });
        const encodedUri = encodeURI(xlsContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${reportTitle}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // PDF Export
        const pdfText =
          `INSTITUTIONAL LIBRARY EXECUTIVE REPORT\n` +
          `==========================================\n` +
          `Report Type: ${selectedReport.toUpperCase()}\n` +
          `Generated Date: ${dateStr}\n` +
          `Department Filter: ${reportDeptFilter}\n` +
          `Category Filter: ${reportCategoryFilter}\n` +
          `Period: ${reportDateFilter}\n\n` +
          `SUMMARY METRICS:\n` +
          `- Total Catalog Titles: ${books.length}\n` +
          `- Active Issues: ${issues.filter((i) => i.status === "Issued").length}\n` +
          `- Overdue Volume: ${overdueSummary.booksOverdue} Books\n\n` +
          `CATALOG DETAILS:\n` +
          books.map((b) => `* [${b.accessionNo}] ${b.title} | Author: ${b.author} | Copies: ${b.availableCopies}/${b.totalCopies} | Rack: ${b.rackNo}`).join("\n");

        const blob = new Blob([pdfText], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${reportTitle}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setReportExporting(null);
      addActivityLog(`Generated and exported ${selectedReport} report as ${format}`, "Reports");
      toast.success(`Exported ${selectedReport} Report in ${format} format!`);
    }, 500);
  };

  // Action 3: Download Inventory
  const handleDownloadInventory = () => {
    setInventoryLoading(true);
    setTimeout(() => {
      const headers = ["Book ID", "Accession No", "Title", "Author", "ISBN", "Category", "Total Copies", "Available Copies", "Rack Location", "Status"];
      const rows = books.map((b) => [
        b.id,
        b.accessionNo,
        `"${b.title.replace(/"/g, '""')}"`,
        `"${b.author.replace(/"/g, '""')}"`,
        b.isbn,
        b.category,
        b.totalCopies,
        b.availableCopies,
        `"${b.rackNo}"`,
        b.availableCopies > 0 ? "In Stock" : "Checked Out",
      ]);

      const summaryHeader = [
        ["INSTITUTIONAL LIBRARY PHYSICAL STOCK & INVENTORY LEDGER"],
        [`Generated Date: ${new Date().toISOString().split("T")[0]}`],
        [`Total Catalog Volume: 42,500 Books | Active Tracked Titles: ${books.length}`],
        [""],
      ].map((e) => e.join(",")).join("\n");

      const csvContent = "data:text/csv;charset=utf-8," + summaryHeader + "\n" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Library_Physical_Inventory_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setInventoryLoading(false);
      addActivityLog(`Downloaded Physical Stock & Inventory Ledger (${books.length} Active Catalog Titles)`, "Inventory");
      toast.success("Stock & Inventory Ledger generated and downloaded successfully!");
    }, 500);
  };

  // Action 4: Schedule Library Audit
  const handleScheduleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuditLoading(true);
    setTimeout(() => {
      setAuditLoading(false);
      setIsAuditOpen(false);

      addActivityLog(`Scheduled ${auditForm.auditType} for ${auditForm.auditDate} (${auditForm.auditTime}) by ${auditForm.auditor}`, "Audit");

      const newAlert: LibraryAlert = {
        id: `ALT-${Date.now()}`,
        severity: "medium",
        title: `${auditForm.auditType} Scheduled`,
        description: `Scheduled on ${auditForm.auditDate} at ${auditForm.auditTime}. Auditor: ${auditForm.auditor}`,
        timestamp: "Just now",
      };
      setAlerts((prev) => [newAlert, ...prev]);

      toast.success(`Institutional Library Audit scheduled for ${auditForm.auditDate} at ${auditForm.auditTime}!`);
    }, 500);
  };

  // Action 5: Digital Resource Handlers
  const handleRenewDigitalSub = (sub: DigitalSubscription) => {
    setDigitalActionLoading(sub.id);
    setTimeout(() => {
      const currentYear = new Date().getFullYear();
      const newExpiry = `${currentYear + 1}-12-31`;
      setDigitalSubs((prev) =>
        prev.map((item) =>
          item.id === sub.id
            ? { ...item, activeSubscription: true, expiryDate: newExpiry }
            : item
        )
      );
      setDigitalActionLoading(null);
      addActivityLog(`Renewed Digital Subscription for ${sub.name} until ${newExpiry}`, "Subscriptions");
      toast.success(`Subscription for ${sub.name} successfully renewed until ${newExpiry}!`);
    }, 400);
  };

  const handleOpenEditSub = (sub: DigitalSubscription) => {
    setSelectedDigitalSub(sub);
    setEditSubForm({ ...sub });
    setIsEditSubOpen(true);
  };

  const handleSaveEditSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDigitalSub) return;
    setDigitalActionLoading("saving");
    setTimeout(() => {
      setDigitalSubs((prev) =>
        prev.map((item) =>
          item.id === selectedDigitalSub.id
            ? { ...item, ...editSubForm }
            : item
        )
      );
      setDigitalActionLoading(null);
      setIsEditSubOpen(false);
      addActivityLog(`Updated Digital Resource details for ${selectedDigitalSub.name}`, "Subscriptions");
      toast.success(`Updated digital resource ${selectedDigitalSub.name} successfully!`);
    }, 400);
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
    addActivityLog("Exported executive library catalog to CSV", "Export");
    toast.success("Exported executive library catalog to CSV!");
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

      {/* DEDICATED ANALYTICS VIEW WHEN TOGGLED */}
      {showAnalyticsView ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <PieChart className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Executive Library Analytics View</h2>
                <p className="text-xs text-muted-foreground">Comprehensive circulation trends, category utilization, peak footfall hours, and digital usage stats</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowAnalyticsView(false)} className="gap-2 text-xs font-semibold">
              <ArrowLeft className="size-4" /> Return to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. MOST BORROWED BOOKS */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <BookOpen className="size-4 text-primary" /> Most Borrowed Books
                </h3>
                <Badge variant="outline" className="font-mono text-xs">Top 5 Titles</Badge>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Artificial Intelligence: A Modern Approach", author: "Russell & Norvig", count: 142, total: 15, available: 11, pct: 92 },
                  { title: "CMOS VLSI Design", author: "Weste & Harris", count: 118, total: 10, available: 4, pct: 85 },
                  { title: "Deep Learning with Python", author: "Francois Chollet", count: 96, total: 20, available: 16, pct: 74 },
                  { title: "Shigley's Mechanical Engineering Design", author: "Budynas", count: 84, total: 12, available: 8, pct: 68 },
                  { title: "University Physics with Modern Physics", author: "Young & Freedman", count: 62, total: 18, available: 14, pct: 55 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5 p-2.5 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-foreground">{idx + 1}. {item.title}</span>
                      <span className="text-primary font-mono">{item.count} Checkouts</span>
                    </div>
                    <div className="flex justify-between text-[0.7rem] text-muted-foreground">
                      <span>Author: {item.author}</span>
                      <span className="font-mono">{item.available}/{item.total} Copies Available</span>
                    </div>
                    <Progress value={item.pct} className="h-1.5 bg-muted" />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. LEAST USED CATEGORIES */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" /> Least Used Categories & Under-Utilized Stacks
                </h3>
                <Badge className="bg-amber-500/10 text-amber-600 text-xs">Category Breakdown</Badge>
              </div>
              <div className="space-y-3">
                {[
                  { cat: "General Science & Humanities", pct: "7%", count: 128, advice: "Promote foundational science reading for 1st Year Students" },
                  { cat: "Civil & Environmental Engineering", pct: "9%", count: 164, advice: "Review catalog inventory & add latest BIM software textbooks" },
                  { cat: "Mechanical Engineering", pct: "18%", count: 320, advice: "Moderate circulation; CAD/CAM section active" },
                  { cat: "Electronics & Communication", pct: "24%", count: 440, advice: "High demand during mid-term laboratory cycles" },
                  { cat: "Computer Science & AI", pct: "42%", count: 788, advice: "Highest demand; consider procuring additional copies" },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-foreground">{item.cat}</span>
                      <Badge variant="outline" className="font-mono text-xs text-primary">{item.pct} Share ({item.count} loans)</Badge>
                    </div>
                    <p className="text-[0.7rem] text-muted-foreground">{item.advice}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. MONTHLY CIRCULATION TRENDS */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-500" /> Monthly Circulation Trends (2026)
                </h3>
                <span className="text-xs font-mono text-emerald-600 font-bold">+14.2% YoY Growth</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center text-xs">
                {[
                  { month: "Jan", count: 1420 },
                  { month: "Feb", count: 1650 },
                  { month: "Mar", count: 1890 },
                  { month: "Apr", count: 1720 },
                  { month: "May", count: 1510 },
                  { month: "Jun", count: 1320 },
                  { month: "Jul", count: 1780 },
                  { month: "Aug", count: 1840 },
                  { month: "Sep", count: 1910 },
                  { month: "Oct", count: 1820 },
                  { month: "Nov", count: 1760 },
                  { month: "Dec", count: 1680 },
                ].map((m, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-muted/40 border border-border/60 space-y-0.5">
                    <span className="text-[0.65rem] text-muted-foreground uppercase block font-semibold">{m.month}</span>
                    <span className="font-mono font-bold text-primary">{m.count}</span>
                  </div>
                ))}
              </div>
              <p className="text-[0.72rem] text-muted-foreground">Average monthly volume processed: <span className="font-bold font-mono text-foreground">1,688 Books/Month</span></p>
            </div>

            {/* 4. PEAK FOOTFALL & CHECKOUT HOURS */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Clock className="size-4 text-purple-600" /> Peak Library Hours & Footfall Analytics
                </h3>
                <Badge className="bg-purple-500/10 text-purple-600 text-xs">Daily Hourly Traffic</Badge>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { time: "08:00 AM - 10:00 AM", level: "Moderate (240 Visits)", peak: false },
                  { time: "11:00 AM - 01:00 PM", level: "PEAK HIGH (680 Visits)", peak: true },
                  { time: "01:00 PM - 02:00 PM", level: "Lunch Hours (180 Visits)", peak: false },
                  { time: "02:00 PM - 04:00 PM", level: "High (450 Visits)", peak: false },
                  { time: "04:00 PM - 06:00 PM", level: "PEAK HIGH (720 Visits)", peak: true },
                  { time: "06:00 PM - 09:00 PM", level: "Evening Study (310 Visits)", peak: false },
                ].map((slot, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-2 rounded-xl border ${slot.peak ? "bg-purple-500/10 border-purple-500/30 text-purple-700" : "bg-muted/30 border-border/60 text-muted-foreground"}`}>
                    <span className="font-semibold">{slot.time}</span>
                    <span className="font-mono text-[0.72rem] font-bold">{slot.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 & 6. STUDENT VS FACULTY USAGE */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Users className="size-4 text-blue-600" /> Student & Faculty Borrowing Usage
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                  <span className="text-[0.65rem] font-bold text-blue-700 uppercase">Student Circulation</span>
                  <p className="text-xl font-bold font-mono text-blue-800">84% Share</p>
                  <p className="text-[0.7rem] text-blue-600">Avg 14-day borrowing cycle | 2,898 Active Members</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <span className="text-[0.65rem] font-bold text-emerald-700 uppercase">Faculty Circulation</span>
                  <p className="text-xl font-bold font-mono text-emerald-800">16% Share</p>
                  <p className="text-[0.7rem] text-emerald-600">Extended 30-day term loan | 142 Active Members</p>
                </div>
              </div>
            </div>

            {/* 7. DIGITAL RESOURCE USAGE */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Globe className="size-4 text-emerald-500" /> Digital E-Journal & Resource Usage
                </h3>
                <Badge variant="outline" className="font-mono text-xs">42,500 Monthly Portal Views</Badge>
              </div>
              <div className="space-y-2 text-xs">
                {digitalSubs.map((sub) => (
                  <div key={sub.id} className="flex justify-between items-center p-2 rounded-xl bg-muted/30 border border-border/60">
                    <span className="font-semibold text-foreground">{sub.name}</span>
                    <span className="font-mono text-primary font-bold">{sub.usageStats}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
              <p className="text-2xl font-bold font-mono text-blue-600">{digitalSubs.length} Subscriptions</p>
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

            {/* DIGITAL LIBRARY SUBSCRIPTIONS SUMMARY WIDGET */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Globe className="size-4 text-blue-500" /> Digital Subscriptions Summary
                </h3>
                <Badge variant="outline" className="text-[0.65rem] font-mono">{digitalSubs.length} Portals</Badge>
              </div>

              <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 text-xs">
                {digitalSubs.map((sub) => (
                  <div key={sub.id} className="p-2.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">{sub.name}</span>
                      <Badge className={sub.activeSubscription ? "bg-emerald-500/10 text-emerald-600 text-[0.6rem] px-1.5 py-0" : "bg-red-500/10 text-red-600 text-[0.6rem] px-1.5 py-0"}>
                        {sub.activeSubscription ? "Active" : "Expired"}
                      </Badge>
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
                <Button
                  variant="outline"
                  onClick={() => setIsConfigOpen(true)}
                  className="justify-start gap-2.5 h-10 text-xs font-semibold"
                >
                  <Sliders className="size-4 text-primary" /> Library Rules & Policy Configuration
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsReportsOpen(true)}
                  className="justify-start gap-2.5 h-10 text-xs font-semibold"
                >
                  <BarChart3 className="size-4 text-emerald-600" /> View Comprehensive Institutional Reports
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownloadInventory}
                  disabled={inventoryLoading}
                  className="justify-start gap-2.5 h-10 text-xs font-semibold"
                >
                  {inventoryLoading ? (
                    <Loader2 className="size-4 animate-spin text-blue-600" />
                  ) : (
                    <FileText className="size-4 text-blue-600" />
                  )}
                  Download Stock & Inventory Ledger
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsAuditOpen(true)}
                  className="justify-start gap-2.5 h-10 text-xs font-semibold"
                >
                  <ShieldCheck className="size-4 text-purple-600" /> Schedule Institutional Library Audit
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsDigitalOpen(true)}
                  className="justify-start gap-2.5 h-10 text-xs font-semibold"
                >
                  <Globe className="size-4 text-amber-600" /> Manage Digital Resource Subscriptions
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowAnalyticsView(true)}
                  className="justify-start gap-2.5 h-10 text-xs font-semibold"
                >
                  <PieChart className="size-4 text-emerald-600" /> View Institutional Library Analytics
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
                <Badge variant="outline" className="text-[0.65rem] font-mono">{activities.length} Logs</Badge>
              </div>

              <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div key={act.id} className="p-2.5 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
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

          {/* TAB 2: ISSUES */}
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
                    <Badge className={sub.activeSubscription ? "bg-emerald-500/10 text-emerald-600 text-xs" : "bg-red-500/10 text-red-600 text-xs"}>
                      {sub.activeSubscription ? "Active Subscription" : "Expired"}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{sub.name}</h3>
                  <p className="text-xs text-muted-foreground">Expiry Date: <span className="font-mono font-semibold">{sub.expiryDate}</span></p>
                  <p className="text-xs text-muted-foreground">Licenses: <span className="font-mono font-semibold">{sub.licenseCount || 500} Seats</span></p>
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
        </>
      )}

      {/* DIALOG 1: LIBRARY CONFIGURATION MODAL */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sliders className="size-5 text-primary" /> Institutional Library Policy & Governance Rules
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure borrowing rules, fine rules, digital library settings, working hours, reservation policy, notification settings, and lost book policy.
            </DialogDescription>
          </DialogHeader>

          {/* 7 Section Tabs */}
          <div className="flex items-center gap-1 border-b border-border pb-2 pt-1 overflow-x-auto">
            {[
              { id: "borrowing", label: "1. Borrowing Rules" },
              { id: "fines", label: "2. Fine Rules" },
              { id: "digital", label: "3. Digital Settings" },
              { id: "hours", label: "4. Working Hours" },
              { id: "reservation", label: "5. Reservation Policy" },
              { id: "notifications", label: "6. Notifications" },
              { id: "lostbook", label: "7. Lost Book Policy" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setConfigTab(tab.id as any)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  configTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4 pt-2">
            {/* 1. Borrowing Rules */}
            {configTab === "borrowing" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Circulation & Borrowing Rules</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
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
                </div>
              </div>
            )}

            {/* 2. Fine Rules */}
            {configTab === "fines" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Overdue Fine Calculation & Limits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Fine Per Day (₹)</Label>
                    <Input
                      type="number"
                      value={configForm.finePerDay}
                      onChange={(e) => setConfigForm({ ...configForm, finePerDay: Number(e.target.value) })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Grace Period (Days)</Label>
                    <Input
                      type="number"
                      value={configForm.gracePeriodDays || 2}
                      onChange={(e) => setConfigForm({ ...configForm, gracePeriodDays: Number(e.target.value) })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Maximum Fine Ceiling (₹)</Label>
                    <Input
                      type="number"
                      value={configForm.maxFineLimit || 500}
                      onChange={(e) => setConfigForm({ ...configForm, maxFineLimit: Number(e.target.value) })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Late Return & Suspension Rule</Label>
                  <Input
                    value={configForm.lateReturnPolicy}
                    onChange={(e) => setConfigForm({ ...configForm, lateReturnPolicy: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 3. Digital Library Settings */}
            {configTab === "digital" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Digital Library & Remote Access Settings</h4>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Digital Library Access Policy</Label>
                  <Input
                    value={configForm.digitalLibraryAccess}
                    onChange={(e) => setConfigForm({ ...configForm, digitalLibraryAccess: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Max Concurrent Article Downloads</Label>
                    <Input
                      type="number"
                      value={configForm.maxConcurrentDownloads || 5}
                      onChange={(e) => setConfigForm({ ...configForm, maxConcurrentDownloads: Number(e.target.value) })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="remoteVpn"
                      checked={configForm.remoteVpnAccess ?? true}
                      onChange={(e) => setConfigForm({ ...configForm, remoteVpnAccess: e.target.checked })}
                      className="size-4 rounded border-border"
                    />
                    <Label htmlFor="remoteVpn" className="text-xs font-semibold cursor-pointer">
                      Enable Off-Campus Off-IP VPN Authentication
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Working Hours */}
            {configTab === "hours" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Library Operating Hours & Holiday Policy</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Weekday Working Hours</Label>
                    <Input
                      value={configForm.workingHours}
                      onChange={(e) => setConfigForm({ ...configForm, workingHours: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Weekend Working Hours</Label>
                    <Input
                      value={configForm.weekendHours || "Sun: 10:00 AM - 4:00 PM"}
                      onChange={(e) => setConfigForm({ ...configForm, weekendHours: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Holiday Calendar & Closure Rules</Label>
                  <Input
                    value={configForm.holidayCalendar}
                    onChange={(e) => setConfigForm({ ...configForm, holidayCalendar: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 5. Reservation Policy */}
            {configTab === "reservation" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Book Reservation & Hold Rules</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Hold Period (Hours)</Label>
                    <Input
                      type="number"
                      value={configForm.holdPeriodHours || 48}
                      onChange={(e) => setConfigForm({ ...configForm, holdPeriodHours: Number(e.target.value) })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Max Reservations Per User</Label>
                    <Input
                      type="number"
                      value={configForm.maxReservationsPerUser || 2}
                      onChange={(e) => setConfigForm({ ...configForm, maxReservationsPerUser: Number(e.target.value) })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Reservation Queue Policy</Label>
                  <Input
                    value={configForm.reservationPolicy}
                    onChange={(e) => setConfigForm({ ...configForm, reservationPolicy: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 6. Notification Settings */}
            {configTab === "notifications" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Automated Alerts & Reminder Rules</h4>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Pre-Due Notification Days</Label>
                  <Input
                    type="number"
                    value={configForm.preDueReminderDays || 2}
                    onChange={(e) => setConfigForm({ ...configForm, preDueReminderDays: Number(e.target.value) })}
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Automated Notification Rules</Label>
                  <Textarea
                    rows={3}
                    value={configForm.notificationRules}
                    onChange={(e) => setConfigForm({ ...configForm, notificationRules: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
            )}

            {/* 7. Lost Book Policy */}
            {configTab === "lostbook" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Lost Book Recovery & Penalty Enforcement</h4>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Lost Book Replacement Penalty (%)</Label>
                  <Input
                    type="number"
                    value={configForm.lostBookPenaltyMultiplier || 150}
                    onChange={(e) => setConfigForm({ ...configForm, lostBookPenaltyMultiplier: Number(e.target.value) })}
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Lost Book Handling Policy</Label>
                  <Textarea
                    rows={3}
                    value={configForm.lostBookPolicy}
                    onChange={(e) => setConfigForm({ ...configForm, lostBookPolicy: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-border flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={handleResetConfig} className="text-xs text-destructive gap-1">
                <RotateCcw className="size-3.5" /> Reset to Defaults
              </Button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => setIsConfigOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={configLoading} className="bg-brand-gradient text-white text-xs font-semibold gap-1.5">
                  {configLoading ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                  Save Configuration
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: LIBRARY REPORTS MODAL */}
      <Dialog open={isReportsOpen} onOpenChange={setIsReportsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" /> Institutional Library Reports & Analytics Export
            </DialogTitle>
            <DialogDescription className="text-xs">
              Generate, preview, and download monthly, yearly, utilization, overdue, digital library, and physical stock inventory reports.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Report Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                { id: "monthly", label: "Monthly Report" },
                { id: "yearly", label: "Yearly Report" },
                { id: "utilization", label: "Book Utilization" },
                { id: "department", label: "Dept-wise Usage" },
                { id: "overdue", label: "Overdue Report" },
                { id: "digital", label: "Digital Usage" },
                { id: "inventory", label: "Inventory Report" },
              ].map((rep) => (
                <button
                  key={rep.id}
                  type="button"
                  onClick={() => setSelectedReport(rep.id as any)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedReport === rep.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {rep.label}
                </button>
              ))}
            </div>

            {/* Filters Row */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Filter Department</Label>
                <select
                  value={reportDeptFilter}
                  onChange={(e) => setReportDeptFilter(e.target.value)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs font-semibold"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Filter Date / Period</Label>
                <select
                  value={reportDateFilter}
                  onChange={(e) => setReportDateFilter(e.target.value)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs font-semibold"
                >
                  <option value="August 2026">August 2026 (Current Month)</option>
                  <option value="July 2026">July 2026</option>
                  <option value="June 2026">June 2026</option>
                  <option value="Academic Year 2025-2026">Academic Year 2025-2026</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Filter Category</Label>
                <select
                  value={reportCategoryFilter}
                  onChange={(e) => setReportCategoryFilter(e.target.value)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs font-semibold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Report Live Preview Table */}
            <div className="border border-border/80 rounded-xl overflow-hidden">
              <div className="p-3 bg-muted/30 border-b border-border/60 flex justify-between items-center text-xs font-bold">
                <span>Report Preview: {selectedReport.toUpperCase()}</span>
                <span className="font-mono text-muted-foreground">{books.length} Matching Records</span>
              </div>
              <div className="max-h-[220px] overflow-y-auto p-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase text-[0.65rem]">
                    <tr>
                      <th className="py-2 px-3">Accession No</th>
                      <th className="py-2 px-3">Title</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Copies</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {books.map((b) => (
                      <tr key={b.id} className="hover:bg-muted/20">
                        <td className="py-2 px-3 font-mono font-bold">{b.accessionNo}</td>
                        <td className="py-2 px-3 font-semibold">{b.title}</td>
                        <td className="py-2 px-3"><Badge variant="outline" className="text-[0.65rem]">{b.category}</Badge></td>
                        <td className="py-2 px-3 font-mono">{b.availableCopies} / {b.totalCopies}</td>
                        <td className="py-2 px-3 text-emerald-600 font-semibold text-[0.7rem]">Active Tracked</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                onClick={() => handleExportReport("CSV")}
                disabled={!!reportExporting}
                className="gap-2 text-xs font-semibold"
              >
                {reportExporting === "CSV" ? <Loader2 className="size-3.5 animate-spin" /> : <FileText className="size-3.5 text-blue-600" />}
                Export CSV
              </Button>

              <Button
                variant="outline"
                onClick={() => handleExportReport("Excel")}
                disabled={!!reportExporting}
                className="gap-2 text-xs font-semibold text-emerald-700 border-emerald-500/30"
              >
                {reportExporting === "Excel" ? <Loader2 className="size-3.5 animate-spin" /> : <FileSpreadsheet className="size-3.5 text-emerald-600" />}
                Export Excel
              </Button>

              <Button
                onClick={() => handleExportReport("PDF")}
                disabled={!!reportExporting}
                className="gap-2 text-xs font-semibold bg-primary text-primary-foreground"
              >
                {reportExporting === "PDF" ? <Loader2 className="size-3.5 animate-spin" /> : <Printer className="size-3.5" />}
                Export PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: SCHEDULE LIBRARY AUDIT MODAL */}
      <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="size-5 text-purple-600" /> Schedule Institutional Library Audit
            </DialogTitle>
            <DialogDescription className="text-xs">
              Schedule a physical stock audit, RFID gate check, or overdue compliance audit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleAuditSubmit} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Audit Date</Label>
                <Input
                  type="date"
                  value={auditForm.auditDate}
                  onChange={(e) => setAuditForm({ ...auditForm, auditDate: e.target.value })}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Audit Time</Label>
                <Input
                  type="time"
                  value={auditForm.auditTime}
                  onChange={(e) => setAuditForm({ ...auditForm, auditTime: e.target.value })}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Audit Type</Label>
              <select
                value={auditForm.auditType}
                onChange={(e) => setAuditForm({ ...auditForm, auditType: e.target.value })}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs font-semibold"
              >
                <option value="Physical Stock Audit">Physical Stock Audit</option>
                <option value="Digital Resource License Audit">Digital Resource License Audit</option>
                <option value="Overdue & Fine Collection Audit">Overdue & Fine Collection Audit</option>
                <option value="RFID Tag & Security Inspection">RFID Tag & Security Inspection</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Auditor / Inspection Officer</Label>
              <Input
                value={auditForm.auditor}
                onChange={(e) => setAuditForm({ ...auditForm, auditor: e.target.value })}
                className="h-9 text-xs"
                placeholder="e.g. Dr. K. V. Ramanathan"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Remarks & Instructions</Label>
              <Textarea
                rows={2}
                value={auditForm.remarks}
                onChange={(e) => setAuditForm({ ...auditForm, remarks: e.target.value })}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsAuditOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={auditLoading} className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-1.5">
                {auditLoading ? <Loader2 className="size-3.5 animate-spin" /> : <ShieldCheck className="size-3.5" />}
                Schedule Audit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: MANAGE DIGITAL RESOURCES MODAL */}
      <Dialog open={isDigitalOpen} onOpenChange={setIsDigitalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Globe className="size-5 text-amber-600" /> Digital Resource Subscriptions Management
            </DialogTitle>
            <DialogDescription className="text-xs">
              Manage institutional e-journals, subscription status, license counts, and access statistics for IEEE, Springer, Elsevier, ACM, NPTEL, and NDLI.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {digitalSubs.map((sub) => (
              <div key={sub.id} className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                      {sub.publisher}
                    </Badge>
                    <Badge className={sub.activeSubscription ? "bg-emerald-500/10 text-emerald-600 text-xs" : "bg-red-500/10 text-red-600 text-xs"}>
                      {sub.activeSubscription ? "Active" : "Expired"}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-foreground leading-snug">{sub.name}</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Expiry Date: <span className="font-mono font-bold text-foreground">{sub.expiryDate}</span></p>
                    <p>License Count: <span className="font-mono font-bold text-foreground">{sub.licenseCount || 500} Seats</span></p>
                    <p className="font-semibold text-primary text-[0.72rem] pt-0.5">{sub.usageStats}</p>
                  </div>
                </div>

                {/* Card Action Buttons: View, Renew, Update */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDigitalSub(sub);
                      setIsViewSubOpen(true);
                    }}
                    className="h-8 text-[0.7rem] px-2 font-semibold gap-1"
                  >
                    <Eye className="size-3 text-blue-600" /> View
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRenewDigitalSub(sub)}
                    disabled={digitalActionLoading === sub.id}
                    className="h-8 text-[0.7rem] px-2 font-semibold gap-1 text-emerald-600 border-emerald-500/30"
                  >
                    {digitalActionLoading === sub.id ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
                    Renew
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditSub(sub)}
                    className="h-8 text-[0.7rem] px-2 font-semibold gap-1 text-primary"
                  >
                    <Edit className="size-3" /> Update
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-3 border-t border-border">
            <Button variant="outline" onClick={() => setIsDigitalOpen(false)} className="text-xs">
              Close Panel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SUB-DIALOG 4A: VIEW DIGITAL RESOURCE DETAILS */}
      <Dialog open={isViewSubOpen} onOpenChange={setIsViewSubOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Globe className="size-4 text-primary" /> {selectedDigitalSub?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Subscription telemetry and institutional access specifications.
            </DialogDescription>
          </DialogHeader>

          {selectedDigitalSub && (
            <div className="space-y-2.5 text-xs pt-1">
              <div className="p-3 rounded-xl bg-muted/40 space-y-1.5">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Publisher / Vendor:</span>
                  <span className="font-bold text-foreground">{selectedDigitalSub.publisher}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Subscription Status:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">
                    {selectedDigitalSub.activeSubscription ? "Active Authorized" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <span className="font-mono font-bold text-foreground">{selectedDigitalSub.expiryDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">License Seats / Capacity:</span>
                  <span className="font-mono font-bold text-primary">{selectedDigitalSub.licenseCount || 500} Authorized Seats</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Usage Telemetry:</span>
                  <span className="font-semibold text-emerald-600">{selectedDigitalSub.usageStats}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Campus IP Range:</span>
                  <span className="font-mono text-muted-foreground">{selectedDigitalSub.ipRange || "192.168.1.0/24"}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsViewSubOpen(false)} className="text-xs">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SUB-DIALOG 4B: EDIT DIGITAL RESOURCE DETAILS */}
      <Dialog open={isEditSubOpen} onOpenChange={setIsEditSubOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Edit className="size-4 text-primary" /> Update Resource: {selectedDigitalSub?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update publisher info, license count, status, or expiry date.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEditSub} className="space-y-3 pt-1 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Publisher / Provider Name</Label>
              <Input
                value={editSubForm.publisher || ""}
                onChange={(e) => setEditSubForm({ ...editSubForm, publisher: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">License Count (Seats)</Label>
                <Input
                  type="number"
                  value={editSubForm.licenseCount || 500}
                  onChange={(e) => setEditSubForm({ ...editSubForm, licenseCount: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Expiry Date</Label>
                <Input
                  type="date"
                  value={editSubForm.expiryDate || ""}
                  onChange={(e) => setEditSubForm({ ...editSubForm, expiryDate: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Monthly Usage Telemetry Summary</Label>
              <Input
                value={editSubForm.usageStats || ""}
                onChange={(e) => setEditSubForm({ ...editSubForm, usageStats: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="activeSub"
                checked={editSubForm.activeSubscription ?? true}
                onChange={(e) => setEditSubForm({ ...editSubForm, activeSubscription: e.target.checked })}
                className="size-4 rounded border-border"
              />
              <Label htmlFor="activeSub" className="text-xs font-semibold cursor-pointer">
                Active Institutional Subscription
              </Label>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsEditSubOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={digitalActionLoading === "saving"} className="bg-primary text-primary-foreground text-xs font-semibold gap-1.5">
                {digitalActionLoading === "saving" ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                Save Resource Updates
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
