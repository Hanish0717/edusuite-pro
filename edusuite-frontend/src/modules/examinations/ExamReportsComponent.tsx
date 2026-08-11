import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function ExamReportsComponent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState("pass_fail");
  const [format, setFormat] = useState("pdf");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`Successfully generated ${reportType.replace("_", " ")} report in ${format.toUpperCase()} format.`);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20 shrink-0">
            <FileSpreadsheet className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Examination Reports
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-purple-600 border-purple-500/30">
                Data Exports
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Generate customizable official reports for accreditation and management.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Report Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pass_fail">Pass/Fail Percentage Report</SelectItem>
                    <SelectItem value="subject_wise">Subject-wise Grade Distribution</SelectItem>
                    <SelectItem value="department_toppers">Department Toppers List</SelectItem>
                    <SelectItem value="attendance_defaulters">Attendance Shortage List</SelectItem>
                    <SelectItem value="fee_defaulters">Fee Pending (Hall Tickets)</SelectItem>
                    <SelectItem value="malpractice">Exam Malpractice Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Semester / Session</Label>
                <Select defaultValue="spring2026">
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring2026">Spring 2026</SelectItem>
                    <SelectItem value="fall2025">Fall 2025</SelectItem>
                    <SelectItem value="spring2025">Spring 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Department (Optional)</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="CSE">Computer Science</SelectItem>
                    <SelectItem value="ECE">Electronics</SelectItem>
                    <SelectItem value="ME">Mechanical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Date Range (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input type="date" className="h-9 text-xs" />
                  <span className="text-muted-foreground text-xs">to</span>
                  <Input type="date" className="h-9 text-xs" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Output Format</h3>
            <div className="flex flex-wrap gap-4">
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${format === "pdf" ? "bg-red-500/10 border-red-500/50 text-red-700" : "bg-card border-border hover:bg-muted/50"}`}>
                <input type="radio" name="format" value="pdf" checked={format === "pdf"} onChange={(e) => setFormat(e.target.value)} className="sr-only" />
                <FileText className={`size-5 ${format === "pdf" ? "text-red-500" : "text-muted-foreground"}`} />
                <span className="text-sm font-semibold">PDF Document</span>
                {format === "pdf" && <CheckCircle2 className="size-4 ml-2" />}
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${format === "excel" ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-700" : "bg-card border-border hover:bg-muted/50"}`}>
                <input type="radio" name="format" value="excel" checked={format === "excel"} onChange={(e) => setFormat(e.target.value)} className="sr-only" />
                <FileSpreadsheet className={`size-5 ${format === "excel" ? "text-emerald-500" : "text-muted-foreground"}`} />
                <span className="text-sm font-semibold">Excel (XLSX)</span>
                {format === "excel" && <CheckCircle2 className="size-4 ml-2" />}
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${format === "csv" ? "bg-blue-500/10 border-blue-500/50 text-blue-700" : "bg-card border-border hover:bg-muted/50"}`}>
                <input type="radio" name="format" value="csv" checked={format === "csv"} onChange={(e) => setFormat(e.target.value)} className="sr-only" />
                <FileText className={`size-5 ${format === "csv" ? "text-blue-500" : "text-muted-foreground"}`} />
                <span className="text-sm font-semibold">CSV Data</span>
                {format === "csv" && <CheckCircle2 className="size-4 ml-2" />}
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" className="h-10 text-xs font-semibold gap-2" onClick={() => toast.success("Sent to default printer.")}>
              <Printer className="size-4" /> Print Directly
            </Button>
            <Button type="submit" disabled={isGenerating} className="h-10 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-2 px-6 shadow-glow">
              <Download className={`size-4 ${isGenerating ? "animate-bounce" : ""}`} /> 
              {isGenerating ? "Generating..." : "Generate & Download"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
