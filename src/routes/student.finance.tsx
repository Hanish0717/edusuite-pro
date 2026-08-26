import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react";
import { FinanceSubmodule } from "@/components/student-finance/types";
import {
  MOCK_FINANCE_SUMMARY,
  MOCK_FEE_HEADS,
  MOCK_PAYMENT_RECORDS,
  MOCK_RECEIPTS,
  MOCK_SCHOLARSHIPS,
  MOCK_REFUND_REQUESTS,
  MOCK_NO_DUE,
} from "@/components/student-finance/mock-data";

// Submodule Views
import { FinanceDashboard } from "@/components/student-finance/finance-dashboard";
import { FeePayments } from "@/components/student-finance/fee-payments";
import { FeeStructure } from "@/components/student-finance/fee-structure";
import { Scholarships } from "@/components/student-finance/scholarships";
import { PaymentHistory } from "@/components/student-finance/payment-history";
import { Receipts } from "@/components/student-finance/receipts";
import { Refunds } from "@/components/student-finance/refunds";
import { NoDue } from "@/components/student-finance/no-due";

// Modals
import { PaymentModal } from "@/components/student-finance/modals/payment-modal";
import { ReceiptModal } from "@/components/student-finance/modals/receipt-modal";
import { ScholarshipModal } from "@/components/student-finance/modals/scholarship-modal";
import { RefundModal } from "@/components/student-finance/modals/refund-modal";
import { FinanceQueryModal } from "@/components/student-finance/modals/finance-query-modal";

// UI Primitives
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Home,
  ChevronRight,
  Wallet,
  CreditCard,
  Layers,
  Award,
  Clock,
  FileText,
  RotateCcw,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/student/finance")({
  head: () => ({
    meta: [{ title: "Fee & Payments — EduSuite Pro ERP" }],
  }),
  component: StudentFinancePage,
});

