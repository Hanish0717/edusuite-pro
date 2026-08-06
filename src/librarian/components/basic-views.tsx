import React, { useEffect, useState } from "react";
import {
  Library,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Globe,
  ExternalLink,
  BookMarked,
  Sparkles,
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

import {
  fetchLibraryBooks,
  fetchBookIssues,
  createLibraryBook,
  issueLibraryBook,
  returnLibraryBook,
  INITIAL_BOOKS,
  INITIAL_ISSUES,
  type LibraryBook,
  type BookIssueRecord,
} from "../services";

const CATEGORIES = ["All Categories", "Computer Science", "Electronics", "Mechanical", "AI & Data Science", "General Science"] as const;

export function LibraryModuleView() {
  const [books, setBooks] = useState<LibraryBook[]>(INITIAL_BOOKS);
  const [issues, setIssues] = useState<BookIssueRecord[]>(INITIAL_ISSUES);
  const [activeTab, setActiveTab] = useState<"catalog" | "issues" | "ejournals">("catalog");

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All Categories");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isIssueBookOpen, setIsIssueBookOpen] = useState(false);

  // Forms
  const [bookForm, setBookForm] = useState<Partial<LibraryBook>>({
    title: "",
    author: "",
    isbn: "978-0134610993",
    category: "Computer Science",
    totalCopies: 10,
    availableCopies: 10,
    rackNo: "Rack CS-05",
  });

  const [issueForm, setIssueForm] = useState<Partial<BookIssueRecord>>({
    rollNo: "23CSE088",
    studentName: "Siddharth Nambiar",
    bookTitle: "Artificial Intelligence: A Modern Approach",
    accessionNo: "ACC-45890",
  });

  const loadData = async () => {
    setLoading(true);
    const [bks, iss] = await Promise.all([fetchLibraryBooks(), fetchBookIssues()]);
    setBooks(bks);
    setIssues(iss);
    setLoading(false);
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

  const handleAddBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author) {
      toast.error("Enter book title and author");
      return;
    }
    const created = await createLibraryBook(bookForm);
    setBooks((prev) => [created, ...prev]);
    setIsAddBookOpen(false);
    toast.success(`Book "${created.title}" added to library catalog!`);
  };

  const handleIssueBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.rollNo || !issueForm.bookTitle) {
      toast.error("Enter student roll number and book title");
      return;
    }
    const created = await issueLibraryBook(issueForm);
    setIssues((prev) => [created, ...prev]);
    setIsIssueBookOpen(false);
    toast.success(`Book issued to student ${created.studentName} (${created.rollNo})!`);
  };

  const handleReturnBook = async (id: string, title: string) => {
    await returnLibraryBook(id);
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status: "Returned" } : i)));
    toast.success(`Book "${title}" marked as RETURNED to library stock.`);
  };

  const handleExportCSV = () => {
    const headers = ["Book ID", "Accession No", "Title", "Author", "ISBN", "Category", "Total Copies", "Available Copies", "Rack Location"];
    const rows = filteredBooks.map((b) => [b.id, b.accessionNo, `"${b.title}"`, `"${b.author}"`, b.isbn, b.category, b.totalCopies, b.availableCopies, `"${b.rackNo}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Library_Catalog_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported library catalog to CSV!");
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
                Library & Knowledge Resource Center
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Campus Services Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Accession catalog, circulation ledger, book issues/returns, and IEEE e-journals digital library.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Catalog
          </Button>
          <Button size="sm" onClick={() => setIsIssueBookOpen(true)} variant="outline" className="h-9 border-primary/30 text-primary gap-2 text-xs font-semibold">
            <BookMarked className="size-4" /> Issue Book
          </Button>
          <Button size="sm" onClick={() => setIsAddBookOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Plus className="size-4" /> Add Book Title
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
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
          <p className="text-2xl font-bold font-mono text-amber-600">₹140 Dues</p>
          <p className="text-[0.68rem] text-muted-foreground">Pending return collection</p>
        </div>
      </div>

      {/* SUBPARTS TAB SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        <button onClick={() => setActiveTab("catalog")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "catalog" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Book Catalog & Racks ({books.length})
        </button>
        <button onClick={() => setActiveTab("issues")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "issues" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Book Issues & Circulation ({issues.length})
        </button>
        <button onClick={() => setActiveTab("ejournals")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "ejournals" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          3. Digital E-Journals
        </button>
      </div>

      {/* TAB 1: BOOK CATALOG */}
      {activeTab === "catalog" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Accession No</th>
                  <th className="py-3 px-3">Book Title</th>
                  <th className="py-3 px-3">Author(s)</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Copies</th>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Issue ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Book Title</th>
                  <th className="py-3 px-3">Issue / Due Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right pr-4">Action</th>
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
                    <td className="py-3 px-3 text-right pr-4">
                      {i.status !== "Returned" && (
                        <Button size="sm" onClick={() => handleReturnBook(i.id, i.bookTitle)} className="h-7 text-xs bg-brand-gradient text-white gap-1">
                          <CheckCircle2 className="size-3" /> Mark Returned
                        </Button>
                      )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary/10 text-primary font-mono text-xs">IEEE Xplore Digital Library</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">Active Subscription</Badge>
            </div>
            <h3 className="text-base font-bold text-foreground">IEEE Transactions on Pattern Analysis & Machine Intelligence</h3>
            <p className="text-xs text-muted-foreground">Full text access to 5M+ peer-reviewed engineering research publications.</p>
            <Button size="sm" asChild className="h-8 text-xs bg-brand-gradient text-white gap-1">
              <a href="https://ieeexplore.ieee.org" target="_blank" rel="noreferrer"><ExternalLink className="size-3.5" /> Access IEEE Portal</a>
            </Button>
          </div>
        </div>
      )}

      {/* DIALOG 1: ADD BOOK */}
      <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Add Book to Library</DialogTitle></DialogHeader>
          <form onSubmit={handleAddBookSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Book Title *</Label><Input required placeholder="Artificial Intelligence: A Modern Approach" value={bookForm.title || ""} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Author *</Label><Input required placeholder="Stuart Russell" value={bookForm.author || ""} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddBookOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Save Book</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: ISSUE BOOK */}
      <Dialog open={isIssueBookOpen} onOpenChange={setIsIssueBookOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Issue Book to Student</DialogTitle></DialogHeader>
          <form onSubmit={handleIssueBookSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Roll No *</Label><Input required placeholder="23CSE088" value={issueForm.rollNo || ""} onChange={(e) => setIssueForm({ ...issueForm, rollNo: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Book Title *</Label><Input required placeholder="Artificial Intelligence: A Modern Approach" value={issueForm.bookTitle || ""} onChange={(e) => setIssueForm({ ...issueForm, bookTitle: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsIssueBookOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Issue Book</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
