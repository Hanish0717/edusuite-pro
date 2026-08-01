import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentExamProfile, UpcomingExamItem } from "../types";
import { Download, Printer, Share2, QrCode, ShieldCheck, FileSpreadsheet, Building, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface HallTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: StudentExamProfile;
  exams: UpcomingExamItem[];
}

export function HallTicketModal({ open, onOpenChange, profile, exams }: HallTicketModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success("Downloading Official Hall Ticket PDF...");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://edusuite.edu/verify/hallticket/${profile.rollNumber}`);
    toast.success("Hall Ticket verification link copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
        <DialogHeader className="space-y-1 text-left border-b pb-4 border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white font-black grid place-items-center font-display text-lg">
                ES
              </div>
              <div>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  EduSuite University — Examination Hall Ticket
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Semester End Theory & Practical Examinations (AY {profile.academicYear})
                </DialogDescription>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs px-2.5 py-1 font-mono">
              VERIFIED & ISSUED
            </Badge>
          </div>
        </DialogHeader>

        {/* PRINTABLE HALL TICKET BODY */}
        <div className="space-y-5 my-4 print:p-0">
          
          {/* STUDENT IDENTIFIER ROW */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-16 w-16 rounded-xl object-cover border-2 border-blue-600 shadow-sm"
              />
              <div className="space-y-1 text-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{profile.name}</h3>
                <p className="text-slate-500 font-mono">Roll No: <strong className="text-blue-600">{profile.rollNumber}</strong></p>
                <p className="text-slate-500">{profile.program} &middot; {profile.branch}</p>
                <p className="text-slate-500 font-semibold">{profile.degree} Semester {profile.currentSemester} ({profile.section})</p>
              </div>
            </div>

            <div className="text-right sm:text-right space-y-1 text-xs border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4 border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Designated Examination Centre</span>
              <strong className="text-slate-900 dark:text-white text-xs block">{profile.examCenter}</strong>
              <span className="text-[11px] text-blue-600 font-mono font-semibold block">Session: {profile.examSession}</span>
            </div>
          </div>

          {/* REGISTERED SUBJECTS TABLE */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Registered Examination Schedule
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Subject Name</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Time Slot</th>
                    <th className="p-2.5">Hall</th>
                    <th className="p-2.5">Seat</th>
                    <th className="p-2.5">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {exams.map((ex) => (
                    <tr key={ex.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-mono font-bold text-blue-600">{ex.subjectCode}</td>
                      <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{ex.subjectName}</td>
                      <td className="p-2.5 font-mono">{ex.examDate}</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">{ex.timeSlot}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">{ex.hallNumber}</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-600">{ex.seatNumber}</td>
                      <td className="p-2.5 border-l border-dashed border-slate-200 dark:border-slate-700 w-24"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RULES & OFFICIAL SEAL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2 text-[11px] text-slate-500 space-y-1 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
              <strong className="text-amber-800 dark:text-amber-300 block">Candidate Mandatory Instructions:</strong>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Report to examination hall 30 minutes prior to scheduled time.</li>
                <li>Physical identity card and printed hall ticket are mandatory.</li>
                <li>Mobile phones, smartwatches, and electronic gadgets are strictly banned.</li>
              </ul>
            </div>

            {/* BARCODE & SEAL */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <div className="font-mono text-[10px] tracking-widest font-black text-slate-800 dark:text-slate-200 border-b border-t py-1 w-full my-1">
                ||||| | |||||| ||| ||||||| |||||
              </div>
              <span className="text-[9px] text-slate-400 font-mono">HT-VERIFIED-2025-22CS101</span>
              <div className="text-[10px] font-bold text-blue-600 pt-1">Controller of Examinations</div>
            </div>
          </div>

        </div>

        <DialogFooter className="pt-2 flex flex-wrap justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={handleShare} className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700">
            <Share2 className="h-3.5 w-3.5 text-blue-600" /> Share Verification Link
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={handlePrint} className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700">
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
            <Button type="button" onClick={handleDownload} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
