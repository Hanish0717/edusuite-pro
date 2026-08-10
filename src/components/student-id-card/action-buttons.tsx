import React from "react";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Download,
  Printer,
  Share2,
  AlertTriangle,
  FileCheck2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { downloadStudentIdCardPdf } from "@/components/student-profile/download-id-card";

interface ActionButtonsProps {
  onViewIdCard: () => void;
  onOpenLostModal: () => void;
  onOpenCorrectionModal: () => void;
  onOpenReprintModal: () => void;
  student: any;
}

export function ActionButtonsToolbar({
  onViewIdCard,
  onOpenLostModal,
  onOpenCorrectionModal,
  onOpenReprintModal,
  student,
}: ActionButtonsProps) {
  
  const handleDownloadPdf = () => {
    // Map StudentIdCardData flat structure to what downloadStudentIdCardPdf expects
    downloadStudentIdCardPdf({
      name: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      degree: student.degree,
      currentSemester: student.semester ?? student.currentSemester ?? 5,
      registrationNumber: student.registrationNumber,
      personal: {
        bloodGroup: student.bloodGroup ?? "O+",
        dob: student.dob ?? "—",
        phone: student.emergencyContact?.phone ?? "—",
        email: student.collegeEmail ?? "student@edusuite.edu.in",
        emergencyContact: {
          phone: student.emergencyContact?.phone ?? "—",
        },
      },
      address: {
        permanent: {
          street: student.address ?? "—",
          city: "Hyderabad",
          state: "Telangana",
          pincode: "500033",
        },
      },
    });
    toast.success("Downloading official Student ID Card PDF...");
  };

  const handlePrint = () => {
    toast.info("Opening print dialog...");
    window.print();
  };

  const handleShare = () => {
    const verifyUrl = `https://edusuite.edu.in/verify/${student.rollNumber}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(verifyUrl).then(() => {
        toast.success("Verification URL copied to clipboard!", {
          description: verifyUrl,
        });
      }).catch(() => {
        toast.info(`Share URL: ${verifyUrl}`);
      });
    } else {
      toast.info(`Share URL: ${verifyUrl}`);
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-blue-600" /> Identity Pass Actions & Service Requests
        </h3>
        <span className="text-xs text-slate-500">Librarian Approval Workflow Active</span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        
        {/* VIEW */}
        <Button
          onClick={onViewIdCard}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800 cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-blue-600" /> View ID Card
        </Button>

        {/* DOWNLOAD PDF */}
        <Button
          onClick={handleDownloadPdf}
          className="rounded-xl text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
          size="sm"
        >
          <Download className="h-3.5 w-3.5" /> Download PDF
        </Button>

        {/* PRINT */}
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800 cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" /> Print
        </Button>

        {/* SHARE */}
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800 cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" /> Share Pass
        </Button>

        <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:inline" />

        {/* REPORT LOST CARD */}
        <Button
          onClick={onOpenLostModal}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs gap-1.5 border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100/50 cursor-pointer"
        >
          <AlertTriangle className="h-3.5 w-3.5" /> Report Lost Card
        </Button>

        {/* REQUEST CORRECTION */}
        <Button
          onClick={onOpenCorrectionModal}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs gap-1.5 border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100/50 cursor-pointer"
        >
          <FileCheck2 className="h-3.5 w-3.5" /> Request Correction
        </Button>

      </div>
    </div>
  );
}
