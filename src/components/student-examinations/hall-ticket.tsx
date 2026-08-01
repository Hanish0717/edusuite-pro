import React, { useState } from "react";
import {
  StudentExamProfile,
  UpcomingExamItem,
  ExamRegWorkflowStatus,
  HallTicketWorkflowStatus,
  HallTicketRecordItem,
  AcademicYearOption,
  YEAR_TO_SEMESTERS_MAP,
  HallTicketCategory,
} from "./types";
import { MOCK_PAST_HALL_TICKETS } from "./mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  History,
  Lock,
  ArrowRight,
  Search,
  CheckCircle2,
  Ticket,
  Layers,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface HallTicketProps {
  profile: StudentExamProfile;
  exams: UpcomingExamItem[];
  examRegStatus: ExamRegWorkflowStatus;
  hallTicketStatus: HallTicketWorkflowStatus;
  selectedYear: AcademicYearOption;
  selectedSemester: number;
  onYearChange: (year: AcademicYearOption) => void;
  onSemesterChange: (sem: number) => void;
  onOpenModal: () => void;
  onNavigateToExamReg: () => void;
}

export function HallTicket({
  profile,
  exams,
  examRegStatus,
  hallTicketStatus,
  selectedYear,
  selectedSemester,
  onYearChange,
  onSemesterChange,
  onOpenModal,
  onNavigateToExamReg,
}: HallTicketProps) {
  // State: Category selection ("regular" | "supplementary")
  const [selectedCategory, setSelectedCategory] = useState<HallTicketCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pastHallTickets] = useState<HallTicketRecordItem[]>(MOCK_PAST_HALL_TICKETS);

  const isExamRegCompleted = examRegStatus === "Paid & Registered" || selectedSemester < 5;

  const filteredPastHallTickets = pastHallTickets.filter(
    (ht) =>
      ht.hallTicketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ht.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `Semester ${ht.semester}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Supplementary exams list if student has active backlogs
  const supplementaryExams: UpcomingExamItem[] = [
    {
      id: "supp-101",
      semester: selectedSemester,
      subjectCode: "EE201",
      subjectName: "Basic Electrical Engineering (Supplementary)",
      examDate: "Feb 22, 2025",
      timeSlot: "02:00 PM - 05:00 PM",
      duration: "3 Hours",
      hallNumber: "Block B - 204",
      seatNumber: "B-12",
      credits: 3.0,
      type: "Theory",
      status: "Scheduled",
    },
  ];

  const handleCardClick = (cat: HallTicketCategory) => {
    setSelectedCategory(cat);
    if (cat === "supplementary" && profile.activeBacklogs === 0) {
      toast.info("No Active Backlogs — You do not have any supplementary exams.");
    } else {
      toast.success(`Showing ${cat === "regular" ? "Regular" : "Supplementary"} Exam Hall Ticket`);
    }
  };

  const handleDownloadPDF = (title: string, htNumber?: string) => {
    toast.success(`Downloading Hall Ticket PDF (${title}${htNumber ? ` — ${htNumber}` : ""})...`);
    // Simulated PDF trigger logic
    const element = document.createElement("a");
    const file = new Blob([`EduSuite Pro Official Hall Ticket Document: ${title}`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `HallTicket_${title.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const activeSubjects = selectedCategory === "supplementary" ? supplementaryExams : exams;

  return (
    <div className="space-y-8">

      {/* 1. CATEGORY SELECTION CARDS (REGULAR & SUPPLEMENTARY) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ticket className="h-4 w-4 text-blue-600" /> Select Hall Ticket Category
            </h3>
            <p className="text-xs text-slate-500">Select a category below to view and download your official admit card</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Regular Exam Hall Ticket */}
          <div
            onClick={() => handleCardClick("regular")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedCategory === "regular"
                ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20"
                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600">
                <Ticket className="h-5 w-5" />
              </div>
              <Badge className={selectedCategory === "regular" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}>
                {selectedCategory === "regular" ? "Active View" : "End-Sem"}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Regular Exam Hall Ticket</h4>
              <p className="text-xs text-slate-500 mt-0.5">End-Semester Main Theory & Lab Examinations</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick("regular");
              }}
              className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline text-left"
            >
              Click to view preview <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2: Supplementary Hall Ticket */}
          <div
            onClick={() => handleCardClick("supplementary")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedCategory === "supplementary"
                ? "border-purple-600 bg-purple-50/40 dark:bg-purple-950/30 shadow-md ring-2 ring-purple-500/20"
                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-slate-700 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-600">
                <Layers className="h-5 w-5" />
              </div>
              <Badge className={selectedCategory === "supplementary" ? "bg-purple-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}>
                {selectedCategory === "supplementary" ? "Active View" : profile.activeBacklogs > 0 ? "Backlog Required" : "No Backlogs"}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Supplementary Hall Ticket</h4>
              <p className="text-xs text-slate-500 mt-0.5">Backlog & Special Improvement Examinations</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick("supplementary");
              }}
              className="text-[11px] font-bold text-purple-600 flex items-center gap-1 hover:underline text-left"
            >
              Click to view preview <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* 2. INLINE PAGE PREVIEW AREA */}
      {!selectedCategory ? (
        /* INITIAL EMPTY PLACEHOLDER */
        <div className="p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 shadow-sm animate-in fade-in duration-300">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600">
            <Ticket className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Select a Hall Ticket Category
            </h3>
            <p className="text-xs text-slate-500">
              Select a Hall Ticket category above to preview and download your admit card for Semester {selectedSemester}.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button
              onClick={() => handleCardClick("regular")}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
            >
              <Ticket className="h-3.5 w-3.5" /> Regular Hall Ticket
            </Button>
            <Button
              onClick={() => handleCardClick("supplementary")}
              size="sm"
              variant="outline"
              className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700"
            >
              <Layers className="h-3.5 w-3.5 text-purple-600" /> Supplementary
            </Button>
          </div>
        </div>
      ) : selectedCategory === "supplementary" && profile.activeBacklogs === 0 ? (
        /* NO BACKLOGS STATE FOR SUPPLEMENTARY HALL TICKET */
        <div className="p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3 shadow-sm animate-in fade-in duration-300">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Active Backlogs
            </h3>
            <p className="text-xs text-slate-500">
              You do not have any registered supplementary exams or pending backlogs for Semester {selectedSemester}. Supplementary hall ticket is not required.
            </p>
          </div>
          <Button
            onClick={() => handleCardClick("regular")}
            size="sm"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm mt-2"
          >
            <Ticket className="h-3.5 w-3.5" /> View Regular Hall Ticket
          </Button>
        </div>
      ) : !isExamRegCompleted && selectedCategory === "regular" ? (
        /* LOCK STATE FOR REGULAR EXAM IF REGISTRATION INCOMPLETE */
        <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 shadow-sm animate-in fade-in duration-300">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-600">
            <Lock className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Regular Hall Ticket Locked
            </h3>
            <p className="text-xs text-slate-500">
              Reason: You have not completed Exam Registration or fee payment for Semester {selectedSemester}.
            </p>
          </div>
          <Button
            onClick={onNavigateToExamReg}
            size="sm"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
          >
            Go to Exam Registration <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        /* HALL TICKET CARD WITH ONLY DOWNLOAD BUTTON */
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* HEADER WITH ONLY DOWNLOAD BUTTON */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800 gap-4">
            <div className="flex items-center gap-4">
              <img src={profile.avatarUrl} alt={profile.name} className="h-16 w-16 rounded-xl object-cover border-2 border-blue-600" />
              <div>
                <span className="text-[10px] text-blue-600 font-mono font-bold uppercase">
                  Official Admit Card — {selectedCategory.toUpperCase()} EXAMS (Sem {selectedSemester})
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{profile.name}</h3>
                <p className="text-xs text-slate-500 font-mono">Roll No: <strong className="text-blue-600">{profile.rollNumber}</strong> &middot; {profile.branch}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">SEAL: VERIFIED & STAMPED</Badge>
              {/* DEDICATED CLEAN DOWNLOAD BUTTON */}
              <Button
                onClick={() => handleDownloadPDF(`${selectedCategory.toUpperCase()} Hall Ticket Sem ${selectedSemester}`)}
                size="sm"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-2 px-4 shadow-sm shadow-blue-500/20"
              >
                <Download className="h-4 w-4" /> Download Hall Ticket (PDF)
              </Button>
            </div>
          </div>

          {/* SCHEDULE TABLE */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-3">Code</th>
                  <th className="p-3">Subject Title</th>
                  <th className="p-3">Exam Date</th>
                  <th className="p-3">Timing</th>
                  <th className="p-3">Reporting Time</th>
                  <th className="p-3">Hall</th>
                  <th className="p-3">Seat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeSubjects.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-blue-600">{ex.subjectCode}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{ex.subjectName}</td>
                    <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{ex.examDate}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{ex.timeSlot}</td>
                    <td className="p-3 font-mono text-amber-600 font-bold">09:00 AM</td>
                    <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{ex.hallNumber}</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">{ex.seatNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* INSTRUCTIONS */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-[11px] text-slate-500 space-y-1 max-w-xl">
              <strong className="text-slate-900 dark:text-white block">Candidate Instructions:</strong>
              <p>&bull; Produce this hall ticket along with your official College Identity Card at the examination hall entrance.</p>
              <p>&bull; Electronic gadgets and unauthorized paper notes are strictly prohibited inside the hall.</p>
            </div>
            <div className="text-center shrink-0 border-l pl-4 border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-blue-600 flex items-center justify-center text-blue-600 font-bold text-[9px] uppercase font-mono p-1">
                OFFICIAL SEAL EXAM BRANCH
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-1 block">Controller of Examinations</span>
            </div>
          </div>

        </div>
      )}

      {/* 3. PREVIOUS YEARS HALL TICKETS ARCHIVE TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="h-4 w-4 text-purple-600" /> Previous Year Hall Tickets Archive
            </h4>
            <p className="text-xs text-slate-500">Historical records & downloadable PDFs for all previous semester hall tickets</p>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search hall ticket number or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                <th className="p-3">Semester</th>
                <th className="p-3">Academic Year</th>
                <th className="p-3">Exam Type</th>
                <th className="p-3">Hall Ticket Number</th>
                <th className="p-3">Generated Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPastHallTickets.map((ht) => (
                <tr key={ht.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Semester {ht.semester}</td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{ht.academicYear}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{ht.examType}</td>
                  <td className="p-3 font-mono font-bold text-blue-600">{ht.hallTicketNumber}</td>
                  <td className="p-3 font-mono text-slate-500">{ht.generatedDate}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">{ht.status}</Badge>
                  </td>
                  <td className="p-3">
                    {/* DEDICATED CLEAN DOWNLOAD BUTTON FOR PREVIOUS HALL TICKETS */}
                    <Button
                      size="sm"
                      onClick={() => handleDownloadPDF(`Semester ${ht.semester} (${ht.academicYear})`, ht.hallTicketNumber)}
                      className="h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 dark:border-blue-900/60 text-xs font-semibold gap-1.5 transition-all shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
