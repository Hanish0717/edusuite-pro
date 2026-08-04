import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";
import type { StudentAttendance } from "@/data/faculty-mock-data";

interface StudentAttendanceTableProps {
  students: StudentAttendance[];
}

export function StudentAttendanceTable({ students }: StudentAttendanceTableProps) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Safe":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Warning":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    }
  };

  return (
    <Panel
      title="Overall Student Attendance Registry"
      description="List of students with cumulative hours, counts, and shortage statuses"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="overflow-x-auto max-w-full">
        <Table className="min-w-[550px] text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Roll Number</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead className="w-[100px] text-center">Total Classes</TableHead>
              <TableHead className="w-[80px] text-center text-emerald-600 font-bold">Present</TableHead>
              <TableHead className="w-[80px] text-center text-rose-600 font-bold">Absent</TableHead>
              <TableHead className="w-[110px] text-center">Attendance %</TableHead>
              <TableHead className="w-[90px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((stud) => (
              <TableRow key={stud.rollNumber} className="hover:bg-muted/40">
                <TableCell className="font-mono font-bold">{stud.rollNumber}</TableCell>
                <TableCell className="font-bold text-foreground">{stud.name}</TableCell>
                <TableCell className="text-center font-semibold text-muted-foreground">{stud.totalClasses}</TableCell>
                <TableCell className="text-center font-bold text-emerald-600 bg-emerald-500/5">{stud.present}</TableCell>
                <TableCell className="text-center font-bold text-rose-600 bg-rose-500/5">{stud.absent}</TableCell>
                <TableCell className="text-center font-black text-foreground">{stud.percentage}%</TableCell>
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
    </Panel>
  );
}
