import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, ArrowUpDown, Upload, Download, Save, Grid, Settings } from "lucide-react";
import type { ExamItem, ExamStudentMark } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MarksEntryProps {
  exams: ExamItem[];
  marksMap: Record<string, ExamStudentMark[]>;
  onSaveMarks: (examId: string, updatedMarks: ExamStudentMark[]) => void;
}

export function MarksEntry({ exams, marksMap, onSaveMarks }: MarksEntryProps) {
  const completedExams = exams.filter((e) => e.status === "Completed");

  const [selectedExamId, setSelectedExamId] = useState(completedExams[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"rollNumber" | "studentName" | "marksObtained">("rollNumber");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const PER_PAGE = 5;

  // Local state copy of current exam's marks for immediate input updates
  const activeMarks = useMemo(() => {
    return marksMap[selectedExamId] ?? [];
  }, [marksMap, selectedExamId]);

  const [localMarks, setLocalMarks] = useState<ExamStudentMark[]>(activeMarks);

  // Sync local marks when exam changes
  useMemo(() => {
    setLocalMarks(activeMarks);
    setPage(0);
  }, [activeMarks]);

  const activeExam = exams.find((e) => e.id === selectedExamId);

  const handleMarkChange = (roll: string, value: string) => {
    const numericValue = value === "" ? undefined : Number(value);
    const max = activeExam?.maxMarks ?? 100;

    if (numericValue !== undefined && (isNaN(numericValue) || numericValue < 0 || numericValue > max)) {
      return; // Validation boundary
    }

    setLocalMarks((prev) =>
      prev.map((m) => {
        if (m.rollNumber === roll) {
          // Compute grade
          let grade = "F";
          const pct = numericValue !== undefined ? (numericValue / max) * 100 : 0;
          if (pct >= 90) grade = "O";
          else if (pct >= 80) grade = "A+";
          else if (pct >= 70) grade = "A";
          else if (pct >= 60) grade = "B+";
          else if (pct >= 50) grade = "B";
          else if (pct >= 40) grade = "C";

          return {
            ...m,
            marksObtained: numericValue,
            grade,
            remarks: pct >= 40 ? "Pass" : "Fail",
            submissionStatus: "Draft" as const
          };
        }
        return m;
      })
    );
  };

  const handleBulkEntry = () => {
    const max = activeExam?.maxMarks ?? 100;
    const presets = [85, 92, 68, 54, 76, 32]; // sample percentages

    setLocalMarks((prev) =>
      prev.map((m, idx) => {
        const pct = presets[idx] ?? 75;
        const obtained = Math.round((pct / 100) * max);

        let grade = "F";
        if (pct >= 90) grade = "O";
        else if (pct >= 80) grade = "A+";
        else if (pct >= 70) grade = "A";
        else if (pct >= 60) grade = "B+";
        else if (pct >= 50) grade = "B";
        else if (pct >= 40) grade = "C";

        return {
          ...m,
          marksObtained: obtained,
          grade,
          remarks: pct >= 40 ? "Pass" : "Fail",
          submissionStatus: "Draft" as const
        };
      })
    );

    toast.success("Bulk presets filled", {
      description: "Auto-calculated grade records have been filled as Draft."
    });
  };

  const handleSave = () => {
    onSaveMarks(selectedExamId, localMarks);
    toast.success("Marks saved successfully", {
      description: "All student evaluation registers updated locally."
    });
  };

  const handlePublish = () => {
    const submittedMarks = localMarks.map((m) => ({
      ...m,
      submissionStatus: "Submitted" as const
    }));
    setLocalMarks(submittedMarks);
    onSaveMarks(selectedExamId, submittedMarks);
    toast.success("Marks published to registrar", {
      description: "Scores locked and submitted for official board approval."
    });
  };

  const filtered = useMemo(() => {
    return localMarks
      .filter(
        (m) =>
          m.studentName.toLowerCase().includes(search.toLowerCase()) ||
          m.rollNumber.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        let va = a[sortKey];
        let vb = b[sortKey];
        if (va === undefined) return 1;
        if (vb === undefined) return -1;
        if (typeof va === "string") va = va.toLowerCase();
        if (typeof vb === "string") vb = vb.toLowerCase();
        return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
      });
  }, [localMarks, search, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleImport = () => {
    toast.info("Import spreadsheet template", {
      description: "Loading Excel xlsx layout parser mockup."
    });
  };

  const handleExport = () => {
    toast.success("Export completed", {
      description: "Evaluation sheet spreadsheet (.csv) downloaded successfully."
    });
  };

  if (completedExams.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No completed exams available for marks entry.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Exam selection bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/40 bg-muted/20">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Select Exam:</label>
          <select
            className="h-8 px-2 text-xs rounded-lg border border-border bg-background font-semibold cursor-pointer focus:outline-none"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            {completedExams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1 text-xs font-bold" onClick={handleImport}>
            <Upload className="size-3.5" /> Import
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1 text-xs font-bold" onClick={handleExport}>
            <Download className="size-3.5" /> Export
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 border-indigo-500/20" onClick={handleBulkEntry}>
            <Grid className="size-3.5" /> Bulk Fill
          </Button>
        </div>
      </div>

      {/* Toolbar controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative w-full max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search student or roll..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-9 h-8 text-xs bg-muted/10 border-border/40"
          />
        </div>

        {activeExam && (
          <span className="text-xs text-muted-foreground font-semibold">
            Max marks: <strong className="text-foreground">{activeExam.maxMarks}</strong>
          </span>
        )}
      </div>

      {/* Table grid */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-5 py-4 text-left cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort("rollNumber")}>
                  <span className="flex items-center gap-1">
                    Roll No
                    {sortKey === "rollNumber" ? (sortAsc ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />) : <ArrowUpDown className="size-3 opacity-30" />}
                  </span>
                </th>
                <th className="px-5 py-4 text-left cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort("studentName")}>
                  <span className="flex items-center gap-1">
                    Student Name
                    {sortKey === "studentName" ? (sortAsc ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />) : <ArrowUpDown className="size-3 opacity-30" />}
                  </span>
                </th>
                <th className="px-5 py-4 text-center cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort("marksObtained")}>
                  <span className="flex items-center gap-1 justify-center">
                    Marks Obtained
                    {sortKey === "marksObtained" ? (sortAsc ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />) : <ArrowUpDown className="size-3 opacity-30" />}
                  </span>
                </th>
                <th className="px-5 py-4 text-center">Grade</th>
                <th className="px-5 py-4 text-left">Remarks</th>
                <th className="px-5 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {visible.map((m) => (
                <tr key={m.rollNumber} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-4 text-xs font-mono text-muted-foreground">{m.rollNumber}</td>
                  <td className="px-5 py-4 font-semibold text-foreground">{m.studentName}</td>
                  <td className="px-5 py-4 text-center">
                    <input
                      type="number"
                      disabled={m.submissionStatus === "Submitted"}
                      className={cn(
                        "h-8 w-20 px-2 rounded-lg border text-center font-bold text-xs focus:ring-2 focus:ring-primary/20 bg-background border-border/60",
                        m.submissionStatus === "Submitted" && "opacity-75 bg-muted"
                      )}
                      value={m.marksObtained ?? ""}
                      onChange={(e) => handleMarkChange(m.rollNumber, e.target.value)}
                    />
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-primary">{m.grade ?? "—"}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{m.remarks ?? "—"}</td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        m.submissionStatus === "Submitted"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : m.submissionStatus === "Draft"
                          ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                          : "bg-slate-500/10 text-slate-600 border border-slate-500/20"
                      )}
                    >
                      {m.submissionStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-xs text-muted-foreground italic">
                    No matching students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border/40">
            <span className="text-xs text-muted-foreground">
              Showing {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs font-bold" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Prev
              </Button>
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs font-bold" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Control panel buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button size="sm" variant="outline" className="h-8 font-bold gap-1.5" onClick={handleSave}>
          <Save className="size-4" /> Save as Draft
        </Button>
        <Button size="sm" className="h-8 font-bold bg-brand-gradient text-white" onClick={handlePublish}>
          Submit & Lock Marks
        </Button>
      </div>
    </div>
  );
}
