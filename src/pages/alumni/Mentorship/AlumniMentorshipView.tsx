import React, { useState } from "react";
import { toast } from "sonner";
import { Award, Star, UserPlus, Clock, Users, CheckCircle2, MessageSquare } from "lucide-react";
import { MentorItem, TimelineItem } from "@/types/alumni";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { MentorCard } from "@/components/alumni/cards/MentorCard";
import { StatCard } from "@/components/alumni/cards/StatCard";
import { MentorRequestModal } from "@/components/alumni/dialogs/MentorRequestModal";
import { Timeline } from "@/components/alumni/timeline/Timeline";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AlumniMentorshipViewProps {
  mentorsList: MentorItem[];
  subTab?: string;
}

export const AlumniMentorshipView: React.FC<AlumniMentorshipViewProps> = ({
  mentorsList,
  subTab = "directory",
}) => {
  const [activeSubTab, setActiveSubTab] = useState(subTab || "directory");
  const [selectedMentor, setSelectedMentor] = useState<MentorItem | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isBecomeMentorModalOpen, setIsBecomeMentorModalOpen] = useState(false);

  const [mentorForm, setMentorForm] = useState({
    domain: "Distributed Systems & Cloud",
    slots: "Saturday 10:00 AM, Sunday 04:00 PM",
  });

  const handleBecomeMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Successfully registered as an Alumni Mentor!", {
      description: "Your available slots are now visible to university undergrads.",
    });
    setIsBecomeMentorModalOpen(false);
  };

  const sessionHistoryItems: TimelineItem[] = [
    {
      id: "HIS-01",
      title: "System Design & Cloud Architecture Review",
      subtitle: "Mentor: Sarah Jenkins (Google Cloud)",
      period: "July 28, 2026",
      description: "Covered distributed caching strategy, database sharding, and fault tolerance patterns for high-throughput backend services.",
      badge: "Rating: 5.0 ⭐",
      iconType: "work",
    },
    {
      id: "HIS-02",
      title: "FAANG Mock Coding Interview",
      subtitle: "Mentor: Karthik Subramanian (Microsoft)",
      period: "July 14, 2026",
      description: "Practiced graph traversal algorithms and sliding window dynamic programming problems.",
      badge: "Rating: 5.0 ⭐",
      iconType: "education",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="1-on-1 Alumni Mentorship Hub"
        subtitle="Book private 30-minute career guidance sessions, mock technical interviews, and resume critiques with senior alumni leaders."
        badgeText="Active Mentorship Portal"
        icon={Award}
        actions={
          <Button
            onClick={() => setIsBecomeMentorModalOpen(true)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
          >
            <UserPlus className="size-3.5" /> Become an Alumni Mentor
          </Button>
        }
      />

      {/* SUB-DASHBOARD STATISTICS CARDS */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Mentors" value="480" change="Verified Roster" icon={Award} />
        <StatCard title="Active Mentors" value="320" change="Available This Week" icon={Users} />
        <StatCard title="Sessions Conducted" value="1,240" change="1-on-1 Meetings" icon={CheckCircle2} />
        <StatCard title="Student Satisfaction" value="4.9 / 5.0" change="142 Feedback Forms" icon={Star} />
      </div>

      {/* SUB-NAVIGATION PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
        {[
          { id: "directory", label: "Mentor Directory" },
          { id: "become-mentor", label: "Become a Mentor" },
          { id: "book-session", label: "Book 1-on-1 Session" },
          { id: "session-history", label: "Session History" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              if (tab.id === "become-mentor") setIsBecomeMentorModalOpen(true);
              if (tab.id === "book-session") {
                setSelectedMentor(mentorsList[0] || null);
                setIsBookModalOpen(true);
              }
            }}
            className={`p-2 px-3.5 rounded-xl border font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeSubTab === tab.id
                ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                : "bg-card border-[#24356B]/30 hover:border-[#4D78FF]/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MENTOR CARDS GRID */}
      {activeSubTab === "session-history" ? (
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
            <Clock className="size-5 text-[#2563EB]" /> Mentorship Session History Timeline
          </h3>
          <GlassCard className="p-5">
            <Timeline items={sessionHistoryItems} />
          </GlassCard>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
            <Award className="size-5 text-[#2563EB]" /> Featured Industry Mentors
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mentorsList.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onBookSlot={(m) => {
                  setSelectedMentor(m);
                  setIsBookModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* BOOK SLOT MODAL */}
      <MentorRequestModal
        mentor={selectedMentor}
        open={isBookModalOpen}
        onOpenChange={setIsBookModalOpen}
      />

      {/* BECOME MENTOR MODAL */}
      <Dialog open={isBecomeMentorModalOpen} onOpenChange={setIsBecomeMentorModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <form onSubmit={handleBecomeMentorSubmit} className="space-y-3.5 text-xs font-sans">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-base">Register as Alumni Mentor</DialogTitle>
            </DialogHeader>

            <div className="space-y-2 font-mono">
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Domain Expertise</label>
                <Input
                  value={mentorForm.domain}
                  onChange={(e) => setMentorForm({ ...mentorForm, domain: e.target.value })}
                  className="h-9"
                />
              </div>
              <div>
                <label className="font-bold text-foreground font-sans block mb-1">Available Weekly Time Slots</label>
                <Input
                  value={mentorForm.slots}
                  onChange={(e) => setMentorForm({ ...mentorForm, slots: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsBecomeMentorModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl">
                Join Mentor Directory
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
