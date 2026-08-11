import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search, ChevronUp, ChevronDown, Download, Upload, ArrowUpDown } from "lucide-react";
import type { AssessmentItem, StudentMark } from "./types";
import { GradeBadge } from "./assessment-badges";
import { cn } from "@/lib/utils";

type SortKey = "rollNumber" | "studentName" | "marksObtained" | "grade";

interface MarksEntryTableProps {
  assessment: AssessmentItem;
  open: boolean;
  onClose: () => void;
}

export function MarksEntryTable({ assessment, open, onClose }: MarksEntryTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rollNumber");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const PER_PAGE = 5;

  const filtered = useMemo(() => {
    return assessment.marks
      .filter((m) =>
        m.studentName.toLowerCase().includes(search.toLowerCase()) ||
        m.rollNumber.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        let va: string | number = a[sortKey];
        let vb: string | number = b[sortKey];
        if (typeof va === "string") va = va.toLowerCase();
        if (typeof vb === "string") vb = vb.toLowerCase();
        return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
      });
  }, [assessment.marks, search, sortKey, sortAsc]);

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) setSortAsc((v) => !v);
    else { setSortKey(k); setSortAsc(true); }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto p-0 gap-0">
        <SheetHeader className="px-6 py-4 border-b border-border/50 sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-base font-bold line-clamp-1">{assessment.name}</SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {assessment.subject} · Section {assessment.section} · Max {assessment.maxMarks} Marks
              </p>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted/50 transition-colors">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search student..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="pl-9 h-8 text-xs bg-muted/20 border-border/40"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs"><Upload className="size-3.5" /> Import</Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs"><Download className="size-3.5" /> Export</Button>
          </div>
        </SheetHeader>

        {/* Summary banner */}
        <div className="px-6 py-3 flex flex-wrap gap-4 text-xs bg-muted/10 border-b border-border/30">
          {[
            ["Appeared",  assessment.studentsAppeared],
            ["Evaluated", assessment.studentsEvaluated],
            ["Avg Score", `${assessment.performance.average}/${assessment.maxMarks}`],
            ["Pass %",    `${assessment.performance.passPercentage}%`],
            ["Fail %",    `${assessment.performance.failPercentage}%`],
          ].map(([l, v]) => (
            <span key={l as string} className="font-medium text-muted-foreground">
              {l}: <strong className="text-foreground">{v}</strong>
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                {(["rollNumber", "studentName", "marksObtained", "grade"] as SortKey[]).map((col) => (
                  <Th key={col} col={col} active={sortKey === col} asc={sortAsc} onClick={() => toggleSort(col)} />
                ))}
                <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">Result</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">Remarks</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {visible.map((m) => (
                <MarkRow key={m.rollNumber} m={m} max={assessment.maxMarks} />
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/40">
            <span className="text-xs text-muted-foreground">
              Showing {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>‹ Prev</Button>
              {Array.from({ length: pages }).map((_, i) => (
                <Button key={i} size="sm" variant={i === page ? "default" : "outline"} className="h-7 w-7 text-xs p-0" onClick={() => setPage(i)}>{i + 1}</Button>
              ))}
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>Next ›</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Th({ col, active, asc, onClick }: { col: string; active: boolean; asc: boolean; onClick: () => void }) {
  const labels: Record<string, string> = { rollNumber: "Roll No", studentName: "Student", marksObtained: "Marks", grade: "Grade" };
  return (
    <th
      className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={onClick}
    >
      <span className="flex items-center gap-1">
        {labels[col] ?? col}
        {active ? (asc ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />) : <ArrowUpDown className="size-3 opacity-30" />}
      </span>
    </th>
  );
}

function MarkRow({ m, max }: { m: StudentMark; max: number }) {
  const pct = Math.round((m.marksObtained / max) * 100);
  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{m.rollNumber}</td>
      <td className="px-4 py-3 font-medium text-foreground text-sm">{m.studentName}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground tabular-nums">{m.marksObtained}<span className="text-muted-foreground font-normal text-xs">/{max}</span></span>
          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
            <div className={cn("h-full rounded-full", pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><GradeBadge grade={m.grade} /></td>
      <td className="px-4 py-3">
        <span className={cn("text-xs font-bold", m.result === "Pass" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
          {m.result}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{m.remarks}</td>
      <td className="px-4 py-3">
        <span className={cn("text-[0.65rem] font-bold px-2 py-0.5 rounded-full", m.evaluationStatus === "Evaluated" ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600")}>
          {m.evaluationStatus}
        </span>
      </td>
    </tr>
  );
}
