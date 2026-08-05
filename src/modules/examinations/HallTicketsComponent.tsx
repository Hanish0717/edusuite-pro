import React, { useState } from "react";
import {
  FileCheck,
  Search,
  Download,
  Printer,
  FileText,
  Mail,
  QrCode,
  History,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface HallTicket {
  id: string;
  rollNo: string;
  studentName: string;
  department: string;
  semester: string;
  examType: string;
  status: "Generated" | "Pending" | "Withheld";
  attendanceEligibility: boolean;
  feeCleared: boolean;
  downloadCount: number;
}

const INITIAL_HALL_TICKETS: HallTicket[] = [
  { id: "HT-001", rollNo: "22CSE001", studentName: "Aarav Sharma", department: "CSE", semester: "Semester 6", examType: "Regular", status: "Generated", attendanceEligibility: true, feeCleared: true, downloadCount: 1 },
  { id: "HT-002", rollNo: "22ECE042", studentName: "Ananya Iyer", department: "ECE", semester: "Semester 6", examType: "Regular", status: "Generated", attendanceEligibility: true, feeCleared: true, downloadCount: 0 },
  { id: "HT-003", rollNo: "23ME014", studentName: "Vikram Aditya", department: "ME", semester: "Semester 4", examType: "Supply", status: "Withheld", attendanceEligibility: false, feeCleared: true, downloadCount: 0 },
  { id: "HT-004", rollNo: "23AIDS012", studentName: "Rohan Varma", department: "AI&DS", semester: "Semester 6", examType: "Regular", status: "Withheld", attendanceEligibility: true, feeCleared: false, downloadCount: 0 },
];

export function HallTicketsView() {
  const [tickets, setTickets] = useState<HallTicket[]>(INITIAL_HALL_TICKETS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [previewTicket, setPreviewTicket] = useState<HallTicket | null>(null);

  const [generateForm, setGenerateForm] = useState({
    department: "CSE",
    semester: "Semester 6",
    examType: "Regular",
  });

  const filteredTickets = tickets.filter((t) => {
    const s = search.toLowerCase();
    const matchSearch = (t.rollNo || "").toLowerCase().includes(s) ||
                        (t.studentName || "").toLowerCase().includes(s) ||
                        (t.department || "").toLowerCase().includes(s);
    const matchStatus = statusFilter === "all" || t.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleBulkGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerateOpen(false);
    toast.success(`Generated hall tickets for ${generateForm.department} ${generateForm.semester} (${generateForm.examType})`);
    
    setTickets(prev => prev.map(t => 
      t.department === generateForm.department && t.semester === generateForm.semester && t.attendanceEligibility && t.feeCleared
        ? { ...t, status: "Generated" } : t
    ));
  };

  const actionDownload = (t: HallTicket) => {
    const csvContent = `data:text/csv;charset=utf-8,RollNo,Name,Department,Status\n${t.rollNo},${t.studentName},${t.department},Generated`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HallTicket_${t.rollNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Downloading Hall Ticket PDF for ${t.rollNo}...`);
    setTickets(prev => prev.map(x => x.id === t.id ? { ...x, downloadCount: x.downloadCount + 1 } : x));
  };

  const actionEmail = (t: HallTicket) => {
    toast.success(`Sent Hall Ticket via Email to ${t.studentName}`);
  };

  const actionPrint = (t: HallTicket) => {
    toast.success(`Printing Hall Ticket for ${t.studentName}...`);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
            <FileCheck className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Hall Tickets Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-emerald-600 border-emerald-500/30">
                Admit Cards
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Validate eligibility, generate, preview, and dispatch student hall tickets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8,RollNo,StudentName,Department,Status\n22CSE001,Aarav Sharma,CSE,Generated";
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Hall_Tickets_Bulk.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Bulk download initiated successfully.");
          }} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Bulk Download
          </Button>
          <Button size="sm" onClick={() => setIsGenerateOpen(true)} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-semibold shadow-glow">
            <FileText className="size-4" /> Bulk Generate
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3 w-full max-w-md">
          <Input 
            placeholder="Search by student name, roll no, or department..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs"
          />
        </div>
        <div className="flex gap-2">
           <Select value={statusFilter} onValueChange={setStatusFilter}>
             <SelectTrigger className="w-[140px] text-xs h-9">
               <SelectValue placeholder="Status Filter" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Status</SelectItem>
               <SelectItem value="generated">Generated</SelectItem>
               <SelectItem value="pending">Pending</SelectItem>
               <SelectItem value="withheld">Withheld</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Student Info</th>
                <th className="py-3 px-3 text-center">Attendance<br/>Eligibility</th>
                <th className="py-3 px-3 text-center">Fee Status<br/>Cleared</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-foreground">{t.studentName}</div>
                    <div className="text-[0.68rem] text-muted-foreground font-mono mt-0.5">{t.rollNo} &middot; {t.department} ({t.semester})</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {t.attendanceEligibility ? <CheckCircle2 className="size-4 text-emerald-500 mx-auto" /> : <XCircle className="size-4 text-red-500 mx-auto" title="< 75% Attendance" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {t.feeCleared ? <CheckCircle2 className="size-4 text-emerald-500 mx-auto" /> : <XCircle className="size-4 text-red-500 mx-auto" title="Pending Dues" />}
                  </td>
                  <td className="py-3 px-3">
                    <Badge className={
                      t.status === "Generated" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                      t.status === "Withheld" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                      "bg-orange-500/10 text-orange-600 border-orange-500/20"
                    }>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right pr-4">
                    {t.status === "Generated" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="icon" className="size-7 bg-muted/50" onClick={() => setPreviewTicket(t)} title="Preview Ticket">
                          <QrCode className="size-3.5 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 bg-muted/50" onClick={() => actionEmail(t)} title="Email Student">
                          <Mail className="size-3.5 text-purple-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 bg-muted/50" onClick={() => actionDownload(t)} title="Download PDF">
                          <Download className="size-3.5 text-emerald-600" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="h-7 text-[0.65rem] text-red-600 border-red-200 bg-red-50 hover:bg-red-100">
                        Resolve Holds
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Bulk Generate Hall Tickets</DialogTitle></DialogHeader>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-lg flex items-start gap-2 mb-2">
             <AlertCircle className="size-4 shrink-0 mt-0.5" />
             <p className="text-xs">Tickets will only be generated for students meeting attendance (&ge;75%) and fee clearance criteria.</p>
          </div>
          <form onSubmit={handleBulkGenerate} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Department</Label>
                <Select value={generateForm.department} onValueChange={(val) => setGenerateForm({ ...generateForm, department: val })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select Dept" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                    <SelectItem value="AI&DS">AI&DS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Semester</Label>
                <Select value={generateForm.semester} onValueChange={(val) => setGenerateForm({ ...generateForm, semester: val })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select Semester" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester 4">Semester 4</SelectItem>
                    <SelectItem value="Semester 6">Semester 6</SelectItem>
                    <SelectItem value="Semester 7">Semester 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsGenerateOpen(false)} className="text-xs">Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">Generate Verified Tickets</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewTicket} onOpenChange={() => setPreviewTicket(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle className="text-lg font-bold">Hall Ticket Preview</DialogTitle></DialogHeader>
          {previewTicket && (
            <div className="p-6 border border-border rounded-xl bg-card shadow-sm space-y-6 relative overflow-hidden">
               {/* Decorative background watermark */}
               <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                  <div className="text-[120px] font-bold -rotate-45 whitespace-nowrap">EduSuite Pro</div>
               </div>
               
               <div className="flex justify-between items-start border-b border-border pb-4 relative z-10">
                  <div className="flex gap-4 items-center">
                     <div className="size-16 rounded bg-muted flex items-center justify-center font-mono text-xs text-muted-foreground border border-border">Photo</div>
                     <div>
                       <h2 className="text-xl font-bold uppercase">{previewTicket.studentName}</h2>
                       <p className="font-mono text-sm text-primary font-bold">{previewTicket.rollNo}</p>
                       <p className="text-xs text-muted-foreground mt-1">{previewTicket.department} &middot; {previewTicket.semester}</p>
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <QrCode className="size-16 text-foreground" />
                     <span className="text-[0.5rem] text-muted-foreground font-mono mt-1">{previewTicket.id}</span>
                  </div>
               </div>

               <div className="relative z-10">
                 <h3 className="font-bold text-sm mb-2 border-b border-border pb-1">Scheduled Examinations ({previewTicket.examType})</h3>
                 <table className="w-full text-xs text-left">
                   <thead className="bg-muted/50">
                     <tr>
                       <th className="p-2">Date & Time</th>
                       <th className="p-2">Subject Code & Name</th>
                       <th className="p-2">Invigilator Sign</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                     <tr>
                       <td className="p-2 font-mono text-muted-foreground">Aug 10<br/>09:30 AM</td>
                       <td className="p-2 font-medium">CS401: Adv AI</td>
                       <td className="p-2"></td>
                     </tr>
                     <tr>
                       <td className="p-2 font-mono text-muted-foreground">Aug 12<br/>09:30 AM</td>
                       <td className="p-2 font-medium">EC304: VLSI Design</td>
                       <td className="p-2"></td>
                     </tr>
                   </tbody>
                 </table>
               </div>
               
               <div className="flex items-center justify-between pt-4 border-t border-border relative z-10 text-[0.65rem] text-muted-foreground">
                 <div className="flex items-center gap-1"><History className="size-3" /> Downloads: {previewTicket.downloadCount}</div>
                 <div>Controller of Examinations</div>
               </div>
            </div>
          )}
          <DialogFooter>
             <Button variant="outline" size="sm" onClick={() => actionPrint(previewTicket!)}><Printer className="size-3.5 mr-1.5" /> Print</Button>
             <Button size="sm" onClick={() => actionDownload(previewTicket!)} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Download className="size-3.5 mr-1.5" /> Download PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
