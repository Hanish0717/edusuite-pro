import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  ExamSubmodule,
  CourseRegWorkflowStatus,
  ExamRegWorkflowStatus,
  HallTicketWorkflowStatus,
  ResultWorkflowStatus,
  AcademicYearOption,
  YEAR_TO_SEMESTERS_MAP,
  HallTicketRecordItem,
  SemesterResultItem,
} from "@/components/student-examinations/types";
import {
  MOCK_EXAM_PROFILE,
  MOCK_UPCOMING_EXAMS,
  MOCK_SEMESTER_RESULTS,
  MOCK_AVAILABLE_COURSES,
  MOCK_REGISTRATION_WORKFLOW,
  MOCK_EXAM_REGISTRATIONS,
} from "@/components/student-examinations/mock-data";

// Submodule Views
import { CourseRegistration } from "@/components/student-examinations/course-registration";
import { ExamRegistration } from "@/components/student-examinations/exam-registration";
import { HallTicket } from "@/components/student-examinations/hall-ticket";
import { Results } from "@/components/student-examinations/results";

// Modals & Drawers
import { HallTicketModal } from "@/components/student-examinations/modals/hall-ticket-modal";
import { GradeCardModal } from "@/components/student-examinations/modals/grade-card-modal";
import { CourseDetailsDrawer } from "@/components/student-examinations/modals/course-details-drawer";
import { RegistrationModal } from "@/components/student-examinations/modals/registration-modal";
import { RevaluationModal } from "@/components/student-examinations/modals/revaluation-modal";
import { NptelDeclarationModal } from "@/components/student-examinations/modals/nptel-declaration-modal";

// UI Primitives & Icons
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Ticket,
  Award,
  ClipboardCheck,
  Lock,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/student/examinations")({
  head: () => ({
    meta: [{ title: "Examinations — EduSuite Pro ERP" }],
  }),
  component: StudentExaminationsPage,
});

