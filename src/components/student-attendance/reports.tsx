import React, { useState } from "react";
import { SubjectAttendanceItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Printer,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

interface ReportsProps {
  subjects: SubjectAttendanceItem[];
}

export function AttendanceReports({ subjects }: ReportsProps) {
  const [reportType, setReportType] = useState<"Semester Report" | "Monthly Report" | "Daily Report" | "Subject-wise Report" | "Attendance Certificate">("Semester Report");
  const [format, setFormat] = useState<"PDF" | "Excel" | "CSV">("PDF");

  const handleGenerate = (type: string, fmt: string) => {
    toast.success(`Generating ${type} in ${fmt} format...`);
    setTimeout(() => {
      toast.success(`File downloaded: EduSuite_${type.replace(/\s+/g, "_")}.${fmt.toLowerCase()}`);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">

      {/* GENERATE REPORTS CARD */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" /> Attendance Reports & Certificates
          </h3>
          <p className="text-xs text-slate-500">Generate certified official statements for condonation, scholarship, or hall ticket clearance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          {/* SELECT REPORT TYPE */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">Report Scope</label>
            <div className="grid grid-cols-2 gap-2">
              {(["Daily Report", "Monthly Report", "Semester Report", "Subject-wise Report", "Attendance Certificate"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setReportType(t)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    reportType === t
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SELECT EXPORT FORMAT */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">Export Format</label>
            <div className="flex items-center gap-2">
              {(["PDF", "Excel", "CSV"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`flex-1 p-3 rounded-xl border text-center font-extrabold transition-all ${
                    format === fmt
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* GENERATE ACTIONS STRIP */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">CERTIFIED INSTITUTIONAL FORMAT</Badge>

          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={handlePrint} variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800">
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
            <Button
              onClick={() => handleGenerate(reportType, format)}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1.5 px-4 shadow-sm"
            >
              <Download className="h-4 w-4" /> Download {format}
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}
