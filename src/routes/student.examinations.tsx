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

// UI Primitives & Icons
import {
  BookOpen,
  Ticket,
  Award,
  ClipboardCheck,
  Lock,
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
  const [courseRegStatus, setCourseRegStatus] = useState<CourseRegWorkflowStatus>("Submitted");
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

  // Year Change Handler
  const handleYearChange = (year: AcademicYearOption) => {
    setSelectedYear(year);
    const sems = YEAR_TO_SEMESTERS_MAP[year] || [1, 2];
    const defaultSem = sems[0] ?? 1;
    setSelectedSemester(defaultSem);
    toast.info(`Switched to ${year} (Semester ${defaultSem})`);
  };

  const handleSemesterChange = (sem: number) => {
    setSelectedSemester(sem);
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

    </div>
  );
}
