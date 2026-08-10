import React, { useEffect, useState } from "react";
import {
  Award,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
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
  fetchInstitutionalResults,
  uploadBatchResults,
  INITIAL_SEMESTER_RESULTS,
  type StudentResultEntry,
} from "./ResultsService";

export function ResultsModuleView() {
  const [results, setResults] = useState<StudentResultEntry[]>(INITIAL_SEMESTER_RESULTS);
  const [activeTab, setActiveTab] = useState<"results" | "transcripts" | "toppers">("results");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResultEntry | null>(null);

  const [form, setForm] = useState<Partial<StudentResultEntry>>({
    rollNo: "23AIDS012",
    studentName: "Rohan Varma",
    department: "AI&DS",
    semester: "Semester 6",
    sgpa: 8.90,
    cgpa: 8.85,
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchInstitutionalResults();
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = results.filter((r) => {
    return (
      r.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rollNo || !form.studentName) {
      toast.error("Enter roll no and student name");
      return;
    }
    const created = await uploadBatchResults(form);
    setResults((prev) => [created, ...prev]);
    setIsAddOpen(false);
    toast.success(`Result published for ${created.studentName} (${created.rollNo}): SGPA ${created.sgpa}!`);
  };

  const handleOpenDossier = (s: StudentResultEntry) => {
    setSelectedStudent(s);
    setIsDossierOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ["Roll No", "Student Name", "Department", "Semester", "SGPA", "CGPA", "Result Class"];
    const rows = filtered.map((r) => [r.rollNo, `"${r.studentName}"`, r.department, `"${r.semester}"`, r.sgpa, r.cgpa, `"${r.resultClass}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Institutional_Results_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported institutional results to CSV!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Award className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Institutional Results & Academic Transcripts
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Performance & Evaluation
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Semester examination grades, CGPA transcripts, rank list, and official degree eligibility.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Results
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Plus className="size-4" /> Upload Batch Result
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Overall Pass Rate</span>
            <TrendingUp className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">96.8% Passed</p>
          <p className="text-[0.68rem] text-muted-foreground">Spring 2026 Examination</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Distinction Holders</span>
            <Award className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">420 Scholars</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">SGPA &gt; 9.0 Standing</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Institutional CGPA</span>
            <GraduationCap className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">8.42 CGPA Avg</p>
          <p className="text-[0.68rem] text-muted-foreground">Across 5 departments</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Official Transcripts</span>
            <FileText className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">3,450 Issued</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">UGC Verified Seal</p>
        </div>
      </div>

      {/* SUBPARTS TAB SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        <button onClick={() => setActiveTab("results")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "results" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Semester Examination Results ({results.length})
        </button>
        <button onClick={() => setActiveTab("toppers")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "toppers" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Gold Medalists & Department Toppers
        </button>
      </div>

      {/* TAB 1: RESULTS */}
      {activeTab === "results" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Department & Semester</th>
                  <th className="py-3 px-3">SGPA</th>
                  <th className="py-3 px-3">CGPA</th>
                  <th className="py-3 px-3">Result Class</th>
                  <th className="py-3 px-3 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{r.rollNo}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{r.studentName}</td>
                    <td className="py-3 px-3">{r.department} ({r.semester})</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{r.sgpa}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">{r.cgpa}</td>
                    <td className="py-3 px-3">
                      <Badge className={r.resultClass.includes("Distinction") ? "bg-purple-500/10 text-purple-600" : "bg-emerald-500/10 text-emerald-600"}>
                        {r.resultClass}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right pr-4">
                      <Button size="sm" onClick={() => handleOpenDossier(r)} variant="ghost" className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground">
                        <Eye className="size-3.5" /> Transcript
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TOPPERS */}
      {activeTab === "toppers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.filter((r) => r.rank).map((top) => (
            <div key={top.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-500/10 text-amber-600 font-mono text-xs">Rank #{top.rank} Gold Medalist</Badge>
                <Badge className="bg-primary/10 text-primary font-mono text-xs">{top.department}</Badge>
              </div>
              <h3 className="text-base font-bold text-foreground">{top.studentName} ({top.rollNo})</h3>
              <p className="text-xs text-muted-foreground">Semester SGPA: <span className="font-bold text-primary">{top.sgpa}</span> &middot; CGPA: <span className="font-bold text-emerald-600">{top.cgpa}</span></p>
            </div>
          ))}
        </div>
      )}

      {/* DIALOG 1: ADD RESULT */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Publish Student Grade Result</DialogTitle></DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Roll No *</Label><Input required placeholder="23AIDS012" value={form.rollNo || ""} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Name *</Label><Input required placeholder="Rohan Varma" value={form.studentName || ""} onChange={(e) => setForm({ ...form, studentName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Semester SGPA</Label><Input type="number" step="0.01" value={form.sgpa ?? 8.90} onChange={(e) => setForm({ ...form, sgpa: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Publish Result</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: TRANSCRIPT DOSSIER */}
      <Dialog open={isDossierOpen} onOpenChange={setIsDossierOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="text-lg font-bold flex items-center justify-between pr-6">Official Transcript <Badge className="bg-emerald-500/10 text-emerald-600 ml-2">Verified</Badge></DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 pt-1 text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1">
                <h3 className="font-bold text-base text-foreground">{selectedStudent.studentName} ({selectedStudent.rollNo})</h3>
                <p className="text-muted-foreground">{selectedStudent.department} &middot; {selectedStudent.semester}</p>
                <div className="flex items-center gap-3 pt-2 font-mono">
                  <span className="text-primary font-bold">SGPA: {selectedStudent.sgpa}</span>
                  <span className="text-emerald-600 font-bold">CGPA: {selectedStudent.cgpa}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-foreground">Course Subject Grades:</p>
                {selectedStudent.grades.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60 font-mono">
                    <span>{g.subjectCode}: {g.subjectTitle}</span>
                    <Badge variant="outline" className="text-primary border-primary/30 font-bold">{g.grade} ({g.credits} Cr)</Badge>
                  </div>
                ))}
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setIsDossierOpen(false)} className="w-full text-xs">Close Transcript</Button></DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
