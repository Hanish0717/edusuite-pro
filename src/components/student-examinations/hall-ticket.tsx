import React, { useState } from "react";
import {
  StudentExamProfile,
  UpcomingExamItem,
  ExamRegWorkflowStatus,
  HallTicketWorkflowStatus,
  HallTicketRecordItem,
  AcademicYearOption,
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
  Eye,
  Printer,
  Clock,
  AlertTriangle,
  FileCheck,
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
  onOpenModal: (ht?: HallTicketRecordItem) => void;
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
  const [selectedCategory, setSelectedCategory] = useState<HallTicketCategory | null>("regular");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pastHallTickets] = useState<HallTicketRecordItem[]>(MOCK_PAST_HALL_TICKETS);

  const isExamRegCompleted = examRegStatus === "Paid & Registered" || selectedSemester < 5;

  // Filtered Archive Table
  const filteredPastHallTickets = pastHallTickets.filter((ht) => {
    const matchesSearch =
      ht.hallTicketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ht.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `Semester ${ht.semester}`.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || ht.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Top Statistics Counts
  const releasedCount = pastHallTickets.filter((h) => h.status === "Released" || h.status === "Verified & Issued").length;
  const downloadedCount = pastHallTickets.filter((h) => h.status === "Downloaded").length;
  const pendingCount = pastHallTickets.filter((h) => h.status === "Pending" || h.status === "Not Released").length;
  const supplementaryCount = pastHallTickets.filter((h) => h.examType.toLowerCase().includes("supple") || h.subjects.some(s => s.type === "Elective")).length + 1;

  // Status Badge Styling Helper
  const getStatusBadge = (status: HallTicketRecordItem["status"]) => {
    switch (status) {
      case "Released":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-[10px]">Released</Badge>;
      case "Downloaded":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-mono text-[10px]">Downloaded</Badge>;
      case "Verified & Issued":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-mono text-[10px]">Verified & Issued</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-mono text-[10px]">Pending</Badge>;
      case "Withheld":
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 font-mono text-[10px]">Withheld</Badge>;
      case "Not Released":
      default:
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 font-mono text-[10px]">Not Released</Badge>;
    }
  };

  const handleDownloadPDF = (title: string, htNumber?: string) => {
    const pdfContent = `EDUSUITE PRO UNIVERSITY ERP - HALL TICKET / ADMIT CARD
============================================================
Document: ${title}
Hall Ticket No: ${htNumber || `HT-2026-SEM${selectedSemester}-0542`}
Student Name: ${profile.name} (Adm No: ${profile.rollNumber})
Degree / Program: ${profile.degree} in ${profile.branch}
Exam Centre: ${profile.examCenter}
Session & Time: ${profile.examSession}

OFFICIAL EXAM SCHEDULE:
${exams.map((e) => `- ${e.subjectCode}: ${e.subjectName} | ${e.examDate} | ${e.timeSlot} | Hall: ${e.hallNumber}`).join("\n")}

Rule 1: Candidate must produce ID card along with Hall Ticket.
Rule 2: Smartwatches and gadgets strictly banned inside examination hall.

Controller of Examinations Signature`;

    const blob = new Blob([pdfContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `HallTicket_${(htNumber || title).replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Hall Ticket PDF (${title})`);
  };

  const handlePrint = (title: string) => {
    toast.info(`Preparing print window for ${title}...`);
    window.print();
  };

  return (
    <div className="space-y-6">

      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Released */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Hall Tickets Released</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {releasedCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Verified & Available for download</span>
        </div>

        {/* Card 2: Downloaded */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Downloaded</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <Download className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {downloadedCount}
          </div>
          <span className="text-[11px] text-blue-600 font-medium">Archived to local storage</span>
        </div>

        {/* Card 3: Pending */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Release</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Under Exam Branch review</span>
        </div>

        {/* Card 4: Supplementary */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Supplementary</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {supplementaryCount}
          </div>
          <span className="text-[11px] text-purple-600 font-medium">Backlog & special exams</span>
        </div>
      </div>

      {/* 2. CATEGORY SELECTION & LIVE ADMIT CARD PREVIEW */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <img src={profile.avatarUrl} alt={profile.name} className="h-16 w-16 rounded-xl object-cover border-2 border-blue-600 shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-600 font-mono font-bold uppercase">
                  Current Semester Admit Card &mdash; Sem {selectedSemester} ({selectedYear})
                </span>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-mono">
                  VERIFIED & ISSUED
                </Badge>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{profile.name}</h3>
              <p className="text-xs text-slate-500 font-mono">
                Adm No: <strong className="text-blue-600">{profile.rollNumber}</strong> &middot; HT No: <strong className="text-slate-800 dark:text-slate-200">HT-2026-SEM{selectedSemester}-0542</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => onOpenModal()}
              size="sm"
              variant="outline"
              className="rounded-xl text-xs font-bold gap-1.5 border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-blue-600" /> View Hall Ticket Modal
            </Button>

            <Button
              onClick={() => handlePrint(`Semester ${selectedSemester} Hall Ticket`)}
              size="sm"
              variant="outline"
              className="rounded-xl text-xs font-bold gap-1.5 border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>

            <Button
              onClick={() => handleDownloadPDF(`Semester ${selectedSemester} Hall Ticket`, `HT-2026-SEM${selectedSemester}-0542`)}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Button>
          </div>
        </div>

        {/* ACTIVE SEMESTER SUBJECTS SCHEDULE TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Ticket className="h-4 w-4 text-blue-600" /> Exam Time Table & Hall Allocation (Semester {selectedSemester})
            </h4>
            <span className="text-xs text-slate-500 font-mono">Centre: {profile.examCenter}</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-3">Code</th>
                  <th className="p-3">Subject Title</th>
                  <th className="p-3">Exam Date</th>
                  <th className="p-3">Timing Slot</th>
                  <th className="p-3">Reporting Time</th>
                  <th className="p-3">Hall No</th>
                  <th className="p-3">Seat No</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {exams.map((ex) => (
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
        </div>

      </div>

      {/* 3. PREVIOUS YEARS HALL TICKETS ARCHIVE TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="h-4 w-4 text-purple-600" /> Previous Hall Tickets Archive
            </h4>
            <p className="text-xs text-slate-500">Historical records for previous semester admit cards</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* SEARCH INPUT */}
            <div className="relative w-48 sm:w-60">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search semester or hall ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs rounded-xl"
              />
            </div>

            {/* STATUS FILTER DROPDOWN */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-2 font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="released">Released</option>
              <option value="downloaded">Downloaded</option>
              <option value="verified & issued">Verified & Issued</option>
              <option value="pending">Pending</option>
              <option value="withheld">Withheld</option>
            </select>
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
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPastHallTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400 text-xs">
                    No hall ticket records match your search filter.
                  </td>
                </tr>
              ) : (
                filteredPastHallTickets.map((ht) => (
                  <tr key={ht.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Semester {ht.semester}</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{ht.academicYear}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{ht.examType}</td>
                    <td className="p-3 font-mono font-bold text-blue-600">{ht.hallTicketNumber}</td>
                    <td className="p-3 font-mono text-slate-500">{ht.generatedDate}</td>
                    <td className="p-3">{getStatusBadge(ht.status)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1. VIEW HALL TICKET BUTTON */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onOpenModal(ht)}
                          className="h-7 text-xs font-semibold gap-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>

                        {/* 2. DOWNLOAD PDF BUTTON */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadPDF(`Semester ${ht.semester} Hall Ticket`, ht.hallTicketNumber)}
                          className="h-7 text-xs font-semibold gap-1 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer border-slate-200 dark:border-slate-700"
                        >
                          <Download className="h-3.5 w-3.5 text-blue-600" /> PDF
                        </Button>

                        {/* 3. PRINT BUTTON */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePrint(`Semester ${ht.semester} Hall Ticket`)}
                          className="h-7 text-xs font-semibold gap-1 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                        >
                          <Printer className="h-3.5 w-3.5" /> Print
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
