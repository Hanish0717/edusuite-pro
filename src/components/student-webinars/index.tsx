import { useState, useMemo } from "react";
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
import { WebinarHero } from "./webinar-hero";
import { WebinarTabsNav } from "./webinar-tabs";
import { WebinarCard } from "./webinar-card";
import { CertificatesView } from "./certificates-view";
import { RecordingsView } from "./recordings-view";
import { WebinarEmptyState } from "./empty-states";

import { WebinarDetailModal } from "./webinar-detail-modal";
import { LiveSessionModal } from "./live-session-modal";
import { CertificateModal } from "./certificate-modal";
import { VideoPlayerModal } from "./video-player-modal";

import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const LOCAL_STORAGE_REG_KEY = "EDUSUITE_WEBINAR_REGISTRATIONS";
const LOCAL_STORAGE_BOOKMARK_KEY = "EDUSUITE_WEBINAR_BOOKMARKS";
const LOCAL_STORAGE_REC_BOOKMARK_KEY = "EDUSUITE_RECORDING_BOOKMARKS";

const getHydratedWebinars = (): Webinar[] => {
  if (typeof window === "undefined") return MOCK_UPCOMING_WEBINARS;
  try {
    const savedRegs = localStorage.getItem(LOCAL_STORAGE_REG_KEY);
    const savedBookmarks = localStorage.getItem(LOCAL_STORAGE_BOOKMARK_KEY);
    const regIds: string[] = savedRegs ? JSON.parse(savedRegs) : [];
    const bookmarkIds: string[] = savedBookmarks ? JSON.parse(savedBookmarks) : [];

    return MOCK_UPCOMING_WEBINARS.map((w) => {
      const isReg = regIds.includes(w.id);
      const isBook = bookmarkIds.includes(w.id);
      return {
        ...w,
        isRegistered: isReg,
        isBookmarked: isBook,
        registeredCount: isReg ? w.registeredCount + 1 : w.registeredCount,
        seatsLeft: isReg ? w.seatsLeft - 1 : w.seatsLeft,
      };
    });
  } catch (e) {
    console.error("Failed to parse localStorage data", e);
    return MOCK_UPCOMING_WEBINARS;
  }
};

const getHydratedFeaturedWebinar = (): Webinar => {
  if (typeof window === "undefined") return MOCK_FEATURED_WEBINAR;
  try {
    const savedRegs = localStorage.getItem(LOCAL_STORAGE_REG_KEY);
    const savedBookmarks = localStorage.getItem(LOCAL_STORAGE_BOOKMARK_KEY);
    const regIds: string[] = savedRegs ? JSON.parse(savedRegs) : [];
    const bookmarkIds: string[] = savedBookmarks ? JSON.parse(savedBookmarks) : [];

    const w = MOCK_FEATURED_WEBINAR;
    const isReg = regIds.includes(w.id);
    const isBook = bookmarkIds.includes(w.id);
    return {
      ...w,
      isRegistered: isReg,
      isBookmarked: isBook,
      registeredCount: isReg ? w.registeredCount + 1 : w.registeredCount,
      seatsLeft: isReg ? w.seatsLeft - 1 : w.seatsLeft,
    };
  } catch (e) {
    console.error("Failed to parse localStorage featured webinar", e);
    return MOCK_FEATURED_WEBINAR;
  }
};

const getHydratedRecordings = (): RecordingItem[] => {
  if (typeof window === "undefined") return MOCK_RECORDINGS;
  try {
    const savedRecBookmarks = localStorage.getItem(LOCAL_STORAGE_REC_BOOKMARK_KEY);
    const recBookmarkIds: string[] = savedRecBookmarks ? JSON.parse(savedRecBookmarks) : [];

    return MOCK_RECORDINGS.map((r) => {
      const isBook = recBookmarkIds.includes(r.id);
      return {
        ...r,
        isBookmarked: isBook,
      };
    });
  } catch (e) {
    console.error("Failed to parse localStorage recordings", e);
    return MOCK_RECORDINGS;
  }
};

