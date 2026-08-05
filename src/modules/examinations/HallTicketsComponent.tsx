import React, { useState } from "react";
import {
  FileCheck,
  Search,
  Download,
  Printer,
  FileText
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

export interface HallTicket {
  id: string;
  rollNo: string;
  studentName: string;
  department: string;
  semester: string;
  examType: string;
  status: "Generated" | "Pending";
}

const INITIAL_HALL_TICKETS: HallTicket[] = [
  { id: "HT-001", rollNo: "22CSE001", studentName: "Aarav Sharma", department: "CSE", semester: "Semester 6", examType: "Regular", status: "Generated" },
  { id: "HT-002", rollNo: "22ECE042", studentName: "Ananya Iyer", department: "ECE", semester: "Semester 6", examType: "Regular", status: "Generated" },
  { id: "HT-003", rollNo: "23ME014", studentName: "Vikram Aditya", department: "ME", semester: "Semester 4", examType: "Supply", status: "Pending" },
  { id: "HT-004", rollNo: "23AIDS012", studentName: "Rohan Varma", department: "AI&DS", semester: "Semester 6", examType: "Regular", status: "Generated" },
];

export function HallTicketsView() {
  const [tickets, setTickets] = useState<HallTicket[]>(INITIAL_HALL_TICKETS);
  const [search, setSearch] = useState("");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const [generateForm, setGenerateForm] = useState({
    department: "CSE",
    semester: "Semester 6",
    examType: "Regular",
  });

  const filteredTickets = tickets.filter((t) => {
    return (
      t.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleBulkGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerateOpen(false);
    toast.success(`Generated hall tickets for ${generateForm.department} ${generateForm.semester} (${generateForm.examType})`);
    
    // update status for pending ones
    setTickets(prev => prev.map(t => 
      t.department === generateForm.department && t.semester === generateForm.semester ? { ...t, status: "Generated" } : t
    ));
  };

  const downloadTicket = (rollNo: string) => {
    toast.success(`Downloading Hall Ticket for ${rollNo}...`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
            <FileCheck className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Hall Tickets
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-emerald-600 border-emerald-500/30">
                Admit Cards
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Generate and manage student hall tickets for upcoming examinations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button size="sm" onClick={() => setIsGenerateOpen(true)} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-semibold shadow-glow">
            <FileText className="size-4" /> Bulk Generate
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Input 
          placeholder="Search by student name, roll no, or department..." 
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
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Department & Sem</th>
                <th className="py-3 px-3">Exam Type</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{t.rollNo}</td>
                  <td className="py-3 px-3 font-semibold text-foreground">{t.studentName}</td>
                  <td className="py-3 px-3 text-muted-foreground">{t.department} ({t.semester})</td>
                  <td className="py-3 px-3">{t.examType}</td>
                  <td className="py-3 px-3">
                    <Badge className={t.status === "Generated" ? "bg-emerald-500/10 text-emerald-600" : "bg-orange-500/10 text-orange-600"}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {t.status === "Generated" && (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => downloadTicket(t.rollNo)} title="Download PDF">
                          <Download className="size-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => downloadTicket(t.rollNo)} title="Print">
                          <Printer className="size-4 text-muted-foreground" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Bulk Generate Hall Tickets</DialogTitle></DialogHeader>
          <form onSubmit={handleBulkGenerate} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Department</Label>
              <Select value={generateForm.department} onValueChange={(val) => setGenerateForm({ ...generateForm, department: val })}>
                <SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                  <SelectItem value="AI&DS">AI&DS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Semester</Label>
              <Select value={generateForm.semester} onValueChange={(val) => setGenerateForm({ ...generateForm, semester: val })}>
                <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semester 4">Semester 4</SelectItem>
                  <SelectItem value="Semester 6">Semester 6</SelectItem>
                  <SelectItem value="Semester 7">Semester 7</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Exam Type</Label>
              <Select value={generateForm.examType} onValueChange={(val) => setGenerateForm({ ...generateForm, examType: val })}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Supply">Supply</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsGenerateOpen(false)} className="text-xs">Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">Generate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
