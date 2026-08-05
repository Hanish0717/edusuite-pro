import React, { useState } from "react";
import {
  FileSpreadsheet,
  Save,
  CheckCircle,
  Upload,
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

export interface StudentInternalMark {
  id: string;
  rollNo: string;
  studentName: string;
  assignment1: number;
  assignment2: number;
  midTerm: number;
  total: number;
}

const INITIAL_MARKS: StudentInternalMark[] = [
  { id: "IM-001", rollNo: "22CSE001", studentName: "Aarav Sharma", assignment1: 18, assignment2: 19, midTerm: 45, total: 82 },
  { id: "IM-002", rollNo: "22CSE002", studentName: "Neha Gupta", assignment1: 15, assignment2: 16, midTerm: 38, total: 69 },
  { id: "IM-003", rollNo: "22CSE003", studentName: "Rahul Verma", assignment1: 12, assignment2: 14, midTerm: 40, total: 66 },
];

export function InternalMarksView() {
  const [marks, setMarks] = useState<StudentInternalMark[]>(INITIAL_MARKS);
  const [selectedSubject, setSelectedSubject] = useState("CS401");
  const [search, setSearch] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const filteredMarks = marks.filter((m) => {
    return (
      m.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      m.studentName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleMarkChange = (id: string, field: keyof StudentInternalMark, value: string) => {
    const numValue = Number(value) || 0;
    setMarks((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, [field]: numValue };
          updated.total = updated.assignment1 + updated.assignment2 + updated.midTerm;
          return updated;
        }
        return m;
      })
    );
  };

  const handleSave = () => {
    toast.success("Internal marks saved successfully!");
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      toast.success("Internal marks published to students!");
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
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
                Continuous Evaluation
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Enter, update, and publish internal assessment marks for students.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-medium">
            <Upload className="size-3.5" /> Import CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} className="h-9 gap-2 text-xs font-medium border-blue-500/30 text-blue-600">
            <Save className="size-3.5" /> Save Draft
          </Button>
          <Button size="sm" onClick={handlePublish} disabled={isPublishing} className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs font-semibold shadow-glow">
            <CheckCircle className="size-4" /> {isPublishing ? "Publishing..." : "Publish Marks"}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Select Subject</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CS401">CS401: Advanced AI & Deep Learning</SelectItem>
              <SelectItem value="EC304">EC304: VLSI System Design</SelectItem>
              <SelectItem value="ME308">ME308: CAD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Faculty Assigned</Label>
          <Input disabled value="Dr. Sarah Smith (CSE Dept)" className="h-9 text-xs bg-muted/30" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Search Student</Label>
          <Input 
            placeholder="Roll no or name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3 w-[15%]">Roll No</th>
                <th className="py-3 px-3 w-[25%]">Student Name</th>
                <th className="py-3 px-3 w-[15%]">Assignment 1 (20)</th>
                <th className="py-3 px-3 w-[15%]">Assignment 2 (20)</th>
                <th className="py-3 px-3 w-[15%]">Mid Term (60)</th>
                <th className="py-3 px-3 w-[15%]">Total (100)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredMarks.map((m) => (
                <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{m.rollNo}</td>
                  <td className="py-3 px-3 font-semibold text-foreground">{m.studentName}</td>
                  <td className="py-3 px-3">
                    <Input 
                      type="number" 
                      max="20" 
                      min="0"
                      value={m.assignment1} 
                      onChange={(e) => handleMarkChange(m.id, "assignment1", e.target.value)}
                      className="h-8 w-20 text-xs text-center"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <Input 
                      type="number" 
                      max="20" 
                      min="0"
                      value={m.assignment2} 
                      onChange={(e) => handleMarkChange(m.id, "assignment2", e.target.value)}
                      className="h-8 w-20 text-xs text-center"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <Input 
                      type="number" 
                      max="60" 
                      min="0"
                      value={m.midTerm} 
                      onChange={(e) => handleMarkChange(m.id, "midTerm", e.target.value)}
                      className="h-8 w-20 text-xs text-center"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className={`font-mono font-bold text-sm ${m.total < 40 ? "text-red-500" : "text-emerald-600"}`}>
                      {m.total}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
