import React, { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, ShieldCheck, AlertCircle, ArrowRight, UserCheck, Clock, FileCheck2 } from "lucide-react";
import { MOCK_STUDENT_RECORDS } from "@/data/alumniData";
import { VerificationQueueItem } from "@/types/alumni";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AlumniRegistrationWizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPendingRegistration?: (item: VerificationQueueItem) => void;
}

export const AlumniRegistrationWizardModal: React.FC<AlumniRegistrationWizardModalProps> = ({
  open,
  onOpenChange,
  onAddPendingRegistration,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [fullName, setFullName] = useState("Priya Sundaram");
  const [rollNumber, setRollNumber] = useState("2020CSE042");
  const [graduationYear, setGraduationYear] = useState("2024");
  const [dept, setDept] = useState("Computer Science (CSE)");
  const [dob, setDob] = useState("2002-05-14");
  const [email, setEmail] = useState("priya.sundaram@gmail.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [company, setCompany] = useState("Amazon India");
  const [designation, setDesignation] = useState("Software Development Engineer - 1");

  // Verification state
  const [verificationResult, setVerificationResult] = useState<"idle" | "success" | "failed">("idle");
  const [verifying, setVerifying] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    setVerifying(true);

    // Simulate institution student record check
    setTimeout(() => {
      const match = MOCK_STUDENT_RECORDS.find(
        (rec) =>
          rec.rollNumber.toLowerCase() === rollNumber.trim().toLowerCase() &&
          rec.graduationYear === graduationYear
      );

      setVerifying(false);
      if (match) {
        setVerificationResult("success");
      } else {
        setVerificationResult("failed");
      }
    }, 1200);
  };

  const handleProceedToSubmit = () => {
    const newItem: VerificationQueueItem = {
      id: `VRF-${Date.now().toString().slice(-4)}`,
      fullName,
      rollNumber,
      dept,
      graduationYear,
      email,
      phone,
      company,
      designation,
      studentRecordVerified: true,
      status: "Pending Approval",
      submittedDate: new Date().toISOString().split("T")[0]!,
      invitedBy: "Sarah Jenkins",
    };

    if (onAddPendingRegistration) {
      onAddPendingRegistration(newItem);
    }

    setStep(3);
    toast.success("Alumni Registration & Verification submitted!", {
      description: "Application is now pending final review by Alumni Coordinator.",
    });
  };

  const handleReset = () => {
    setStep(1);
    setVerificationResult("idle");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-3xl p-6">
        <div className="space-y-4 font-sans">
          <DialogHeader className="pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="font-extrabold text-base flex items-center gap-2">
                <ShieldCheck className="size-5 text-[#2563EB]" /> Official Alumni Record Registration & Verification
              </DialogTitle>
              <Badge variant="outline" className="font-mono text-[0.68rem] bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]">
                Step {step} of 3
              </Badge>
            </div>
            <DialogDescription className="text-xs">
              Institutional verification workflow ensuring only verified graduates join the Alumni Network.
            </DialogDescription>
          </DialogHeader>

          {/* PROGRESS STEPPER */}
          <div className="grid grid-cols-3 gap-2 font-mono text-[0.68rem] text-center border-b border-border/60 pb-3">
            <div className={`p-2 rounded-xl border ${step === 1 ? "bg-[#2563EB] text-white font-bold" : "bg-muted text-muted-foreground"}`}>
              1. Graduate Details
            </div>
            <div className={`p-2 rounded-xl border ${step === 2 ? "bg-[#2563EB] text-white font-bold" : "bg-muted text-muted-foreground"}`}>
              2. Record Verification
            </div>
            <div className={`p-2 rounded-xl border ${step === 3 ? "bg-[#2563EB] text-white font-bold" : "bg-muted text-muted-foreground"}`}>
              3. Status Timeline
            </div>
          </div>

          {/* STEP 1: FORM INPUT */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Full Name</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-9" />
                </div>
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Student Roll / Reg No.</label>
                  <Input value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required className="h-9" placeholder="E.g., 2020CSE042" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Graduation Year</label>
                  <select value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} className="w-full h-9 p-2 rounded-xl border border-input bg-background">
                    {["2020", "2021", "2022", "2023", "2024", "2025", "2026"].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Department</label>
                  <Input value={dept} onChange={(e) => setDept(e.target.value)} required className="h-9" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Email Address</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-9" />
                </div>
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Mobile Number</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-9" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Current Employer</label>
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} className="h-9" />
                </div>
                <div>
                  <label className="font-bold text-foreground font-sans block mb-1">Designation / Role</label>
                  <Input value={designation} onChange={(e) => setDesignation(e.target.value)} className="h-9" />
                </div>
              </div>

              <DialogFooter className="pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl gap-1.5">
                  Verify Student Record <ArrowRight className="size-4" />
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* STEP 2: INSTITUTION RECORD VERIFICATION */}
          {step === 2 && (
            <div className="space-y-4 py-2 text-center">
              {verifying ? (
                <div className="space-y-3 py-6">
                  <div className="size-12 rounded-full border-4 border-[#2563EB] border-t-transparent animate-spin mx-auto" />
                  <p className="font-mono text-xs font-bold text-foreground">
                    Verifying Roll No. <span className="text-[#2563EB]">{rollNumber}</span> with Registrar Student Database...
                  </p>
                </div>
              ) : verificationResult === "success" ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-left space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <CheckCircle2 className="size-5" /> Student Record Verified Successfully!
                    </div>
                    <p className="text-foreground">✓ Roll Number <strong>{rollNumber}</strong> matched in {graduationYear} Batch Database.</p>
                    <p className="text-foreground">✓ Degree &amp; Department: <strong>B.Tech — {dept}</strong></p>
                    <p className="text-emerald-600 font-bold">Status: Ready for Admin Coordinator Approval</p>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
                      Edit Info
                    </Button>
                    <Button onClick={handleProceedToSubmit} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl gap-1.5">
                      Submit for Admin Approval
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-left space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                      <AlertCircle className="size-5" /> Student Record Not Found!
                    </div>
                    <p className="text-foreground">
                      Roll Number <strong>{rollNumber}</strong> was not found in the institution graduation registry for {graduationYear}.
                    </p>
                    <p className="text-muted-foreground text-[0.68rem]">
                      Only graduates of this institution are eligible to join the official Alumni Network.
                    </p>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
                      Try Different Roll Number
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: STATUS TIMELINE */}
          {step === 3 && (
            <div className="space-y-4 font-sans py-2">
              <div className="p-4 bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-2xl text-center space-y-1">
                <FileCheck2 className="size-8 text-[#2563EB] mx-auto" />
                <h4 className="font-extrabold text-base text-foreground">Registration Submitted</h4>
                <p className="text-xs text-muted-foreground font-mono">
                  Application ID: #VRF-2026-101 • Status: <span className="text-[#2563EB] font-bold">Pending Approval</span>
                </p>
              </div>

              {/* TIMELINE */}
              <div className="space-y-2 font-mono text-xs p-3 bg-card border border-border rounded-2xl">
                {[
                  { title: "Invitation Sent", desc: "Invited by Batchmate Sarah Jenkins", status: "complete" },
                  { title: "Registration Submitted", desc: "Graduate details uploaded", status: "complete" },
                  { title: "Student Record Verification", desc: "Matched Roll No. 2020CSE042", status: "complete" },
                  { title: "Admin Review", desc: "Pending Coordinator Review", status: "current" },
                  { title: "Account Activated", desc: "Access to Alumni Portal", status: "pending" },
                ].map((st, idx) => (
                  <div key={st.title} className="flex items-start gap-3 p-2 rounded-xl">
                    <div className={`size-6 rounded-full grid place-items-center text-xs font-bold shrink-0 ${
                      st.status === "complete" ? "bg-emerald-500 text-white" : st.status === "current" ? "bg-[#2563EB] text-white animate-pulse" : "bg-muted text-muted-foreground"
                    }`}>
                      {st.status === "complete" ? "✓" : idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-foreground font-sans">{st.title}</p>
                      <p className="text-[0.68rem] text-muted-foreground">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter className="pt-2">
                <Button onClick={handleReset} className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl">
                  Done &amp; Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
