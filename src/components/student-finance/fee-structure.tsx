import { useState } from "react";
import { StudentFinanceSummary, FeeHeadItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2 } from "lucide-react";
import { downloadFeeStructurePdf } from "./finance-pdf-utils";

interface FeeStructureProps {
  summary: StudentFinanceSummary;
  feeHeads: FeeHeadItem[];
}

export function FeeStructure({ summary, feeHeads }: FeeStructureProps) {
  const [selectedSem, setSelectedSem] = useState<number>(5);
  const [isDownloading, setIsDownloading] = useState(false);

  const feeCategoryCards = [
    { title: "Academic Fee", amount: 240000, desc: "Tuition, Lab & E-Learning", color: "text-blue-600" },
    { title: "Hostel & Mess Fee", amount: 70000, desc: "Occupancy & Catering", color: "text-emerald-600" },
    { title: "Exam Fee", amount: 10000, desc: "Semester End Evaluation", color: "text-purple-600" },
    { title: "Library Fee", amount: 6000, desc: "IEEE & Digital Journals", color: "text-amber-600" },
    { title: "Transport Fee", amount: 24000, desc: "AC Bus Fleet", color: "text-indigo-600" },
    { title: "Misc & Workshop", amount: 10000, desc: "Skills & Placement", color: "text-slate-600" },
  ];

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadFeeStructurePdf(summary, feeHeads);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const el = document.getElementById("fee-structure-print-area");
    if (!el) { window.print(); return; }
    const content = el.innerHTML;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) { window.print(); return; }
    win.document.write(`
      <html>
        <head>
          <title>Fee Structure — ${summary.studentName}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; padding: 24px; color: #0f172a; }
            h1 { font-size: 18px; text-align: center; margin-bottom: 4px; }
            p { text-align: center; color: #64748b; margin: 0 0 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th { background: #f1f5f9; padding: 8px; text-align: left; border: 1px solid #e2e8f0; font-size: 11px; }
            td { padding: 8px; border: 1px solid #e2e8f0; font-size: 11px; }
            .total-row { background: #eff6ff; font-weight: bold; color: #2563eb; }
          </style>
        </head>
        <body>
          <h1>EduSuite Pro University — Fee Structure</h1>
          <p>${summary.studentName} (${summary.rollNumber}) · ${summary.branch} · Semester ${selectedSem} · AY ${summary.academicYear}</p>
          ${content}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const grandTotal = feeHeads.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP CARDS (6 FEE HEAD CATEGORIES) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {feeCategoryCards.map((card) => (
          <div key={card.title} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 block">{card.title}</span>
            <div className={`text-lg font-bold font-display ${card.color} font-mono`}>₹{(card.amount / 1000).toFixed(0)}k</div>
            <span className="text-[9px] text-slate-400">{card.desc}</span>
          </div>
        ))}
      </div>

      {/* 2. STRUCTURE TABLE & ACTIONS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">4-Year Statutory Fee Structure Master</h3>
            <p className="text-xs text-slate-500">Itemized breakdown for B.Tech Computer Science & Engineering</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              variant="outline"
              className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
            <Button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
            >
              {isDownloading ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</>
              ) : (
                <><Download className="h-3.5 w-3.5" /> Download Structure PDF</>
              )}
            </Button>
          </div>
        </div>

        {/* SEMESTER FILTER SWITCHER */}
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSem(sem)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSem === sem
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Semester {sem}
            </button>
          ))}
        </div>

        {/* Printable & downloadable table */}
        <div id="fee-structure-print-area">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                  <th className="p-3">Fee Head</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Semester</th>
                  <th className="p-3">Amount (₹)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Component Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {feeHeads.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{item.feeHead}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                    </td>
                    <td className="p-3 font-mono">Sem {selectedSem}</td>
                    <td className="p-3 font-bold font-mono text-blue-600 text-xs">₹{item.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <Badge className={item.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{item.description}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 dark:bg-blue-950/20">
                  <td className="p-3 font-bold text-blue-700 dark:text-blue-400" colSpan={3}>
                    Grand Total — Semester {selectedSem}
                  </td>
                  <td className="p-3 font-bold font-mono text-blue-700 dark:text-blue-400">
                    ₹{grandTotal.toLocaleString()}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
