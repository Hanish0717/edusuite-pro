import React, { useState } from "react";
import { ExamScheduleItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, MapPin, Download, Eye, Award, X, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface ExamTimetableProps {
  exams: ExamScheduleItem[];
}

export function ExamTimetable({ exams }: ExamTimetableProps) {
  const [selectedExam, setSelectedExam] = useState<ExamScheduleItem | null>(null);

  const handleDownloadHallTicket = (exam: ExamScheduleItem) => {
    const ticketContent = `EDUSUITE PRO COLLEGE OF ENGINEERING & TECHNOLOGY
=====================================================
OFFICIAL EXAMINATION HALL TICKET / ADMIT PASS
=====================================================
Candidate Name: Sai Teja | Adm No: 22CS101
Branch: Computer Science & Engineering (Sem V)
Academic Session: 2026-2027

EXAMINATION DETAILS:
-----------------------------------------------------
Exam Title: ${exam.examName}
Subject Code: ${exam.subjectCode}
Subject Name: ${exam.subjectName}
Exam Date: ${exam.date}
Time Slot: ${exam.time} (${exam.duration})
Exam Venue: ${exam.venue}
Assigned Seat Number: Seat #${exam.seatNumber}
Hall Ticket Status: ${exam.hallTicketStatus}

EXAMINATION INSTRUCTIONS:
1. Candidate must report to the examination hall 20 minutes prior to commencement.
2. Official Student ID Card and printed Hall Ticket are mandatory for entry.
3. Mobile phones, smartwatches, and programmable calculators are strictly prohibited.

Controller of Examinations — EduSuite ERP`;

    const blob = new Blob([ticketContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `HallTicket_${exam.subjectCode}_${exam.date.replace(/[\s,]+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Official Hall Ticket PDF for ${exam.subjectCode}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="h-4 w-4 text-rose-500" /> Mid-Term & End-Semester Exam Schedule ({exams.length})
        </h3>
        <span className="text-xs font-mono text-slate-500">Controller of Examinations Portal</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md hover:border-rose-500/30 transition-all flex flex-col justify-between space-y-4 group overflow-hidden"
          >
            {/* TOP HEADER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono font-bold text-rose-600 border-rose-200 text-[11px]">
                  {exam.subjectCode}
                </Badge>

                <Badge
                  className={`text-[9px] px-2 py-0.5 font-mono ${
                    exam.hallTicketStatus === "Issued"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }`}
                >
                  Hall Ticket: {exam.hallTicketStatus}
                </Badge>
              </div>

              <span className="text-[11px] font-mono text-slate-400 block">{exam.examName}</span>

              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors leading-snug">
                {exam.subjectName}
              </h4>
            </div>

            {/* VENUE & SEAT METRICS */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-rose-500" /> Exam Date:
                </span>
                <strong className="text-slate-900 dark:text-white">{exam.date}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-purple-600" /> Time Slot:
                </span>
                <span className="text-purple-600 font-bold">{exam.time} ({exam.duration})</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" /> Exam Venue:
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{exam.venue}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Seat:</span>
                <Badge variant="outline" className="font-mono text-xs font-bold text-slate-900 bg-amber-50 dark:bg-amber-950/40 border-amber-300">
                  Seat #{exam.seatNumber}
                </Badge>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full min-w-0 overflow-hidden">
              <Button
                onClick={() => setSelectedExam(exam)}
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1 w-full min-w-0 overflow-hidden font-semibold cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                <span className="truncate">View Details</span>
              </Button>

              <Button
                onClick={() => handleDownloadHallTicket(exam)}
                size="sm"
                className="h-8 text-xs rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1 w-full min-w-0 overflow-hidden cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Download Ticket</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* EXAM DETAILS MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="font-mono text-xs font-bold text-rose-600 border-rose-300 mb-1">
                  {selectedExam.subjectCode} • {selectedExam.examName}
                </Badge>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedExam.subjectName}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedExam(null)}
                className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Exam Date</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedExam.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Timing</span>
                <span className="font-bold text-purple-600">{selectedExam.time} ({selectedExam.duration})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Examination Hall</span>
                <span className="font-bold text-blue-600">{selectedExam.venue}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Seat Allocation</span>
                <span className="font-bold text-amber-600">Seat #{selectedExam.seatNumber}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-rose-500" /> Syllabus Coverage & Regulations
              </h4>
              <ul className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] list-disc list-inside">
                <li>Modules Covered: Units 1, 2, 3 & 4 (Full Mid-Sem Syllabus).</li>
                <li>Scientific non-programmable calculators permitted.</li>
                <li>Reporting time: 20 minutes before examination start time.</li>
                <li>Hall Ticket and College Physical ID Card mandatory.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedExam(null)}
                className="rounded-xl text-xs"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleDownloadHallTicket(selectedExam);
                  setSelectedExam(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs gap-1.5"
              >
                <Download className="h-4 w-4" /> Download Admit Pass
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
