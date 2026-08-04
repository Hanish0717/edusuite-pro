import React from "react";
import {
  AvailableCourseItem,
  StudentExamProfile,
  ExamRegistrationItem,
  CourseRegWorkflowStatus,
  ExamRegWorkflowStatus,
  AcademicYearOption,
  YEAR_TO_SEMESTERS_MAP,
} from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Info,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface ExamRegistrationProps {
  profile: StudentExamProfile;
  examRegistrations: ExamRegistrationItem[];
  courses: AvailableCourseItem[];
  courseRegStatus: CourseRegWorkflowStatus;
  examRegStatus: ExamRegWorkflowStatus;
  selectedYear: AcademicYearOption;
  selectedSemester: number;
  onYearChange: (year: AcademicYearOption) => void;
  onSemesterChange: (sem: number) => void;
  onRegisterExam: (id: string) => void;
  onCompleteAllExamReg: () => void;
  onNavigateToCourseReg: () => void;
  onNavigateToHallTicket: () => void;
}

export function ExamRegistration({
  courses,
  examRegistrations,
  courseRegStatus,
  examRegStatus,
  selectedYear,
  selectedSemester,
  onYearChange,
  onSemesterChange,
  onRegisterExam,
  onCompleteAllExamReg,
  onNavigateToCourseReg,
  onNavigateToHallTicket,
}: ExamRegistrationProps) {
  const isCourseRegCompleted = courseRegStatus === "Completed";
  const isExamRegPaid = examRegStatus === "Paid & Registered";
  const availableSemesters = YEAR_TO_SEMESTERS_MAP[selectedYear] || [5, 6];

  // Dynamically filter courses for selected semester
  const filteredCourses = courses.filter((c) => c.semester === selectedSemester);

  return (
    <div className="space-y-6">



      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ACADEMIC FILTERS (3 COLUMNS) */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Filters</h3>

          <div className="space-y-4 text-xs">
            {/* YEAR DROPDOWN */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">Select Year</label>
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value as AcademicYearOption)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* DEPENDENT SEMESTER DROPDOWN */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">Select Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => onSemesterChange(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableSemesters.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* NOTE BOX */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs space-y-1 text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Note</span>
            </div>
            <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
              Registering for an exam requires you to be registered for the course first. Hall tickets are generated based on registered exams.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: COURSE EXAM REGISTRATION (8 COLUMNS) */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Course Exam Registration</h3>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-100 dark:border-blue-900/60">
              Sem {selectedSemester} Exams
            </span>
          </div>

          {/* COURSES CARD GRID */}
          {filteredCourses.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
              No exams scheduled for Semester {selectedSemester} yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((c) => {
                const matchingReg = examRegistrations.find((r) => r.subjectCode === c.code);
                const isPaid = matchingReg?.paymentStatus === "Paid" || (isExamRegPaid && selectedSemester === 5);
                const isRegisteredCourse = c.isRegistered || (isCourseRegCompleted && selectedSemester === 5) || selectedSemester < 5;

                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-blue-600">{c.code}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{c.category === "Core" ? "Normal Subject" : c.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{c.name}</h4>
                      
                      <div className="mt-2 space-y-1 text-xs text-slate-500">
                        <p className="font-mono text-[11px]">Credits: {c.credits.toFixed(1)} &bull; Semester: {c.semester}</p>
                        <p className="text-[11px]">Mentor: <span className="text-blue-600 font-semibold">{c.faculty}</span></p>
                      </div>
                    </div>

                    {isPaid ? (
                      <Button
                        disabled
                        className="w-full h-9 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-default"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Exam Registered (Paid)
                      </Button>
                    ) : !isRegisteredCourse ? (
                      <Button
                        disabled
                        className="w-full h-9 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-0"
                      >
                        Register for Course First
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onRegisterExam(matchingReg?.id || c.id)}
                        className="w-full h-9 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20"
                      >
                        Register for Exam (Pay ₹500)
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
