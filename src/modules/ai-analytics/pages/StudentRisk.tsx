import { useState } from "react";
import { Save, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/shared/components/Form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRiskAnalysis } from "../hooks/useRiskAnalysis";
import { WorkflowPipeline } from "../components/cards/WorkflowPipeline";
import { DataTable, ColumnDef } from "@/shared/components/DataTable/DataTable";
import { LoadingState } from "@/shared/components";
import type { StudentRisk as StudentRiskType } from "../types";

export function StudentRisk() {
  const [editingStudent, setEditingStudent] = useState<StudentRiskType | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  
  const { risks, loading, error, updateRecommendation } = useRiskAnalysis();

  const handleOpenEdit = (student: StudentRiskType) => {
    setEditingStudent(student);
    setTempNotes(student.recommendation);
  };

  const handleSaveRecommendation = async () => {
    if (!editingStudent) return;
    await updateRecommendation(editingStudent.studentId, tempNotes);
    setEditingStudent(null);
  };

  // Columns definition for the generic DataTable
  const columns: ColumnDef<StudentRiskType>[] = [
    {
      header: "Student",
      render: (row) => (
        <div>
          <p className="font-bold text-sm text-foreground">{row.name}</p>
          <p className="font-mono text-xs text-muted-foreground">{row.studentId}</p>
        </div>
      ),
    },
    {
      header: "Dept",
      accessorKey: "department",
      className: "font-mono text-sm font-semibold",
    },
    {
      header: "Attendance",
      render: (row) => <span className="font-semibold text-sm">{row.attendance}%</span>,
    },
    {
      header: "Internal Marks",
      render: (row) => <span className="font-semibold text-sm">{row.internalMarks}%</span>,
    },
    {
      header: "CGPA",
      render: (row) => <span className="font-bold text-sm">{row.cgpa}</span>,
    },
    {
      header: "Fees Status",
      render: (row) => (
        <Badge
          variant="outline"
          className={
            row.feeStatus === "Paid"
              ? "border-emerald-500/20 text-emerald-600 bg-emerald-500/10 font-bold"
              : row.feeStatus === "Pending"
              ? "border-amber-500/20 text-amber-600 bg-amber-500/10 font-bold"
              : "border-red-500/20 text-red-600 bg-red-500/10 font-bold"
          }
        >
          {row.feeStatus}
        </Badge>
      ),
    },
    {
      header: "Risk Score",
      render: (row) => <span className="font-mono font-bold text-foreground">{row.riskScore} / 100</span>,
    },
    {
      header: "Risk Level",
      render: (row) => {
        const getRiskBadge = (level: string) => {
          switch (level) {
            case "Critical":
              return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 font-bold">Critical</Badge>;
            case "High":
              return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold">High</Badge>;
            case "Medium":
              return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold">Medium</Badge>;
            default:
              return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">Low</Badge>;
          }
        };
        return getRiskBadge(row.riskLevel);
      },
    },
    {
      header: "Academic Recommendation",
      className: "max-w-xs truncate text-xs text-muted-foreground font-medium",
      accessorKey: "recommendation",
    },
    {
      header: "Override",
      className: "text-right",
      render: (row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleOpenEdit(row)}
          className="hover:text-primary cursor-pointer rounded-lg"
        >
          <Edit className="size-4" />
        </Button>
      ),
    },
  ];

  // Configure filters definitions matching the DataTable API
  const filtersDef = [
    {
      key: "department" as keyof StudentRiskType,
      label: "Department",
      options: ["CSE", "ECE", "ME", "EEE", "Civil"] as string[],
    },
    {
      key: "riskLevel" as keyof StudentRiskType,
      label: "Risk Level",
      options: ["Low", "Medium", "High", "Critical"] as string[],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Visual Pipeline Graph */}
      <WorkflowPipeline />

      <Panel
        title="Student Cohort Risk Evaluations"
        description="Identifying learners with potential academic warning indicators based on attendance, internals, and fee status."
      >
        {loading ? (
          <LoadingState message="Running XGBoost risk classification analysis..." />
        ) : error ? (
          <div className="text-center p-6 text-red-500 font-semibold">{error}</div>
        ) : (
          <div className="pt-2">
            <DataTable
              columns={columns}
              data={risks}
              searchKey="name"
              searchPlaceholder="Search by student name..."
              filters={filtersDef}
              pageSize={8}
            />
          </div>
        )}
      </Panel>

      {/* Adviser Recommendation Dialog */}
      <Dialog open={editingStudent !== null} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Academic Intervention Recommendation</DialogTitle>
            <DialogDescription>
              Submit custom intervention advice or remedial directives for{" "}
              <strong className="text-foreground">{editingStudent?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              label="Advisory Notes"
              placeholder="e.g., Mandatory remedial classes scheduled for Unit-3 Compiler Design. Attendance closely monitored."
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingStudent(null)}
              className="font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRecommendation}
              className="bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer gap-1.5"
            >
              <Save className="size-3.5" /> Save Overrides
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
