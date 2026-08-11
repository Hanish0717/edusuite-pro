import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";
import type { StudentAttendance } from "@/data/faculty-mock-data";

interface LowAttendanceAlertsProps {
  students: StudentAttendance[];
}

export function LowAttendanceAlerts({ students }: LowAttendanceAlertsProps) {
  // Filter students below 75%
  const lowAttendanceStudents = students.filter((s) => s.percentage < 75);

  const getWarningLevel = (pct: number) => {
    if (pct < 65) return { label: "Critical", style: "bg-rose-500/10 text-rose-600 border-rose-500/20" };
    return { label: "Warning", style: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
  };

  return (
    <Panel
      title="Shortage Risk Alerts (< 75%)"
      description="List of students with critical attendance shortages requiring attention"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="overflow-x-auto max-w-full">
        <Table className="min-w-[400px] text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Roll Number</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead className="w-[100px] text-center">Attendance %</TableHead>
              <TableHead className="w-[100px] text-right">Warning Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowAttendanceStudents.map((stud) => {
              const warning = getWarningLevel(stud.percentage);
              return (
                <TableRow key={stud.rollNumber} className="hover:bg-muted/40">
                  <TableCell className="font-mono font-bold text-rose-600">{stud.rollNumber}</TableCell>
                  <TableCell className="font-bold text-foreground">{stud.name}</TableCell>
                  <TableCell className="text-center font-black text-rose-600 bg-rose-500/5">{stud.percentage}%</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border ${warning.style}`}>
                      {warning.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {lowAttendanceStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground font-semibold">
                  No students below the 75% attendance threshold.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Panel>
  );
}
