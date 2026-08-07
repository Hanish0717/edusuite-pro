import React, { useState, useEffect } from "react";
import {
  AvailableCourseItem,
  StudentExamProfile,
  AcademicYearOption,
  YEAR_TO_SEMESTERS_MAP,
} from "./types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useExamStore, submitDirectExamRegistration } from "./exam-store";

interface ExamRegistrationProps {
  profile: StudentExamProfile;
  courses: AvailableCourseItem[];
  selectedYear: AcademicYearOption;
  selectedSemester: number;
  onYearChange: (year: AcademicYearOption) => void;
  onSemesterChange: (sem: number) => void;
  onNavigateToCourseReg?: () => void;
}

export function ExamRegistration({
  profile,
  courses = [],
  selectedYear,
  selectedSemester,
  onYearChange,
  onSemesterChange,
  onNavigateToCourseReg,
}: ExamRegistrationProps) {
  const availableSemesters = YEAR_TO_SEMESTERS_MAP[selectedYear] || [5, 6];
  const { registeredCourseIds = [], examRegistrations = [] } = useExamStore();

  const safeRegisteredCourseIds = registeredCourseIds || [];
  const safeExamRegistrations = examRegistrations || [];
  const safeCourses = courses || [];

  // Display ONLY courses registered in Course Registration for selected semester
  const registeredCourses = safeCourses.filter(
    (c) => c.semester === selectedSemester && safeRegisteredCourseIds.includes(c.id)
  );

  // Selected checkboxes for exam submission
  const [selectedExamCourseIds, setSelectedExamCourseIds] = useState<string[]>([]);

  // Initialize selectedExamCourseIds with courses already submitted/registered
  useEffect(() => {
    const defaultSelected = registeredCourses.map((c) => c.id);
    setSelectedExamCourseIds(defaultSelected);
  }, [selectedSemester, registeredCourses.length]);

  const handleToggleSelectExam = (courseId: string) => {
    setSelectedExamCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmitExamRegistration = () => {
    if (registeredCourses.length === 0) {
      toast.error("No registered courses found. Please complete Course Registration first.");
      return;
    }

    if (selectedExamCourseIds.length === 0) {
      toast.error("Please select at least one course for examination.");
      return;
    }

    const selectedCoursesToRegister = registeredCourses.filter((c) => selectedExamCourseIds.includes(c.id));

    submitDirectExamRegistration(
      {
        studentId: profile.studentId,
        studentName: profile.name,
        rollNumber: profile.rollNumber,
        department: profile.branch,
      },
      selectedCoursesToRegister
    );

    toast.success(`Exam Registration Submitted Successfully for ${selectedCoursesToRegister.length} course(s)! Status: ✓ Exam Registered.`);
  };

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

          {/* NOTE BOX */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs space-y-1 text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Exam Registration</span>
            </div>
            <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
              Select the courses you want to register for examinations and click &quot;Submit Exam Registration&quot;.
            </p>
          </div>

          {/* REGISTRATION SUMMARY */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Registered Courses:</span>
              <span className="font-bold text-slate-900 dark:text-white">{registeredCourses.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Selected for Exam:</span>
              <span className="font-bold text-blue-600">{selectedExamCourseIds.length}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTERED COURSES EXAM CATALOG (8 COLUMNS) */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Exam Registration</h3>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-100 dark:border-blue-900/60">
              Sem {selectedSemester} Registered Exams
            </span>
          </div>

          {/* EMPTY STATE OR COURSE GRID */}
          {registeredCourses.length === 0 ? (
            <div className="p-10 text-center text-xs space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
              <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
              <p className="font-bold text-sm text-slate-900 dark:text-white">No registered courses found.</p>
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                You must complete Course Registration first before registering for examinations in Semester {selectedSemester}.
              </p>
              {onNavigateToCourseReg && (
                <Button onClick={onNavigateToCourseReg} variant="outline" size="sm" className="mt-2 text-xs font-semibold border-blue-200 text-blue-600">
                  Go to Course Registration
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredCourses.map((c) => {
                  const existingReg = safeExamRegistrations.find((r) => r.courseId === c.id);
                  const isPendingVerification = existingReg?.status === "Pending Verification";
                  const isRejected = existingReg?.status === "Rejected";
                  const isExamRegistered = existingReg?.status === "Registered";

                  const isChecked = selectedExamCourseIds.includes(c.id);

                  return (
                    <div
                      key={c.id}
                      onClick={() => handleToggleSelectExam(c.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isExamRegistered
                          ? "border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/10"
                          : isPendingVerification
                          ? "border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/10"
                          : isRejected
                          ? "border-rose-500/40 bg-rose-50/30 dark:bg-rose-950/10"
                          : isChecked
                          ? "border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm"
                          : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`exam-check-${c.id}`}
                              checked={isChecked}
                              onCheckedChange={() => handleToggleSelectExam(c.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="font-mono font-bold text-blue-600">{c.code}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {c.category}
                          </Badge>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{c.name}</h4>
                        
                        <div className="mt-2 space-y-1 text-xs text-slate-500">
                          <p className="font-mono text-[11px]">Credits: {c.credits.toFixed(1)} &bull; Semester: {c.semester}</p>
                          <p className="text-[11px]">Faculty: <span className="text-blue-600 font-semibold">{c.faculty}</span></p>
                        </div>
                      </div>

                      {/* Status Badge / Selection Button */}
                      <div className="pt-2">
                        {isPendingVerification ? (
                          <div className="w-full h-9 flex items-center justify-center text-xs font-bold rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 gap-1.5">
                            <Clock className="h-4 w-4 text-amber-500 animate-spin" /> Pending NPTEL Verification
                          </div>
                        ) : isRejected ? (
                          <div className="w-full h-9 flex items-center justify-center text-xs font-bold rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 gap-1.5">
                            <XCircle className="h-4 w-4 text-rose-500" /> NPTEL Rejected
                          </div>
                        ) : isExamRegistered ? (
                          <div className="w-full h-9 flex items-center justify-center text-xs font-bold rounded-xl bg-emerald-600 text-white shadow-sm gap-1.5">
                            <CheckCircle2 className="h-4 w-4" /> Exam Registered ✓
                          </div>
                        ) : (
                          <div className={`w-full h-9 flex items-center justify-center text-xs font-bold rounded-xl border transition-all ${
                            isChecked
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}>
                            {isChecked ? "Selected for Exam" : "Select for Exam"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BOTTOM SUBMIT BUTTON */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  onClick={handleSubmitExamRegistration}
                  className="w-full md:w-auto px-8 h-12 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Exam Registration
                </Button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