function StudentFinancePage() {
  const [activeSubmodule, setActiveSubmodule] = useState<FinanceSubmodule>("payments");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(false);

  // Dynamic Data States
  const [summary, setSummary] = useState(MOCK_FINANCE_SUMMARY);
  const [feeHeads, setFeeHeads] = useState(MOCK_FEE_HEADS);
  const [paymentRecords, setPaymentRecords] = useState(MOCK_PAYMENT_RECORDS);
  const [receipts, setReceipts] = useState(MOCK_RECEIPTS);
  const [scholarships, setScholarships] = useState(MOCK_SCHOLARSHIPS);
  const [refunds, setRefunds] = useState(MOCK_REFUND_REQUESTS);
  const [clearances, setClearances] = useState(MOCK_NO_DUE);

  // Modal States
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [scholarshipModalOpen, setScholarshipModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [queryModalOpen, setQueryModalOpen] = useState(false);

  // Submodules Toolbar List
  const submodulesList = [
    { id: "payments", label: "Fee Payments", icon: CreditCard },
    { id: "structure", label: "Fee Structure", icon: Layers },
    { id: "scholarships", label: "Scholarships", icon: Award },
    { id: "history", label: "Payment History", icon: Clock },
    { id: "receipts", label: "Receipts", icon: FileText },
    { id: "refunds", label: "Refund Requests", icon: RotateCcw },
    { id: "nodue", label: "No Due Status", icon: ShieldCheck },
  ];

  // Payment Handler
  const handlePaymentSuccess = (paidAmt: number) => {
    setSummary((prev) => ({
      ...prev,
      amountPaid: prev.amountPaid + paidAmt,
      pendingAmount: Math.max(0, prev.pendingAmount - paidAmt),
      paymentStatus: prev.pendingAmount - paidAmt <= 0 ? "Paid" : "Partially Paid",
    }));

    const newTx = {
      transactionId: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      date: "Feb 01, 2025",
      amount: paidAmt,
      paymentMode: "UPI" as const,
      referenceNumber: `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      status: "Success" as const,
      semester: 5,
      receiptNumber: `REC-2025-0${Math.floor(100 + Math.random() * 900)}`,
      feeHead: "Semester V Tuition Dues",
    };

    setPaymentRecords((prev) => [newTx, ...prev]);
    setReceipts((prev) => [
      {
        receiptNumber: newTx.receiptNumber,
        transactionId: newTx.transactionId,
        amount: paidAmt,
        paymentDate: "Feb 01, 2025",
        paymentMode: "UPI (Google Pay)",
        academicYear: "2024 - 2025",
        semester: 5,
        qrVerified: true,
      },
      ...prev,
    ]);
  };

  const toggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 900);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center text-xs text-slate-500 gap-1.5 font-medium">
        <Link to="/dashboard" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
          <Home className="h-3.5 w-3.5" /> Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
        <Link to="/student/dashboard" className="hover:text-blue-600 transition-colors">
          Student
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
        <span className="font-bold text-slate-900 dark:text-white">Fee & Payments</span>
      </nav>

      {/* 2. SUBMODULE SWITCHER TOOLBAR */}
      <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto scrollbar-none">
        
        {/* Submodules Bar */}
        <div className="flex items-center gap-1.5 min-w-max">
          {submodulesList.map((sub) => {
            const IconComp = sub.icon;
            const isActive = activeSubmodule === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubmodule(sub.id as FinanceSubmodule)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 3. MAIN CONTENT */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      ) : isEmptyState ? (
        <div className="p-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <EmptyState
            title="No Financial Records Found"
            description="There are currently no active fee dues or transaction records for this academic term."
            actionLabel="Reset to Demo View"
            onAction={() => setIsEmptyState(false)}
          />
        </div>
      ) : (
        <>
          {activeSubmodule === "dashboard" && (
            <FinanceDashboard
              summary={summary}
              recentPayments={paymentRecords}
              scholarships={scholarships}
              onNavigateSubmodule={(sub) => setActiveSubmodule(sub)}
              onOpenPaymentModal={() => setPaymentModalOpen(true)}
              onOpenScholarshipModal={() => setScholarshipModalOpen(true)}
              onOpenQueryModal={() => setQueryModalOpen(true)}
              onOpenReceiptModal={(rec) => {
                setSelectedReceipt(rec);
                setReceiptModalOpen(true);
              }}
            />
          )}

          {activeSubmodule === "payments" && (
            <FeePayments
              summary={summary}
              feeHeads={feeHeads}
              onOpenPaymentModal={() => setPaymentModalOpen(true)}
            />
          )}

          {activeSubmodule === "structure" && (
            <FeeStructure summary={summary} feeHeads={feeHeads} />
          )}

          {activeSubmodule === "scholarships" && (
            <Scholarships
              scholarships={scholarships}
              onOpenScholarshipModal={() => setScholarshipModalOpen(true)}
            />
          )}

          {activeSubmodule === "history" && (
            <PaymentHistory
              payments={paymentRecords}
              onOpenReceiptModal={(rec) => {
                setSelectedReceipt(rec);
                setReceiptModalOpen(true);
              }}
            />
          )}

          {activeSubmodule === "receipts" && (
            <Receipts
              receipts={receipts}
              onOpenReceiptModal={(rec) => {
                setSelectedReceipt(rec);
                setReceiptModalOpen(true);
              }}
            />
          )}

          {activeSubmodule === "refunds" && (
            <Refunds
              refunds={refunds}
              onOpenRefundModal={() => setRefundModalOpen(true)}
            />
          )}

          {activeSubmodule === "nodue" && <NoDue clearances={clearances} />}
        </>
      )}

      {/* 4. MODALS */}
      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        summary={summary}
        onSuccess={handlePaymentSuccess}
      />

      <ReceiptModal
        open={receiptModalOpen}
        onOpenChange={setReceiptModalOpen}
        receipt={selectedReceipt}
        summary={summary}
      />

      <ScholarshipModal
        open={scholarshipModalOpen}
        onOpenChange={setScholarshipModalOpen}
        onSuccess={(sch) => setScholarships((prev) => [sch, ...prev])}
      />

      <RefundModal
        open={refundModalOpen}
        onOpenChange={setRefundModalOpen}
        onSuccess={(ref) => setRefunds((prev) => [ref, ...prev])}
      />

      <FinanceQueryModal
        open={queryModalOpen}
        onOpenChange={setQueryModalOpen}
      />

    </div>
  );
}
