import { Mail, Phone, Clock, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { StudentDetails } from "@/data/faculty-mock-data";

interface StudentCardProps {
  student: StudentDetails;
  onClick: () => void;
}

export function StudentCard({ student, onClick }: StudentCardProps) {
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
    return "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse";
  };

  return (
    <Card
      onClick={onClick}
      className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer group"
    >
      <div className="absolute right-0 top-0 h-16 w-16 bg-muted/10 blur-xl" />
      <CardContent className="p-5 space-y-4 text-xs">
        {/* Header Roster row */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="size-10 rounded-xl shrink-0 border border-border">
              <AvatarImage src="" />
              <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary text-[0.72rem]">
                {student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h5 className="font-extrabold text-[0.78rem] text-foreground leading-snug group-hover:text-primary transition-colors truncate">
                {student.name}
              </h5>
              <p className="font-mono text-[0.62rem] text-muted-foreground mt-0.5 font-bold">
                {student.rollNumber} &middot; Section {student.section}
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border shrink-0 ${getBadgeStyle(student.status)}`}>
            {student.status}
          </Badge>
        </div>

        {/* Contacts info */}
        <div className="space-y-1.5 pt-1 text-[0.65rem] text-muted-foreground font-medium">
          <p className="flex items-center gap-1.5"><Mail className="size-3.5 text-primary/60 shrink-0" /> <span className="truncate">{student.email}</span></p>
          <p className="flex items-center gap-1.5"><Phone className="size-3.5 text-primary/60 shrink-0" /> {student.mobile}</p>
        </div>

        {/* Attendance Coverage bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[0.6rem] font-bold text-muted-foreground">
            <span>Class Attendance</span>
            <span className={getAttendanceStyle(student.attendance.percentage)}>{student.attendance.percentage}%</span>
          </div>
          <Progress value={student.attendance.percentage} className="h-1.5 bg-primary/10 [&>div]:bg-brand-gradient" />
        </div>

        {/* Mentorship / grade badge indicators */}
        <div className="pt-3 border-t border-border/40 flex justify-between items-center text-[0.62rem] text-muted-foreground font-semibold">
          {student.isMentee ? (
            <Badge variant="secondary" className="rounded-lg bg-indigo-500/5 text-indigo-600 border border-indigo-500/10 text-[0.58rem] py-0 px-2 font-extrabold">
              Mentee Group
            </Badge>
          ) : (
            <span className="text-[0.62rem] text-muted-foreground">Advisor Group</span>
          )}
          <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border ${getGradeStyle(student.performance.overallGrade)}`}>
            Grade: {student.performance.overallGrade}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
