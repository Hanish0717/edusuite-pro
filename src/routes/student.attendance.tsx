import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarCheck,
  BookOpen,
  Clock,
  Calendar,
  FileText,
  BarChart2,
  Filter,
} from "lucide-react";
import {
  AcademicYearOption,
  AttendanceTab,
  SubjectAttendanceItem,
  YEAR_TO_SEMESTERS_MAP,
} from "@/components/student-attendance/types";
import {
  MOCK_STUDENT_ATTENDANCE_PROFILE,
  MOCK_ALL_SUBJECTS,
  MOCK_TODAY_SCHEDULE,
  MOCK_ATTENDANCE_HISTORY,
  MOCK_CALENDAR_ITEMS,
  MOCK_LEAVE_BALANCE,
  MOCK_LEAVE_REQUESTS,
} from "@/components/student-attendance/mock-data";
import { AttendanceSummary } from "@/components/student-attendance/attendance-summary";
import { SubjectAttendance } from "@/components/student-attendance/subject-attendance";
import { AttendanceHistory } from "@/components/student-attendance/attendance-history";
import { AttendanceCalendar } from "@/components/student-attendance/attendance-calendar";
import { LeaveManagement } from "@/components/student-attendance/leave-management";
import { AttendanceReports } from "@/components/student-attendance/reports";
import { AttendanceDrawer } from "@/components/student-attendance/attendance-drawer";
import { LeaveModal } from "@/components/student-attendance/leave-modal";

export const Route = createFileRoute("/student/attendance")({
  head: () => ({
    meta: [{ title: "Attendance Management — EduSuite Pro" }],
  }),
  component: StudentAttendancePage,
});

function StudentAttendancePage() {
  const [activeTab, setActiveTab] = useState<AttendanceTab>("summary");
  
  // Year -> Semester dynamic state synchronization
  const [selectedYear, setSelectedYear] = useState<AcademicYearOption>("3rd Year");
  const availableSemesters = YEAR_TO_SEMESTERS_MAP[selectedYear] || [5, 6];
  const [selectedSemester, setSelectedSemester] = useState<number>(availableSemesters[0] ?? 5);

  const [selectedSubject, setSelectedSubject] = useState<SubjectAttendanceItem | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Dynamic leave requests & balance state
  const [leaveRequests, setLeaveRequests] = useState(MOCK_LEAVE_REQUESTS);
  const [leaveBalance, setLeaveBalance] = useState(MOCK_LEAVE_BALANCE);

  // Dynamic subjects filter based on selected Year & Semester
  const displayedSubjects = React.useMemo(() => {
    const matched = MOCK_ALL_SUBJECTS.filter(
      (sub) => sub.academicYear === selectedYear && sub.semester === selectedSemester
    );
    if (matched.length > 0) return matched;
    const semMatched = MOCK_ALL_SUBJECTS.filter((sub) => sub.semester === selectedSemester);
    if (semMatched.length > 0) return semMatched;
    return MOCK_ALL_SUBJECTS.filter((s) => s.semester === 5);
  }, [selectedYear, selectedSemester]);

  // Dynamic student profile metrics based on selected semester subjects
  const currentProfile = React.useMemo(() => {
    let totalConducted = 0;
    let totalAttended = 0;
    let totalAbsent = 0;
    let totalLeave = 0;

    displayedSubjects.forEach((sub) => {
      totalConducted += sub.conducted;
      totalAttended += sub.attended;
      totalAbsent += sub.absent;
      totalLeave += sub.leave;
    });

    const pct = totalConducted > 0 ? Number(((totalAttended / totalConducted) * 100).toFixed(1)) : 85.0;

    return {
      ...MOCK_STUDENT_ATTENDANCE_PROFILE,
      academicYear: selectedYear,
      semester: selectedSemester,
      overallAttendancePct: pct,
      presentClasses: totalAttended,
      absentClasses: totalAbsent,
      leaveClasses: totalLeave,
    };
  }, [displayedSubjects, selectedYear, selectedSemester]);

  const handleYearChange = (year: AcademicYearOption) => {
    setSelectedYear(year);
    const newSems = YEAR_TO_SEMESTERS_MAP[year] || [5, 6];
    setSelectedSemester(newSems[0] ?? 5);
  };

  const handleApplyLeave = (newLeave: {
    leaveType: "Casual Leave" | "Medical Leave" | "Emergency Leave" | "On Duty (OD)";
    fromDate: string;
    toDate: string;
    reason: string;
    emergencyContact?: string;
    documentName?: string;
  }) => {
    const created: any = {
      id: `LV-2025-0${Math.floor(40 + Math.random() * 50)}`,
      leaveType: newLeave.leaveType,
      reason: newLeave.reason,
      appliedDate: "Jan 22, 2025",
      fromDate: newLeave.fromDate,
      toDate: newLeave.toDate,
      days: 1,
      status: "Pending",
      approvedBy: "Awaiting Advisor Review",
      remarks: "Under review by Faculty Advisor",
      documentName: newLeave.documentName,
      emergencyContact: newLeave.emergencyContact,
    };

    setLeaveRequests((prev) => [created, ...prev]);
    setLeaveBalance((prev) => ({
      ...prev,
      pending: prev.pending + 1,
      availableLeaves: Math.max(prev.availableLeaves - 1, 0),
    }));
  };

  const tabsConfig = [
    { id: "summary", label: "Attendance Summary", icon: CalendarCheck },
    { id: "subject-attendance", label: "Subject Attendance", icon: BookOpen },
    { id: "history", label: "Attendance History", icon: Clock },
    { id: "leave-management", label: "Leave Management", icon: FileText },
  ] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. ACADEMIC YEAR -> SEMESTER DYNAMIC FILTER HEADER BAR */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0b193c]/10 text-[#0b193c] dark:text-blue-400">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Scope Filter</h3>
            <p className="text-xs text-slate-500">Select Academic Year to automatically update Semester options</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* YEAR DROPDOWN */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value as AcademicYearOption)}
              className="h-9 text-xs px-3 font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0b193c]"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* SEMESTER DROPDOWN */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="h-9 text-xs px-3 font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0b193c]"
            >
              {availableSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. SUBMODULE TABS NAVIGATION */}
      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="flex items-center space-x-6 min-w-max">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AttendanceTab)}
                className={`py-3.5 px-1 font-semibold text-xs transition-all flex items-center gap-2 border-b-2 ${
                  isActive
                    ? "border-[#0b193c] text-[#0b193c] dark:border-blue-400 dark:text-blue-400 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE SUBMODULE TAB CONTENT */}
      <div>
        {activeTab === "summary" && (
          <AttendanceSummary
            profile={currentProfile}
            schedule={MOCK_TODAY_SCHEDULE}
            subjects={displayedSubjects}
            onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === "subject-attendance" && (
          <SubjectAttendance
            subjects={displayedSubjects}
            onSelectSubject={setSelectedSubject}
          />
        )}

        {activeTab === "history" && (
          <AttendanceHistory logs={MOCK_ATTENDANCE_HISTORY} />
        )}

        {activeTab === "leave-management" && (
          <LeaveManagement
            balance={leaveBalance}
            leaveRequests={leaveRequests}
            onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
          />
        )}
      </div>

      {/* SUBJECT DETAILS DRAWER */}
      <AttendanceDrawer
        subject={selectedSubject}
        onClose={() => setSelectedSubject(null)}
      />

      {/* APPLY LEAVE MODAL */}
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmitLeave={handleApplyLeave}
      />

    </div>
  );
}
