import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { StudentDetails } from "@/data/faculty-mock-data";

interface StudentTableProps {
  students: StudentDetails[];
  onSelectStudent: (student: StudentDetails) => void;
}

export function StudentTable({ students, onSelectStudent }: StudentTableProps) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      default:
        return "bg-muted text-muted-foreground border-border/40";
    }
  };

  const getAttendanceStyle = (pct: number) => {
    if (pct < 75) return "text-rose-600 font-extrabold";
    return "text-emerald-600 font-extrabold";
  };

  const getGradeStyle = (grade: string) => {
    if (grade.startsWith("A")) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (grade.startsWith("B") || grade.startsWith("C")) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    return "bg-rose-500/10 text-rose-600 border-rose-500/20";
  };

  return (
    <div className="overflow-x-auto max-w-full rounded-2xl border bg-card text-xs">
      <Table className="min-w-[700px] text-xs">
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-[100px]">Roll Number</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead className="w-[80px] text-center">Section</TableHead>
            <TableHead>Email Contact</TableHead>
            <TableHead className="w-[120px] text-center">Attendance %</TableHead>
            <TableHead className="w-[80px] text-center">Overall Grade</TableHead>
            <TableHead className="w-[90px] text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((stud) => (
            <TableRow
              key={stud.rollNumber}
              onClick={() => onSelectStudent(stud)}
              className="hover:bg-muted/20 cursor-pointer transition-colors"
            >
              <TableCell className="font-mono font-bold text-foreground">{stud.rollNumber}</TableCell>
              <TableCell className="font-bold text-foreground">
                <div className="flex items-center gap-2">
                  <span>{stud.name}</span>
                  {stud.isMentee && (
                    <Badge variant="outline" className="py-0 px-1 rounded bg-indigo-500/5 text-indigo-600 border border-indigo-500/10 text-[0.55rem] font-bold">
                      Mentee
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center font-semibold text-muted-foreground">{stud.section}</TableCell>
              <TableCell className="font-medium text-muted-foreground">{stud.email}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center gap-2 justify-center">
                  <Progress value={stud.attendance.percentage} className="h-1.5 w-14 bg-primary/10 [&>div]:bg-brand-gradient" />
                  <span className={getAttendanceStyle(stud.attendance.percentage)}>{stud.attendance.percentage}%</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border ${getGradeStyle(stud.performance.overallGrade)}`}>
                  {stud.performance.overallGrade}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border ${getBadgeStyle(stud.status)}`}>
                  {stud.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
