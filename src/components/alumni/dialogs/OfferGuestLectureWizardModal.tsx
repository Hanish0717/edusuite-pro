import React, { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  User,
  Building2,
  FileText,
  Calendar,
  Clock,
  Upload,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Paperclip,
  Check,
} from "lucide-react";
import { GuestLectureSession } from "@/types/alumni";
import { DEPARTMENT_COORDINATORS_MAP } from "@/data/alumniData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OfferGuestLectureWizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitProposal: (newSession: GuestLectureSession) => void;
}

export const OfferGuestLectureWizardModal: React.FC<OfferGuestLectureWizardModalProps> = ({
  open,
  onOpenChange,
  onSubmitProposal,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    speakerName: "Sarah Jenkins",
    speakerRole: "Senior Staff Engineer",
    speakerCompany: "Google Cloud",
    speakerExperience: "6+ Years",
    speakerLinkedIn: "https://linkedin.com/in/sarahjenkins-cloud",
    title: "Generative AI Infrastructure & Scaling Large Models",
    topic: "Generative AI Systems",
    sessionType: "Technical Workshop" as const,
    targetDepartment: "Artificial Intelligence & Machine Learning (AI & ML)",
    targetYear: "3rd Year B.Tech",
    targetSemester: "Semester V",
    scheduledDate: "2026-08-28",
    scheduledTime: "04:00 PM IST",
    durationMinutes: 90,
    mode: "Offline (On-Campus)" as const,
    description: "Deep dive into model serving engines, quantization, and fault-tolerant cloud architecture for enterprise LLM deployments.",
    presentationFileName: "GenAI_Scaling_Masterclass_Slides.pptx",
  });

  const selectedCoordinator = DEPARTMENT_COORDINATORS_MAP[formData.targetDepartment];

  const handleNext = () => {
    if (step === 1 && !formData.speakerName.trim()) {
      toast.error("Please enter speaker name.");
      return;
    }
    if (step === 2 && !formData.title.trim()) {
      toast.error("Please enter lecture title.");
      return;
    }
    setStep((prev) => (prev + 1) as any);
  };

  const handlePrev = () => {
    setStep((prev) => (prev - 1) as any);
  };

  const handleSubmit = (isDraft = false) => {
    const coordinator = DEPARTMENT_COORDINATORS_MAP[formData.targetDepartment];

    const newSession: GuestLectureSession = {
      id: `LEC-${Date.now()}`,
      speakerName: formData.speakerName,
      speakerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      speakerRole: formData.speakerRole,
      speakerCompany: formData.speakerCompany,
      speakerBatch: "Batch of 2020",
      speakerExperience: formData.speakerExperience,
      speakerLinkedIn: formData.speakerLinkedIn,
      title: formData.title,
      topic: formData.topic,
      sessionType: formData.sessionType,
      targetDepartment: formData.targetDepartment,
      targetYear: formData.targetYear,
      targetSemester: formData.targetSemester,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      durationMinutes: formData.durationMinutes,
      mode: formData.mode,
      venueOrLink: "Main University Auditorium (Capacity: 1,200)",
      assignedCoordinator: coordinator,
      status: isDraft ? "Submitted" : "Assigned",
      registeredCount: 0,
      description: formData.description,
      presentationFile: formData.presentationFileName,
      submittedDate: new Date().toISOString().split("T")[0],
    };

    onSubmitProposal(newSession);
    toast.success(
      isDraft
        ? "Saved proposal draft!"
        : `Proposal submitted and assigned to ${coordinator?.coordinatorName || "Department Coordinator"}!`,
      {
        description: `Routed to ${formData.targetDepartment} Alumni Coordinator for review.`,
        icon: <CheckCircle2 className="size-4 text-emerald-600" />,
      }
    );

    setStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-3xl p-6 font-sans">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-extrabold text-lg text-foreground">
                Offer an Alumni Guest Lecture
              </DialogTitle>
              <p className="text-xs font-mono text-muted-foreground pt-0.5">
                Step {step} of 3 — {step === 1 ? "Speaker Details" : step === 2 ? "Session & Department Routing" : "Uploads & Submission"}
              </p>
            </div>
            <Badge className="bg-[#2563EB] text-white font-mono text-[0.65rem] px-2.5 py-0.5">
              Step {step} / 3
            </Badge>
          </div>
        </DialogHeader>

        {/* STEP PROGRESS INDICATOR */}
        <div className="flex items-center gap-2 font-mono text-xs my-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? "bg-[#2563EB]" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* STEP 1: SPEAKER DETAILS */}
        {step === 1 && (
          <div className="space-y-3 font-mono text-xs pt-1">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Speaker Full Name</label>
                <Input
                  value={formData.speakerName}
                  onChange={(e) => setFormData({ ...formData, speakerName: e.target.value })}
                  className="h-9 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Company / Organization</label>
                <Input
                  value={formData.speakerCompany}
                  onChange={(e) => setFormData({ ...formData, speakerCompany: e.target.value })}
                  className="h-9 font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Designation / Role</label>
                <Input
                  value={formData.speakerRole}
                  onChange={(e) => setFormData({ ...formData, speakerRole: e.target.value })}
                  className="h-9 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Industry Experience</label>
                <Input
                  value={formData.speakerExperience}
                  onChange={(e) => setFormData({ ...formData, speakerExperience: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-foreground font-sans block mb-1">LinkedIn Profile URL (Optional)</label>
              <Input
                value={formData.speakerLinkedIn}
                onChange={(e) => setFormData({ ...formData, speakerLinkedIn: e.target.value })}
                className="h-9"
              />
            </div>
          </div>
        )}

        {/* STEP 2: SESSION DETAILS & AUTOMATIC DEPARTMENT ROUTING */}
        {step === 2 && (
          <div className="space-y-3 font-mono text-xs pt-1">
            <div>
              <label className="font-bold text-foreground font-sans block mb-1">Lecture / Session Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-9 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Session Type</label>
                <select
                  value={formData.sessionType}
                  onChange={(e) => setFormData({ ...formData, sessionType: e.target.value as any })}
                  className="w-full h-9 p-2 rounded-xl border border-input bg-background font-mono text-xs"
                >
                  <option value="Technical Workshop">Technical Workshop</option>
                  <option value="Guest Lecture">Guest Lecture</option>
                  <option value="Career Guidance">Career Guidance</option>
                  <option value="Industry Webinar">Industry Webinar</option>
                  <option value="Entrepreneurship Talk">Entrepreneurship Talk</option>
                  <option value="Mock Interview Session">Mock Interview Session</option>
                  <option value="Research Seminar">Research Seminar</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Target Department</label>
                <select
                  value={formData.targetDepartment}
                  onChange={(e) => setFormData({ ...formData, targetDepartment: e.target.value })}
                  className="w-full h-9 p-2 rounded-xl border border-input bg-background font-mono text-xs font-bold text-[#2563EB]"
                >
                  {Object.keys(DEPARTMENT_COORDINATORS_MAP).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AUTOMATIC DEPARTMENT ROUTING CARD */}
            {selectedCoordinator && (
              <div className="p-3 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/40 flex items-center gap-3">
                <img
                  src={selectedCoordinator.avatar}
                  alt={selectedCoordinator.coordinatorName}
                  className="size-10 rounded-xl object-cover border border-[#2563EB]"
                />
                <div className="min-w-0 flex-1 font-mono">
                  <span className="text-[0.62rem] font-bold text-[#2563EB] block">PROPOSAL ASSIGNED TO</span>
                  <h4 className="font-extrabold text-xs text-foreground font-sans truncate">
                    {selectedCoordinator.coordinatorName}
                  </h4>
                  <span className="text-[0.65rem] text-muted-foreground truncate block">
                    {selectedCoordinator.title}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Preferred Date</label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="h-9"
                />
              </div>
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Preferred Time</label>
                <Input
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-foreground font-sans block mb-1">Session Abstract / Details</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full p-2.5 rounded-xl border border-input bg-background font-sans text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>
        )}

        {/* STEP 3: UPLOADS & FINAL SUBMISSION */}
        {step === 3 && (
          <div className="space-y-3.5 font-mono text-xs pt-1">
            <div className="p-4 rounded-2xl border border-dashed border-primary/40 bg-muted/30 text-center space-y-2">
              <Upload className="size-8 text-[#2563EB] mx-auto" />
              <div>
                <h4 className="font-extrabold text-xs text-foreground font-sans">Presentation &amp; Courseware Upload</h4>
                <p className="text-[0.68rem] text-muted-foreground">Upload PPTX, PDF slides, or lecture notes</p>
              </div>

              <div className="inline-flex items-center gap-2 p-2 px-3 bg-card rounded-xl border border-border font-bold text-primary">
                <Paperclip className="size-3.5" />
                <span>{formData.presentationFileName}</span>
              </div>
            </div>

            <div className="p-3 bg-[#2563EB]/10 rounded-2xl border border-[#2563EB]/30 space-y-1 font-sans">
              <h5 className="font-bold text-xs text-[#2563EB] flex items-center gap-1.5">
                <Check className="size-4" /> Ready for Department Routing
              </h5>
              <p className="text-[0.72rem] text-muted-foreground">
                Upon clicking <strong>Submit Proposal</strong>, this offer will automatically route to{" "}
                <strong>{selectedCoordinator?.coordinatorName}</strong> ({formData.targetDepartment} Coordinator) for review.
              </p>
            </div>
          </div>
        )}

        {/* WIZARD FOOTER BUTTONS */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrev} className="rounded-xl h-9 text-xs cursor-pointer gap-1">
              <ArrowLeft className="size-3.5" /> Back
            </Button>
          ) : (
            <Button variant="outline" onClick={() => handleSubmit(true)} className="rounded-xl h-9 text-xs cursor-pointer">
              Save Draft
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={handleNext} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 text-xs rounded-xl cursor-pointer gap-1">
              Next Step <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button onClick={() => handleSubmit(false)} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 text-xs rounded-xl cursor-pointer gap-1 shadow-md">
              <CheckCircle2 className="size-4" /> Submit Proposal
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
