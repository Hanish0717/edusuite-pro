import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Building,
  Sparkles,
  Info,
  CalendarCheck,
  Palmtree,
  CalendarDays,
} from "lucide-react";

export interface DayAttendanceDetail {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  dayName: string;
  isToday: boolean;
  isFuture: boolean;
  status: "Present" | "Absent" | "Holiday" | "No Classes";
  checkIn?: string;
  checkOut?: string;
  attendancePct?: number;
  remarks?: string;
  periods?: {
    id: string;
    period: string;
    timing: string;
    subjectCode: string;
    subjectName: string;
    facultyName: string;
    room: string;
    status: "Present" | "Absent" | "Holiday" | "Pending";
  }[];
}

interface DynamicAttendanceCalendarProps {
  selectedYear?: string;
  selectedSemester?: number;
  onDateClick?: (detail: DayAttendanceDetail) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AttendanceCalendar({
  selectedYear = "3rd Year",
  selectedSemester = 5,
  onDateClick,
}: DynamicAttendanceCalendarProps) {
  // Today's date context (Defaulting to August 2026 or current date)
  const today = useMemo(() => new Date(2026, 7, 5), []); // 2026-08-05
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1)); // August 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Selected date state for details view below calendar
  const [selectedDateDetail, setSelectedDateDetail] = useState<DayAttendanceDetail | null>(null);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate dynamic days array for active month
  const monthDays = useMemo(() => {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const days: (DayAttendanceDetail | null)[] = [];

    // Padding for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    // Populate actual days
    for (let d = 1; d <= totalDays; d++) {
      const dObj = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayOfWeek = dObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const isToday =
        dObj.getFullYear() === today.getFullYear() &&
        dObj.getMonth() === today.getMonth() &&
        dObj.getDate() === today.getDate();

      const isFuture = dObj.getTime() > today.getTime();

      let status: "Present" | "Absent" | "Holiday" | "No Classes" = "Present";
      let title: string | undefined = undefined;

      if (isWeekend) {
        status = "No Classes";
        title = dayOfWeek === 0 ? "Sunday Rest Day" : "Saturday Weekend";
      } else if (d === 15) {
        status = "Holiday";
        title = "Independence Day Holiday";
      } else if (d === 8 || d === 22) {
        status = "Absent";
      } else {
        status = "Present";
      }

      // Details for periods & timing
      let periods: DayAttendanceDetail["periods"] = [];
      let checkIn: string | undefined = undefined;
      let checkOut: string | undefined = undefined;
      let attendancePct: number | undefined = undefined;
      let remarks: string | undefined = undefined;

      if (status === "Present") {
        checkIn = "08:55 AM";
        checkOut = "04:30 PM";
        attendancePct = 100;
        remarks = "100% On-time biometric check-in recorded at Main Gate Reader #03.";
        periods = [
          {
            id: `p1-${d}`,
            period: "Period 1",
            timing: "09:30 AM - 10:30 AM",
            subjectCode: selectedSemester === 5 ? "CS301" : "CS308",
            subjectName: selectedSemester === 5 ? "Computer Networks" : "Machine Learning",
            facultyName: "Dr. A. K. Sharma",
            room: "Block A - 301",
            status: "Present",
          },
          {
            id: `p2-${d}`,
            period: "Period 2",
            timing: "10:30 AM - 11:30 AM",
            subjectCode: selectedSemester === 5 ? "CS302" : "CS309",
            subjectName: selectedSemester === 5 ? "Database Management Systems" : "Deep Learning Lab",
            facultyName: "Prof. S. R. Rao",
            room: "Block A - 301",
            status: "Present",
          },
          {
            id: `p3-${d}`,
            period: "Period 3",
            timing: "11:30 AM - 12:30 PM",
            subjectCode: selectedSemester === 5 ? "OE311" : "CS310",
            subjectName: selectedSemester === 5 ? "Intellectual Property Rights" : "Cloud Security",
            facultyName: "Dr. V. N. Swamy",
            room: "Block B - 204",
            status: "Present",
          },
          {
            id: `p4-${d}`,
            period: "Period 4",
            timing: "01:30 PM - 02:30 PM",
            subjectCode: selectedSemester === 5 ? "CS305" : "CS312",
            subjectName: selectedSemester === 5 ? "Software Engineering" : "Agile Development",
            facultyName: "Mr. M. Praveen",
            room: "Lab Block - 04",
            status: "Present",
          },
        ];
      } else if (status === "Absent") {
        checkIn = "N/A";
        checkOut = "N/A";
        attendancePct = 0;
        remarks = "Marked absent during morning roll-call. No leave application filed.";
        periods = [
          {
            id: `p1-${d}`,
            period: "Period 1",
            timing: "09:30 AM - 10:30 AM",
            subjectCode: "CS301",
            subjectName: "Computer Networks",
            facultyName: "Dr. A. K. Sharma",
            room: "Block A - 301",
            status: "Absent",
          },
          {
            id: `p2-${d}`,
            period: "Period 2",
            timing: "10:30 AM - 11:30 AM",
            subjectCode: "CS302",
            subjectName: "Database Management Systems",
            facultyName: "Prof. S. R. Rao",
            room: "Block A - 301",
            status: "Absent",
          },
        ];
      } else if (status === "Holiday") {
        remarks = title || "Official Institutional Holiday";
      } else {
        remarks = "No academic classes scheduled on weekends.";
      }

      const dayDetail: DayAttendanceDetail = {
        dateStr,
        dayNumber: d,
        dayName: WEEKDAYS[dayOfWeek],
        isToday,
        isFuture,
        status: isFuture ? "No Classes" : status,
        checkIn: isFuture ? undefined : checkIn,
        checkOut: isFuture ? undefined : checkOut,
        attendancePct: isFuture ? undefined : attendancePct,
        remarks: isFuture ? "Future date — attendance pending" : remarks,
        periods: isFuture ? [] : periods,
      };

      days.push(dayDetail);
    }

    return days;
  }, [year, month, today, selectedSemester]);

  // Calculate monthly summary KPIs (excluding future & weekends)
  const summaryKPIs = useMemo(() => {
    let workingDays = 0;
    let daysPresent = 0;
    let daysAbsent = 0;

    monthDays.forEach((day) => {
      if (day && !day.isFuture && day.status !== "No Classes" && day.status !== "Holiday") {
        workingDays++;
        if (day.status === "Present") daysPresent++;
        if (day.status === "Absent") daysAbsent++;
      }
    });

    const pct = workingDays > 0 ? Number(((daysPresent / workingDays) * 100).toFixed(1)) : 100;

    return {
      workingDays,
      daysPresent,
      daysAbsent,
      pct,
    };
  }, [monthDays]);

  // Handle tile click
  const handleTileClick = (day: DayAttendanceDetail) => {
    setSelectedDateDetail(day);
    if (onDateClick) onDateClick(day);
  };

  const getTileBgClass = (day: DayAttendanceDetail) => {
    if (day.isFuture) return "bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed";

    switch (day.status) {
      case "Present":
        return "bg-emerald-500 text-white hover:bg-emerald-600 shadow-xs cursor-pointer";
      case "Absent":
        return "bg-red-500 text-white hover:bg-red-600 shadow-xs cursor-pointer";
      case "Holiday":
        return "bg-amber-500 text-white hover:bg-amber-600 shadow-xs cursor-pointer";
      case "No Classes":
        return "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 cursor-pointer";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. ACADEMIC ATTENDANCE CALENDAR HEADER CARD & MONTH NAVIGATOR */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Academic Attendance Calendar
                </h3>
                <Badge variant="outline" className="font-mono text-xs text-purple-600 border-purple-200">
                  {selectedYear} &middot; Sem {selectedSemester}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic monthly attendance grid with period logs & check-in analytics.
              </p>
            </div>
          </div>

          {/* MONTH & YEAR CONTROLS */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
              className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            >
              <ChevronLeft className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </Button>

            <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {MONTH_NAMES[month]} {year}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            >
              <ChevronRight className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </Button>
          </div>
        </div>

        {/* 2. SUMMARY METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Working Days</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">{summaryKPIs.workingDays} Days</div>
            <span className="text-[10px] text-slate-500 font-mono">Conducted this month</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Days Present</span>
            <div className="text-xl font-extrabold text-emerald-600 font-mono">{summaryKPIs.daysPresent} Days</div>
            <span className="text-[10px] text-emerald-600/80 font-mono">Attended</span>
          </div>

          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 space-y-0.5">
            <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider block">Days Absent</span>
            <div className="text-xl font-extrabold text-red-600 font-mono">{summaryKPIs.daysAbsent} Days</div>
            <span className="text-[10px] text-red-600/80 font-mono">Unexcused</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-0.5">
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">Attendance %</span>
            <div className="text-xl font-extrabold text-purple-600 font-mono">{summaryKPIs.pct}%</div>
            <Badge className="bg-purple-600 text-white text-[9px] px-1.5 py-0">Monthly Pace</Badge>
          </div>
        </div>

        {/* 3. COLOR LEGEND BAR */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span className="text-[11px] font-bold uppercase text-slate-400">Color Legend:</span>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Present</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Absent</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Holiday</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-400"></span> No Classes</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-100"></span> Today</div>
          </div>
        </div>
      </div>

      {/* 4. CALENDAR GRID TILES */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        {/* WEEKDAYS HEADER */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        {/* DAY TILES */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-16 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-transparent" />;
            }

            const isSelected = selectedDateDetail?.dateStr === day.dateStr;

            return (
              <button
                key={day.dateStr}
                disabled={day.isFuture}
                onClick={() => handleTileClick(day)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-between h-16 transition-all relative ${
                  day.isToday ? "ring-2 ring-blue-500 font-bold" : ""
                } ${isSelected ? "scale-105 ring-2 ring-purple-600 shadow-md" : ""} ${getTileBgClass(day)}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-extrabold">{day.dayNumber}</span>
                  {day.isToday && (
                    <span className="text-[8px] uppercase bg-blue-600 text-white font-mono px-1 rounded">Today</span>
                  )}
                </div>

                <span className="text-[9px] font-mono opacity-90 truncate max-w-full font-semibold">
                  {day.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. CLICKED DAY DETAILS SECTION */}
      {selectedDateDetail && (
        <div className="p-6 rounded-2xl border border-purple-200 dark:border-purple-950 bg-gradient-to-br from-purple-50/40 via-white to-purple-50/20 dark:from-purple-950/20 dark:via-slate-900 dark:to-purple-950/10 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-purple-600 uppercase block">
                {selectedDateDetail.dayName} &middot; {selectedDateDetail.dateStr}
              </span>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                Day Attendance Breakdown
              </h4>
            </div>

            <Badge
              className={`text-xs px-3 py-1 font-bold ${
                selectedDateDetail.status === "Present"
                  ? "bg-emerald-500 text-white"
                  : selectedDateDetail.status === "Absent"
                  ? "bg-red-500 text-white"
                  : selectedDateDetail.status === "Holiday"
                  ? "bg-amber-500 text-white"
                  : "bg-slate-400 text-white"
              }`}
            >
              {selectedDateDetail.status === "Present" && "✅ Present"}
              {selectedDateDetail.status === "Absent" && "❌ Absent"}
              {selectedDateDetail.status === "Holiday" && "🏖 Holiday"}
              {selectedDateDetail.status === "No Classes" && "📅 No Classes"}
            </Badge>
          </div>

          {/* DAY METRICS STRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Check-in Time</span>
              <strong className="text-slate-900 dark:text-white font-bold text-sm">
                {selectedDateDetail.checkIn || "N/A"}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Check-out Time</span>
              <strong className="text-slate-900 dark:text-white font-bold text-sm">
                {selectedDateDetail.checkOut || "N/A"}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Day Attendance %</span>
              <strong className="text-purple-600 font-bold text-sm font-mono">
                {selectedDateDetail.attendancePct !== undefined ? `${selectedDateDetail.attendancePct}%` : "N/A"}
              </strong>
            </div>
          </div>

          {/* REMARKS / NOTES */}
          {selectedDateDetail.remarks && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-300 font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-purple-600 shrink-0" />
              <span>{selectedDateDetail.remarks}</span>
            </div>
          )}

          {/* PERIODS / SUBJECTS BREAKDOWN */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-purple-600" /> Scheduled Academic Periods
            </h5>

            {!selectedDateDetail.periods || selectedDateDetail.periods.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-xs text-slate-400">
                No attendance record available for this date.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedDateDetail.periods.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-purple-600 text-[11px]">{p.period}</span>
                        <span className="text-[10px] text-slate-400">({p.timing})</span>
                      </div>
                      <h6 className="font-bold text-slate-900 dark:text-white mt-0.5">{p.subjectCode} - {p.subjectName}</h6>
                      <p className="text-[10px] text-slate-500">Faculty: {p.facultyName} &middot; {p.room}</p>
                    </div>

                    <Badge
                      className={
                        p.status === "Present"
                          ? "bg-emerald-500/10 text-emerald-600 font-bold"
                          : "bg-red-500/10 text-red-600 font-bold"
                      }
                    >
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
