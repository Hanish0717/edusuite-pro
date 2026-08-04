import React from "react";
import {
  AvailableCourseItem,
  StudentExamProfile,
  RegistrationWorkflowStep,
  CourseRegWorkflowStatus,
  AcademicYearOption,
  YEAR_TO_SEMESTERS_MAP,
} from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

interface CourseRegistrationProps {
  profile: StudentExamProfile;
  courses: AvailableCourseItem[];
  workflow: RegistrationWorkflowStep[];
  courseRegStatus: CourseRegWorkflowStatus;
  selectedYear: AcademicYearOption;
  selectedSemester: number;
  onYearChange: (year: AcademicYearOption) => void;
  onSemesterChange: (sem: number) => void;
  onToggleRegister: (courseId: string) => void;
  onOpenCourseDrawer: (course: AvailableCourseItem) => void;
  onOpenConfirmModal: () => void;
  onCompleteCourseRegistration: () => void;
  onNavigateToExamReg: () => void;
  selectedCourseIds: string[];
  onToggleSelect: (courseId: string) => void;
  onSubmitCourseRegistration: () => void;
}

export function CourseRegistration({
  courses,
  courseRegStatus,
  selectedYear,
  selectedSemester,
  onYearChange,
  onSemesterChange,
  onToggleRegister,
  onCompleteCourseRegistration,
  onNavigateToExamReg,
  selectedCourseIds = [],
  onToggleSelect,
  onSubmitCourseRegistration,
}: CourseRegistrationProps) {
  const isCompleted = courseRegStatus === "Completed";
  const availableSemesters = YEAR_TO_SEMESTERS_MAP[selectedYear] || [5, 6];

  // Dynamically filter courses for selected semester
  const filteredCourses = courses.filter((c) => c.semester === selectedSemester);

  return (
    <div className="space-y-6">



      {/* TWO COLUMN LAYOUT (EXACT MATCH WITH SCREENSHOT) */}
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
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0b193c]"
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
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0b193c]"
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
          <div className="p-4 rounded-xl bg-[#0b193c]/10 border border-[#0b193c]/20 text-xs space-y-1 text-slate-900 dark:text-blue-200">
            <div className="flex items-center gap-1.5 font-bold text-[#0b193c] dark:text-blue-300">
              <Info className="h-4 w-4 text-[#0b193c] dark:text-blue-400 shrink-0" />
              <span>Note</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700 dark:text-blue-300">
              Courses are offered by the Exam Cell Office. Please verify subject names and codes before clicking register.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: OFFERED COURSES CATALOG (8 COLUMNS) */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#0b193c] dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Offered Courses Catalog</h3>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#0b193c]/10 text-[#0b193c] dark:text-blue-400 border border-[#0b193c]/20">
              CSE - Sem {selectedSemester}
            </span>
          </div>

          {/* COURSES CARD GRID */}
          {filteredCourses.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
              No courses offered for Semester {selectedSemester} yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((c) => {
                const isSelected = selectedCourseIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      c.isRegistered || (isCompleted && c.isRegistered)
                        ? "border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/10 dark:bg-emerald-950/5 shadow-sm opacity-90"
                        : isSelected
                        ? "border-blue-500 bg-blue-50/10 dark:bg-blue-950/10 shadow-md ring-1 ring-blue-500/20"
                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0b193c] dark:text-blue-400">{c.code}</span>
                          {c.isNptel && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold shrink-0">
                              NPTEL
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {c.category === "Core" ? "Normal Subject" : c.category}
                          </span>
                          {!c.isRegistered && !isCompleted && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => onToggleSelect(c.id)}
                              className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          )}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{c.name}</h4>
                      
                      <div className="mt-2 space-y-1 text-xs text-slate-500">
                        <p className="font-mono text-[11px]">Credits: {c.credits.toFixed(1)} &bull; Semester: {c.semester}</p>
                        <p className="text-[11px]">Mentor: <span className="text-[#0b193c] dark:text-blue-400 font-semibold">{c.faculty}</span></p>
                      </div>
                    </div>

                    <Button
                      disabled={c.isRegistered || isCompleted}
                      onClick={() => {
                        if (!c.isRegistered && !isCompleted) {
                          onToggleSelect(c.id);
                        }
                      }}
                      className={`w-full h-9 text-xs font-bold rounded-xl transition-all shadow-sm ${
                        c.isRegistered || (isCompleted && c.isRegistered)
                          ? "bg-emerald-600 text-white cursor-not-allowed opacity-100"
                          : isCompleted
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-0"
                          : isSelected
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/10"
                          : "bg-[#0b193c] hover:bg-[#0b193c]/90 text-white"
                      }`}
                    >
                      {c.isRegistered || (isCompleted && c.isRegistered)
                        ? "Course Registered ✓"
                        : isCompleted
                        ? "Not Registered"
                        : isSelected
                        ? "Selected ✓"
                        : "Select Course"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* STICKY BOTTOM SUBMIT BAR */}
          {!isCompleted && selectedCourseIds.length > 0 && (
            <div className="sticky bottom-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-xs">
                <span className="text-slate-500 font-medium dark:text-slate-400">Selected:</span>{" "}
                <span className="font-bold text-slate-900 dark:text-white">{selectedCourseIds.length} Subjects</span>
                <span className="text-slate-400 mx-2">|</span>
                <span className="text-slate-500 font-medium dark:text-slate-400">Credits:</span>{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {courses
                    .filter((c) => selectedCourseIds.includes(c.id))
                    .reduce((sum, c) => sum + c.credits, 0)
                    .toFixed(1)} Cr
                </span>
              </div>
              <Button
                onClick={onSubmitCourseRegistration}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-5 rounded-xl transition-all shadow-sm shrink-0"
              >
                Submit Course Registration ({selectedCourseIds.length})
              </Button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
