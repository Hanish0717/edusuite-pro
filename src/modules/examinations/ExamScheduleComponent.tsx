import React, { useEffect, useState } from "react";
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Download,
  Calendar,
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
  fetchExamSchedules,
  createExamSchedule,
  INITIAL_EXAMS,
  type ExamSchedule,
} from "./ExaminationsService";

export function ExamScheduleView() {
  const [exams, setExams] = useState<ExamSchedule[]>(INITIAL_EXAMS);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);

  const [examForm, setExamForm] = useState<Partial<ExamSchedule>>({
    examCode: "REG-APR-2026",
    subjectCode: "CS405",
    subjectName: "Cloud Computing & Microservices",
    department: "CSE",
    semester: "Semester 7",
    examDate: "2026-08-20",
    session: "Forenoon (09:30 AM - 12:30 PM)",
    hallNo: "LH-305",
  });

  const loadData = async () => {
    setLoading(true);
    const ex = await fetchExamSchedules();
    setExams(ex);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredExams = exams.filter((e) => {
    return (
      e.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
      e.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.hallNo.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.subjectCode || !examForm.subjectName) return toast.error("Enter subject code and name");
    const created = await createExamSchedule(examForm);
    setExams((prev) => [created, ...prev]);
    setIsAddExamOpen(false);
    toast.success(`Exam schedule for ${created.subjectCode} created!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Calendar className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Exam Schedule & Hall Allocation
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Examination Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Manage exam timetables, allocate halls, and view upcoming exams.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddExamOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Plus className="size-4" /> Schedule Exam
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Input 
          placeholder="Search by subject code, name, department, or hall..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Subject Code & Name</th>
                <th className="py-3 px-3">Department & Sem</th>
                <th className="py-3 px-3">Exam Date & Session</th>
                <th className="py-3 px-3">Hall Location</th>
                <th className="py-3 px-3">Valuation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredExams.map((e) => (
                <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-foreground">{e.subjectCode}: {e.subjectName}</div>
                    <div className="text-[0.68rem] text-primary font-mono">{e.examCode}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-foreground">{e.department} ({e.semester})</td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{e.examDate} &middot; {e.session}</td>
                  <td className="py-3 px-3 font-mono font-bold text-primary">{e.hallNo}</td>
                  <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{e.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAddExamOpen} onOpenChange={setIsAddExamOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Schedule Semester Exam</DialogTitle></DialogHeader>
          <form onSubmit={handleAddExamSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Subject Code *</Label><Input required placeholder="CS405" value={examForm.subjectCode || ""} onChange={(e) => setExamForm({ ...examForm, subjectCode: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Subject Title *</Label><Input required placeholder="Cloud Computing & Microservices" value={examForm.subjectName || ""} onChange={(e) => setExamForm({ ...examForm, subjectName: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddExamOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Schedule Exam</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
