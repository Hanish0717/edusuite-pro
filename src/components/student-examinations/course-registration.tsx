import React, { useState, useEffect } from "react";
import {
  AvailableCourseItem,
  StudentExamProfile,
  RegistrationWorkflowStep,
  CourseRegWorkflowStatus,
  AcademicYearOption,
  YEAR_TO_SEMESTERS_MAP,
} from "./types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Info,
  CheckCircle2,
  Send,
  HelpCircle,
  FileCheck,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useExamStore,
  submitCourseRegistration,
  submitDirectExamRegistration,
  submitNptelExamRegistration,
} from "./exam-store";

interface CourseRegistrationProps {
  profile: StudentExamProfile;
  courses: AvailableCourseItem[];
  workflow: RegistrationWorkflowStep[];
  courseRegStatus: CourseRegWorkflowStatus;
  selectedYear: AcademicYearOption;
  selectedSemester: number;
  onYearChange: (year: AcademicYearOption) => void;
  onSemesterChange: (sem: number) => void;
  onToggleRegister?: (courseId: string) => void;
  onOpenCourseDrawer?: (course: AvailableCourseItem) => void;
  onOpenConfirmModal?: () => void;
  onCompleteCourseRegistration?: () => void;
  onNavigateToExamReg?: () => void;
}

