import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Panel } from "@/components/dashboard/panel";

interface AttendanceSummaryProps {
  attendance: {
    totalClasses: number;
    present: number;
    absent: number;
    percentage: number;
  };
}

export function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  const isShortage = attendance.percentage < 75;

  return (
    <Panel
      title="Attendance Coverage Report"
      description="Syllabus hours and cumulative class presence summary"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-6">
        {/* Present counts ratio */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/40 text-center font-bold">
          <div>
            <p className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">Total Classes</p>
            <p className="text-base font-extrabold mt-1 text-foreground">{attendance.totalClasses} hrs</p>
          </div>
          <div>
            <p className="text-[0.6rem] uppercase tracking-wider text-emerald-600">Present</p>
            <p className="text-base font-extrabold mt-1 text-emerald-600">{attendance.present} hrs</p>
          </div>
          <div>
            <p className="text-[0.6rem] uppercase tracking-wider text-rose-600">Absent</p>
            <p className="text-base font-extrabold mt-1 text-rose-600">{attendance.absent} hrs</p>
          </div>
        </div>

        {/* Coverage progress */}
        <div className="space-y-2">
          <div className="flex justify-between font-bold">
            <span className="text-muted-foreground flex items-center gap-1"><Clock className="size-3.5" /> Total Percentage Index</span>
            <span className={isShortage ? "text-rose-600" : "text-emerald-600"}>{attendance.percentage}%</span>
          </div>
          <Progress value={attendance.percentage} className="h-2 bg-primary/10 [&>div]:bg-brand-gradient" />
        </div>

        {/* Warning Indicator */}
        {isShortage ? (
          <div className="flex items-start gap-2 p-3.5 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-[0.65rem] text-rose-600 font-semibold leading-relaxed">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold">Attendance Shortage Warning</p>
              <p className="text-[0.62rem] text-rose-500 mt-0.5">This student's attendance is below the 75% threshold. Condonation or shortage warning letter required.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 p-3.5 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl text-[0.65rem] text-emerald-600 font-semibold leading-relaxed">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold">Attendance Profile Safe</p>
              <p className="text-[0.62rem] text-emerald-500 mt-0.5">No attendance shortage flags detected for the active academic semester.</p>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
