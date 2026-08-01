import React, { useState } from "react";
import { StudentInfo, AcademicOverview, TimetableSlot, TaskItem, EventItem, ActivityItem } from "./types";
import { generateMockNotices } from "@/components/notice-board/mock-data";
import { NoticeItem } from "@/components/notice-board/types";
import { DashboardHeader } from "./dashboard-header";
import { AcademicOverviewCards } from "./academic-overview";
import { TodayTimetable } from "./today-timetable";
import { MyTasks } from "./my-tasks";
import { NoticeWidget } from "./notice-widget";
import { EventsWidget } from "./events-widget";
import { AttendanceWidget } from "./attendance-widget";
import { ExamWidget } from "./exam-widget";
import { FinanceWidget } from "./finance-widget";
import { LMSWidget } from "./lms-widget";
import { LibraryWidget } from "./library-widget";
import { QuickActions } from "./quick-actions";
import { RecentActivityTimeline } from "./recent-activity";
import { CalendarWidget } from "./calendar-widget";
import { NoticeDetailDrawer } from "@/components/notice-board/notice-detail-drawer";
import { useNavigate } from "@tanstack/react-router";

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  // Mock Student Data
  const studentInfo: StudentInfo = {
    name: "Sai Teja",
    rollNo: "22CS101",
    department: "Computer Science & Engineering",
    semester: "Semester V",
    academicYear: "2026-2027",
    todayDate: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };

  const academicOverviewData: AcademicOverview = {
    attendancePercentage: 86.4,
    cgpa: 8.85,
    currentSemester: "Semester V",
    creditsEarned: 112,
    totalCredits: 160,
    pendingFees: 15000,
    issuedBooksCount: 2,
    upcomingExamsCount: 4,
    pendingAssignmentsCount: 3,
  };

  const todayTimetableSlots: TimetableSlot[] = [
    { id: "1", time: "09:30 AM - 10:30 AM", subject: "Design & Analysis of Algorithms", code: "CS501", faculty: "Dr. A. K. Sharma", room: "LT-201", status: "completed" },
    { id: "2", time: "10:30 AM - 11:30 AM", subject: "Database Management Systems", code: "CS502", faculty: "Prof. S. R. Rao", room: "LT-201", status: "current" },
    { id: "3", time: "11:45 AM - 01:15 PM", subject: "Web Technologies Lab (Batch A)", code: "CS505P", faculty: "Dr. Meera Nair", room: "Lab-3", status: "upcoming" },
    { id: "4", time: "02:15 PM - 03:15 PM", subject: "Artificial Intelligence & ML", code: "CS503", faculty: "Dr. V. K. Gupta", room: "LT-203", status: "upcoming" },
  ];

  const actionTasks: TaskItem[] = [
    { id: "t1", title: "Submit DBMS Assignment #3", category: "LMS", dueDate: "Tomorrow, 11:59 PM", urgent: true, linkUrl: "/student/lms" },
    { id: "t2", title: "Mid-Sem Exam Form Verification", category: "Examinations", dueDate: "Aug 05, 2026", urgent: true, linkUrl: "/student/examinations" },
    { id: "t3", title: "Odd Semester Course Elective Opt-in", category: "Academics", dueDate: "Aug 08, 2026", urgent: false, linkUrl: "/student/lms" },
    { id: "t4", title: "Pay Pending Tuition Fee Clearance", category: "Finance", dueDate: "Aug 20, 2026", urgent: false, linkUrl: "/student/finance" },
    { id: "t5", title: "Return Borrowed Book: 'Clean Code'", category: "Library", dueDate: "Aug 14, 2026", urgent: false, linkUrl: "/settings" },
    { id: "t6", title: "Download Printed Exam Hall Ticket", category: "Examinations", dueDate: "Aug 15, 2026", urgent: false, linkUrl: "/student/examinations" },
  ];

  const recentNotices = generateMockNotices().slice(0, 5);

  const upcomingEvents: EventItem[] = [
    { id: "e1", title: "Mid Semester Theory Examinations", type: "Exam", date: "Aug 18, 2026", location: "Exam Blocks A & B" },
    { id: "e2", title: "TCS Campus Recruitment Drive", type: "Placement", date: "Aug 12, 2026", location: "Auditorium Hall" },
    { id: "e3", title: "InnovateX 24-Hour AI Hackathon", type: "Hackathon", date: "Aug 22, 2026", location: "CS Seminar Hall" },
    { id: "e4", title: "AWS Cloud Architecture Seminar", type: "Seminar", date: "Aug 25, 2026", location: "Virtual Teams" },
    { id: "e5", title: "Independence Day Institutional Holiday", type: "Holiday", date: "Aug 15, 2026", location: "Campus Ground" },
  ];

  const recentActivities: ActivityItem[] = [
    { id: "a1", title: "Attendance Marked: DBMS (Present)", timestamp: "Today 10:30 AM", type: "attendance" },
    { id: "a2", title: "Notice Read: Semester V Class Timetable", timestamp: "Today 08:15 AM", type: "notice" },
    { id: "a3", title: "Assignment Submitted: Web Tech Lab 2", timestamp: "Yesterday 11:45 PM", type: "assignment" },
    { id: "a4", title: "Hall Ticket Downloaded: Mid-Sem 2026", timestamp: "Yesterday 04:20 PM", type: "exam" },
    { id: "a5", title: "Fee Paid: Hostel Mess Advance (₹12,000)", timestamp: "3 days ago", type: "fee" },
    { id: "a6", title: "Book Issued: Operating System Concepts", timestamp: "4 days ago", type: "library" },
  ];

  const handleNavigate = (url: string) => {
    navigate({ to: url as any });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Welcome Header */}
      <DashboardHeader
        student={studentInfo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Academic Overview Cards Grid */}
      <AcademicOverviewCards data={academicOverviewData} />

      {/* 3. Quick Actions Widget */}
      <QuickActions onNavigate={handleNavigate} />

      {/* 4. Main Two Column Grid: Left Feed + Right Snapshots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Timetable */}
          <TodayTimetable
            slots={todayTimetableSlots}
            onViewFullTimetable={() => handleNavigate("/student/timetable")}
          />

          {/* Action Tasks */}
          <MyTasks tasks={actionTasks} onNavigate={handleNavigate} />

          {/* Announcements / Notices Widget */}
          <NoticeWidget
            notices={recentNotices}
            onViewAll={() => handleNavigate("/communication")}
            onSelectNotice={(notice) => setSelectedNotice(notice)}
          />

          {/* Module Snapshots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AttendanceWidget
              percentage={academicOverviewData.attendancePercentage}
              classesNeeded={0}
              onViewAttendance={() => handleNavigate("/student/timetable")}
            />
            <ExamWidget onOpenExamination={() => handleNavigate("/student/examinations")} />
            <FinanceWidget
              paidAmount={75000}
              pendingAmount={academicOverviewData.pendingFees}
              scholarshipAmount={25000}
              dueDate="Aug 20, 2026"
              onPayNow={() => handleNavigate("/student/finance")}
            />
            <LMSWidget onOpenLMS={() => handleNavigate("/student/lms")} />
          </div>
        </div>

        {/* Right 1 Column */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <EventsWidget events={upcomingEvents} />

          {/* Library Snapshot */}
          <LibraryWidget onOpenLibrary={() => handleNavigate("/settings")} />

          {/* Mini Academic Calendar */}
          <CalendarWidget />

          {/* Recent Activity Timeline */}
          <RecentActivityTimeline activities={recentActivities} />
        </div>
      </div>

      {/* Notice Detail Drawer */}
      <NoticeDetailDrawer
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
        onToggleBookmark={() => {}}
      />
    </div>
  );
};
