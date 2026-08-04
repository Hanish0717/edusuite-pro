import React, { useState } from "react";
import { toast } from "sonner";
import { Mail, UserPlus, Send, CheckCircle2 } from "lucide-react";
import { InvitationItem } from "@/types/alumni";
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

interface InviteBatchmateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendInvitation: (invitation: InvitationItem) => void;
}

export const InviteBatchmateModal: React.FC<InviteBatchmateModalProps> = ({
  open,
  onOpenChange,
  onSendInvitation,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [batch, setBatch] = useState("Batch of 2024");
  const [dept, setDept] = useState("Computer Science (CSE)");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error("Please fill in recipient's name and email address.");
      return;
    }

    const newInvite: InvitationItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      recipientName: fullName,
      recipientEmail: email,
      batch,
      dept,
      invitedBy: "Sarah Jenkins",
      invitedDate: new Date().toISOString().split("T")[0]!,
      status: "Pending",
    };

    onSendInvitation(newInvite);
    toast.success("Invitation sent successfully!", {
      description: `An invitation email has been sent to ${email}. The invited graduate must complete student record verification.`,
      icon: <CheckCircle2 className="size-4 text-[#2563EB]" />,
    });

    setFullName("");
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-base flex items-center gap-2">
              <UserPlus className="size-5 text-[#2563EB]" /> Invite Batchmate to Alumni Portal
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Send an official verified invitation link to your graduation batchmates. Only verified alumni can access the portal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 font-mono">
            <div>
              <label className="font-bold text-foreground font-sans block mb-1">Batchmate Full Name</label>
              <Input
                placeholder="E.g., Priya Sundaram"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-9 font-sans text-xs"
                required
              />
            </div>

            <div>
              <label className="font-bold text-foreground font-sans block mb-1">Email Address</label>
              <Input
                type="email"
                placeholder="priya.sundaram@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 font-mono text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Graduation Batch</label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full h-9 p-2 rounded-xl border border-input bg-background text-xs font-mono"
                >
                  {["Batch of 2020", "Batch of 2021", "Batch of 2022", "Batch of 2023", "Batch of 2024", "Batch of 2025"].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Department</label>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full h-9 p-2 rounded-xl border border-input bg-background text-xs font-mono"
                >
                  {["Computer Science (CSE)", "Electronics & Communication (ECE)", "Mechanical Engineering (ME)", "Information Technology (IT)"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
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
              <Send className="size-3.5" /> Send Batchmate Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
