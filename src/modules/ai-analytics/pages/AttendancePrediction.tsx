import { useState } from "react";
import { ArrowRight, Send, AlertTriangle } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAttendance } from "../hooks/useAttendance";
import { WorkflowPipeline } from "../components/cards/WorkflowPipeline";
import { DataTable, ColumnDef } from "@/shared/components/DataTable/DataTable";
import { LoadingState } from "@/shared/components";
import type { AttendancePrediction } from "../types";

export function AttendancePrediction() {
  const [search, setSearch] = useState("");
  const { predictions, loading, error, department, setDepartment, alertUser } = useAttendance();

  // Columns definition for the generic DataTable
  const columns: ColumnDef<AttendancePrediction>[] = [
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
      header: "Current Attendance",
      render: (row) => <span className="font-bold text-sm">{row.currentAttendance}%</span>,
    },
    {
      header: "Trend Forecast",
      className: "text-center",
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <span className="text-xs font-semibold">{row.currentAttendance}%</span>
          <ArrowRight className="size-3 text-primary" />
          <span className="text-xs font-bold text-foreground">{row.predictedAttendance}%</span>
        </div>
      ),
    },
    {
      header: "Predicted End-Sem",
      render: (row) => (
        <span className={`font-bold text-sm ${row.predictedAttendance < 75 ? "text-red-500" : "text-emerald-500"}`}>
          {row.predictedAttendance}%
        </span>
      ),
    },
    {
      header: "Confidence",
      render: (row) => <span className="text-sm font-semibold text-muted-foreground">{row.confidence}%</span>,
    },
    {
      header: "Risk Level",
      render: (row) => {
        const getRiskBadge = (risk: string) => {
          switch (risk) {
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
        return getRiskBadge(row.risk);
      },
    },
    {
      header: "Action Alerts",
      className: "text-right",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs font-semibold shadow-[0_2px_8px_rgba(29,78,216,0.15)] cursor-pointer">
              Dispatch Alert
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => alertUser(row.studentId, "Student")}
              className="cursor-pointer font-semibold gap-2"
            >
              <Send className="size-3" /> Alert Student
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alertUser(row.studentId, "Parent")}
              className="cursor-pointer font-semibold gap-2"
            >
              <Send className="size-3" /> Alert Parent
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alertUser(row.studentId, "Faculty")}
              className="cursor-pointer font-semibold gap-2"
            >
              <Send className="size-3" /> Alert Mentor
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alertUser(row.studentId, "HOD")}
              className="cursor-pointer font-semibold gap-2"
            >
              <AlertTriangle className="size-3" /> Alert HOD
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Configure filters definitions matching the DataTable API
  const filtersDef = [
    {
      key: "department" as keyof AttendancePrediction,
      label: "Department",
      options: ["CSE", "ECE", "ME", "EEE", "Civil"] as string[],
    },
    {
      key: "risk" as keyof AttendancePrediction,
      label: "Risk Level",
      options: ["Low", "Medium", "High", "Critical"] as string[],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Visual Pipeline Graph */}
      <WorkflowPipeline />

      <Panel
        title="Biometric Attendance Forecast Logs"
        description="Predicting semester-end attendance rates using historic weekly progress and biometric check-ins."
      >
        {loading ? (
          <LoadingState message="Calculating attendance vectors with LSTM model..." />
        ) : error ? (
          <div className="text-center p-6 text-red-500 font-semibold">{error}</div>
        ) : (
          <div className="pt-2">
            <DataTable
              columns={columns}
              data={predictions}
              searchKey="name"
              searchPlaceholder="Search by student name..."
              filters={filtersDef}
              pageSize={8}
            />
          </div>
        )}
      </Panel>
    </div>
  );
}
