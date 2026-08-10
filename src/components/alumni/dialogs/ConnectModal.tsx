import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { MessageSquare, Send, CheckCircle2, UserCheck, Sparkles } from "lucide-react";
import { AlumniProfileItem } from "@/types/alumni";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConnectModalProps {
  alumnus: AlumniProfileItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmConnect: (alumnusId: string, intent: string, note: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  alumnus,
  open,
  onOpenChange,
  onConfirmConnect,
}) => {
  const [intent, setIntent] = useState("Networking");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (alumnus) {
      setNote(
        `Hi ${alumnus.name}, I came across your profile on the EduSuite Pro Alumni Portal. I am very interested in your work as ${alumnus.designation} at ${alumnus.company} and would love to connect with you!`
      );
    }
  }, [alumnus]);

  if (!alumnus) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmConnect(alumnus.id, intent, note);
    toast.success(`Connection request sent to ${alumnus.name}!`, {
      description: `Intent: ${intent}. Notified ${alumnus.name} via email & portal notification.`,
      icon: <UserCheck className="size-4 text-[#2563EB]" />,
    });
    onOpenChange(false);
  };

  const intentOptions = [
    { label: "Networking", desc: "General professional networking" },
    { label: "Mentorship", desc: "Career guidance & advice" },
    { label: "Job Referral", desc: "Inquire about open positions" },
    { label: "Research / Tech", desc: "Technical discussion" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <DialogHeader className="pb-2 border-b border-border">
            <div className="flex items-center gap-3.5">
              <img
                src={alumnus.avatar}
                alt={alumnus.name}
                className="size-14 rounded-2xl object-cover border-2 border-primary/20 shadow-xs"
              />
              <div className="space-y-0.5">
                <DialogTitle className="font-extrabold text-base flex items-center gap-1.5">
                  Connect with {alumnus.name}
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-primary font-bold">
                  {alumnus.designation} @ {alumnus.company}
                </DialogDescription>
                <span className="text-[0.68rem] text-muted-foreground font-mono">
                  {alumnus.batch} • {alumnus.dept}
                </span>
              </div>
            </div>
          </DialogHeader>

          {/* Connection Intent Selector */}
          <div className="space-y-1.5 font-mono">
            <label className="font-bold text-foreground font-sans block text-[0.72rem]">
              Connection Reason / Intent:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {intentOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.label}
                  onClick={() => setIntent(opt.label)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    intent === opt.label
                      ? "bg-[#2563EB] text-white font-bold border-[#2563EB]"
                      : "bg-card border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  <span className="font-bold text-xs block">{opt.label}</span>
                  <span className={`text-[0.62rem] font-sans block ${intent === opt.label ? "text-blue-100" : "text-muted-foreground"}`}>
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Note Input */}
          <div className="space-y-1 font-mono">
            <label className="font-bold text-foreground font-sans block text-[0.72rem]">
              Personalized Note / Invitation Message:
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl border border-input bg-background font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary leading-relaxed"
            />
          </div>

          <DialogFooter className="pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl gap-1.5"
            >
              <Send className="size-3.5" /> Send Connection Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
