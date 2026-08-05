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
  CheckSquare,
  FileCheck,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { isCourseNptelExempted } from "./nptel-service";

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
  nptelDeclarations?: Record<string, {
    fileName: string;
    fileSize: string;
    comments: string;
    pdfUrl: string;
    isNptel: boolean;
    verificationStatus?: string;
  }>;
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
  nptelDeclarations = {},
}: ExamRegistrationProps) {
  const isCourseRegCompleted = courseRegStatus === "Completed";
  const isExamRegPaid = examRegStatus === "Paid & Registered";
  const availableSemesters = YEAR_TO_SEMESTERS_MAP[selectedYear] || [5, 6];

  // Dynamically filter courses for selected semester - registered courses
  const filteredCourses = courses.filter((c) => c.semester === selectedSemester && c.isRegistered);

  // Separate exam-eligible courses vs NPTEL exempted courses
  const nptelExemptedCourses = filteredCourses.filter((c) => c.isNptel && isCourseNptelExempted(c.id, nptelDeclarations));
  const examEligibleCourses = filteredCourses.filter((c) => !(c.isNptel && isCourseNptelExempted(c.id, nptelDeclarations)));

  const allExamRegistered = examEligibleCourses.length > 0 && examEligibleCourses.every((c) => {
    const reg = examRegistrations.find((r) => r.subjectCode === c.code);
    return reg?.status === "Registered" || isExamRegPaid;
  });

  return (
    <div className="space-y-6">
      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ACADEMIC FILTERS (4 COLUMNS) */}
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

          {/* NPTEL EXEMPTION SUMMARY WIDGET */}
          {nptelExemptedCourses.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>NPTEL Credit Transfer Exemption</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300">
                <strong>{nptelExemptedCourses.length} NPTEL course(s)</strong> have verified certificates and are automatically <strong>excluded</strong> from written exams and hall tickets.
              </p>
            </div>
          )}

          {/* NOTE BOX */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs space-y-1 text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Exam Registration Rules</span>
            </div>
            <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
              Click <strong>"Register All Eligible Courses"</strong> to finalize exam registration for all non-exempted semester courses.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: COURSE EXAM REGISTRATION (8 COLUMNS) */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          
          {/* HEADER BAR WITH REGISTER ALL BUTTON */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Course Exam Registration</h3>
                <span className="text-[11px] text-slate-400 font-medium">Sem {selectedSemester} &middot; {examEligibleCourses.length} Exam-Eligible Subject(s)</span>
              </div>
            </div>

            {/* REGISTER ALL ELIGIBLE COURSES ACTION BUTTON */}
            {examEligibleCourses.length > 0 && (
              <Button
                onClick={onCompleteAllExamReg}
                size="sm"
                disabled={allExamRegistered}
                className={`text-xs font-bold rounded-xl gap-2 shadow-sm transition-all ${
                  allExamRegistered
                    ? "bg-emerald-600 text-white cursor-default opacity-100"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <CheckSquare className="h-4 w-4" />
                <span>{allExamRegistered ? "All Courses Registered ✓" : "Register All Eligible Courses"}</span>
              </Button>
            )}
          </div>

          {/* COURSES CARD GRID */}
          {filteredCourses.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl space-y-3">
              <p>No registered courses found for Semester {selectedSemester} yet.</p>
              <Button
                onClick={onNavigateToCourseReg}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-sm"
              >
                Go to Course Registration
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((c) => {
                const isNptelCourse = c.isNptel;
                const isExempted = isNptelCourse && isCourseNptelExempted(c.id, nptelDeclarations);
                const nptelData = nptelDeclarations[c.id];

                const matchingReg = examRegistrations.find((r) => r.subjectCode === c.code);
                const isRegisteredForExam = matchingReg?.status === "Registered" || isExamRegPaid;

                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isExempted
                        ? "border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm"
                        : isRegisteredForExam
                        ? "border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/10 dark:bg-emerald-950/5 shadow-sm"
                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-blue-600">{c.code}</span>
                          {isNptelCourse && (
                            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold hover:bg-amber-500/10 text-[9px] px-1.5 py-0">
                              NPTEL
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {c.category === "Core" ? "Normal Subject" : c.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{c.name}</h4>
                      
                      <div className="mt-2 space-y-1 text-xs text-slate-500">
                        <p className="font-mono text-[11px]">Credits: {c.credits.toFixed(1)} &bull; Semester: {c.semester}</p>
                        <p className="text-[11px]">Mentor: <span className="text-blue-600 font-semibold">{c.faculty}</span></p>
                      </div>

                      {/* NPTEL Exemption Notice Banner */}
                      {isExempted && (
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] space-y-1 text-amber-900 dark:text-amber-200">
                          <div className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-300">
                            <FileCheck className="h-4 w-4 text-amber-600 shrink-0" />
                            <span>Excluded from Exam & Hall Ticket</span>
                          </div>
                          <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-normal">
                            NPTEL Certificate Verified ✓ Course credits transferred directly.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* STATUS ACTION BUTTON */}
                    {isExempted ? (
                      <Button
                        disabled
                        className="w-full h-9 text-xs font-bold rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 cursor-default opacity-100"
                      >
                        NPTEL Credit Transfer (Exam Exempted) ✓
                      </Button>
                    ) : isRegisteredForExam ? (
                      <Button
                        disabled
                        className="w-full h-9 text-xs font-bold rounded-xl bg-emerald-600 text-white cursor-default opacity-100 shadow-sm"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Exam Registered
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onRegisterExam(matchingReg?.id || c.id)}
                        className="w-full h-9 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      >
                        Register for Exam
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
