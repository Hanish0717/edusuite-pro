import React from "react";
import { Download, Calendar, BookOpen, Clock, FileText } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const handleDownloadFile = (title: string, filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${title}`);
  };

  const handleDownloadAcademicCalendar = () => {
    const content = `EDUSUITE PRO COLLEGE OF ENGINEERING & TECHNOLOGY
=====================================================
ACADEMIC CALENDAR 2026 - 2027 (AUTUMN & SPRING SEMESTERS)
=====================================================

1. AUTUMN SEMESTER (SEMESTER V)
- Commencement of Classes: July 15, 2026
- First Internal Assessment: August 25 - August 29, 2026
- Mid-Semester Break: September 15 - September 20, 2026
- Second Internal Assessment: October 20 - October 24, 2026
- Practical & Lab Examinations: November 10 - November 15, 2026
- End-Semester Theory Examinations: November 20 - December 05, 2026

2. SPRING SEMESTER (SEMESTER VI)
- Commencement of Classes: January 05, 2027
- Annual Sports & Cultural Fest: February 18 - February 21, 2027
- Mid-Semester Examinations: March 10 - March 15, 2027
- End-Semester Theory Examinations: May 12 - May 28, 2027

Verified Document — Academic Affairs Office`;
    handleDownloadFile("Academic Calendar 2026-27", "Academic_Calendar_2026_27.pdf", content);
  };

  const handleDownloadHolidayList = () => {
    const content = `EDUSUITE PRO COLLEGE OF ENGINEERING & TECHNOLOGY
=====================================================
OFFICIAL CAMPUS HOLIDAY LIST 2026
=====================================================

1. Independence Day - August 15, 2026 (Saturday)
2. Vinayaka Chaturthi - August 22, 2026 (Saturday)
3. Mahatma Gandhi Jayanti - October 02, 2026 (Friday)
4. Vijayadasami / Dussehra - October 19 - October 21, 2026 (Mon - Wed)
5. Deepavali Break - November 08 - November 10, 2026 (Sun - Tue)
6. Christmas Holiday - December 25, 2026 (Friday)
7. New Year's Day - January 01, 2027 (Friday)
8. Sankranti / Pongal Break - January 13 - January 16, 2027 (Wed - Sat)
9. Republic Day - January 26, 2027 (Tuesday)

Approved by Principal & Management Board`;
    handleDownloadFile("Official Holiday List 2026", "Official_Holiday_List_2026.pdf", content);
  };

  const handleDownloadExamSchedule = () => {
    const content = `EDUSUITE PRO COLLEGE OF ENGINEERING & TECHNOLOGY
=====================================================
MID-SEMESTER EXAMINATION SCHEDULE 2026 (B.TECH SEM V)
=====================================================

- Date: Aug 25, 2026 | Time: 10:00 AM - 12:00 PM | Subject: Data Structures & Algorithms (CS501)
- Date: Aug 26, 2026 | Time: 10:00 AM - 12:00 PM | Subject: Database Management Systems (CS502)
- Date: Aug 27, 2026 | Time: 10:00 AM - 12:00 PM | Subject: Operating Systems & Architecture (CS503)
- Date: Aug 28, 2026 | Time: 10:00 AM - 12:00 PM | Subject: Computer Networks & Security (CS504)
- Date: Aug 29, 2026 | Time: 10:00 AM - 12:00 PM | Subject: Object Oriented System Design (OE311)

Examination Cell & Controller of Exams`;
    handleDownloadFile("Mid-Sem Exam Schedule", "Mid_Sem_Exam_Schedule_2026.pdf", content);
  };

  const handleViewTimetable = () => {
    toast.info("Navigating to Student Class Timetable...");
    navigate({ to: "/student/timetable" as any });
  };

  const handleOpenHandbook = () => {
    const content = `EDUSUITE PRO COLLEGE OF ENGINEERING & TECHNOLOGY
=====================================================
STUDENT CODE OF CONDUCT & ACADEMIC HANDBOOK 2026
=====================================================

CHAPTER 1: ACADEMIC INTEGRITY & ATTENDANCE
- Mandatory minimum 75% attendance criteria for exam eligibility.
- Plagiarism in assignments or lab submissions leads to zero grade.

CHAPTER 2: CAMPUS RULES & ETHICS
- Identity card must be worn around the neck at all times.
- Zero tolerance policy for ragging, bullying, or harassment.

CHAPTER 3: LIBRARY & LABORATORY POLICIES
- Books borrowed must be returned within 14 calendar days.
- Lab equipment damage caused by negligence will be fined.

Student Affairs & Dean Office`;
    handleDownloadFile("Student Handbook", "Student_Code_of_Conduct_Handbook.pdf", content);
  };

  const actions = [
    { title: "Download Academic Calendar", icon: Calendar, action: handleDownloadAcademicCalendar },
    { title: "Download Holiday List", icon: Download, action: handleDownloadHolidayList },
    { title: "Download Exam Schedule", icon: FileText, action: handleDownloadExamSchedule },
    { title: "View Timetable", icon: Clock, action: handleViewTimetable },
    { title: "Open Student Handbook", icon: BookOpen, action: handleOpenHandbook },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5 text-primary" /> Quick Downloads & Actions
      </h3>
      <div className="space-y-1.5">
        {actions.map((act, index) => {
          const Icon = act.icon;
          return (
            <button
              key={index}
              onClick={act.action}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-primary/10 hover:border-primary/40 text-xs font-medium text-foreground transition-all group text-left cursor-pointer"
            >
              <span className="flex items-center gap-2 line-clamp-1">
                <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                {act.title}
              </span>
              <Download className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
