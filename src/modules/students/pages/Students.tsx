import React, { useState } from "react";
import { Plus, Download, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { StudentFilters } from "../components/tables/StudentFilters";
import { StudentTable } from "../components/tables/StudentTable";
import { StudentForm } from "../components/forms/StudentForm";
import { DeleteStudentDialog } from "../components/dialogs/DeleteStudentDialog";
import { TransferStudentDialog } from "../components/dialogs/TransferStudentDialog";
import { PromoteStudentDialog } from "../components/dialogs/PromoteStudentDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { StudentRecord, StudentFilters as Filters } from "../types";
import { useStudentPermissions } from "../hooks/useStudentPermissions";

interface StudentsProps {
  students: StudentRecord[];
  allStudents: StudentRecord[];
  loading: boolean;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  refresh: () => void;
  createStudent: (data: Partial<StudentRecord>) => Promise<StudentRecord>;
  updateStudent: (id: string, updates: Partial<StudentRecord>) => Promise<StudentRecord>;
  deleteStudent: (id: string) => Promise<void>;
  promoteStudent: (id: string, year: string, sem: number) => Promise<StudentRecord>;
  transferStudent: (id: string, dept: string, sec: string) => Promise<StudentRecord>;
}

export function Students({
  students,
  allStudents,
  loading,
  filters,
  setFilters,
  refresh,
  createStudent,
  updateStudent,
  deleteStudent,
  promoteStudent,
  transferStudent,
}: StudentsProps) {
  const { can } = useStudentPermissions();

  // Dialog Open States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Selected Records
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (s: StudentRecord) => {
    setSelectedStudent(s);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (id: string, rollNo: string, name: string) => {
    setSelectedStudent({ id, rollNo, fullName: name } as StudentRecord);
    setIsDeleteOpen(true);
  };

  const handleOpenPromote = (s: StudentRecord) => {
    setSelectedStudent(s);
    setIsPromoteOpen(true);
  };

  const handleOpenTransfer = (s: StudentRecord) => {
    setSelectedStudent(s);
    setIsTransferOpen(true);
  };

  const handleAddSubmit = async (data: Partial<StudentRecord>) => {
    await createStudent(data);
    setIsAddOpen(false);
  };

  const handleEditSubmit = async (data: Partial<StudentRecord>) => {
    if (selectedStudent) {
      await updateStudent(selectedStudent.id, data);
      setIsEditOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedStudent) {
      await deleteStudent(selectedStudent.id);
      setIsDeleteOpen(false);
    }
  };

  const handlePromoteConfirm = async (year: string, sem: number) => {
    if (selectedStudent) {
      await promoteStudent(selectedStudent.id, year, sem);
      setIsPromoteOpen(false);
    }
  };

  const handleTransferConfirm = async (dept: string, sec: string) => {
    if (selectedStudent) {
      await transferStudent(selectedStudent.id, dept, sec);
      setIsTransferOpen(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Student ID",
      "Roll No",
      "Full Name",
      "Email Address",
      "Phone",
      "Gender",
      "Department",
      "Academic Year",
      "Semester",
      "Batch Code",
      "Section",
      "CGPA",
      "Attendance %",
      "Fee Status",
      "Guardian Name",
      "Guardian Phone",
      "Academic Status",
    ];

    const rows = students.map((s) => [
      s.id,
      s.rollNo,
      `"${s.fullName}"`,
      s.email,
      `"${s.phone}"`,
      s.gender,
      s.department,
      `"${s.academicYear}"`,
      s.semester,
      s.batchCode,
      s.section,
      s.cgpa,
      `${s.attendancePct}%`,
      s.feeStatus,
      `"${s.guardianName}"`,
      `"${s.guardianPhone}"`,
      s.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Student_Master_Roster_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${students.length} registry records to CSV!`);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <StudentFilters filters={filters} setFilters={setFilters} />

      {/* Main Roster Panel */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Users className="size-4 text-primary" /> Central Student Master Ledger
            <Badge variant="secondary" className="font-mono text-xs">
              {students.length} Records
            </Badge>
          </h3>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
              className="h-8 gap-2 text-xs"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Sync
            </Button>
            {can("EXPORT_STUDENTS") && (
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-8 gap-2 text-xs">
                <Download className="size-3.5" /> Export CSV
              </Button>
            )}
            {can("CREATE_STUDENT") && (
              <Button size="sm" onClick={handleOpenAdd} className="h-8 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow">
                <Plus className="size-3.5" /> Register Student
              </Button>
            )}
          </div>
        </div>

        {/* Table View */}
        <StudentTable
          students={students}
          loading={loading}
          onView={() => {}}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onPromote={handleOpenPromote}
          onTransfer={handleOpenTransfer}
        />
      </div>

      {/* dialogs */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Register Student</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new student profile to the ERP master registry database.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <StudentForm onSubmit={handleAddSubmit} onCancel={() => setIsAddOpen(false)} submitLabel="Register" />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Student Details</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update registry profile properties for the student.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            {selectedStudent && (
              <StudentForm
                initialData={selectedStudent}
                onSubmit={handleEditSubmit}
                onCancel={() => setIsEditOpen(false)}
                submitLabel="Save Changes"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteStudentDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        rollNo={selectedStudent?.rollNo || ""}
        name={selectedStudent?.fullName || ""}
        onConfirm={handleDeleteConfirm}
      />

      <PromoteStudentDialog
        open={isPromoteOpen}
        onOpenChange={setIsPromoteOpen}
        student={selectedStudent}
        onConfirm={handlePromoteConfirm}
      />

      <TransferStudentDialog
        open={isTransferOpen}
        onOpenChange={setIsTransferOpen}
        student={selectedStudent}
        onConfirm={handleTransferConfirm}
      />
    </div>
  );
}

export const pageMeta = {
  title: "Student Registry",
  breadcrumb: ["Students", "Registry"],
};