function StudentExaminationsPage() {
  // Active Submodule Tab
  const [activeSubmodule, setActiveSubmodule] = useState<ExamSubmodule>("course-registration");

  // Year & Semester State
  const [selectedYear, setSelectedYear] = useState<AcademicYearOption>("3rd Year");
  const [selectedSemester, setSelectedSemester] = useState<number>(5);

  // Linked Workflow State
  const [courseRegStatus, setCourseRegStatus] = useState<CourseRegWorkflowStatus>("Not Started");
  const [examRegStatus, setExamRegStatus] = useState<ExamRegWorkflowStatus>("Locked");
  const [hallTicketStatus, setHallTicketStatus] = useState<HallTicketWorkflowStatus>("Locked");
  const [resultStatus, setResultStatus] = useState<ResultWorkflowStatus>("Not Published");

  // Dynamic Datasets
  const [profile] = useState(MOCK_EXAM_PROFILE);
  const [upcomingExams] = useState(MOCK_UPCOMING_EXAMS);
  const [semesterResults] = useState(MOCK_SEMESTER_RESULTS);
  const [availableCourses, setAvailableCourses] = useState(MOCK_AVAILABLE_COURSES);
  const [workflow] = useState(MOCK_REGISTRATION_WORKFLOW);
  const [examRegistrations, setExamRegistrations] = useState(MOCK_EXAM_REGISTRATIONS);

  // Hall Ticket Modal — supports both current & archive hall tickets
  const [hallTicketModalOpen, setHallTicketModalOpen] = useState(false);
  const [selectedHallTicketRecord, setSelectedHallTicketRecord] = useState<HallTicketRecordItem | null>(null);

  // Grade Card Modal
  const [gradeCardModalOpen, setGradeCardModalOpen] = useState(false);
  const [selectedSemesterResult, setSelectedSemesterResult] = useState<SemesterResultItem | null>(null);

  // Course Drawer
  const [courseDrawerOpen, setCourseDrawerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Registration Modal
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);

  // Revaluation Modal
  const [revaluationModalOpen, setRevaluationModalOpen] = useState(false);

  // Course selection and NPTEL declaration state
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [nptelDeclarations, setNptelDeclarations] = useState<Record<string, {
    fileName: string;
    fileSize: string;
    comments: string;
    pdfUrl: string;
    isNptel: boolean;
  }>>({});

  // Registration Validation Modals
  const [selectionRequiredOpen, setSelectionRequiredOpen] = useState(false);
  const [nptelDeclarationOpen, setNptelDeclarationOpen] = useState(false);
  const [successRegistrationOpen, setSuccessRegistrationOpen] = useState(false);
  const [registeredSummary, setRegisteredSummary] = useState<{
    regNumber: string;
    count: number;
    date: string;
    academicYear: string;
  } | null>(null);
  const [isSubmittingCourseReg, setIsSubmittingCourseReg] = useState(false);

  // Year Change Handler
  const handleYearChange = (year: AcademicYearOption) => {
    setSelectedYear(year);
    const sems = YEAR_TO_SEMESTERS_MAP[year] || [1, 2];
    const defaultSem = sems[0] ?? 1;
    setSelectedSemester(defaultSem);
    setSelectedCourseIds([]);
    toast.info(`Switched to ${year} (Semester ${defaultSem})`);
  };

  const handleSemesterChange = (sem: number) => {
    setSelectedSemester(sem);
    setSelectedCourseIds([]);
    toast.info(`Switched to Semester ${sem}`);
  };

  // Submodules list
  const submodulesList = [
    { id: "course-registration", label: "Course Registration", icon: BookOpen },
    { id: "exam-registration", label: "Exam Registration", icon: ClipboardCheck },
    { id: "hall-ticket", label: "Hall Ticket", icon: Ticket },
    { id: "results", label: "Results & Memos", icon: Award },
  ];

  // Helper counts
  const semesterCourses = availableCourses.filter((c) => c.semester === selectedSemester);
  const registeredCoursesList = semesterCourses.filter((c) => c.isRegistered);
  const registeredCreditsSum = registeredCoursesList.reduce((s, c) => s + c.credits, 0);

  // Workflow Triggers
  const handleCompleteCourseRegistration = () => {
    setCourseRegStatus("Completed");
    setExamRegStatus("Pending Payment");
    toast.success("Course Registration Completed! Exam Registration is now UNLOCKED.");
  };

  const handleCompleteAllExamRegistration = () => {
    setCourseRegStatus("Completed");
    setExamRegStatus("Paid & Registered");
    setHallTicketStatus("Generated");
    setExamRegistrations((prev) =>
      prev.map((reg) => ({
        ...reg,
        paymentStatus: "Paid" as const,
        status: "Approved" as const,
        receiptNumber: `EXM-REC-${Math.floor(1000 + Math.random() * 9000)}`,
      }))
    );
    toast.success("Exam Registration & Fee Payment Successful! Hall Ticket UNLOCKED & GENERATED.");
  };

  const handleRegisterSingleExam = (examRegId: string) => {
    setExamRegistrations((prev) => {
      const next = prev.map((reg) => {
        if (reg.id === examRegId) {
          return {
            ...reg,
            paymentStatus: "Paid" as const,
            status: "Approved" as const,
            receiptNumber: `EXM-REC-${Math.floor(1000 + Math.random() * 9000)}`,
          };
        }
        return reg;
      });

      const allPaid = next.every((r) => r.paymentStatus === "Paid");
      if (allPaid) {
        setExamRegStatus("Paid & Registered");
        setHallTicketStatus("Generated");
        toast.success("All exam registrations paid! Hall Ticket UNLOCKED.");
      } else {
        setExamRegStatus("Pending Payment");
        toast.success("Single exam fee paid!");
      }
      return next;
    });
  };

  const handleToggleSelectCourse = (courseId: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleToggleRegisterCourse = (courseId: string) => {
    setAvailableCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextRegistered = !c.isRegistered;
          toast.success(
            nextRegistered
              ? `Registered for ${c.code} (${c.name})`
              : `Dropped ${c.code} (${c.name})`
          );
          return {
            ...c,
            isRegistered: nextRegistered,
            availableSeats: nextRegistered ? c.availableSeats - 1 : c.availableSeats + 1,
          };
        }
        return c;
      })
    );
  };

  const executeFinalSubmission = (nptelData: Record<string, any> = {}) => {
    setIsSubmittingCourseReg(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmittingCourseReg(false);
      
      // Update available courses list so the selected courses are marked as registered!
      setAvailableCourses((prev) =>
        prev.map((c) => {
          if (selectedCourseIds.includes(c.id)) {
            return {
              ...c,
              isRegistered: true,
              availableSeats: c.availableSeats - 1,
            };
          }
          return c;
        })
      );

      // Save NPTEL declarations
      setNptelDeclarations((prev) => ({
        ...prev,
        ...nptelData,
      }));

      // Set Course Registration Status to Completed, and Unlock Exam Registration & Hall Ticket
      setCourseRegStatus("Completed");
      setExamRegStatus("Paid & Registered");
      setHallTicketStatus("Generated");

      // Generate Exam Registration records for the newly registered courses (excluding NPTEL)
      const newExamRegs = availableCourses
        .filter((c) => selectedCourseIds.includes(c.id) && !c.isNptel)
        .map((c) => ({
          id: `er-${c.id}`,
          semester: c.semester,
          examType: "Regular" as const,
          subjectCode: c.code,
          subjectName: c.name,
          credits: c.credits,
          feeAmount: 500,
          paymentStatus: "Paid" as const,
          registrationDeadline: profile.registrationDeadline,
          lateFee: 0,
          examCentrePreference: "Main Campus - Academic Block A",
          status: "Approved" as const,
          receiptNumber: `EXM-REC-${Math.floor(1000 + Math.random() * 9000)}`,
        }));

      setExamRegistrations((prev) => {
        const codesToReplace = newExamRegs.map((r) => r.subjectCode);
        const filtered = prev.filter((r) => !codesToReplace.includes(r.subjectCode));
        return [...filtered, ...newExamRegs];
      });

      // Generate a dynamic registration summary
      const regId = `CR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      setRegisteredSummary({
        regNumber: regId,
        count: selectedCourseIds.length,
        date: today,
        academicYear: selectedYear,
      });

      // Clear selection list
      setSelectedCourseIds([]);

      // Open Success Dialog
      setSuccessRegistrationOpen(true);
      
      toast.success("Course Registration Completed successfully!");
    }, 1500);
  };

  const handleSubmitCourseRegistration = () => {
    // 1. Check if no courses are selected
    if (selectedCourseIds.length === 0) {
      setSelectionRequiredOpen(true);
      return;
    }

    // 2. Check if any selected course is NPTEL
    const selectedNptelCourses = availableCourses.filter(
      (c) => selectedCourseIds.includes(c.id) && c.isNptel
    );

    if (selectedNptelCourses.length > 0) {
      // Open NPTEL Declaration Modal
      setNptelDeclarationOpen(true);
    } else {
      // Proceed directly to final submission
      executeFinalSubmission();
    }
  };

  const handleTogglePublishResults = () => {
    if (resultStatus === "Published") {
      setResultStatus("Not Published");
      toast.info("Results status set to Evaluation In Progress.");
    } else {
      setResultStatus("Published");
      toast.success("Results published by Controller of Examinations!");
    }
  };

  // Semester Navigation inside GradeCard Modal
  const handleNavigateSemester = (sem: number) => {
    const result = semesterResults.find((r) => r.semester === sem);
    if (result) {
      setSelectedSemesterResult(result);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. TOP 4 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Branch */}
        <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <span className="text-xs font-semibold text-slate-500 block">Your Branch / Department</span>
          <div className="text-3xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">
            CSE
          </div>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#0b193c]/10 text-[#0b193c] dark:text-blue-400 border border-[#0b193c]/20">
            Department Profile
          </span>
        </div>

        {/* Card 2: Earned Credits */}
        <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <span className="text-xs font-semibold text-slate-500 block">Total Earned Credits</span>
          <div className="text-3xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">
            {profile.creditsEarned} Credits
          </div>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#0b193c]/10 text-[#0b193c] dark:text-blue-400 border border-[#0b193c]/20">
            From declared results
          </span>
        </div>

        {/* Card 3: Registered Courses */}
        <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <span className="text-xs font-semibold text-slate-500 block">Registered Courses (Sem {selectedSemester})</span>
          <div className="text-3xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">
            {registeredCoursesList.length}
          </div>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#0b193c]/10 text-[#0b193c] dark:text-blue-400 border border-[#0b193c]/20">
            Completed Enrolment
          </span>
        </div>

        {/* Card 4: Registered Credits */}
        <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <span className="text-xs font-semibold text-slate-500 block">Total Registered Credits (Sem {selectedSemester})</span>
          <div className="text-3xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">
            {registeredCreditsSum} Credits
          </div>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#0b193c]/10 text-[#0b193c] dark:text-blue-400 border border-[#0b193c]/20">
            Max Limit: 24 Credits
          </span>
        </div>

      </div>

      {/* 2. SUBMODULE TABS */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-6">
          {submodulesList.map((sub) => {
            const IconComp = sub.icon;
            const isActive = activeSubmodule === sub.id;

            let isLocked = false;
            if (sub.id === "exam-registration" && courseRegStatus !== "Completed" && selectedSemester === 5) {
              isLocked = true;
            }
            if (sub.id === "hall-ticket" && examRegStatus !== "Paid & Registered" && selectedSemester === 5) {
              isLocked = true;
            }

            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubmodule(sub.id as ExamSubmodule)}
                className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                  isActive
                    ? "border-[#0b193c] text-[#0b193c] dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <IconComp className="h-4 w-4" />
                <span>{sub.label}</span>
                {isLocked && <Lock className="h-3 w-3 opacity-60" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN SUBMODULE VIEWS */}
      {activeSubmodule === "course-registration" && (
        <CourseRegistration
          profile={profile}
          courses={availableCourses}
          workflow={workflow}
          courseRegStatus={courseRegStatus}
          selectedYear={selectedYear}
          selectedSemester={selectedSemester}
          onYearChange={handleYearChange}
          onSemesterChange={handleSemesterChange}
          onToggleRegister={handleToggleRegisterCourse}
          onOpenCourseDrawer={(course) => {
            setSelectedCourse(course);
            setCourseDrawerOpen(true);
          }}
          onOpenConfirmModal={() => setRegistrationModalOpen(true)}
          onCompleteCourseRegistration={handleCompleteCourseRegistration}
          onNavigateToExamReg={() => setActiveSubmodule("exam-registration")}
          selectedCourseIds={selectedCourseIds}
          onToggleSelect={handleToggleSelectCourse}
          onSubmitCourseRegistration={handleSubmitCourseRegistration}
        />
      )}

      {activeSubmodule === "exam-registration" && (
        <ExamRegistration
          profile={profile}
          examRegistrations={examRegistrations}
          courses={availableCourses}
          courseRegStatus={courseRegStatus}
          examRegStatus={examRegStatus}
          selectedYear={selectedYear}
          selectedSemester={selectedSemester}
          onYearChange={handleYearChange}
          onSemesterChange={handleSemesterChange}
          onRegisterExam={handleRegisterSingleExam}
          onCompleteAllExamReg={handleCompleteAllExamRegistration}
          onNavigateToCourseReg={() => setActiveSubmodule("course-registration")}
          onNavigateToHallTicket={() => setActiveSubmodule("hall-ticket")}
          nptelDeclarations={nptelDeclarations}
        />
      )}

      {activeSubmodule === "hall-ticket" && (
        <HallTicket
          profile={profile}
          exams={upcomingExams}
          examRegStatus={examRegStatus}
          hallTicketStatus={hallTicketStatus}
          selectedYear={selectedYear}
          selectedSemester={selectedSemester}
          onYearChange={handleYearChange}
          onSemesterChange={handleSemesterChange}
          onOpenModal={(ht) => {
            setSelectedHallTicketRecord(ht || null);
            setHallTicketModalOpen(true);
          }}
          onNavigateToExamReg={() => setActiveSubmodule("exam-registration")}
        />
      )}

      {activeSubmodule === "results" && (
        <Results
          profile={profile}
          semesterResults={semesterResults}
          resultStatus={resultStatus}
          selectedYear={selectedYear}
          selectedSemester={selectedSemester}
          onYearChange={handleYearChange}
          onSemesterChange={handleSemesterChange}
          onOpenGradeCardModal={(res) => {
            setSelectedSemesterResult(res);
            setGradeCardModalOpen(true);
          }}
          onApplyRevaluation={() => setRevaluationModalOpen(true)}
          onTogglePublishResults={handleTogglePublishResults}
        />
      )}

      {/* MODALS */}
      <HallTicketModal
        open={hallTicketModalOpen}
        onOpenChange={setHallTicketModalOpen}
        profile={profile}
        exams={upcomingExams}
        hallTicketRecord={selectedHallTicketRecord}
      />

      <GradeCardModal
        open={gradeCardModalOpen}
        onOpenChange={setGradeCardModalOpen}
        profile={profile}
        result={selectedSemesterResult}
        allResults={semesterResults}
        onNavigateSemester={handleNavigateSemester}
        onApplyRevaluation={() => {
          setGradeCardModalOpen(false);
          setRevaluationModalOpen(true);
        }}
      />

      <CourseDetailsDrawer
        open={courseDrawerOpen}
        onOpenChange={setCourseDrawerOpen}
        course={selectedCourse}
        onRegister={(c) => handleToggleRegisterCourse(c.id)}
        onDrop={(c) => handleToggleRegisterCourse(c.id)}
      />

      <RegistrationModal
        open={registrationModalOpen}
        onOpenChange={setRegistrationModalOpen}
        selectedCourses={registeredCoursesList}
        onConfirm={() => {
          setCourseRegStatus("Submitted");
          toast.success("Course Registration locks submitted to Advisor!");
        }}
      />

      <RevaluationModal
        open={revaluationModalOpen}
        onOpenChange={setRevaluationModalOpen}
        semesterResults={semesterResults}
        defaultSemester={selectedSemesterResult?.semester || selectedSemester}
        onSubmitRevaluation={(data) => {
          toast.success(`Revaluation request for ${data.subjectCode} submitted! Ref: REV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
        }}
      />

      {/* Course Selection Required Modal */}
      <Dialog open={selectionRequiredOpen} onOpenChange={setSelectionRequiredOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl text-center">
          <DialogHeader className="text-center space-y-2">
            <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto" />
            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
              Course Selection Required
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Please select at least one course before submitting your registration.
            </DialogDescription>
          </DialogHeader>

          <Button
            type="button"
            onClick={() => setSelectionRequiredOpen(false)}
            className="w-full mt-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs h-9 font-semibold"
          >
            Okay, Go Back
          </Button>
        </DialogContent>
      </Dialog>

      {/* NPTEL Course Declaration Modal */}
      <NptelDeclarationModal
        open={nptelDeclarationOpen}
        onOpenChange={setNptelDeclarationOpen}
        selectedNptelCourses={availableCourses.filter(
          (c) => selectedCourseIds.includes(c.id) && c.isNptel
        )}
        savedDeclarations={nptelDeclarations}
        onConfirm={(declarations) => {
          executeFinalSubmission(declarations);
        }}
      />

      {/* Course Registration Success Modal */}
      <Dialog open={successRegistrationOpen} onOpenChange={setSuccessRegistrationOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
          <div className="text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Course Registration Successful
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Your selected courses have been registered successfully.
            </DialogDescription>
          </div>

          {registeredSummary && (
            <div className="my-5 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Registration No:</span>
                <span className="font-mono font-bold text-blue-600">{registeredSummary.regNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Selected Courses:</span>
                <span className="font-bold text-slate-900 dark:text-white">{registeredSummary.count} Courses</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Registration Date:</span>
                <span className="font-bold text-slate-900 dark:text-white">{registeredSummary.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Academic Year:</span>
                <span className="font-bold text-slate-900 dark:text-white">{registeredSummary.academicYear}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-semibold">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSuccessRegistrationOpen(false)}
              className="rounded-xl h-9 text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSuccessRegistrationOpen(false);
                setActiveSubmodule("exam-registration");
              }}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs h-9"
            >
              View Registration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {isSubmittingCourseReg && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 text-white">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="text-xs font-bold font-mono">Submitting Course Registration...</p>
        </div>
      )}

    </div>
  );
}
