import React, { useState, useMemo } from "react";
import {
  Webinar,
  WebinarTab,
  CertificateItem,
  RecordingItem,
} from "./types";
import {
  MOCK_UPCOMING_WEBINARS,
  MOCK_FEATURED_WEBINAR,
  MOCK_CERTIFICATES,
  MOCK_RECORDINGS,
} from "./mock-data";

import { WebinarHeader } from "./webinar-header";
import { WebinarStatsCards } from "./webinar-stats";
import { WebinarHero } from "./webinar-hero";
import { CategoryChips } from "./category-chips";
import { WebinarTabsNav } from "./webinar-tabs";
import { WebinarCard } from "./webinar-card";
import { WebinarHighlights } from "./webinar-highlights";
import { CertificatesView } from "./certificates-view";
import { RecordingsView } from "./recordings-view";
import { WebinarEmptyState } from "./empty-states";

import { WebinarDetailModal } from "./webinar-detail-modal";
import { LiveSessionModal } from "./live-session-modal";
import { CertificateModal } from "./certificate-modal";
import { VideoPlayerModal } from "./video-player-modal";

import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function StudentWebinarsModule() {
  const [webinarsList, setWebinarsList] = useState<Webinar[]>(MOCK_UPCOMING_WEBINARS);
  const [certificatesList] = useState<CertificateItem[]>(MOCK_CERTIFICATES);
  const [recordingsList, setRecordingsList] = useState<RecordingItem[]>(MOCK_RECORDINGS);

  const [activeTab, setActiveTab] = useState<WebinarTab>("upcoming");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [liveWebinar, setLiveWebinar] = useState<Webinar | null>(null);
  const [isLiveOpen, setIsLiveOpen] = useState(false);

  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const [selectedRecording, setSelectedRecording] = useState<RecordingItem | null>(null);
  const [isRecordingOpen, setIsRecordingOpen] = useState(false);

  // Register toggle handler
  const handleRegisterToggle = (webinarId: string) => {
    setWebinarsList((prev) =>
      prev.map((w) => {
        if (w.id === webinarId) {
          const nextState = !w.isRegistered;
          if (nextState) {
            toast.success(`Successfully registered for "${w.title}"!`);
          } else {
            toast.info(`Registration canceled for "${w.title}".`);
          }
          const updated = {
            ...w,
            isRegistered: nextState,
            registeredCount: nextState ? w.registeredCount + 1 : w.registeredCount - 1,
            seatsLeft: nextState ? w.seatsLeft - 1 : w.seatsLeft + 1,
          };
          if (selectedWebinar?.id === webinarId) {
            setSelectedWebinar(updated);
          }
          return updated;
        }
        return w;
      })
    );
  };

  // Bookmark toggle handler
  const handleToggleWebinarBookmark = (webinarId: string) => {
    setWebinarsList((prev) =>
      prev.map((w) => {
        if (w.id === webinarId) {
          const nextState = !w.isBookmarked;
          toast.success(nextState ? `Saved "${w.title}" to bookmarks!` : `Removed "${w.title}" from bookmarks.`);
          const updated = { ...w, isBookmarked: nextState };
          if (selectedWebinar?.id === webinarId) {
            setSelectedWebinar(updated);
          }
          return updated;
        }
        return w;
      })
    );
  };

  // Featured webinar memoized from state
  const featuredWebinar = useMemo(() => {
    return webinarsList.find((w) => w.isFeatured || w.id === "web-live-1") || MOCK_FEATURED_WEBINAR;
  }, [webinarsList]);

  // Filter Webinars
  const filteredWebinars = useMemo(() => {
    return webinarsList.filter((webinar) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        webinar.title.toLowerCase().includes(query) ||
        webinar.speaker.name.toLowerCase().includes(query) ||
        webinar.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || webinar.category === selectedCategory;

      let matchesTab = true;
      if (activeTab === "live") matchesTab = webinar.status === "live";
      if (activeTab === "registered") matchesTab = webinar.isRegistered;
      if (activeTab === "completed") matchesTab = webinar.status === "completed";

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [webinarsList, searchQuery, selectedCategory, activeTab]);

  const handleSelectWebinar = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setIsDetailOpen(true);
  };

  const handleJoinLive = (webinar: Webinar) => {
    setLiveWebinar(webinar);
    setIsLiveOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 max-w-[1700px] mx-auto space-y-6">
      {/* 1. PAGE HEADER */}
      <WebinarHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. TOP NAVIGATION TABS */}
      <WebinarTabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. MAIN LAYOUT (LEFT CONTENT AREA vs RIGHT SIDEBAR) */}
      {activeTab === "certificates" ? (
        <CertificatesView
          certificates={certificatesList}
          onDownload={(cert) => toast.success(`Downloading ${cert.certificateName}...`)}
          onView={(cert) => {
            setSelectedCertificate(cert);
            setIsCertificateOpen(true);
          }}
        />
      ) : activeTab === "recordings" ? (
        <RecordingsView
          recordings={recordingsList}
          onWatch={(rec) => {
            setSelectedRecording(rec);
            setIsRecordingOpen(true);
          }}
          onToggleBookmark={(recId) => {
            setRecordingsList((prev) =>
              prev.map((r) => (r.id === recId ? { ...r, isBookmarked: !r.isBookmarked } : r))
            );
            toast.success("Bookmark updated!");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT 3 COLS: WEBINAR CONTENT */}
          <div className="lg:col-span-3 space-y-8">
            {/* UPCOMING WEBINARS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white capitalize">
                  {activeTab} Webinars
                </h2>
                <button
                  onClick={() => {
                    setActiveTab("upcoming");
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  View All <ArrowRight className="size-3" />
                </button>
              </div>

              {filteredWebinars.length === 0 ? (
                <WebinarEmptyState
                  type={activeTab === "registered" ? "no-registrations" : "no-webinars"}
                  onResetFilter={() => {
                    setActiveTab("upcoming");
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredWebinars.map((webinar) => (
                    <WebinarCard
                      key={webinar.id}
                      webinar={webinar}
                      onRegisterToggle={handleRegisterToggle}
                      onToggleBookmark={handleToggleWebinarBookmark}
                      onSelectWebinar={handleSelectWebinar}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* BOTTOM ROW: FEATURED WEBINAR BANNER (LEFT) & TOP CATEGORIES (RIGHT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured Webinar Banner */}
              <WebinarHero
                webinar={featuredWebinar}
                onRegisterToggle={handleRegisterToggle}
                onSelectWebinar={handleSelectWebinar}
              />

              {/* Top Categories Card */}
              <CategoryChips
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setActiveTab("upcoming");
                }}
              />
            </div>

            {/* RECENT RECORDINGS ROW */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Recent Recordings
                </h2>
                <button
                  onClick={() => setActiveTab("recordings")}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                >
                  View All <ArrowRight className="size-3" />
                </button>
              </div>
              <RecordingsView
                recordings={recordingsList.slice(0, 2)}
                onWatch={(rec) => {
                  setSelectedRecording(rec);
                  setIsRecordingOpen(true);
                }}
                onToggleBookmark={(recId) => {
                  setRecordingsList((prev) =>
                    prev.map((r) => (r.id === recId ? { ...r, isBookmarked: !r.isBookmarked } : r))
                  );
                }}
              />
            </div>

            {/* MY CERTIFICATES ROW */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  My Certificates
                </h2>
                <button
                  onClick={() => setActiveTab("certificates")}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                >
                  View All <ArrowRight className="size-3" />
                </button>
              </div>
              <CertificatesView
                certificates={certificatesList}
                onDownload={(cert) => toast.success(`Downloading ${cert.certificateName}...`)}
                onView={(cert) => {
                  setSelectedCertificate(cert);
                  setIsCertificateOpen(true);
                }}
              />
            </div>
          </div>

          {/* RIGHT 1 COL: SIDEBAR (WEBINAR HIGHLIGHTS & UPCOMING SCHEDULE) */}
          <div className="lg:col-span-1">
            <WebinarHighlights onTabNavigate={(tab) => setActiveTab(tab)} />
          </div>
        </div>
      )}

      {/* 5. MODALS */}
      <WebinarDetailModal
        webinar={selectedWebinar}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRegisterToggle={handleRegisterToggle}
        onJoinLive={handleJoinLive}
      />

      <LiveSessionModal
        webinar={liveWebinar}
        isOpen={isLiveOpen}
        onClose={() => setIsLiveOpen(false)}
      />

      <CertificateModal
        certificate={selectedCertificate}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      <VideoPlayerModal
        recording={selectedRecording}
        isOpen={isRecordingOpen}
        onClose={() => setIsRecordingOpen(false)}
      />
    </div>
  );
}
