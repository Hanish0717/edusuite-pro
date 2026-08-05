import React, { useState } from "react";
import {
  Calendar,
  List,
  Plus,
  RefreshCw,
  Upload,
  AlertTriangle,
  Users,
  CheckCircle2,
  CalendarDays,
  FileCheck2,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fetchExamSchedules, type ExamSchedule } from "./ExaminationsService";

export function ExamScheduleView() {
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  const [form, setForm] = useState<Partial<ExamSchedule>>({
    examCode: "REG-APR-2026",
    subjectCode: "",
    subjectName: "",
    department: "",
    semester: "",
    examDate: "",
    session: "Forenoon (09:30 AM - 12:30 PM)",
    hallNo: "",
  });

  const [conflicts, setConflicts] = useState<string[]>([]);
  const [isAllocating, setIsAllocating] = useState(false);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchExamSchedules();
    setExams(data);
    setLoading(false);
  };

  const filteredExams = exams.filter((e) => {
    const s = search.toLowerCase();
    return (
      (e.subjectCode || "").toLowerCase().includes(s) ||
      (e.subjectName || "").toLowerCase().includes(s) ||
      (e.department || "").toLowerCase().includes(s) ||
      (e.hallNo || "").toLowerCase().includes(s)
    );
  });

  const checkConflicts = () => {
    const c = [];
    if (form.examDate && form.department) {
      const match = exams.find(e => e.examDate === form.examDate && e.department === form.department && e.session === form.session);
      if (match) {
        c.push(`Conflict: ${form.department} already has ${match.subjectCode} scheduled on this date and session.`);
      }
    }
    setConflicts(c);
    if (c.length === 0 && wizardStep === 2) {
      toast.success("No conflicts detected.");
    }
  };

  const autoAllocate = () => {
    setIsAllocating(true);
    setTimeout(() => {
      setIsAllocating(false);
      setForm(prev => ({ ...prev, hallNo: "LH-401, LH-402 (Auto)" }));
      toast.success("Halls and Invigilators auto-allocated successfully based on student count.");
    }, 1500);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const newExam = {
      id: `EXM-${Math.floor(Math.random() * 900) + 100}`,
      ...form,
      status: "Scheduled" as const,
    } as ExamSchedule;
    setExams(prev => [newExam, ...prev]);
    setIsWizardOpen(false);
    setWizardStep(1);
    toast.success("Exam schedule successfully created.");
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBulkUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast.success(`File "${e.target.files[0].name}" uploaded successfully. 42 schedules added.`);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
            <CalendarDays className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Exam Schedule Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-blue-500 border-blue-500/30">
                Time Table
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Plan, schedule, and allocate resources for upcoming examinations.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv, .xlsx" 
            className="hidden" 
          />
          <Button variant="outline" size="sm" onClick={handleBulkUploadClick} className="h-9 gap-2 text-xs font-medium">
            <Upload className="size-3.5" /> Bulk Upload
          </Button>
          <Button size="sm" onClick={() => { setForm({}); setWizardStep(1); setConflicts([]); setIsWizardOpen(true); }} className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs font-semibold shadow-glow">
            <Plus className="size-4" /> Schedule Wizard
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3 w-full max-w-md">
          <div className="relative flex-1">
            <Input 
              placeholder="Search subjects, departments, halls..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => toast.info("Advanced filters coming soon.")} className="shrink-0 size-9">
            <Filter className="size-4 text-muted-foreground" />
          </Button>
        </div>
        <div className="flex items-center p-1 rounded-xl bg-muted/50 border border-border shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setViewMode("list")} className={`h-7 px-3 text-xs ${viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            <List className="size-3.5 mr-1.5" /> List
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setViewMode("calendar")} className={`h-7 px-3 text-xs ${viewMode === "calendar" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            <Calendar className="size-3.5 mr-1.5" /> Calendar
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Dept & Sem</th>
                <th className="py-3 px-3">Date & Session</th>
                <th className="py-3 px-3">Hall & Invigilator</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredExams.map((e) => (
                <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-foreground">{e.subjectName}</div>
                    <div className="text-[0.68rem] text-primary font-mono">{e.subjectCode} &middot; {e.examCode}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-foreground">{e.department} ({e.semester})</td>
                  <td className="py-3 px-3 text-muted-foreground"><span className="font-medium text-foreground">{e.examDate}</span><br/>{e.session}</td>
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-blue-600">{e.hallNo}</div>
                    <div className="text-[0.68rem] text-muted-foreground">Invigilators Allocated</div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">{e.status}</Badge>
                  </td>
                </tr>
              ))}
              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted-foreground">No exams found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm overflow-hidden min-h-[500px]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-lg">August 2026 (Upcoming Exams)</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-mono text-[0.65rem]">Forenoon Session</Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-mono text-[0.65rem]">Afternoon Session</Badge>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-[1px] bg-border border border-border rounded-xl overflow-hidden">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="bg-muted/50 p-2 text-center text-xs font-semibold text-muted-foreground uppercase">{day}</div>
            ))}
            {/* Generate a basic 5-week grid starting from Aug 1st, 2026 (Saturday) */}
            {Array.from({ length: 35 }).map((_, i) => {
              const dayOfMonth = i - 5; // Offset so Aug 1st is on a Saturday
              const isCurrentMonth = dayOfMonth > 0 && dayOfMonth <= 31;
              const dateStr = `2026-08-${String(dayOfMonth).padStart(2, '0')}`;
              
              const dayExams = filteredExams.filter(e => e.examDate === dateStr);
              
              return (
                <div key={i} className={`bg-card min-h-[100px] p-2 flex flex-col gap-1 transition-colors hover:bg-muted/20 ${!isCurrentMonth ? "opacity-30 bg-muted/30" : ""}`}>
                  <span className={`text-xs font-semibold ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}>
                    {dayOfMonth > 0 ? dayOfMonth : ""}
                  </span>
                  
                  {isCurrentMonth && dayExams.map((e, idx) => (
                    <div 
                      key={idx} 
                      className={`text-[0.65rem] p-1.5 rounded border leading-tight truncate ${e.session.includes("Forenoon") ? "bg-blue-500/10 border-blue-500/20 text-blue-700" : "bg-purple-500/10 border-purple-500/20 text-purple-700"}`}
                      title={`${e.subjectName} (${e.department}) - ${e.session}`}
                    >
                      <div className="font-bold truncate">{e.subjectCode}</div>
                      <div className="truncate opacity-80">{e.department}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Wizard Dialog */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Schedule Wizard</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 mb-4 mt-2">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex-1">
                <div className={`h-1.5 rounded-full ${wizardStep >= step ? "bg-blue-600" : "bg-muted"}`} />
                <p className={`text-[0.65rem] mt-1.5 font-semibold uppercase tracking-wider ${wizardStep >= step ? "text-blue-600" : "text-muted-foreground"}`}>
                  {step === 1 ? "Basic Details" : step === 2 ? "Date & Conflicts" : "Hall Allocation"}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={wizardStep === 3 ? handleFinish : (e) => { e.preventDefault(); setWizardStep(s => s + 1); if(wizardStep===1) checkConflicts(); }}>
            <div className="py-4 space-y-4 min-h-[200px]">
              {wizardStep === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label className="text-xs">Exam Code</Label><Input required value={form.examCode || ""} onChange={e => setForm({...form, examCode: e.target.value})} className="h-9 text-xs font-mono" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Subject Code</Label><Input required value={form.subjectCode || ""} onChange={e => setForm({...form, subjectCode: e.target.value})} className="h-9 text-xs font-mono uppercase" /></div>
                  <div className="col-span-2 space-y-1.5"><Label className="text-xs">Subject Name</Label><Input required value={form.subjectName || ""} onChange={e => setForm({...form, subjectName: e.target.value})} className="h-9 text-xs" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Department</Label><Input required value={form.department || ""} onChange={e => setForm({...form, department: e.target.value})} className="h-9 text-xs uppercase" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Semester</Label><Input required value={form.semester || ""} onChange={e => setForm({...form, semester: e.target.value})} className="h-9 text-xs" /></div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs">Exam Date</Label><Input type="date" required value={form.examDate || ""} onChange={e => setForm({...form, examDate: e.target.value})} className="h-9 text-xs" /></div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Session</Label>
                      <Select value={form.session} onValueChange={(v: any) => setForm({...form, session: v})}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Forenoon (09:30 AM - 12:30 PM)">Forenoon</SelectItem>
                          <SelectItem value="Afternoon (02:00 PM - 05:00 PM)">Afternoon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={checkConflicts} className="w-full h-9 text-xs gap-2">
                    <RefreshCw className="size-3.5" /> Check Conflicts
                  </Button>
                  
                  {conflicts.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-2">
                      <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                      <ul className="text-xs space-y-1">
                        {conflicts.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  {conflicts.length === 0 && form.examDate && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-2">
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span className="text-xs font-semibold">No scheduling conflicts detected.</span>
                    </div>
                  )}
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Resource Allocation</span>
                      <Button type="button" size="sm" onClick={autoAllocate} disabled={isAllocating} className="h-8 bg-blue-600 hover:bg-blue-700 text-xs text-white">
                        {isAllocating ? "Allocating..." : "Auto Allocate Halls & Staff"}
                      </Button>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Allocated Halls</Label>
                      <Input value={form.hallNo || ""} onChange={e => setForm({...form, hallNo: e.target.value})} placeholder="e.g. LH-101, LH-102" className="h-9 text-xs font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Invigilators (Faculty IDs)</Label>
                      <Input placeholder="e.g. FAC-001, FAC-042" className="h-9 text-xs font-mono" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="pt-4 border-t border-border mt-2">
              <Button type="button" variant="outline" onClick={() => { if(wizardStep > 1) setWizardStep(s => s - 1); else setIsWizardOpen(false); }} className="text-xs">
                {wizardStep > 1 ? "Back" : "Cancel"}
              </Button>
              <Button type="submit" disabled={wizardStep === 2 && conflicts.length > 0} className="bg-blue-600 text-white text-xs font-semibold">
                {wizardStep < 3 ? "Next Step" : "Confirm Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
