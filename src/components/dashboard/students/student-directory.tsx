import { StudentCard } from "./student-card";
import { StudentTable } from "./student-table";
import { EmptyState } from "./empty-state";
import type { StudentDetails } from "@/data/faculty-mock-data";

interface StudentDirectoryProps {
  students: StudentDetails[];
  viewMode: "grid" | "list";
  onSelectStudent: (student: StudentDetails) => void;
}

export function StudentDirectory({ students, viewMode, onSelectStudent }: StudentDirectoryProps) {
  if (students.length === 0) {
    return <EmptyState />;
  }

  if (viewMode === "list") {
    return <StudentTable students={students} onSelectStudent={onSelectStudent} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {students.map((stud) => (
        <StudentCard
          key={stud.rollNumber}
          student={stud}
          onClick={() => onSelectStudent(stud)}
        />
      ))}
    </div>
  );
}
