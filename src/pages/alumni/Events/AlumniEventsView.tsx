import React, { useState } from "react";
import { toast } from "sonner";
import { Calendar, Ticket, Award, Image, Download, QrCode, CheckCircle2, Users, Clock } from "lucide-react";
import { AlumniEventItem, TimelineItem } from "@/types/alumni";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { EventCard } from "@/components/alumni/cards/EventCard";
import { StatCard } from "@/components/alumni/cards/StatCard";
import { CalendarWidget } from "@/components/alumni/widgets/CalendarWidget";
import { Timeline } from "@/components/alumni/timeline/Timeline";
import { QRAttendanceModal } from "@/components/alumni/dialogs/QRAttendanceModal";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AlumniEventsViewProps {
  eventsList: AlumniEventItem[];
  subTab?: string;
}

export const AlumniEventsView: React.FC<AlumniEventsViewProps> = ({
  eventsList,
  subTab = "upcoming",
}) => {
  const [activeSubTab, setActiveSubTab] = useState(subTab || "upcoming");
  const [selectedEvent, setSelectedEvent] = useState<AlumniEventItem | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleConfirmRegistration = () => {
    if (!selectedEvent) return;
    toast.success(`Registered ticket for ${selectedEvent.title}!`, {
      description: "Digital ticket PDF & QR Code sent to your registered email.",
    });
    setIsRegisterModalOpen(false);
  };

  const handleDownloadCertificate = () => {
    toast.success("Downloading Official Alumni Event Participation Certificate (PDF)...", {
      description: "Issued by Directorate of Alumni Relations.",
    });
    setIsCertificateModalOpen(false);
  };

  const filteredEvents = eventsList.filter((e) => {
    if (activeSubTab === "upcoming") return true;
    if (activeSubTab === "reunions") return e.category === "Global Reunion";
    if (activeSubTab === "webinars") return e.category === "Tech Symposium" || e.category === "Workshop";
    return true;
  });

  const eventTimelineItems: TimelineItem[] = [
    {
      id: "TL-01",
      title: "Global Grand Alumni Homecoming Reunion 2026",
      subtitle: "Main Auditorium & Lawn",
      period: "October 15, 2026 • 05:00 PM IST",
      description: "Celebrating 25 years of institutional excellence with keynote speeches, endowment galas, and networking dinners.",
      badge: "420 Registered",
      iconType: "event",
    },
    {
      id: "TL-02",
      title: "Silicon Valley GenAI Tech Symposium",
      subtitle: "Google Sunnyvale & Webcast",
      period: "September 08, 2026 • 09:00 AM PST",
      description: "Technical keynote address on large-scale AI deployment and quantum algorithms.",
      badge: "680 Webcast Viewers",
      iconType: "award",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events, Reunions & Tech Symposiums"
        subtitle="Stay connected through global homecoming galas, regional chapter meetups, and online research webinars."
        badgeText="Alumni Homecoming Hub"
        icon={Calendar}
        actions={
          <>
            <Button
              onClick={() => {
                setSelectedEvent(eventsList[0] || null);
                setIsQRModalOpen(true);
              }}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer backdrop-blur-md border border-white/20 gap-1.5"
            >
              <QrCode className="size-3.5" /> Digital QR Pass
            </Button>
            <Button
              onClick={() => setIsCertificateModalOpen(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
            >
              <Download className="size-3.5" /> Event Certificates
            </Button>
          </>
        }
      />

      {/* SUB-DASHBOARD STATISTICS CARDS */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Upcoming Events" value="15" change="Global Schedule" icon={Calendar} />
        <StatCard title="Registered Alumni" value="1,420" change="+12% Growth" icon={Users} />
        <StatCard title="Attendance Rate" value="94.2%" change="Verified Passes" icon={CheckCircle2} />
        <StatCard title="Completed Events" value="85" change="Annual Total" icon={Award} />
      </div>

      {/* SUB-NAVIGATION PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
        {[
          { id: "upcoming", label: "Upcoming Events" },
          { id: "past", label: "Past Events" },
          { id: "meets", label: "Alumni Meets" },
          { id: "reunions", label: "Reunions" },
          { id: "webinars", label: "Webinars & Workshops" },
          { id: "gallery", label: "Media Gallery" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
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

      {/* CONTENT BASED ON SUBTAB */}
      {activeSubTab === "gallery" ? (
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
            <Image className="size-5 text-[#2563EB]" /> Alumni Homecoming Media Gallery
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { title: "Homecoming Gala 2025", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop&q=80" },
              { title: "Silicon Valley Meetup", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop&q=80" },
              { title: "E-Cell Fireside Keynote", img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&auto=format&fit=crop&q=80" },
              { title: "Alumni Awards Ceremony", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&auto=format&fit=crop&q=80" },
            ].map((item) => (
              <div key={item.title} className="relative h-44 rounded-2xl overflow-hidden group border border-[#24356B]/30">
                <img src={item.img} alt={item.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B44] via-transparent to-transparent flex items-end p-3">
                  <span className="font-bold text-xs text-white font-sans">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
              <Calendar className="size-5 text-[#2563EB]" /> Event Schedule
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onRegister={(e) => {
                    setSelectedEvent(e);
                    if (e.isRegistered) {
                      setIsQRModalOpen(true);
                    } else {
                      setIsRegisterModalOpen(true);
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* CALENDAR & TIMELINE */}
          <div className="space-y-4">
            <CalendarWidget />

            <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2 pt-2">
              <Ticket className="size-5 text-[#2563EB]" /> Key Events Timeline
            </h3>
            <GlassCard className="p-5">
              <Timeline items={eventTimelineItems} />
            </GlassCard>
          </div>
        </div>
      )}

      {/* REGISTER TICKET MODAL */}
      <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          {selectedEvent && (
            <div className="space-y-4 text-xs font-sans">
              <DialogHeader>
                <DialogTitle className="font-extrabold text-base">Confirm Event Ticket Registration</DialogTitle>
                <p className="text-xs text-[#2563EB] font-mono font-bold pt-0.5">{selectedEvent.title}</p>
              </DialogHeader>

              <div className="p-3 bg-muted/50 rounded-xl space-y-1 font-mono text-[0.72rem]">
                <p>📅 Date: <strong>{selectedEvent.date} ({selectedEvent.time})</strong></p>
                <p>📍 Venue: <strong>{selectedEvent.venue}</strong></p>
                <p>🎟️ Ticket Fee: <strong className="text-emerald-600">Complimentary Alumni Pass</strong></p>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsRegisterModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleConfirmRegistration} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl gap-1">
                  <CheckCircle2 className="size-4" /> Confirm &amp; Download Pass
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CERTIFICATE PREVIEW MODAL */}
      <Dialog open={isCertificateModalOpen} onOpenChange={setIsCertificateModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <div className="space-y-4 text-xs font-sans text-center">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-base">Alumni Participation Certificate</DialogTitle>
            </DialogHeader>

            <div className="p-6 border-2 border-[#2563EB] bg-[#4D78FF]/5 rounded-2xl space-y-2">
              <Award className="size-10 text-[#2563EB] mx-auto" />
              <h4 className="font-extrabold text-sm font-sans text-foreground">Certificate of Excellence</h4>
              <p className="text-[0.68rem] text-muted-foreground font-mono">
                Awarded for distinguished participation in University Alumni Events.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={() => setIsCertificateModalOpen(false)} className="rounded-xl">
                Close
              </Button>
              <Button onClick={handleDownloadCertificate} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl gap-1.5">
                <Download className="size-4" /> Download Official PDF
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR ATTENDANCE MODAL */}
      <QRAttendanceModal
        event={selectedEvent}
        open={isQRModalOpen}
        onOpenChange={setIsQRModalOpen}
      />
    </div>
  );
};