export function StudentWebinarsModule() {
  const [webinarsList, setWebinarsList] = useState<Webinar[]>(() => getHydratedWebinars());
  const [featuredWebinar, setFeaturedWebinar] = useState<Webinar>(() => getHydratedFeaturedWebinar());
  const [certificatesList] = useState<CertificateItem[]>(MOCK_CERTIFICATES);
  const [recordingsList, setRecordingsList] = useState<RecordingItem[]>(() => getHydratedRecordings());

  const [activeTab, setActiveTab] = useState<WebinarTab>("upcoming");
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

  // Registration loading and session tracking states
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [newlyRegisteredIds, setNewlyRegisteredIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // PDF download state
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

  // Register toggle handler
  const handleRegisterToggle = async (webinarId: string) => {
    // Find the webinar
    const webinar = webinarId === featuredWebinar.id 
      ? featuredWebinar 
      : webinarsList.find((w) => w.id === webinarId);

    if (!webinar) return;

    if (webinar.isRegistered) {
      // Registration is disabled once registered
      return;
    }

    if (webinar.seatsLeft <= 0) {
      toast.error("No seats available for this webinar.");
      return;
    }

    setRegisteringId(webinarId);

    // Simulate network latency for loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (webinarId === featuredWebinar.id) {
      setFeaturedWebinar((prev) => ({
        ...prev,
        isRegistered: true,
        registeredCount: prev.registeredCount + 1,
        seatsLeft: prev.seatsLeft - 1,
      }));
    } else {
      setWebinarsList((prev) =>
        prev.map((w) => {
          if (w.id === webinarId) {
            return {
              ...w,
              isRegistered: true,
              registeredCount: w.registeredCount + 1,
              seatsLeft: w.seatsLeft - 1,
            };
          }
          return w;
        })
      );
    }

    setNewlyRegisteredIds((prev) => [...prev, webinarId]);
    toast.success("Successfully registered for the webinar.");
    setRegisteringId(null);
  };

  // Bookmark toggle handler for webinars
  const handleBookmarkToggle = (webinarId: string) => {
    let nextBookmarked = false;

    if (webinarId === featuredWebinar.id) {
      nextBookmarked = !featuredWebinar.isBookmarked;
      setFeaturedWebinar((prev) => ({ ...prev, isBookmarked: nextBookmarked }));
    } else {
      setWebinarsList((prev) =>
        prev.map((w) => {
          if (w.id === webinarId) {
            nextBookmarked = !w.isBookmarked;
            return { ...w, isBookmarked: nextBookmarked };
          }
          return w;
        })
      );
    }

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BOOKMARK_KEY);
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (nextBookmarked) {
        if (!list.includes(webinarId)) {
          list.push(webinarId);
        }
      } else {
        list = list.filter((id) => id !== webinarId);
      }
      localStorage.setItem(LOCAL_STORAGE_BOOKMARK_KEY, JSON.stringify(list));
      toast.success(nextBookmarked ? "Webinar bookmarked!" : "Bookmark removed!");
    } catch (e) {
      console.error("Failed to update bookmark in localStorage", e);
    }
  };

  // Save all current registrations
  const handleSaveRegistrations = async () => {
    setIsSaving(true);

    // Simulate save duration
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const currentRegIds: string[] = [];
      if (featuredWebinar.isRegistered) {
        currentRegIds.push(featuredWebinar.id);
      }
      webinarsList.forEach((w) => {
        if (w.isRegistered) {
          currentRegIds.push(w.id);
        }
      });

      const saved = localStorage.getItem(LOCAL_STORAGE_REG_KEY);
      const prevSavedIds: string[] = saved ? JSON.parse(saved) : [];

      const combinedIds = Array.from(new Set([...prevSavedIds, ...currentRegIds]));
      localStorage.setItem(LOCAL_STORAGE_REG_KEY, JSON.stringify(combinedIds));

      toast.success("Webinar registrations saved successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save registrations.");
    } finally {
      setIsSaving(false);
    }
  };

  // Build a standalone off-screen certificate element with pure inline styles for html2canvas capture
  const buildCertificateElement = (cert: CertificateItem): HTMLElement => {
    const speakerName =
      cert.webinarId === "web-106"
        ? "Dr. Priya Sharma"
        : cert.webinarId === "web-107"
        ? "Mr. Arjun Reddy"
        : "Dr. Raghav Menon";

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      position: fixed;
      left: -9999px;
      top: -9999px;
      width: 1122px;
      height: 794px;
      box-sizing: border-box;
      background: linear-gradient(135deg, #020617 0%, #0f172a 50%, #1c0a0a 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 56px 72px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
      text-align: center;
      border: 2px solid rgba(245,158,11,0.3);
      border-radius: 24px;
      overflow: hidden;
    `;

    wrapper.innerHTML = `
      <div style="position:absolute;inset:16px;border:2px solid rgba(245,158,11,0.3);border-radius:18px;pointer-events:none;"></div>
      <div style="position:absolute;inset:24px;border:1px solid rgba(245,158,11,0.15);border-radius:14px;pointer-events:none;"></div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
        <div style="width:80px;height:80px;border-radius:50%;background:rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;border:2px solid rgba(245,158,11,0.4);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        </div>
        <span style="font-size:11px;font-weight:800;letter-spacing:0.2em;color:#f59e0b;text-transform:uppercase;">EduSuite Pro Technical Academy</span>
        <h2 style="font-size:36px;font-weight:700;color:white;margin:0;font-family:Georgia,serif;letter-spacing:2px;">Certificate of Completion</h2>
        <p style="font-size:12px;color:#94a3b8;margin:0;">This credential is proudly awarded to</p>
      </div>

      <div style="border-bottom:1px solid rgba(245,158,11,0.2);padding-bottom:16px;max-width:500px;width:100%;">
        <h3 style="font-size:38px;font-weight:800;margin:0;background:linear-gradient(90deg,#fde68a,#ffffff,#fcd34d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">K. Sai Teja</h3>
        <p style="font-size:11px;color:#94a3b8;margin:6px 0 0;">Student ID: 22CS101 &bull; Computer Science &amp; Engineering</p>
      </div>

      <div style="max-width:600px;width:100%;display:flex;flex-direction:column;gap:8px;font-size:12px;color:#cbd5e1;">
        <p style="margin:0;">for successfully attending and completing the interactive masterclass:</p>
        <p style="margin:0;font-size:14px;font-weight:700;color:#fcd34d;padding:10px 20px;border-radius:12px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);">&quot;${cert.webinarTitle}&quot;</p>
        <p style="margin:0;font-size:11px;color:#94a3b8;">Issued on <span style="color:white;font-weight:600;">${cert.issueDate}</span> by ${cert.issuerName}</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;width:100%;max-width:700px;border-top:1px solid rgba(245,158,11,0.2);padding-top:20px;align-items:flex-end;font-size:11px;">
        <div style="text-align:left;display:flex;flex-direction:column;gap:8px;">
          <div style="background:white;padding:6px;border-radius:6px;display:inline-block;width:64px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=EDUSUITE-CERT-${cert.certificateCode}" width="64" height="64" style="display:block;" />
          </div>
          <div>
            <span style="font-size:9px;color:#64748b;text-transform:uppercase;display:block;">Credential ID</span>
            <span style="font-family:monospace;color:#f59e0b;font-weight:700;font-size:10px;">${cert.certificateCode}</span>
          </div>
        </div>
        <div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div style="width:56px;height:56px;border-radius:50%;border:2px solid #f59e0b;background:rgba(245,158,11,0.1);display:flex;align-items:center;justify-content:center;color:#f59e0b;font-weight:700;font-size:10px;font-family:Georgia,serif;">SEAL</div>
          <span style="color:#34d399;font-weight:700;font-size:10px;background:rgba(4,120,87,0.2);padding:2px 8px;border-radius:20px;">&#10003; Verified</span>
        </div>
        <div style="text-align:right;display:flex;flex-direction:column;gap:12px;">
          <div>
            <span style="font-style:italic;color:#fcd34d;font-size:13px;display:block;font-family:Georgia,serif;">Priya Sharma</span>
            <div style="height:1px;background:#334155;width:112px;margin-left:auto;"></div>
            <span style="font-size:9px;color:#64748b;display:block;">Authorized Signature</span>
          </div>
          <div>
            <span style="font-size:9px;color:#64748b;display:block;">Speaker</span>
            <span style="font-weight:700;font-size:10px;color:#e2e8f0;">${speakerName}</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);
    return wrapper;
  };

  // Shared download handler for PNG and PDF formats
  const handleDownloadCertificate = async (cert: CertificateItem, format: "png" | "pdf") => {
    setDownloadingCertId(cert.id);
    const toastId = toast.loading("Generating...");

    let tempElement: HTMLElement | null = null;

    try {
      console.log("Download button clicked");

      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default || html2canvasModule;

      let elementToCapture: HTMLElement | null = null;

      // For PDF: try to capture the already-visible modal first
      if (format === "pdf") {
        elementToCapture = document.getElementById("certificate-preview-container");
        console.log("Modal element lookup:", elementToCapture ? "found" : "not found");
      }

      // If no visible modal element, build a standalone DOM element with inline styles
      if (!elementToCapture) {
        tempElement = buildCertificateElement(cert);
        // Allow browser to finish layout painting
        await new Promise((resolve) => setTimeout(resolve, 400));
        elementToCapture = tempElement;
      }

      if (!elementToCapture) {
        throw new Error("Certificate element could not be found for capture.");
      }
      console.log("Certificate element found");

      console.log("html2canvas started");
      const canvas = await html2canvas(elementToCapture, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#020617",
        logging: false,
      });

      console.log("Canvas created");
      toast.loading("Preparing Download...", { id: toastId });

      const studentName = "K_SaiTeja";
      const studentId = "22CS101";
      const certificateId = cert.certificateCode;

      if (format === "png") {
        console.log("PNG created");
        const dataUrl = canvas.toDataURL("image/png");
        console.log("Calling download");

        const link = document.createElement("a");
        link.download = `Certificate_${studentName}_${certificateId}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const jsPDFModule = await import("jspdf");
        const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

        console.log("PDF created");
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const pdfW = pdf.internal.pageSize.getWidth();
        const pdfH = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH, undefined, "FAST");
        console.log("Calling download");

        const fileName = `Certificate_${studentId}_${certificateId}.pdf`;

        try {
          pdf.save(fileName);
        } catch (downloadError) {
          console.warn("pdf.save failed, using blob fallback:", downloadError);
          const blob = pdf.output("blob");
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = fileName;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }

      console.log("Download completed");
      toast.success("Certificate downloaded successfully!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error("Certificate download failed.", { id: toastId });
    } finally {
      if (tempElement && document.body.contains(tempElement)) {
        document.body.removeChild(tempElement);
      }
      setDownloadingCertId(null);
    }
  };

  // Active selected webinar selector to keep modal state in sync with updates
  const activeSelectedWebinar = useMemo(() => {
    if (!selectedWebinar) return null;
    if (selectedWebinar.id === featuredWebinar.id) return featuredWebinar;
    return webinarsList.find((w) => w.id === selectedWebinar.id) || selectedWebinar;
  }, [selectedWebinar, featuredWebinar, webinarsList]);

  // Filter Webinars
  const filteredWebinars = useMemo(() => {
    return webinarsList.filter((webinar) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        webinar.title.toLowerCase().includes(query) ||
        webinar.speaker.name.toLowerCase().includes(query) ||
        webinar.category.toLowerCase().includes(query);

      let matchesTab = true;
      if (activeTab === "live") matchesTab = webinar.status === "live";
      if (activeTab === "registered") matchesTab = webinar.isRegistered;
      if (activeTab === "completed") matchesTab = webinar.status === "completed";

      return matchesSearch && matchesTab;
    });
  }, [webinarsList, searchQuery, activeTab]);

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
        onSave={handleSaveRegistrations}
        isSaving={isSaving}
      />

      {/* 3. TOP NAVIGATION TABS */}
      <WebinarTabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. MAIN LAYOUT (LEFT CONTENT AREA vs RIGHT SIDEBAR) */}
      {activeTab === "certificates" ? (
        <CertificatesView
          certificates={certificatesList}
          onDownload={(cert) => handleDownloadCertificate(cert, "png")}
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
            setRecordingsList((prev) => {
              const updated = prev.map((r) => (r.id === recId ? { ...r, isBookmarked: !r.isBookmarked } : r));
              try {
                const bookmarkedRecs = updated.filter(r => r.isBookmarked).map(r => r.id);
                localStorage.setItem(LOCAL_STORAGE_REC_BOOKMARK_KEY, JSON.stringify(bookmarkedRecs));
              } catch (e) {
                console.error(e);
              }
              return updated;
            });
            toast.success("Bookmark updated!");
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* UPCOMING WEBINARS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Upcoming Webinars
              </h2>
              <button
                onClick={() => setActiveTab("upcoming")}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
              >
                View All <ArrowRight className="size-3" />
              </button>
            </div>

            {filteredWebinars.length === 0 ? (
              <WebinarEmptyState
                type={activeTab === "registered" ? "no-registrations" : "no-webinars"}
                onResetFilter={() => {
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
                    onSelectWebinar={handleSelectWebinar}
                    newlyRegisteredIds={newlyRegisteredIds}
                    registeringId={registeringId}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Featured Webinar Banner */}
          <WebinarHero
            webinar={featuredWebinar}
            onRegisterToggle={handleRegisterToggle}
            onSelectWebinar={handleSelectWebinar}
            newlyRegisteredIds={newlyRegisteredIds}
            registeringId={registeringId}
          />

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
                setRecordingsList((prev) => {
                  const updated = prev.map((r) => (r.id === recId ? { ...r, isBookmarked: !r.isBookmarked } : r));
                  try {
                    const bookmarkedRecs = updated.filter(r => r.isBookmarked).map(r => r.id);
                    localStorage.setItem(LOCAL_STORAGE_REC_BOOKMARK_KEY, JSON.stringify(bookmarkedRecs));
                  } catch (e) {
                    console.error(e);
                  }
                  return updated;
                });
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
              onDownload={(cert) => handleDownloadCertificate(cert, "png")}
              onView={(cert) => {
                setSelectedCertificate(cert);
                setIsCertificateOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 5. MODALS */}
      <WebinarDetailModal
        webinar={activeSelectedWebinar}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRegisterToggle={handleRegisterToggle}
        onJoinLive={handleJoinLive}
        newlyRegisteredIds={newlyRegisteredIds}
        registeringId={registeringId}
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
        onDownload={(cert) => handleDownloadCertificate(cert, "pdf")}
        isDownloading={downloadingCertId !== null}
      />

      <VideoPlayerModal
        recording={selectedRecording}
        isOpen={isRecordingOpen}
        onClose={() => setIsRecordingOpen(false)}
      />
    </div>
  );
}
