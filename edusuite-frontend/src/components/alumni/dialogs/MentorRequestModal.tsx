import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Check, Calendar } from "lucide-react";
import { MentorItem } from "@/types/alumni";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MentorRequestModalProps {
  mentor: MentorItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MentorRequestModal: React.FC<MentorRequestModalProps> = ({
  mentor,
  open,
  onOpenChange,
}) => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [topic, setTopic] = useState("");

  // Automatically pre-select the first available time slot when modal opens or mentor changes
  useEffect(() => {
    if (mentor && mentor.availableSlots && mentor.availableSlots.length > 0) {
      setSelectedSlot(mentor.availableSlots[0]!);
    }
  }, [mentor, open]);

  if (!mentor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeSlot = selectedSlot || (mentor.availableSlots && mentor.availableSlots[0]) || "Upcoming Slot";
    
    toast.success(`Booked 1-on-1 session with ${mentor.name} for ${activeSlot}!`, {
      description: topic ? `Topic: "${topic}"` : "Calendar invitation sent to your email.",
      icon: <Calendar className="size-4 text-emerald-600" />,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <img src={mentor.avatar} alt={mentor.name} className="size-12 rounded-2xl object-cover border border-primary/20" />
              <div>
                <DialogTitle className="font-extrabold text-base">{mentor.name}</DialogTitle>
                <DialogDescription className="text-xs font-mono text-primary font-bold">
                  {mentor.designation} @ {mentor.company}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-2 font-mono">
            <label className="font-bold text-foreground font-sans block text-[0.72rem]">
              Select Available Time Slot:
            </label>
            <div className="flex flex-wrap gap-2">
              {mentor.availableSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 px-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#2563EB] text-white font-bold border-[#2563EB] shadow-xs"
                        : "bg-card border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {isSelected && <Check className="size-3.5" />}
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1 font-mono">
            <label className="font-bold text-foreground font-sans block text-[0.72rem]">
              Session Topic / Notes:
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g., System Design review for Google interview..."
              rows={3}
              className="w-full p-2.5 rounded-xl border border-input bg-background font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer">
              Confirm Slot Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
