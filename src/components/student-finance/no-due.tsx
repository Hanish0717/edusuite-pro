import { useState } from "react";
import { NoDueClearanceItem, StudentFinanceSummary } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, ShieldCheck, Download, Building, BookOpen, BedDouble, Bus, Wallet, Loader2 } from "lucide-react";
import { downloadNoDueCertificatePdf } from "./finance-pdf-utils";
import { toast } from "sonner";

interface NoDueProps {
  clearances: NoDueClearanceItem[];
  summary: StudentFinanceSummary;
}

export function NoDue({ clearances, summary }: NoDueProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const approvedCount = clearances.filter((c) => c.clearanceStatus === "Approved").length;
  const isOverallClear = approvedCount === clearances.length;

  const getDeptIcon = (dept: string) => {
    if (dept.includes("Library")) return BookOpen;
    if (dept.includes("Hostel")) return BedDouble;
    if (dept.includes("Transport")) return Bus;
    if (dept.includes("Finance")) return Wallet;
    return Building;
  };

  const handleDownload = async () => {
    if (!isOverallClear) {
      toast.warning("Clear pending Finance dues (₹45,000) to unlock official No Due Certificate.");
      return;
    }
    setIsDownloading(true);
    try {
      await downloadNoDueCertificatePdf(summary, clearances);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP CARDS (CLEARANCE PER DEPARTMENT) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {clearances.map((c) => {
          const IconComp = getDeptIcon(c.department);
          return (
            <div key={c.department} className={`p-3.5 rounded-xl border shadow-sm space-y-1 ${
              c.clearanceStatus === "Approved"
                ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20"
                : "border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/20"
            }`}>
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-semibold block truncate">{c.department}</span>
                <IconComp className="h-3.5 w-3.5 shrink-0" />
              </div>
              <div className={`text-sm font-bold flex items-center gap-1 ${
                c.clearanceStatus === "Approved" ? "text-emerald-600" : "text-amber-600"
              }`}>
                {c.clearanceStatus === "Approved" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                {c.clearanceStatus}
              </div>
              <span className="text-[9px] text-slate-400 block truncate">{c.clearedBy}</span>
            </div>
          );
        })}

        {/* OVERALL STATUS CARD */}
        <div className={`p-3.5 rounded-xl border shadow-sm space-y-1 ${
          isOverallClear
            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
            : "border-amber-300 bg-amber-50 text-amber-800"
        }`}>
          <span className="text-[10px] font-semibold block">Overall Clearance</span>
          <div className="text-sm font-bold flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            {isOverallClear ? "NO DUES CLEARED" : "PENDING (4/5)"}
          </div>
          <span className="text-[9px] font-semibold">Semester V Lock</span>
        </div>
      </div>

      {/* 2. TIMELINE & DOWNLOAD CERTIFICATE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Automated Institutional No Dues Clearance
            </h3>
            <p className="text-xs text-slate-500">Real-time status across academic, library, hostel, transport & finance desks</p>
          </div>

          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            size="sm"
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm"
          >
            {isDownloading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</>
            ) : (
              <><Download className="h-3.5 w-3.5" /> Download No Due Certificate</>
            )}
          </Button>
        </div>

        {/* DEPARTMENT CLEARANCE DETAILS TABLE */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Department Approval Status Audit
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                  <th className="p-3">Department Desk</th>
                  <th className="p-3">Officer Authorized</th>
                  <th className="p-3">Clearance Date</th>
                  <th className="p-3">Outstanding Due (₹)</th>
                  <th className="p-3">Remarks & Audit Notes</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {clearances.map((item) => (
                  <tr key={item.department} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{item.department}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{item.clearedBy}</td>
                    <td className="p-3 font-mono text-slate-500">{item.clearedDate || "Pending"}</td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">₹{item.amountDue.toLocaleString()}</td>
                    <td className="p-3 text-slate-500 text-[11px]">{item.remarks}</td>
                    <td className="p-3">
                      <Badge className={item.clearanceStatus === "Approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                        {item.clearanceStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
