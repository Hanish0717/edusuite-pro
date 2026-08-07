import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import {
  useExamStore,
  approveByHod,
  rejectByHod,
  ExamRegistrationRecord,
} from "./exam-store";

export function HodApprovalPanel() {
  const { examRegistrations } = useExamStore();
  const [hodComments, setHodComments] = useState<Record<string, string>>({});
  const [selectedCert, setSelectedCert] = useState<ExamRegistrationRecord | null>(null);

  const handleCommentChange = (id: string, val: string) => {
    setHodComments((prev) => ({ ...prev, [id]: val }));
  };

  const handleApprove = (id: string) => {
    const comment = hodComments[id] || "Approved by HOD";
    approveByHod(id, comment);
    toast.success("HOD Approval granted! Examination & Student modules updated instantly.");
  };

  const handleReject = (id: string) => {
    const comment = hodComments[id] || "Rejected by HOD. Invalid or incomplete documents.";
    rejectByHod(id, comment);
    toast.error("Registration rejected by HOD. Student notified.");
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
            <Building className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              HOD Course & NPTEL Registration Verification
            </h3>
            <p className="text-xs text-muted-foreground">
              Review department student registrations and verify NPTEL certificates before final exam cell clearance.
            </p>
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-xs text-purple-600 border-purple-300">
          {examRegistrations.length} Total Submissions
        </Badge>
      </div>

      {examRegistrations.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
          No student exam registration requests received yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Course Code & Name</th>
                <th className="py-3 px-3">NPTEL Certificate</th>
                <th className="py-3 px-3">Verification Status</th>
                <th className="py-3 px-3">Comments</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {examRegistrations.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-semibold text-foreground">
                    <div>{r.studentName}</div>
                    <div className="text-[0.68rem] text-primary font-mono">{r.rollNumber}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-foreground">{r.department} (Sem {r.semester})</td>
                  <td className="py-3 px-3 font-medium text-foreground">
                    <span className="font-mono text-primary font-bold">{r.courseCode}</span>: {r.courseName}
                  </td>
                  <td className="py-3 px-3">
                    {r.certificate ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCert(r)}
                        className="h-7 text-xs font-semibold text-primary hover:underline gap-1 px-2"
                      >
                        <FileText className="size-3.5" /> {r.certificate.fileName}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">N/A (Standard Exam)</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <Badge className={
                      r.hodStatus === "Approved"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : r.hodStatus === "Pending"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-rose-500/10 text-rose-600"
                    }>
                      HOD: {r.hodStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Input
                      placeholder="Add HOD comments..."
                      value={hodComments[r.id] ?? r.hodComment ?? ""}
                      onChange={(e) => handleCommentChange(r.id, e.target.value)}
                      className="h-8 text-xs font-mono max-w-[200px]"
                    />
                  </td>
                  <td className="py-3 px-3 text-right">
                    {r.hodStatus === "Pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(r.id)}
                          className="h-7 px-2.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                        >
                          <CheckCircle2 className="size-3" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(r.id)}
                          className="h-7 px-2.5 text-[11px] font-bold border-rose-300 text-rose-600 hover:bg-rose-50 gap-1"
                        >
                          <XCircle className="size-3" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic font-mono">Status: {r.hodStatus}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CERTIFICATE MODAL */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="size-5 text-primary" /> NPTEL Certificate Preview
            </DialogTitle>
          </DialogHeader>

          {selectedCert?.certificate && (
            <div className="space-y-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-1">
                <p className="font-semibold text-foreground">Student: <span className="font-mono">{selectedCert.studentName} ({selectedCert.rollNumber})</span></p>
                <p className="font-semibold text-foreground">Department: <span className="font-mono">{selectedCert.department}</span></p>
                <p className="font-semibold text-foreground">Course: <span className="font-mono text-primary">{selectedCert.courseCode} - {selectedCert.courseName}</span></p>
              </div>

              <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-primary">{selectedCert.certificate.fileName}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedCert.certificate.fileSizeMb} MB &bull; Uploaded {new Date(selectedCert.certificate.uploadedAt).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline" className="text-[10px] bg-card">Valid Format ✓</Badge>
              </div>

              {selectedCert.certificate.remarks && (
                <div className="space-y-1">
                  <span className="font-semibold text-muted-foreground">Student Remarks:</span>
                  <p className="p-2 rounded-lg bg-card border border-border text-[11px] font-mono">
                    {selectedCert.certificate.remarks}
                  </p>
                </div>
              )}

              <DialogFooter className="pt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleReject(selectedCert.id);
                    setSelectedCert(null);
                  }}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleApprove(selectedCert.id);
                    setSelectedCert(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Approve
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
