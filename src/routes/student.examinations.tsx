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
import { useExamStore } from "@/components/student-examinations/exam-store";

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

  // Exam Store for dynamic courses & registrations
  const { registeredCourseIds } = useExamStore();

  // Dynamic Datasets
  const [profile] = useState(MOCK_EXAM_PROFILE);
  const [upcomingExams] = useState(MOCK_UPCOMING_EXAMS);
  const [semesterResults] = useState(MOCK_SEMESTER_RESULTS);
  const [availableCourses] = useState(MOCK_AVAILABLE_COURSES);
  const [workflow] = useState(MOCK_REGISTRATION_WORKFLOW);

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
  const safeRegisteredCourseIds = registeredCourseIds || [];
  const safeAvailableCourses = availableCourses || [];
  const semesterCourses = safeAvailableCourses.filter((c) => c.semester === selectedSemester);
  const registeredCoursesList = semesterCourses.filter((c) => safeRegisteredCourseIds.includes(c.id));
  const registeredCreditsSum = registeredCoursesList.reduce((s, c) => s + (c?.credits || 0), 0);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
            Student Examinations & Evaluation
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage course registration, exam applications, hall tickets, and view semester grade memos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block">Registered Credits:</span>
            <div className="text-2xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">
              {registeredCreditsSum} Credits
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUBMODULE TABS */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-6 overflow-x-auto">
          {submodulesList.map((sub) => {
            const IconComp = sub.icon;
            const isActive = activeSubmodule === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubmodule(sub.id as ExamSubmodule)}
                className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                  isActive
                    ? "border-[#0b193c] text-[#0b193c] dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <IconComp className="h-4 w-4" />
                <span>{sub.label}</span>
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
          onOpenCourseDrawer={(course) => {
            setSelectedCourse(course);
            setCourseDrawerOpen(true);
          }}
          onOpenConfirmModal={() => setRegistrationModalOpen(true)}
          onNavigateToExamReg={() => setActiveSubmodule("exam-registration")}
        />
      )}

      {activeSubmodule === "exam-registration" && (
        <ExamRegistration
          profile={profile}
          courses={availableCourses}
          selectedYear={selectedYear}
          selectedSemester={selectedSemester}
          onYearChange={handleYearChange}
          onSemesterChange={handleSemesterChange}
          onNavigateToCourseReg={() => setActiveSubmodule("course-registration")}
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
          selectedYear={selectedYear}
          selectedSemester={selectedSemester}
          onYearChange={handleYearChange}
          onSemesterChange={handleSemesterChange}
          onOpenGradeCardModal={(sr) => {
            setSelectedSemesterResult(sr);
            setGradeCardModalOpen(true);
          }}
          onOpenRevaluationModal={() => setRevaluationModalOpen(true)}
        />
      )}

      {/* MODALS */}
      <HallTicketModal
        isOpen={hallTicketModalOpen}
        onClose={() => setHallTicketModalOpen(false)}
        profile={profile}
        exams={upcomingExams}
        selectedRecord={selectedHallTicketRecord}
      />

      <GradeCardModal
        isOpen={gradeCardModalOpen}
        onClose={() => setGradeCardModalOpen(false)}
        profile={profile}
        selectedSemesterResult={selectedSemesterResult}
      />

      <CourseDetailsDrawer
        isOpen={courseDrawerOpen}
        onClose={() => setCourseDrawerOpen(false)}
        course={selectedCourse}
        onRegisterCourse={(cId) => {
          setCourseDrawerOpen(false);
        }}
      />

      <RegistrationModal
        isOpen={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
        onConfirm={() => {
          setRegistrationModalOpen(false);
        }}
      />

      <RevaluationModal
        isOpen={revaluationModalOpen}
        onClose={() => setRevaluationModalOpen(false)}
      />
    </div>
  );
}
