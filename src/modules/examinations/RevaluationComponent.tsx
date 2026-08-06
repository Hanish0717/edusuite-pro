import React, { useState } from "react";
import {
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  History,
  FileSpreadsheet,
  AlertTriangle,
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

export interface RevaluationRequest {
  id: string;
  requestId: string;
  rollNo: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  originalGrade: string;
  revisedGrade?: string;
  status: "Under Review" | "Grade Upgraded" | "No Change" | "Pending Payment";
  feePaid: boolean;
  assignedFaculty: string;
}

const INITIAL_REVALUATIONS: RevaluationRequest[] = [
  { id: "REV-801", requestId: "REQ-2026-001", rollNo: "22ECE042", studentName: "Ananya Iyer", subjectCode: "EC304", subjectName: "VLSI System Design", originalGrade: "B+", revisedGrade: "A", status: "Grade Upgraded", feePaid: true, assignedFaculty: "Dr. K. Sharma" },
  { id: "REV-802", requestId: "REQ-2026-002", rollNo: "22CSE001", studentName: "Aarav Sharma", subjectCode: "CS401", subjectName: "Advanced AI", originalGrade: "B", status: "Under Review", feePaid: true, assignedFaculty: "Dr. P. Nair" },
  { id: "REV-803", requestId: "REQ-2026-003", rollNo: "23ME014", studentName: "Vikram Aditya", subjectCode: "ME308", subjectName: "CAD", originalGrade: "C", status: "Pending Payment", feePaid: false, assignedFaculty: "Unassigned" },
];

export function RevaluationComponent() {
  const [requests, setRequests] = useState<RevaluationRequest[]>(INITIAL_REVALUATIONS);
  const [search, setSearch] = useState("");
  const [selectedReq, setSelectedReq] = useState<RevaluationRequest | null>(null);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [revisedGrade, setRevisedGrade] = useState("");

  const filtered = requests.filter((r) => {
    const s = search.toLowerCase();
    return (
      (r.rollNo || "").toLowerCase().includes(s) ||
      (r.studentName || "").toLowerCase().includes(s) ||
      (r.subjectCode || "").toLowerCase().includes(s) ||
      (r.requestId || "").toLowerCase().includes(s)
    );
  });

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReq) {
      setRequests(prev => prev.map(r => 
        r.id === selectedReq.id ? { ...r, revisedGrade: revisedGrade || r.originalGrade, status: revisedGrade && revisedGrade !== r.originalGrade ? "Grade Upgraded" : "No Change" } : r
      ));
      toast.success(`Processed revaluation for ${selectedReq.rollNo}. Grade updated to ${revisedGrade || selectedReq.originalGrade}.`);
      setIsProcessOpen(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
            <RefreshCw className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Revaluation Ledger
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-amber-600 border-amber-500/30">
                Exam Cell
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Manage student revaluation requests, workflow, and updated grades.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-medium">
            <History className="size-3.5" /> Request History
          </Button>
          <Button size="sm" className="h-9 bg-amber-600 hover:bg-amber-700 text-white gap-2 text-xs font-semibold shadow-glow">
            <FileSpreadsheet className="size-4" /> Export Ledger
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full max-w-md">
        <Input 
          placeholder="Search by Request ID, Roll No, Subject..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs"
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Request ID & Date</th>
                <th className="py-3 px-3">Student Info</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3 text-center">Fee Status</th>
                <th className="py-3 px-3 text-center">Faculty Assigned</th>
                <th className="py-3 px-3 text-center">Grades</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-foreground">{r.requestId}</div>
                    <div className="text-[0.68rem] text-muted-foreground">Aug 5, 2026</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-foreground">{r.studentName}</div>
                    <div className="text-[0.68rem] text-muted-foreground font-mono">{r.rollNo}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-foreground">{r.subjectCode}</div>
                    <div className="text-[0.68rem] text-muted-foreground">{r.subjectName}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {r.feePaid ? <Badge className="bg-emerald-500/10 text-emerald-600">Paid ₹500</Badge> : <Badge className="bg-red-500/10 text-red-600">Pending</Badge>}
                  </td>
                  <td className="py-3 px-3 text-center font-medium">
                    {r.assignedFaculty}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-sm">
                    {r.originalGrade} &rarr; <span className="text-primary font-bold">{r.revisedGrade || "?"}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge className={
                      r.status === "Grade Upgraded" ? "bg-emerald-500/10 text-emerald-600" :
                      r.status === "No Change" ? "bg-muted text-muted-foreground" :
                      r.status === "Pending Payment" ? "bg-red-500/10 text-red-600" :
                      "bg-amber-500/10 text-amber-600"
                    }>{r.status}</Badge>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={r.status !== "Under Review" && r.status !== "Pending Payment"} 
                      onClick={() => { setSelectedReq(r); setRevisedGrade(""); setIsProcessOpen(true); }}
                      className="h-7 text-xs"
                    >
                      Process
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isProcessOpen} onOpenChange={setIsProcessOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Process Revaluation</DialogTitle></DialogHeader>
          {selectedReq && (
            <form onSubmit={handleProcess} className="space-y-4 pt-2">
              <div className="p-3 bg-muted/30 border border-border rounded-lg space-y-1 text-xs">
                <p><span className="font-semibold">Student:</span> {selectedReq.studentName} ({selectedReq.rollNo})</p>
                <p><span className="font-semibold">Subject:</span> {selectedReq.subjectCode}</p>
                <p><span className="font-semibold">Original Grade:</span> <span className="font-mono">{selectedReq.originalGrade}</span></p>
              </div>

              {!selectedReq.feePaid && (
                 <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg flex items-start gap-2">
                   <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                   <p className="text-xs font-semibold">Fee payment is pending. Processing is generally restricted.</p>
                 </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Revised Grade (Leave blank if No Change)</Label>
                <Input placeholder="e.g. A" value={revisedGrade} onChange={e => setRevisedGrade(e.target.value)} className="h-9 font-mono uppercase" />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsProcessOpen(false)} className="text-xs">Cancel</Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold">Confirm Evaluation</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
