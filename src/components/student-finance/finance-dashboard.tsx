import React from "react";
import { StudentFinanceSummary, PaymentRecordItem, ScholarshipItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  CreditCard,
  Download,
  Award,
  HelpCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  PieChart as PieIcon,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  MOCK_CHARTS_SEM_PAYMENTS,
  MOCK_CHARTS_FEE_DISTRIBUTION,
} from "./mock-data";

interface FinanceDashboardProps {
  summary: StudentFinanceSummary;
  recentPayments: PaymentRecordItem[];
  scholarships: ScholarshipItem[];
  onNavigateSubmodule: (sub: any) => void;
  onOpenPaymentModal: () => void;
  onOpenScholarshipModal: () => void;
  onOpenQueryModal: () => void;
  onOpenReceiptModal: (receipt: any) => void;
}

export function FinanceDashboard({
  summary,
  recentPayments,
  scholarships,
  onNavigateSubmodule,
  onOpenPaymentModal,
  onOpenScholarshipModal,
  onOpenQueryModal,
  onOpenReceiptModal,
}: FinanceDashboardProps) {
  const percentPaid = Math.round((summary.amountPaid / summary.totalAcademicFee) * 100);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP 8 KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Total Academic Fee</span>
          <div className="text-lg font-bold font-display text-slate-900 dark:text-white font-mono">
            ₹{(summary.totalAcademicFee / 1000).toFixed(0)}k
          </div>
          <span className="text-[9px] text-slate-400">4 Years Total</span>
        </div>

        <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-emerald-600 block">Amount Paid</span>
          <div className="text-lg font-bold font-display text-emerald-600 font-mono">
            ₹{(summary.amountPaid / 1000).toFixed(0)}k
          </div>
          <span className="text-[9px] text-emerald-600 font-semibold">{percentPaid}% Cleared</span>
        </div>

        <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-rose-600 block">Pending Amount</span>
          <div className="text-lg font-bold font-display text-rose-600 font-mono">
            ₹{summary.pendingAmount.toLocaleString()}
          </div>
          <span className="text-[9px] text-rose-600">Due Feb 15</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Scholarship</span>
          <div className="text-lg font-bold font-display text-purple-600 font-mono">
            ₹{summary.scholarshipAmount.toLocaleString()}
          </div>
          <span className="text-[9px] text-purple-600">Approved</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Concession</span>
          <div className="text-lg font-bold font-display text-blue-600 font-mono">
            ₹{summary.concessionAmount.toLocaleString()}
          </div>
          <span className="text-[9px] text-slate-400">Merit Waiver</span>
        </div>

        <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-amber-600 block">Next Due Date</span>
          <div className="text-xs font-bold text-amber-600 font-mono mt-1">
            {summary.nextDueDate}
          </div>
          <span className="text-[9px] text-amber-600 font-semibold">Sem V Installment</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Installments Paid</span>
          <div className="text-lg font-bold font-display text-emerald-600 font-mono">
            {summary.installmentsPaid} / {summary.installmentsTotal}
          </div>
          <span className="text-[9px] text-slate-400">On Time</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Remaining</span>
          <div className="text-lg font-bold font-display text-blue-600 font-mono">
            {summary.installmentsTotal - summary.installmentsPaid} Ins
          </div>
          <span className="text-[9px] text-slate-400">Scheduled</span>
        </div>
      </div>

      {/* 3. WIDGETS & RECHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Charts & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Semester Wise Payments Bar Chart */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" /> Semester Fee Collection Progress
                </h3>
                <p className="text-[11px] text-slate-500">Paid amount vs total fee structure per semester</p>
              </div>
              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
                {percentPaid}% Cleared Overall
              </Badge>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CHARTS_SEM_PAYMENTS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="sem" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  <Bar dataKey="paid" fill="#10B981" name="Paid (₹)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#93C5FD" name="Total Required (₹)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions List */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" /> Latest Financial Transactions
              </h3>
              <Button onClick={() => onNavigateSubmodule("history")} size="sm" variant="ghost" className="h-7 text-xs text-blue-600 p-0">
                View Ledger
              </Button>
            </div>

            <div className="space-y-2">
              {recentPayments.slice(0, 4).map((tx) => (
                <div key={tx.transactionId} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 font-mono text-xs font-bold shrink-0">
                      {tx.paymentMode}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tx.feeHead}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{tx.date} &middot; Ref: {tx.referenceNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                    <strong className="text-emerald-600 font-mono font-bold text-sm">₹{tx.amount.toLocaleString()}</strong>
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">SUCCESS</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Fee Distribution & Scholarship Widget */}
        <div className="space-y-6">
          
          {/* Fee Category Distribution Pie */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 text-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <PieIcon className="h-4 w-4 text-emerald-600" /> Fee Distribution Breakdown
            </h3>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={MOCK_CHARTS_FEE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {MOCK_CHARTS_FEE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-left">
              {MOCK_CHARTS_FEE_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarship Status Summary */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-600" /> Active Scholarships
              </h3>
              <Button onClick={() => onNavigateSubmodule("scholarships")} size="sm" variant="ghost" className="h-7 text-xs text-purple-600 p-0">
                View All
              </Button>
            </div>

            <div className="space-y-2">
              {scholarships.map((sch) => (
                <div key={sch.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[9px]">
                      {sch.category}
                    </Badge>
                    <span className="text-emerald-600 font-mono font-bold text-xs">₹{sch.approvedAmount.toLocaleString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sch.name}</h4>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
