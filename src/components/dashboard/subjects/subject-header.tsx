import { BookOpen, GraduationCap } from "lucide-react";

interface SubjectHeaderProps {
  departmentName: string;
  academicYear: string;
  semester: string;
}

export function SubjectHeader({ departmentName, academicYear, semester }: SubjectHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Subject Management</h1>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
          <GraduationCap className="size-3.5" /> {departmentName} &middot; Academic Year {academicYear} &middot; Semester {semester}
        </p>
      </div>
    </div>
  );
}
