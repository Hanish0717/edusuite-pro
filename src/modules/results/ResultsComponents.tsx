import React, { useEffect, useState } from "react";
import {
  Award,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  GraduationCap,
  FileText,
  TrendingUp,
  XCircle,
  Printer,
  CheckCircle2,
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
  const [activeTab, setActiveTab] = useState<"results" | "toppers">("results");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");

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
    const s = search.toLowerCase();
    const matchesSearch = (r.rollNo || "").toLowerCase().includes(s) ||
                          (r.studentName || "").toLowerCase().includes(s);
    const matchesDept = departmentFilter === "all" || r.department === departmentFilter;
    const matchesSem = semesterFilter === "all" || r.semester === semesterFilter;
    return matchesSearch && matchesDept && matchesSem;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rollNo || !form.studentName) return toast.error("Enter roll no and student name");
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

  const handlePublish = (rollNo: string) => {
    toast.success(`Result published officially for ${rollNo}.`);
  };

  const handleWithdraw = (rollNo: string) => {
    toast.error(`Result withdrawn for ${rollNo}. Student will no longer see it.`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20 shrink-0">
            <Award className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Institutional Results & Transcripts
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-purple-600 border-purple-500/30">
                Academic Performance
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Publish semester grades, generate official transcripts, and view rank lists.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Data
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)} className="h-9 bg-purple-600 hover:bg-purple-700 text-white gap-2 text-xs font-semibold shadow-glow">
            <Plus className="size-4" /> Bulk Upload Result
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Overall Pass Rate</span>
            <TrendingUp className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">96.8% Passed</p>
          <p className="text-[0.68rem] text-muted-foreground">Spring 2026 Examination</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Distinction Holders</span>
            <Award className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">420 Scholars</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">SGPA &gt; 9.0 Standing</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Institutional CGPA</span>
            <GraduationCap className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">8.42 CGPA Avg</p>
          <p className="text-[0.68rem] text-muted-foreground">Across 5 departments</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Official Transcripts</span>
            <FileText className="size-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-orange-600">3,450 Issued</p>
          <p className="text-[0.68rem] text-orange-600 font-medium">UGC Verified Seal</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border">
          <button onClick={() => setActiveTab("results")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "results" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            Semester Results ({results.length})
          </button>
          <button onClick={() => setActiveTab("toppers")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "toppers" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            Rank List & Gold Medalists
          </button>
        </div>
        <div className="flex gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue placeholder="Dept" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
              <SelectItem value="AI&DS">AI&DS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue placeholder="Semester" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sems</SelectItem>
              <SelectItem value="Semester 4">Semester 4</SelectItem>
              <SelectItem value="Semester 6">Semester 6</SelectItem>
              <SelectItem value="Semester 8">Semester 8</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full max-w-md">
        <Input 
          placeholder="Search roll no or student name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs h-9"
        />
      </div>

      {activeTab === "results" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Roll No & Name</th>
                  <th className="py-3 px-3">Dept & Sem</th>
                  <th className="py-3 px-3">SGPA</th>
                  <th className="py-3 px-3">CGPA</th>
                  <th className="py-3 px-3 text-center">Result Class</th>
                  <th className="py-3 px-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-foreground">{r.rollNo}</div>
                      <div className="font-semibold text-muted-foreground mt-0.5">{r.studentName}</div>
                    </td>
                    <td className="py-3 px-3 font-medium">{r.department} ({r.semester})</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{r.sgpa}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">{r.cgpa}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge className={r.resultClass.includes("Distinction") ? "bg-purple-500/10 text-purple-600" : "bg-emerald-500/10 text-emerald-600"}>
                        {r.resultClass}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="icon" className="size-7 bg-muted/50 text-blue-500" title="Publish Result" onClick={() => handlePublish(r.rollNo)}>
                          <CheckCircle2 className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 bg-muted/50 text-red-500" title="Withdraw Result" onClick={() => handleWithdraw(r.rollNo)}>
                          <XCircle className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDossier(r)} className="h-7 text-xs font-medium gap-1 bg-muted/50 text-muted-foreground hover:text-foreground px-2">
                          <Eye className="size-3.5" /> Transcript
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">No results found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "toppers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.filter((r) => r.rank).map((top) => (
            <div key={top.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10"><Award className="size-20" /></div>
              <div className="flex items-center justify-between relative z-10">
                <Badge className="bg-amber-500/10 text-amber-600 font-mono text-xs border border-amber-500/30">Rank #{top.rank}</Badge>
                <Badge className="bg-muted text-muted-foreground font-mono text-xs">{top.department}</Badge>
              </div>
              <div className="relative z-10 pt-2">
                <h3 className="text-lg font-bold text-foreground">{top.studentName}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{top.rollNo}</p>
                <div className="mt-3 flex gap-4 border-t border-border pt-3">
                  <div>
                    <p className="text-[0.65rem] uppercase text-muted-foreground font-semibold">SGPA</p>
                    <p className="font-mono font-bold text-primary">{top.sgpa}</p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase text-muted-foreground font-semibold">CGPA</p>
                    <p className="font-mono font-bold text-emerald-600">{top.cgpa}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Publish Student Result</DialogTitle></DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Roll No *</Label><Input required placeholder="23AIDS012" value={form.rollNo || ""} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Name *</Label><Input required placeholder="Rohan Varma" value={form.studentName || ""} onChange={(e) => setForm({ ...form, studentName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Semester SGPA</Label><Input type="number" step="0.01" value={form.sgpa ?? 8.90} onChange={(e) => setForm({ ...form, sgpa: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="text-xs">Cancel</Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold">Publish Result</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDossierOpen} onOpenChange={setIsDossierOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="text-lg font-bold flex items-center justify-between pr-6">Official Transcript <Badge className="bg-emerald-500/10 text-emerald-600 ml-2">Verified</Badge></DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 pt-1 text-xs">
              <div className="p-5 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-foreground uppercase tracking-wide">{selectedStudent.studentName}</h3>
                    <p className="text-muted-foreground font-mono">{selectedStudent.rollNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{selectedStudent.department}</p>
                    <p className="text-muted-foreground">{selectedStudent.semester}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-3 border-t border-border mt-3">
                  <div><span className="text-[0.65rem] uppercase text-muted-foreground">SGPA</span><p className="text-primary font-bold font-mono text-base">{selectedStudent.sgpa}</p></div>
                  <div><span className="text-[0.65rem] uppercase text-muted-foreground">CGPA</span><p className="text-emerald-600 font-bold font-mono text-base">{selectedStudent.cgpa}</p></div>
                  <div><span className="text-[0.65rem] uppercase text-muted-foreground">Result Class</span><p className="font-bold font-sans">{selectedStudent.resultClass}</p></div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-foreground border-b border-border pb-1">Course Grades (Credits Earned: 24)</p>
                {selectedStudent.grades.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0 font-mono">
                    <span className="font-sans font-medium">{g.subjectCode}: {g.subjectTitle}</span>
                    <Badge variant="outline" className="text-foreground border-border font-bold bg-background">{g.grade} <span className="text-muted-foreground ml-1 font-normal">({g.credits} Cr)</span></Badge>
                  </div>
                ))}
              </div>
              <DialogFooter className="pt-4 border-t border-border sm:justify-between items-center">
                 <p className="text-[0.65rem] text-muted-foreground italic">Digitally signed by Controller of Examinations</p>
                 <div className="flex gap-2">
                   <Button variant="outline" size="sm" onClick={() => toast.success("Printing transcript...")} className="text-xs h-8"><Printer className="size-3.5 mr-1.5" /> Print</Button>
                   <Button size="sm" onClick={() => toast.success("Transcript PDF Downloaded.")} className="text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white"><Download className="size-3.5 mr-1.5" /> Download PDF</Button>
                 </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
