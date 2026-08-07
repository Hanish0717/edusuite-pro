import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useMemo, useEffect } from "react";
import { getMockStudents } from "@/lib/mock-examcell-state";
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
  UpcomingExamItem,
} from "@/components/student-examinations/types";
import {
  MOCK_EXAM_PROFILE,
  MOCK_UPCOMING_EXAMS,
  MOCK_SEMESTER_RESULTS,
  MOCK_AVAILABLE_COURSES,
  MOCK_REGISTRATION_WORKFLOW,
  MOCK_EXAM_REGISTRATIONS,
} from "@/components/student-examinations/mock-data";
import { isCourseNptelExempted } from "@/components/student-examinations/nptel-service";

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
  XCircle,
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
  const [availableCourses, setAvailableCourses] = useState(MOCK_AVAILABLE_COURSES);
  const [workflow] = useState(MOCK_REGISTRATION_WORKFLOW);
  const [examRegistrations, setExamRegistrations] = useState(MOCK_EXAM_REGISTRATIONS);

  // Synchronize student's database status with active view states
  useEffect(() => {
    const mockStudents = getMockStudents();
    // Match either the profile roll number or 22CS101 (the switched student profile)
    const record = mockStudents.find(s => 
      s.roll_number === profile.rollNumber || s.roll_number === "22CS101"
    );
    if (record) {
      if (record.hall_ticket_status === 'Generated') {
        setHallTicketStatus("Generated");
        setExamRegStatus("Paid & Registered");
      } else {
        setHallTicketStatus("Locked");
        const attendanceOk = (record.attendance_percentage || 0) >= 75;
        const feesOk = (record.fee_balance || 0) === 0;
        if (attendanceOk && feesOk && record.is_registered) {
          setExamRegStatus("Paid & Registered");
        } else {
          setExamRegStatus("Locked");
        }
      }
    }
  }, [profile.rollNumber]);

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
  const [nptelChoice, setNptelChoice] = useState<"YES" | "NO" | null>(null);
  const [nptelDeclarations, setNptelDeclarations] = useState<Record<string, {
    fileName: string;
    fileSize: string;
    comments: string;
    pdfUrl: string;
    isNptel: boolean;
  }>>({});

  // --------------------------------------------------------------------------
  // SINGLE SOURCE OF TRUTH DYNAMIC DERIVATIONS
  // Master Source: Registered Courses & Exam Registration for selectedSemester
  // --------------------------------------------------------------------------

  // 1. Current Semester Registered Exams (Master Source)
  const currentSemExamRegs = useMemo(() => {
    const registeredInSem = availableCourses.filter(
      (c) => c.semester === selectedSemester && c.isRegistered
    );

    // If nptelChoice === "YES" or NPTEL credit transferred, exclude NPTEL course
    const activeRegCourses = registeredInSem.filter((c) => {
      if (c.isNptel) {
        if (
          nptelChoice === "YES" ||
          isCourseNptelExempted(c.id, nptelDeclarations) ||
          isCourseNptelExempted(c.code, nptelDeclarations)
        ) {
          return false;
        }
      }
      return true;
    });

    return activeRegCourses.map((c) => {
      const existing = examRegistrations.find(
        (e) => e.semester === selectedSemester && e.subjectCode === c.code
      );
      if (existing) return existing;

      return {
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
      };
    });
  }, [availableCourses, selectedSemester, nptelChoice, nptelDeclarations, examRegistrations, profile.registrationDeadline]);

  // 2. Master Dynamic Hall Ticket Exams: Exact match with currentSemExamRegs.length!
  const derivedUpcomingExams: UpcomingExamItem[] = useMemo(() => {
    const dates = ["Feb 10, 2025", "Feb 12, 2025", "Feb 14, 2025", "Feb 17, 2025", "Feb 19, 2025", "Feb 21, 2025"];
    return currentSemExamRegs.map((reg, idx) => ({
      id: `ex-${reg.id}`,
      semester: reg.semester,
      subjectCode: reg.subjectCode,
      subjectName: reg.subjectName,
      examDate: dates[idx % dates.length],
      timeSlot: "09:30 AM - 12:30 PM",
      duration: "3 Hours",
      hallNumber: reg.subjectCode.includes("Lab") ? "Lab Block - 04" : "Block A - 302",
      seatNumber: reg.subjectCode.includes("Lab") ? `L-${12 + idx}` : `A-${40 + idx}`,
      credits: reg.credits,
      type: reg.subjectCode.includes("Lab")
        ? "Lab"
        : reg.subjectCode.startsWith("OE") || reg.subjectCode.startsWith("PE") || reg.subjectCode.startsWith("NP")
        ? "Elective"
        : "Theory",
      status: "Scheduled" as const,
    }));
  }, [currentSemExamRegs]);

  // 3. Master Dynamic Results: Exact match with currentSemExamRegs.length!
  const derivedSemesterResults: SemesterResultItem[] = useMemo(() => {
    const currentSemSubjects = currentSemExamRegs.map((reg) => ({
      code: reg.subjectCode,
      name: reg.subjectName,
      internal: 38,
      external: 54,
      total: 92,
      grade: "O",
      credits: reg.credits,
      status: "Pass" as const,
    }));

    const totalCredits = currentSemSubjects.reduce((acc, s) => acc + s.credits, 0);

    return MOCK_SEMESTER_RESULTS.map((semRes) => {
      if (semRes.semester === selectedSemester) {
        return {
          ...semRes,
          creditsAttempted: totalCredits,
          creditsEarned: totalCredits,
          subjects: currentSemSubjects,
        };
      }
      return semRes;
    });
  }, [currentSemExamRegs, selectedSemester]);

  // 4. Synchronization Safeguards Validation Check
  useEffect(() => {
    const regCount = currentSemExamRegs.length;
    const htCount = derivedUpcomingExams.length;
    const resCount = derivedSemesterResults.find((r) => r.semester === selectedSemester)?.subjects.length || 0;

    if (regCount !== htCount || regCount !== resCount) {
      console.warn(
        `[Single Source Sync] Discrepancy detected for Semester ${selectedSemester}: Registered (${regCount}), Hall Ticket (${htCount}), Results (${resCount}). Datasets synchronized automatically.`
      );
    }
  }, [currentSemExamRegs, derivedUpcomingExams, derivedSemesterResults, selectedSemester]);

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
    setNptelChoice(null);
    toast.info(`Switched to ${year} (Semester ${defaultSem})`);
  };

  const handleSemesterChange = (sem: number) => {
    setSelectedSemester(sem);
    setSelectedCourseIds([]);
    setNptelChoice(null);
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

  // NPTEL Pre-Registration Check Modal State
  const [nptelCheckModalOpen, setNptelCheckModalOpen] = useState(false);

  const handleSelectAllCourses = () => {
    const unregisteredCourses = availableCourses.filter(
      (c) => c.semester === selectedSemester && !c.isRegistered
    );
    const allSelected =
      unregisteredCourses.length > 0 &&
      unregisteredCourses.every((c) => selectedCourseIds.includes(c.id));

    if (allSelected) {
      setSelectedCourseIds([]);
      toast.info("Deselected all courses");
    } else {
      // Instead of immediately selecting courses, open NPTEL check confirmation dialog
      setNptelCheckModalOpen(true);
    }
  };

  const handleNptelCheckYes = () => {
    setNptelChoice("YES");
    setNptelCheckModalOpen(false);
    // Open existing NPTEL Certificate Declaration modal
    setNptelDeclarationOpen(true);
  };

  const handleNptelCheckNo = () => {
    setNptelChoice("NO");
    setNptelCheckModalOpen(false);
    // Select all available courses for selected semester (including NPTEL as regular subject)
    const unregisteredCourses = availableCourses.filter(
      (c) => c.semester === selectedSemester && !c.isRegistered
    );
    setSelectedCourseIds(unregisteredCourses.map((c) => c.id));
    toast.success(
      `Selected all ${unregisteredCourses.length} offered courses (including NPTEL as regular subject) for Semester ${selectedSemester}`
    );
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

      // Generate Exam Registration records for the newly registered courses
      // Exclude NPTEL ONLY IF nptelChoice === "YES" (credit transferred)
      const newExamRegs = availableCourses
        .filter((c) => {
          if (!selectedCourseIds.includes(c.id)) return false;
          if (c.isNptel && nptelChoice === "YES") return false;
          return true;
        })
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

    // 2. If student chose YES for NPTEL completion, ensure certificate has been declared
    if (nptelChoice === "YES") {
      const hasUploadedNptelCert = Object.keys(nptelDeclarations).length > 0;
      if (!hasUploadedNptelCert) {
        setNptelDeclarationOpen(true);
        return;
      }
    }

    // If nptelChoice is "NO" (or "YES" with certificate uploaded), skip NPTEL popup and submit directly!
    executeFinalSubmission();
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
    const result = derivedSemesterResults.find((r) => r.semester === sem);
    if (result) {
      setSelectedSemesterResult(result);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. TOP 4 METRIC CARDS — Styled like 2nd Image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Branch / Department */}
        <div className="p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold tracking-wider text-[#344054] dark:text-slate-300 uppercase">
              MY DEPARTMENT
            </span>
            <div className="w-11 h-11 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#101828] dark:text-white">CSE</span>
              <span className="text-sm font-medium text-[#667085] dark:text-slate-400 ml-2">active</span>
            </div>
            <p className="text-xs font-normal text-[#98a2b3] dark:text-slate-500 mt-1.5">
              Department Profile
            </p>
          </div>
        </div>

        {/* Card 2: Earned Credits */}
        <div className="p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold tracking-wider text-[#344054] dark:text-slate-300 uppercase">
              EARNED CREDITS
            </span>
            <div className="w-11 h-11 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#101828] dark:text-white">{profile.creditsEarned}</span>
              <span className="text-sm font-medium text-[#667085] dark:text-slate-400 ml-2">completed</span>
            </div>
            <p className="text-xs font-normal text-[#98a2b3] dark:text-slate-500 mt-1.5">
              From declared results
            </p>
          </div>
        </div>

        {/* Card 3: Registered Courses */}
        <div className="p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold tracking-wider text-[#344054] dark:text-slate-300 uppercase">
              REGISTERED COURSES
            </span>
            <div className="w-11 h-11 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ClipboardCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#101828] dark:text-white">{registeredCoursesList.length}</span>
              <span className="text-sm font-medium text-[#667085] dark:text-slate-400 ml-2">enrolled</span>
            </div>
            <p className="text-xs font-normal text-[#98a2b3] dark:text-slate-500 mt-1.5">
              Semester {selectedSemester} Tracker
            </p>
          </div>
        </div>

        {/* Card 4: Registered Credits */}
        <div className="p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold tracking-wider text-[#344054] dark:text-slate-300 uppercase">
              REGISTERED CREDITS
            </span>
            <div className="w-11 h-11 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Ticket className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#101828] dark:text-white">{registeredCreditsSum}</span>
              <span className="text-sm font-medium text-[#667085] dark:text-slate-400 ml-2">credits</span>
            </div>
            <p className="text-xs font-normal text-[#98a2b3] dark:text-slate-500 mt-1.5">
              Max Limit: 24 Credits
            </p>
          </div>
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
          onSelectAllCourses={handleSelectAllCourses}
          onSubmitCourseRegistration={handleSubmitCourseRegistration}
          nptelDeclarations={nptelDeclarations}
        />
      )}

      {activeSubmodule === "exam-registration" && (
        <ExamRegistration
          profile={profile}
          examRegistrations={currentSemExamRegs}
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
          exams={derivedUpcomingExams}
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
          nptelDeclarations={nptelDeclarations}
        />
      )}

      {activeSubmodule === "results" && (
        <Results
          profile={profile}
          semesterResults={derivedSemesterResults}
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
          nptelDeclarations={nptelDeclarations}
        />
      )}

      {/* MODALS */}
      <HallTicketModal
        open={hallTicketModalOpen}
        onOpenChange={setHallTicketModalOpen}
        profile={profile}
        exams={derivedUpcomingExams}
        hallTicketRecord={selectedHallTicketRecord}
      />

      <GradeCardModal
        open={gradeCardModalOpen}
        onOpenChange={setGradeCardModalOpen}
        profile={profile}
        result={selectedSemesterResult}
        allResults={derivedSemesterResults}
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
        semesterResults={derivedSemesterResults}
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

      {/* NPTEL Course Completion Check Modal */}
      <Dialog open={nptelCheckModalOpen} onOpenChange={setNptelCheckModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
          <DialogHeader className="space-y-3 text-center">
            <div className="mx-auto p-3 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 w-fit border border-blue-200 dark:border-blue-900">
              <Award className="h-8 w-8" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white font-display">
              Have you completed any NPTEL Course?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              If you have completed an NPTEL course, upload your certificate so that the NPTEL subject is excluded from regular exam registration, hall ticket generation, and result processing.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-2">
            <Button
              type="button"
              onClick={handleNptelCheckYes}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-4 gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" /> Yes, I Completed NPTEL
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleNptelCheckNo}
              className="rounded-xl border-slate-300 dark:border-slate-700 font-bold text-xs h-10 px-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5"
            >
              <XCircle className="h-4 w-4 text-rose-500" /> No, Regular Registration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* NPTEL Course Declaration Modal */}
      <NptelDeclarationModal
        open={nptelDeclarationOpen}
        onOpenChange={setNptelDeclarationOpen}
        selectedNptelCourses={
          availableCourses.filter(
            (c) => (selectedCourseIds.includes(c.id) || selectedCourseIds.length === 0) && c.semester === selectedSemester && c.isNptel
          )
        }
        savedDeclarations={nptelDeclarations}
        onConfirm={(declarations) => {
          setNptelDeclarations(declarations);
          // Automatically select all remaining regular (non-NPTEL) courses for selected semester
          const regularUnregisteredCourses = availableCourses.filter(
            (c) => c.semester === selectedSemester && !c.isRegistered && !c.isNptel
          );
          setSelectedCourseIds(regularUnregisteredCourses.map((c) => c.id));
          setNptelDeclarationOpen(false);
          toast.success(
            "NPTEL certificate submitted! NPTEL course exempted; remaining regular courses selected."
          );
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
