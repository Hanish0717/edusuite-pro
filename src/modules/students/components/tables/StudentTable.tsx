import React from "react";
import { Users, Eye, Edit, Trash2, Milestone, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import type { StudentRecord } from "../../types";
import { useStudentPermissions } from "../../hooks/useStudentPermissions";

interface StudentTableProps {
  students: StudentRecord[];
  loading: boolean;
  onView: (s: StudentRecord) => void;
  onEdit: (s: StudentRecord) => void;
  onDelete: (id: string, rollNo: string, name: string) => void;
  onPromote: (s: StudentRecord) => void;
  onTransfer: (s: StudentRecord) => void;
}

export function StudentTable({
  students,
  loading,
  onView,
  onEdit,
  onDelete,
  onPromote,
  onTransfer,
}: StudentTableProps) {
  const { can } = useStudentPermissions();

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
        <div className="size-5 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        Loading student records...
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
        <Users className="size-7 text-muted-foreground mx-auto" />
        <p className="text-xs text-muted-foreground font-medium">No student records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
          <tr>
            <th className="py-3 px-3">Roll No</th>
            <th className="py-3 px-3">Student Name</th>
            <th className="py-3 px-3">Dept & Year</th>
            <th className="py-3 px-3">CGPA</th>
            <th className="py-3 px-3">Attendance</th>
            <th className="py-3 px-3">Fee Status</th>
            <th className="py-3 px-3">Academic Status</th>
            <th className="py-3 px-3 text-right pr-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {students.map((s) => (
            <tr key={s.id} className="hover:bg-muted/20 transition-colors">
              <td className="py-3 px-3 font-mono font-bold text-foreground">
                <Link to={`/students/profile/${s.id}`} className="hover:underline hover:text-primary">
                  {s.rollNo}
                </Link>
              </td>
              <td className="py-3 px-3">
                <div className="font-semibold text-foreground">{s.fullName}</div>
                <div className="text-[0.68rem] text-muted-foreground font-mono">{s.email}</div>
              </td>
              <td className="py-3 px-3">
                <div className="font-bold text-foreground">{s.department}</div>
                <div className="text-[0.68rem] text-muted-foreground">{s.academicYear} - Sem {s.semester}</div>
              </td>
              <td className="py-3 px-3 font-mono font-bold text-primary text-sm">{s.cgpa}</td>
              <td className="py-3 px-3 font-mono font-bold">
                <span className={s.attendancePct < 75 ? "text-amber-600 font-bold" : "text-emerald-600"}>
                  {s.attendancePct}%
                </span>
              </td>
              <td className="py-3 px-3">
                <Badge
                  className={
                    s.feeStatus === "Paid"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                      : s.feeStatus === "Partial"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[0.68rem]"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                  }
                >
                  {s.feeStatus}
                </Badge>
              </td>
              <td className="py-3 px-3">
                <Badge
                  className={
                    s.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                      : s.status === "Risk"
                      ? "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                      : "bg-muted text-muted-foreground text-[0.68rem]"
                  }
                >
                  {s.status}
                </Badge>
              </td>
              <td className="py-3 px-3 text-right pr-4">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(s)}
                    className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                    title="View Dossier"
                    asChild
                  >
                    <Link to={`/students/profile/${s.id}`}>
                      <Eye className="size-3.5" /> Details
                    </Link>
                  </Button>
                  {can("PROMOTE_STUDENT") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPromote(s)}
                      className="size-7 text-muted-foreground hover:text-primary"
                      title="Promote Semester"
                    >
                      <Milestone className="size-3.5" />
                    </Button>
                  )}
                  {can("TRANSFER_STUDENT") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onTransfer(s)}
                      className="size-7 text-muted-foreground hover:text-primary"
                      title="Transfer Department"
                    >
                      <ArrowRightLeft className="size-3.5" />
                    </Button>
                  )}
                  {can("UPDATE_STUDENT") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(s)}
                      className="size-7 text-muted-foreground hover:text-primary"
                      title="Edit Record"
                    >
                      <Edit className="size-3.5" />
                    </Button>
                  )}
                  {can("DELETE_STUDENT") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(s.id, s.rollNo, s.fullName)}
                      className="size-7 text-muted-foreground hover:text-red-600"
                      title="Delete Student"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