export function CourseRegistration({
  profile,
  courses = [],
  selectedYear,
  selectedSemester,
  onYearChange,
  onSemesterChange,
}: CourseRegistrationProps) {
  const availableSemesters = YEAR_TO_SEMESTERS_MAP[selectedYear] || [5, 6];
  const { registeredCourseIds = [], isSemesterSubmitted } = useExamStore();

  const safeCourses = courses || [];
  const safeRegisteredCourseIds = registeredCourseIds || [];
  const isSemesterDone = isSemesterSubmitted ? isSemesterSubmitted(selectedSemester) : false;

  // Dynamically filter courses for selected semester
  const filteredCourses = safeCourses.filter((c) => c.semester === selectedSemester);

  // Selected checkboxes state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog States
  const [isNptelQuestionOpen, setIsNptelQuestionOpen] = useState(false);
  const [isNptelUploadOpen, setIsNptelUploadOpen] = useState(false);

  // NPTEL Upload Form State
  const [selectedNptelCourseId, setSelectedNptelCourseId] = useState<string>("");
  const [nptelFile, setNptelFile] = useState<File | null>(null);
  const [nptelRemarks, setNptelRemarks] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  // Sync selectedIds with store when semester changes
  useEffect(() => {
    const alreadyRegistered = filteredCourses
      .filter((c) => safeRegisteredCourseIds.includes(c.id))
      .map((c) => c.id);

    setSelectedIds(alreadyRegistered);
  }, [selectedSemester, safeRegisteredCourseIds.length]);

  const handleToggleSelect = (courseId: string) => {
    if (isSemesterDone) return;
    setSelectedIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmitRegistrationClick = () => {
    if (isSemesterDone) {
      toast.info("Course Registration for this semester is already submitted!");
      return;
    }

    if (selectedIds.length === 0) {
      toast.error("Please select at least one course.");
      return;
    }

    // Immediately ask NPTEL completion question
    setIsNptelQuestionOpen(true);
  };

  // User selects "NO" to NPTEL question
  const handleNptelNo = () => {
    setIsNptelQuestionOpen(false);

    // Save selected courses in Course Registration
    submitCourseRegistration(selectedSemester, selectedIds);

    // Automatically send registered courses to Exam Registration module
    const coursesToRegister = filteredCourses.filter((c) => selectedIds.includes(c.id));
    submitDirectExamRegistration(
      {
        studentId: profile.studentId,
        studentName: profile.name,
        rollNumber: profile.rollNumber,
        department: profile.branch,
      },
      coursesToRegister
    );

    toast.success(`Course Registration & Exam Registration Completed! (${selectedIds.length} course(s) registered)`);
  };

  // User selects "YES" to NPTEL question
  const handleNptelYes = () => {
    setIsNptelQuestionOpen(false);

    const selectedCoursesList = filteredCourses.filter((c) => selectedIds.includes(c.id));
    if (selectedCoursesList.length > 0) {
      setSelectedNptelCourseId(selectedCoursesList[0].id);
    }
    setNptelFile(null);
    setNptelRemarks("");
    setUploadError("");
    setIsNptelUploadOpen(true);
  };

  // File change validator
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError("");

    if (!file) {
      setNptelFile(null);
      return;
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isAllowedExt = ["pdf", "png", "jpg", "jpeg"].includes(ext || "");

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      setUploadError("Invalid file type. Allowed formats: PDF, PNG, JPG, JPEG.");
      setNptelFile(null);
      return;
    }

    const maxSizeMb = 10;
    if (file.size > maxSizeMb * 1024 * 1024) {
      setUploadError(`File size exceeds ${maxSizeMb} MB limit.`);
      setNptelFile(null);
      return;
    }

    setNptelFile(file);
  };

  // Submit NPTEL Upload
  const handleNptelUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNptelCourseId) {
      toast.error("Please select a course for NPTEL certificate upload.");
      return;
    }

    if (!nptelFile) {
      setUploadError("Certificate file is required. Please upload PDF, PNG, JPG, or JPEG (Max 10MB).");
      return;
    }

    const targetCourse = filteredCourses.find((c) => c.id === selectedNptelCourseId);
    if (!targetCourse) return;

    // 1. Save Course Registration
    submitCourseRegistration(selectedSemester, selectedIds);

    // 2. Submit NPTEL certificate & registration to Examination and HOD modules
    submitNptelExamRegistration(
      {
        studentId: profile.studentId,
        studentName: profile.name,
        rollNumber: profile.rollNumber,
        department: profile.branch,
      },
      targetCourse,
      {
        fileName: nptelFile.name,
        fileType: nptelFile.type || "application/pdf",
        fileSizeMb: Number((nptelFile.size / (1024 * 1024)).toFixed(2)),
        remarks: nptelRemarks,
      }
    );

    // Also register remaining non-nptel selected courses directly
    const otherCourses = filteredCourses.filter((c) => selectedIds.includes(c.id) && c.id !== targetCourse.id);
    if (otherCourses.length > 0) {
      submitDirectExamRegistration(
        {
          studentId: profile.studentId,
          studentName: profile.name,
          rollNumber: profile.rollNumber,
          department: profile.branch,
        },
        otherCourses
      );
    }

    setIsNptelUploadOpen(false);
    toast.success("Course Registration Completed & NPTEL Certificate submitted to Examination & HOD modules for verification!");
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
              Select courses using the checkboxes below and click &quot;Submit Course Registration&quot;. Registered courses automatically carry forward to Exam Registration.
            </p>
          </div>

          {/* SUMMARY BOX */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Total Offered:</span>
              <span className="font-bold text-slate-900 dark:text-white">{filteredCourses.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Selected Courses:</span>
              <span className="font-bold text-[#0b193c] dark:text-blue-400">{selectedIds.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Registration Status:</span>
              <span className={`font-bold ${isSemesterDone ? "text-emerald-600" : "text-amber-600"}`}>
                {isSemesterDone ? "Submitted ✓" : "Pending Selection"}
              </span>
            </div>
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCourses.map((c) => {
                  const isChecked = selectedIds.includes(c.id);
                  const isRegistered = safeRegisteredCourseIds.includes(c.id);

                  return (
                    <div
                      key={c.id}
                      onClick={() => !isSemesterDone && handleToggleSelect(c.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isRegistered
                          ? "border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/10 cursor-default"
                          : isChecked
                          ? "border-[#0b193c] dark:border-blue-500 bg-[#0b193c]/5 dark:bg-blue-950/20 shadow-sm"
                          : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`course-check-${c.id}`}
                              checked={isChecked}
                              disabled={isSemesterDone}
                              onCheckedChange={() => handleToggleSelect(c.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="font-mono font-bold text-[#0b193c] dark:text-blue-400">{c.code}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">{c.category === "Core" ? "Normal Subject" : c.category}</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{c.name}</h4>
                        
                        <div className="mt-2 space-y-1 text-xs text-slate-500">
                          <p className="font-mono text-[11px]">Credits: {c.credits.toFixed(1)} &bull; Semester: {c.semester}</p>
                          <p className="text-[11px]">Faculty: <span className="text-[#0b193c] dark:text-blue-400 font-semibold">{c.faculty}</span></p>
                        </div>
                      </div>

                      {/* Course Card Status Button */}
                      <div className="pt-2">
                        {isRegistered ? (
                          <div className="w-full h-9 flex items-center justify-center text-xs font-bold rounded-xl bg-emerald-600 text-white shadow-sm gap-1.5">
                            <CheckCircle2 className="h-4 w-4" /> Course Registered ✓
                          </div>
                        ) : (
                          <div className={`w-full h-9 flex items-center justify-center text-xs font-bold rounded-xl border transition-all ${
                            isChecked
                              ? "bg-[#0b193c] text-white border-[#0b193c]"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}>
                            {isChecked ? "Selected for Registration" : "Select Course"}
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
                  onClick={handleSubmitRegistrationClick}
                  disabled={isSemesterDone}
                  className={`w-full md:w-auto px-8 h-12 text-sm font-bold rounded-xl shadow-lg transition-all gap-2 ${
                    isSemesterDone
                      ? "bg-emerald-600 hover:bg-emerald-600 text-white cursor-not-allowed opacity-90"
                      : "bg-[#0b193c] hover:bg-[#0b193c]/90 text-white shadow-[#0b193c]/20"
                  }`}
                >
                  <Send className="h-4 w-4" />
                  {isSemesterDone ? "Course Registration Submitted ✓" : "Submit Course Registration"}
                </Button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* --------------------------------------------------------- */}
      {/* 1. NPTEL CONFIRMATION QUESTION DIALOG */}
      {/* --------------------------------------------------------- */}
      <Dialog open={isNptelQuestionOpen} onOpenChange={setIsNptelQuestionOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 mb-2">
              <HelpCircle className="size-6" />
            </div>
            <DialogTitle className="text-center text-base font-bold">
              NPTEL Certification Check
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500 mt-1">
              Have you completed NPTEL certification for any of the selected courses?
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Selected Courses:</p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 font-mono">
              {filteredCourses
                .filter((c) => selectedIds.includes(c.id))
                .map((c) => (
                  <li key={c.id}>{c.code} - {c.name}</li>
                ))}
            </ul>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={handleNptelNo}
              variant="outline"
              className="w-full h-10 font-bold text-xs rounded-xl border-slate-300"
            >
              NO
            </Button>
            <Button
              onClick={handleNptelYes}
              className="w-full h-10 font-bold text-xs rounded-xl bg-[#0b193c] hover:bg-[#0b193c]/90 text-white"
            >
              YES
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --------------------------------------------------------- */}
      {/* 2. UPLOAD NPTEL CERTIFICATE MODAL */}
      {/* --------------------------------------------------------- */}
      <Dialog open={isNptelUploadOpen} onOpenChange={setIsNptelUploadOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <FileCheck className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Upload NPTEL Certificate
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Please select the course and upload your valid NPTEL completion certificate.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleNptelUploadSubmit} className="space-y-4 text-xs pt-2">
            {/* COURSE DROPDOWN */}
            <div className="space-y-1.5">
              <Label className="font-semibold">Select Course</Label>
              <select
                value={selectedNptelCourseId}
                onChange={(e) => setSelectedNptelCourseId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filteredCourses
                  .filter((c) => selectedIds.includes(c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name} ({c.credits} Credits)
                    </option>
                  ))}
              </select>
            </div>

            {/* CERTIFICATE FILE UPLOAD */}
            <div className="space-y-1.5">
              <Label className="font-semibold">Upload Certificate (PDF, PNG, JPG, JPEG &le; 10MB)</Label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="nptel-course-cert-input"
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="nptel-course-cert-input" className="cursor-pointer block space-y-2">
                  <Upload className="h-7 w-7 text-blue-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {nptelFile ? nptelFile.name : "Click to select or drag certificate file here"}
                  </p>
                  {nptelFile && (
                    <p className="text-[11px] text-emerald-600 font-mono font-bold">
                      {(nptelFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Selected ✓
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400">Supported formats: PDF, PNG, JPG, JPEG (Max 10 MB)</p>
                </label>
              </div>

              {uploadError && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> {uploadError}
                </p>
              )}
            </div>

            {/* REMARKS (OPTIONAL) */}
            <div className="space-y-1.5">
              <Label className="font-semibold">Remarks (Optional)</Label>
              <Textarea
                value={nptelRemarks}
                onChange={(e) => setNptelRemarks(e.target.value)}
                placeholder="Add any additional details or certificate registration ID..."
                className="rounded-xl text-xs h-20"
              />
            </div>

            <DialogFooter className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNptelUploadOpen(false)}
                className="h-9 px-4 text-xs font-semibold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-6 text-xs font-bold rounded-xl bg-[#0b193c] hover:bg-[#0b193c]/90 text-white"
              >
                Submit Certificate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
