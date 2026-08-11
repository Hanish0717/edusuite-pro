import React, { useState } from "react";
import {
  FileSpreadsheet,
  Save,
  CheckCircle,
  Upload,
  Download,
  Lock,
  Unlock,
  History,
  AlertCircle,
  Users,
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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface StudentInternalMark {
  id: string;
  rollNo: string;
  studentName: string;
  attendance: number;
  assignment: number;
  quiz: number;
  midTerm: number;
  project: number;
  total: number;
}

const INITIAL_MARKS: StudentInternalMark[] = [
  { id: "IM-001", rollNo: "22CSE001", studentName: "Aarav Sharma", attendance: 5, assignment: 18, quiz: 9, midTerm: 25, project: 15, total: 72 },
  { id: "IM-002", rollNo: "22CSE002", studentName: "Neha Gupta", attendance: 4, assignment: 16, quiz: 8, midTerm: 22, project: 14, total: 64 },
  { id: "IM-003", rollNo: "22CSE003", studentName: "Rahul Verma", attendance: 3, assignment: 14, quiz: 7, midTerm: 20, project: 12, total: 56 },
  { id: "IM-004", rollNo: "22CSE004", studentName: "Sanya Mathur", attendance: 5, assignment: 19, quiz: 10, midTerm: 28, project: 18, total: 80 },
];

export function InternalMarksView() {
  const [marks, setMarks] = useState<StudentInternalMark[]>(INITIAL_MARKS);
  const [selectedSubject, setSelectedSubject] = useState("CS401");
  const [search, setSearch] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const filteredMarks = marks.filter((m) => {
    const s = search.toLowerCase();
    return (
      (m.rollNo || "").toLowerCase().includes(s) ||
      (m.studentName || "").toLowerCase().includes(s)
    );
  });

  const handleMarkChange = (id: string, field: keyof StudentInternalMark, value: string) => {
    if (isLocked) return toast.error("Marks are locked and cannot be edited.");
    const numValue = Number(value) || 0;
    
    // Validation rules
    const maxVals: Record<string, number> = { attendance: 5, assignment: 20, quiz: 10, midTerm: 30, project: 20 };
    if (field in maxVals && numValue > maxVals[field]) {
      toast.error(`Max marks for ${field} is ${maxVals[field]}`);
      return;
    }

    setMarks((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, [field]: numValue };
          updated.total = updated.attendance + updated.assignment + updated.quiz + updated.midTerm + updated.project;
          return updated;
        }
        return m;
      })
    );
  };

  const handleSubjectChange = (val: string) => {
    setSelectedSubject(val);
    setIsLocked(false);
    toast.info(`Loaded marks for ${val}`);
  };

  const handleSave = () => {
    if (isLocked) return toast.error("Cannot save. Marks are locked.");
    toast.success("Draft saved successfully! (Audit log updated)");
  };

  const handlePublish = () => {
    if (isLocked) return toast.error("Marks are already locked and published.");
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsLocked(true);
      toast.success("Internal marks published and locked for this subject!");
    }, 1500);
  };

  const toggleLock = () => {
    if (isLocked) {
      toast.success("Marks entry unlocked by Admin override.");
      setIsLocked(false);
    } else {
      toast.success("Marks manually locked.");
      setIsLocked(true);
    }
  };

  const exportExcel = () => {
    toast.success("Downloading internal_marks_CS401.xlsx");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">
            <FileSpreadsheet className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Internal Marks Entry
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-blue-600 border-blue-500/30">
                Continuous Assessment
              </Badge>
              {isLocked && <Badge className="bg-red-500/10 text-red-600 gap-1"><Lock className="size-3" /> Locked</Badge>}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Enter, validate, and publish component-wise internal assessment marks.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setIsAuditOpen(true)} className="h-9 gap-2 text-xs font-medium">
            <History className="size-3.5" /> Audit Log
          </Button>
          <Button variant="outline" size="sm" onClick={exportExcel} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export
          </Button>
          <Button variant="outline" size="sm" disabled={isLocked} className="h-9 gap-2 text-xs font-medium border-blue-500/30 text-blue-600">
            <Upload className="size-3.5" /> Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isLocked} className="h-9 gap-2 text-xs font-medium border-blue-500/30 text-blue-600">
            <Save className="size-3.5" /> Save Draft
          </Button>
          <Button size="sm" onClick={handlePublish} disabled={isPublishing || isLocked} className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs font-semibold shadow-glow">
            <CheckCircle className="size-4" /> {isPublishing ? "Publishing..." : "Publish Marks"}
          </Button>
          {/* Admin Override Lock Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleLock} className="size-9 ml-2" title={isLocked ? "Unlock Marks" : "Lock Marks"}>
            {isLocked ? <Unlock className="size-4 text-red-500" /> : <Lock className="size-4 text-emerald-500" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Select Subject</Label>
          <Select value={selectedSubject} onValueChange={handleSubjectChange}>
            <SelectTrigger className="bg-card text-xs h-9"><SelectValue placeholder="Select Subject" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CS401">CS401: Advanced AI</SelectItem>
              <SelectItem value="EC304">EC304: VLSI System Design</SelectItem>
              <SelectItem value="ME308">ME308: CAD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Faculty Assigned</Label>
          <div className="flex items-center gap-2 h-9 px-3 rounded-md bg-muted/40 border border-border text-xs">
            <Users className="size-3.5 text-muted-foreground" /> Dr. Sarah Smith (CSE)
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-semibold">Search Student</Label>
          <Input 
            placeholder="Search by roll no or name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        {isLocked && (
          <div className="p-3 mb-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-red-600">
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            <p className="text-xs">Marks are locked and published. Further edits require administrative override approval.</p>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3 sticky left-0 bg-muted/40 z-10 w-48">Roll No & Name</th>
                <th className="py-3 px-3 text-center">Attendance<br/><span className="text-[0.6rem]">(Max 5)</span></th>
                <th className="py-3 px-3 text-center">Assignment<br/><span className="text-[0.6rem]">(Max 20)</span></th>
                <th className="py-3 px-3 text-center">Quiz<br/><span className="text-[0.6rem]">(Max 10)</span></th>
                <th className="py-3 px-3 text-center">Mid Term<br/><span className="text-[0.6rem]">(Max 30)</span></th>
                <th className="py-3 px-3 text-center">Project<br/><span className="text-[0.6rem]">(Max 20)</span></th>
                <th className="py-3 px-3 text-center">Total<br/><span className="text-[0.6rem]">(Max 85)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredMarks.map((m) => (
                <tr key={m.id} className={`hover:bg-muted/20 transition-colors ${isLocked ? "opacity-80" : ""}`}>
                  <td className="py-3 px-3 sticky left-0 bg-card z-10 border-r border-border/40">
                    <div className="font-mono font-bold text-foreground">{m.rollNo}</div>
                    <div className="font-semibold text-muted-foreground text-[0.68rem]">{m.studentName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <Input type="number" max="5" min="0" disabled={isLocked} value={m.attendance} onChange={(e) => handleMarkChange(m.id, "attendance", e.target.value)} className="h-8 w-16 text-xs text-center mx-auto" />
                  </td>
                  <td className="py-3 px-3">
                    <Input type="number" max="20" min="0" disabled={isLocked} value={m.assignment} onChange={(e) => handleMarkChange(m.id, "assignment", e.target.value)} className="h-8 w-16 text-xs text-center mx-auto" />
                  </td>
                  <td className="py-3 px-3">
                    <Input type="number" max="10" min="0" disabled={isLocked} value={m.quiz} onChange={(e) => handleMarkChange(m.id, "quiz", e.target.value)} className="h-8 w-16 text-xs text-center mx-auto" />
                  </td>
                  <td className="py-3 px-3">
                    <Input type="number" max="30" min="0" disabled={isLocked} value={m.midTerm} onChange={(e) => handleMarkChange(m.id, "midTerm", e.target.value)} className="h-8 w-16 text-xs text-center mx-auto" />
                  </td>
                  <td className="py-3 px-3">
                    <Input type="number" max="20" min="0" disabled={isLocked} value={m.project} onChange={(e) => handleMarkChange(m.id, "project", e.target.value)} className="h-8 w-16 text-xs text-center mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className={`font-mono font-bold text-sm ${m.total < 35 ? "text-red-500" : "text-emerald-600"}`}>
                      {m.total}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Marks Audit Log</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4 text-xs">
            <div className="flex gap-3 border-l-2 border-emerald-500 pl-3">
              <div className="pb-1">
                <p className="font-semibold">Marks Published & Locked</p>
                <p className="text-muted-foreground font-mono mt-0.5">By: Dr. Sarah Smith (Faculty)</p>
                <p className="text-muted-foreground mt-0.5">Aug 5, 2026 14:30 PM</p>
              </div>
            </div>
            <div className="flex gap-3 border-l-2 border-blue-500 pl-3">
              <div className="pb-1">
                <p className="font-semibold">Draft Saved</p>
                <p className="text-muted-foreground font-mono mt-0.5">By: Dr. Sarah Smith (Faculty)</p>
                <p className="text-muted-foreground mt-0.5">Aug 4, 2026 10:15 AM</p>
              </div>
            </div>
            <div className="flex gap-3 border-l-2 border-muted pl-3">
              <div className="pb-1">
                <p className="font-semibold">Imported via CSV</p>
                <p className="text-muted-foreground font-mono mt-0.5">By: Exam Coordinator</p>
                <p className="text-muted-foreground mt-0.5">Aug 3, 2026 09:00 AM</p>
              </div>
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsAuditOpen(false)} className="w-full text-xs">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
