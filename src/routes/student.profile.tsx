import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react";
import { MOCK_STUDENT_PROFILE } from "@/components/student-profile/mock-data";
import { StudentProfileData } from "@/components/student-profile/types";
import { StudentHeaderCard } from "@/components/student-profile/header-card";
import { OverviewCardsGrid } from "@/components/student-profile/overview-cards";
import { downloadStudentIdCardPdf } from "@/components/student-profile/download-id-card";

// Modals
import { DigitalIdCardModal } from "@/components/student-profile/modals/digital-id-card-modal";
import { QrModal } from "@/components/student-profile/modals/qr-modal";
import { EditProfileDrawer } from "@/components/student-profile/modals/edit-profile-drawer";
import { ApplyLeaveModal } from "@/components/student-profile/modals/apply-leave-modal";
import { PayFeesModal } from "@/components/student-profile/modals/pay-fees-modal";
import { DocumentPreviewModal } from "@/components/student-profile/modals/document-preview-modal";
import { BonafideModal } from "@/components/student-profile/modals/bonafide-modal";
import { ResetPasswordModal } from "@/components/student-profile/modals/reset-password-modal";
// Tabs
import { OverviewTab } from "@/components/student-profile/tabs/overview-tab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Home,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [{ title: "Student Profile Module — EduSuite Pro ERP" }],
  }),
  component: StudentProfilePage,
});
function StudentProfilePage() {
  const [student, setStudent] = useState<StudentProfileData>(MOCK_STUDENT_PROFILE);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(false);

  // Modal open states
  const [idCardOpen, setIdCardOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [payFeesModalOpen, setPayFeesModalOpen] = useState(false);
  const [docPreviewModalOpen, setDocPreviewModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [bonafideModalOpen, setBonafideModalOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  // Download handlers
  const handleDownloadPdf = () => {
    downloadStudentIdCardPdf(student);
  };

  const handleExportExcel = () => {
    toast.success("Exporting student records to Excel (.xlsx)...");
  };

  const handleExportCsv = () => {
    toast.success("Exporting student records to CSV...");
  };

  const handlePrint = () => {
    window.print();
  };

  // State toggle helpers for testing
  const toggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  };



  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. BREADCRUMB NAVIGATION */}
      <nav className="flex items-center text-xs text-slate-500 gap-1.5 font-medium">
        <Link to="/dashboard" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
          <Home className="h-3.5 w-3.5" /> Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
        <Link to="/student/dashboard" className="hover:text-blue-600 transition-colors">
          Student
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
        <span className="font-bold text-slate-900 dark:text-white">Profile</span>
      </nav>



      {/* LOADING SKELETON STATE SIMULATION */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      ) : isEmptyState ? (
        /* EMPTY STATE TESTING VIEW */
        <div className="p-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <EmptyState
            title="No Student Records Found"
            description="The requested student profile has not been assigned or initialized in the ERP database."
            actionLabel="Reset to Demo Student"
            onAction={() => setIsEmptyState(false)}
          />
        </div>
      ) : (
        /* 3. MAIN ERP PROFILE CONTENT */
        <>
          {/* HEADER CARD */}
          <StudentHeaderCard
            student={student}
            onOpenIdCard={() => {}}
            onOpenQr={() => setQrOpen(true)}
            onOpenEdit={() => setEditDrawerOpen(true)}
            onDownloadPdf={() => {}}
            onPrint={handlePrint}
            onOpenResetPassword={() => setResetPasswordOpen(true)}
          />

          {/* MAIN OVERVIEW CONTENT */}
          <OverviewTab
            student={student}
            onOpenBonafide={() => setBonafideModalOpen(true)}
            onOpenLeave={() => setLeaveModalOpen(true)}
            onOpenPayFees={() => setPayFeesModalOpen(true)}
            onOpenIdCard={() => setIdCardOpen(true)}
            onOpenLibrarySearch={() => {}}
          />
        </>
      )}

      {/* 5. MODAL DIALOGS & DRAWERS */}
      <DigitalIdCardModal
        open={idCardOpen}
        onOpenChange={setIdCardOpen}
        student={student}
      />

      <QrModal
        open={qrOpen}
        onOpenChange={setQrOpen}
        student={student}
      />

      <EditProfileDrawer
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        student={student}
        onSave={(updated) => setStudent(updated)}
      />

      <ApplyLeaveModal
        open={leaveModalOpen}
        onOpenChange={setLeaveModalOpen}
        onSuccess={(newLeave) => {
          setStudent({
            ...student,
            attendanceSummary: {
              ...student.attendanceSummary,
              leaves: [newLeave, ...student.attendanceSummary.leaves],
            },
          });
        }}
      />

      <PayFeesModal
        open={payFeesModalOpen}
        onOpenChange={setPayFeesModalOpen}
        amount={75000}
        onPaymentSuccess={() => {
          setStudent({
            ...student,
            feeStatus: "Paid",
            feePendingAmount: 0,
          });
        }}
      />

      <DocumentPreviewModal
        open={docPreviewModalOpen}
        onOpenChange={setDocPreviewModalOpen}
        document={selectedDoc}
      />

      <BonafideModal
        open={bonafideModalOpen}
        onOpenChange={setBonafideModalOpen}
        student={student}
      />

      <ResetPasswordModal
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
      />

    </div>
  );
}
