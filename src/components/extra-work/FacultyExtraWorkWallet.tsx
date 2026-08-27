import React, { useState, useRef } from "react";
import {
  Wallet,
  TrendingUp,
  Clock,
  Briefcase,
  PlusCircle,
  Search,
  FileCheck2,
  Award,
  Download,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Printer,
  X,
  FileText,
  Camera,
  Image as ImageIcon,
  Upload,
  Paperclip,
  Trash2,
  RefreshCw,
  Plus,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ExtraWorkWalletService } from "@/services/extra-work-wallet-service";
import { ExtraWorkItem, ExtraWorkCategory, EvidenceItem, VerificationAuthority } from "@/types/extra-work-wallet";
import { FacultyTierBadge } from "./FacultyTierBadge";

interface AttachedFilePreview {
  id: string;
  name: string;
  size: string;
  type: "IMAGE" | "PDF" | "DOCUMENT";
  previewUrl: string;
  fileObj?: File;
}

export function FacultyExtraWorkWallet() {
  const facultyId = "FAC-CSE-101";

  // DYNAMIC STATES
  const [summary, setSummary] = useState(() => ExtraWorkWalletService.getFacultyWalletSummary(facultyId));
  const [items, setItems] = useState<ExtraWorkItem[]>(() => ExtraWorkWalletService.getFacultyExtraWorkItems(facultyId));
  const [opportunities, setOpportunities] = useState(() => ExtraWorkWalletService.getOpenOpportunities());
  const [benefits, setBenefits] = useState(() => ExtraWorkWalletService.getWWPBenefits(summary.totalWWP));

  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "LEDGER" | "OPPORTUNITIES" | "BENEFITS">("OVERVIEW");

  // LOG EXTRA WORK CLAIM MODAL STATE
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimTitle, setClaimTitle] = useState("");
  const [claimCategory, setClaimCategory] = useState<ExtraWorkCategory>("EVENTS");
  const [targetAuthority, setTargetAuthority] = useState<VerificationAuthority>("HOD");
  const [claimRole, setClaimRole] = useState("Lead Coordinator");
  const [claimDescription, setClaimDescription] = useState("");
  const [claimStartDate, setClaimStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [claimEndDate, setClaimEndDate] = useState("");
  const [claimDurationHours, setClaimDurationHours] = useState("12");

  // MEDIA ATTACHMENTS STATE (Photos, Camera Snaps, PDF Certificates)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFilePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // REAL LIVE CAMERA VIEWFINDER STATE
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraPhotoCount, setCameraPhotoCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // APPRAISAL REPORT MODAL STATE
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  // REFRESH ALL DYNAMIC DATA
  const refreshWalletData = React.useCallback(() => {
    const updatedSummary = ExtraWorkWalletService.getFacultyWalletSummary(facultyId);
    const updatedItems = ExtraWorkWalletService.getFacultyExtraWorkItems(facultyId);
    const updatedOpps = ExtraWorkWalletService.getOpenOpportunities();
    const updatedBenefits = ExtraWorkWalletService.getWWPBenefits(updatedSummary.totalWWP);

    setSummary(updatedSummary);
    setItems(updatedItems);
    setOpportunities(updatedOpps);
    setBenefits(updatedBenefits);
  }, [facultyId]);

  // LIVE REACTIVE SUBSCRIPTION TO WALLET SERVICE MUTATIONS
  React.useEffect(() => {
    refreshWalletData();
    const unsubscribe = ExtraWorkWalletService.subscribe(() => {
      refreshWalletData();
    });
    return () => unsubscribe();
  }, [refreshWalletData]);

  // CATEGORY CHANGE WITH AUTO-SUGGESTED VERIFIER ROUTING
  const handleCategoryChange = (cat: ExtraWorkCategory) => {
    setClaimCategory(cat);
    const suggestedRole = ExtraWorkWalletService.resolveVerificationAuthority(cat);
    setTargetAuthority(suggestedRole);
  };

  // OPEN REAL LIVE WEBCAM / CAMERA STREAM
  const startLiveCamera = async () => {
    setCapturedPhoto(null);
    setCameraError(null);
    setIsCameraModalOpen(true);

    setTimeout(async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError("Camera API is not supported on this browser/device.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        setCameraStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => console.log("Video play error:", err));
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setCameraStream(fallbackStream);
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            videoRef.current.play().catch((err) => console.log("Fallback video play error:", err));
          }
        } catch (fallbackErr: any) {
          setCameraError("Could not access camera. Please check camera permissions in browser.");
        }
      }
    }, 100);
  };

  // STOP LIVE CAMERA STREAM
  const stopLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraModalOpen(false);
    setCapturedPhoto(null);
  };

  // SNAP PHOTO FROM LIVE VIDEO STREAM
  const snapLivePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedPhoto(dataUrl);
    }
  };

  // RETAKE PHOTO ACTION
  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => console.log("Re-play error:", err));
    }
  };

  // CONFIRM AND ATTACH CAPTURED PHOTO
  const confirmCapturedPhoto = (keepCameraOpen: boolean = false) => {
    if (!capturedPhoto) return;

    const newPhotoNum = cameraPhotoCount + 1;
    setCameraPhotoCount(newPhotoNum);

    const newPhotoAttachment: AttachedFilePreview = {
      id: `CAM-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `Live_Proof_Photo_${newPhotoNum}_${new Date().toLocaleTimeString().replace(/:/g, "-")}.jpg`,
      size: "~400 KB",
      type: "IMAGE",
      previewUrl: capturedPhoto,
    };

    setAttachedFiles((prev) => [...prev, newPhotoAttachment]);
    setCapturedPhoto(null);

    if (!keepCameraOpen) {
      stopLiveCamera();
    } else {
      if (videoRef.current && cameraStream) {
        videoRef.current.play().catch((e) => console.log(e));
      }
    }
  };

  // HANDLE FILE SELECTION (Gallery / Docs / Photos / PDFs)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const newAttachments: AttachedFilePreview[] = filesArray.map((file, idx) => {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type.includes("pdf");
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      return {
        id: `FILE-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        size: sizeStr,
        type: isImage ? "IMAGE" : isPdf ? "PDF" : "DOCUMENT",
        previewUrl: isImage ? URL.createObjectURL(file) : "#",
        fileObj: file,
      };
    });

    setAttachedFiles((prev) => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  // REMOVE ATTACHMENT
  const handleRemoveAttachment = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // HANDLE LOG CLAIM SUBMISSION
  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTitle.trim()) {
      alert("Please enter a valid activity title.");
      return;
    }

    const evidenceList: EvidenceItem[] = attachedFiles.map((f) => ({
      id: f.id,
      title: f.name,
      type: f.type === "IMAGE" ? "PHOTO" : f.type === "PDF" ? "CERTIFICATE" : "DOCUMENT",
      url: f.previewUrl,
      uploadedAt: new Date().toISOString(),
    }));

    const result = ExtraWorkWalletService.claimExtraWork({
      facultyId,
      title: claimTitle,
      category: claimCategory,
      role: claimRole,
      description: claimDescription,
      startDate: claimStartDate,
      endDate: claimEndDate || undefined,
      durationHours: Number(claimDurationHours) || 8,
      evidenceItems: evidenceList,
      targetVerificationAuthority: targetAuthority,
    });

    if (result.success) {
      alert(`Success: ${result.message}`);
      setIsClaimModalOpen(false);
      // Reset Form
      setClaimTitle("");
      setClaimDescription("");
      setAttachedFiles([]);
      setCameraPhotoCount(0);
      // Dynamically update UI
      refreshWalletData();
      setActiveTab("LEDGER");
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  // HANDLE APPLY FOR OPPORTUNITY
  const handleApplyOpportunity = (oppId: string, oppTitle: string) => {
    const res = ExtraWorkWalletService.applyForOpportunity(oppId, facultyId);
    alert(res.message);
    if (res.success) {
      refreshWalletData();
    }
  };

  // HANDLE GENERATE & SHOW APPRAISAL REPORT
  const handleOpenReportModal = () => {
    const r = ExtraWorkWalletService.generateAnnualContributionReport(facultyId);
    setReportData(r);
    setIsReportModalOpen(true);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Wallet className="size-4 text-primary" />
            <span>Faculty Personal Wallet</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            My Extra Work Wallet
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Recognizing & rewarding verified extra contributions beyond regular duties • 100% Points Based
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleOpenReportModal}
            variant="outline"
            className="text-xs font-semibold rounded-xl gap-2 border-border shadow-2xs"
          >
            <Download className="size-4" />
            <span>Download Appraisal Report</span>
          </Button>

          <Button
            onClick={() => setIsClaimModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 py-2 gap-2 rounded-xl shadow-2xs"
          >
            <PlusCircle className="size-4" />
            <span>Log Extra Work Claim</span>
          </Button>
        </div>
      </div>

      {/* TOP METRIC CARDS - CLEAN UI PALETTE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">My Verified WWP</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-foreground">
                {summary.totalWWP} <span className="text-xs font-normal text-muted-foreground">WWP</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">Academic Year Total</p>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Award className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">This Month Earned</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-emerald-600 dark:text-emerald-400">
                +{summary.thisMonthWWP} <span className="text-xs font-normal text-muted-foreground">WWP</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">Last credit: {summary.lastCreditedDate}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <TrendingUp className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Pending Claims</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-amber-600 dark:text-amber-400">
                {summary.pendingItemsCount} <span className="text-xs font-normal text-muted-foreground">Items</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">Est: +{summary.pendingWWPEstimate} WWP</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
              <Clock className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Available Roles</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-foreground">
                {opportunities.length} <span className="text-xs font-normal text-muted-foreground">Open</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">Applications: {summary.totalAppliedOpportunities}</p>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Briefcase className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        <Button
          onClick={() => setActiveTab("OVERVIEW")}
          variant={activeTab === "OVERVIEW" ? "default" : "ghost"}
          className={`text-xs font-semibold rounded-xl shrink-0 ${activeTab === "OVERVIEW" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Overview & Breakdown
        </Button>
        <Button
          onClick={() => setActiveTab("LEDGER")}
          variant={activeTab === "LEDGER" ? "default" : "ghost"}
          className={`text-xs font-semibold rounded-xl shrink-0 ${activeTab === "LEDGER" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          My Extra Work Ledger ({items.length})
        </Button>
        <Button
          onClick={() => setActiveTab("OPPORTUNITIES")}
          variant={activeTab === "OPPORTUNITIES" ? "default" : "ghost"}
          className={`text-xs font-semibold rounded-xl shrink-0 ${activeTab === "OPPORTUNITIES" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Volunteer Opportunities ({opportunities.length})
        </Button>
        <Button
          onClick={() => setActiveTab("BENEFITS")}
          variant={activeTab === "BENEFITS" ? "default" : "ghost"}
          className={`text-xs font-semibold rounded-xl shrink-0 ${activeTab === "BENEFITS" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Unlocked Benefits ({benefits.filter((b) => b.unlocked).length})
        </Button>
      </div>

      {/* OVERVIEW TAB CONTENT */}
      {activeTab === "OVERVIEW" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border border-border bg-card rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-foreground">My Category Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(summary.categoryBreakdown).map(([category, points]) => (
                <div key={category} className="p-3 bg-muted/50 rounded-xl border border-border">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{category.replace(/_/g, " ")}</p>
                  <p className="text-xl font-bold font-mono text-foreground mt-1">+{points} WWP</p>
                </div>
              ))}
            </div>
          </Card>

          {/* TIER LEVEL CARD WITH ANIMATED BADGE SYMBOL */}
          <Card className="border border-border bg-card rounded-2xl p-5 shadow-2xs space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-bold text-xs rounded-full px-3 py-0.5">
                    {summary.levelInfo.currentLevel} CONTRIBUTOR
                  </Badge>
                </div>
                <h3 className="text-xl font-extrabold text-foreground">{summary.levelInfo.levelName}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Next Tier: <strong>{summary.levelInfo.nextLevelName}</strong> ({summary.levelInfo.pointsToNextLevel > 0 ? `${summary.levelInfo.pointsToNextLevel} WWP needed` : "Top Level Achieved!"})
                </p>
              </div>

              {/* ANIMATED BADGE SYMBOL (AUTOMATICALLY CHANGES COLOR: BRONZE, SILVER, GOLD, PLATINUM, DIAMOND) */}
              <FacultyTierBadge
                level={summary.levelInfo.currentLevel}
                totalWWP={summary.totalWWP}
                size="md"
              />
            </div>

            <div className="space-y-1">
              <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary.levelInfo.progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground font-semibold">
                <span>Tier Progress</span>
                <span className="text-primary font-mono">{summary.levelInfo.progressPercentage}%</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* LEDGER TAB CONTENT */}
      {activeTab === "LEDGER" && (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="border border-border bg-card rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    {item.category.replace(/_/g, " ")}
                  </Badge>
                  <Badge className={`text-[10px] font-bold ${item.status === "VERIFIED" ? "bg-emerald-600 text-white" : item.status === "REJECTED" ? "bg-destructive text-destructive-foreground" : "bg-amber-500 text-white"}`}>
                    {item.status}
                  </Badge>
                  <Badge variant="outline" className="border-border text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                    <Send className="size-3 text-primary" />
                    <span>Target: {item.targetVerificationAuthority ? item.targetVerificationAuthority.replace(/_/g, " ") : "HOD"}</span>
                  </Badge>
                </div>
                <h4 className="text-base font-bold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground">
                  Role: <strong className="text-foreground">{item.role || "Contributor"}</strong> • Submitted: {new Date(item.submittedAt || item.createdAt).toLocaleDateString()}
                  {item.reviewerNotes && <span className="block text-muted-foreground text-[11px] mt-0.5">Note: {item.reviewerNotes}</span>}
                </p>

                {/* PROOF ATTACHMENTS LIST */}
                {item.evidenceList && item.evidenceList.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[10px] text-muted-foreground font-semibold">Proof Documents ({item.evidenceList.length}):</span>
                    {item.evidenceList.map((ev, idx) => (
                      <Badge key={idx} variant="outline" className="text-[9px] gap-1 border-border">
                        <Paperclip className="size-3 text-primary" />
                        <span>{ev.title}</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="text-xl font-extrabold font-mono text-foreground">+{item.calculation.totalWWP} WWP</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* OPPORTUNITIES TAB CONTENT */}
      {activeTab === "OPPORTUNITIES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((opp) => {
            const hasApplied = opp.appliedFacultyIds?.includes(facultyId);
            return (
              <Card key={opp.id} className="border border-border bg-card rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    {opp.category.replace(/_/g, " ")}
                  </Badge>
                  <span className="text-xs font-extrabold font-mono text-emerald-600 dark:text-emerald-400">+{opp.rewardWWP} WWP Reward</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground">{opp.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{opp.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Deadline: {opp.deadlineDate}</span>
                  <Button
                    disabled={hasApplied}
                    onClick={() => handleApplyOpportunity(opp.id, opp.title)}
                    size="sm"
                    className={`text-xs font-semibold rounded-xl ${hasApplied ? "bg-muted text-muted-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
                  >
                    {hasApplied ? "Already Applied" : "Apply Now"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* BENEFITS TAB CONTENT */}
      {activeTab === "BENEFITS" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {benefits.map((benefit) => (
            <Card key={benefit.id} className={`border rounded-2xl p-4 shadow-2xs space-y-3 ${benefit.unlocked ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-card opacity-80"}`}>
              <div className="flex items-center justify-between">
                <Badge className={benefit.unlocked ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}>
                  {benefit.unlocked ? "UNLOCKED PERK" : `Requires ${benefit.requiredWWP} WWP`}
                </Badge>
              </div>
              <h4 className="text-base font-bold text-foreground">{benefit.title}</h4>
              <p className="text-xs text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>
      )}

      {/* LOG EXTRA WORK CLAIM MODAL WITH TARGET VERIFIER ROUTING & MULTI-MEDIA UPLOADER */}
      <Dialog open={isClaimModalOpen} onOpenChange={setIsClaimModalOpen}>
        <DialogContent className="max-w-lg bg-card text-card-foreground rounded-2xl border border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Log Extra Work Claim</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit verified proof of extra contributions performed beyond regular teaching duties.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleClaimSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-foreground">Activity Title *</label>
              <Input
                placeholder="E.g., Convenor for International Tech Symposium 2026"
                value={claimTitle}
                onChange={(e) => setClaimTitle(e.target.value)}
                className="h-9 text-xs mt-1 border-border"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground">Category *</label>
                <Select value={claimCategory} onValueChange={(val) => handleCategoryChange(val as ExtraWorkCategory)}>
                  <SelectTrigger className="h-9 text-xs mt-1 border-border">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EVENTS">Events & Programs</SelectItem>
                    <SelectItem value="STUDENT_DEVELOPMENT">Student Development</SelectItem>
                    <SelectItem value="RESEARCH_INNOVATION">Research & Innovation</SelectItem>
                    <SelectItem value="INSTITUTIONAL">Institutional Work</SelectItem>
                    <SelectItem value="INDUSTRY_ENGAGEMENT">Industry Engagement</SelectItem>
                    <SelectItem value="SOCIAL_COMMUNITY">Social & Community</SelectItem>
                    <SelectItem value="HIGH_IMPACT_ACHIEVEMENT">High Impact Achievement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Role Executed *</label>
                <Input
                  placeholder="E.g., Chief Organizer, Mentor"
                  value={claimRole}
                  onChange={(e) => setClaimRole(e.target.value)}
                  className="h-9 text-xs mt-1 border-border"
                  required
                />
              </div>
            </div>

            {/* TARGET VERIFIER AUTHORITY SELECTOR (HOD, DEAN, PRINCIPAL ETC.) */}
            <div className="p-3 bg-muted/60 rounded-xl border border-border space-y-1">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-foreground">
                  <Send className="size-3.5 text-primary" />
                  <span>Send Request To (Target Verifier) *</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Select Approver</span>
              </label>
              <Select value={targetAuthority} onValueChange={(val) => setTargetAuthority(val as VerificationAuthority)}>
                <SelectTrigger className="h-9 text-xs mt-1 border-border bg-card">
                  <SelectValue placeholder="Select Verifier Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOD">🏢 Head of Department (HOD)</SelectItem>
                  <SelectItem value="RESEARCH_DEAN">🔬 Dean of Research & Innovation</SelectItem>
                  <SelectItem value="IQAC_DEAN">📋 IQAC / Academic Quality Dean</SelectItem>
                  <SelectItem value="STUDENT_DEAN">🎓 Dean of Student Affairs</SelectItem>
                  <SelectItem value="PLACEMENT_HEAD">💼 Head of Placement & Corporate</SelectItem>
                  <SelectItem value="PRINCIPAL">👑 Principal / Institutional Director</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground pt-0.5">
                ℹ️ This request will be directly routed to the selected authority's verification queue.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground">Start Date *</label>
                <Input
                  type="date"
                  value={claimStartDate}
                  onChange={(e) => setClaimStartDate(e.target.value)}
                  className="h-9 text-xs mt-1 border-border"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground">End Date</label>
                <Input
                  type="date"
                  value={claimEndDate}
                  onChange={(e) => setClaimEndDate(e.target.value)}
                  className="h-9 text-xs mt-1 border-border"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground">Hours Spent</label>
                <Input
                  type="number"
                  value={claimDurationHours}
                  onChange={(e) => setClaimDurationHours(e.target.value)}
                  className="h-9 text-xs mt-1 border-border"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Description</label>
              <Textarea
                placeholder="Provide details about your contribution..."
                value={claimDescription}
                onChange={(e) => setClaimDescription(e.target.value)}
                className="text-xs mt-1 min-h-16 border-border"
              />
            </div>

            {/* INTERACTIVE MULTI-PHOTO & DOCUMENT PROOF UPLOADER */}
            <div className="space-y-3 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Proof Documents & Photos (JPG, PNG, WEBP, PDF)
                </label>
                <Badge variant="outline" className="text-[10px] font-semibold border-border">
                  {attachedFiles.length} Attached
                </Badge>
              </div>

              {/* HIDDEN INPUT FOR GALLERY / FILES */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,application/pdf,.doc,.docx"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              {/* ACTION BUTTONS: GALLERY UPLOAD & REAL LIVE CAMERA VIEWFINDER */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 text-xs font-semibold rounded-xl border-dashed border-border gap-2"
                >
                  <Upload className="size-4" />
                  <span>Choose Photo / PDF</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={startLiveCamera}
                  className="h-10 text-xs font-semibold rounded-xl border-dashed border-border gap-2 text-emerald-600 dark:text-emerald-400"
                >
                  <Camera className="size-4" />
                  <span>Take Live Photo</span>
                </Button>
              </div>

              {/* ATTACHED FILES PREVIEW LIST */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-bold text-muted-foreground">Attached Proof Files:</p>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {attachedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {file.type === "IMAGE" && file.previewUrl !== "#" ? (
                            <img src={file.previewUrl} alt="preview" className="size-8 rounded-lg object-cover border border-border" />
                          ) : file.type === "PDF" ? (
                            <FileText className="size-6 text-red-500 shrink-0" />
                          ) : (
                            <Paperclip className="size-6 text-blue-500 shrink-0" />
                          )}
                          <div className="truncate">
                            <p className="font-semibold text-foreground truncate">{file.name}</p>
                            <p className="text-[10px] text-muted-foreground">{file.size} • {file.type}</p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAttachment(file.id)}
                          className="size-7 text-muted-foreground hover:text-destructive rounded-lg"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* CONTINUOUS ADD ANOTHER PHOTO / DOCUMENT ACTION BAR */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-primary font-bold gap-1 p-0 hover:bg-transparent"
                    >
                      <Plus className="size-3.5" />
                      <span>Add More Photos / PDFs</span>
                    </Button>
                    <span className="text-muted-foreground">•</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={startLiveCamera}
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-bold gap-1 p-0 hover:bg-transparent"
                    >
                      <Camera className="size-3.5" />
                      <span>Take Another Live Photo</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsClaimModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl gap-2">
                <Send className="size-3.5" />
                <span>Submit to {targetAuthority.replace(/_/g, " ")}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* REAL LIVE CAMERA VIEWFINDER MODAL WITH CONTINUOUS MULTI-PHOTO SUPPORT */}
      <Dialog open={isCameraModalOpen} onOpenChange={(open) => !open && stopLiveCamera()}>
        <DialogContent className="max-w-md bg-slate-950 text-white rounded-2xl border-slate-800">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Camera className="size-5 text-emerald-400" />
                <span>Live Camera Snap</span>
              </DialogTitle>
              {attachedFiles.length > 0 && (
                <Badge className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold">
                  {attachedFiles.length} Photo(s) Attached
                </Badge>
              )}
            </div>
            <DialogDescription className="text-xs text-slate-400">
              Align certificate or proof photo in the viewfinder and click Snap Photo.
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-4/3 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
            {/* Live Video element ALWAYS stays mounted so camera stream never gets unmounted/disconnected */}
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {/* Captured Snapshot Overlay when user snaps a photo */}
            {capturedPhoto && (
              <img src={capturedPhoto} alt="Captured preview" className="absolute inset-0 w-full h-full object-contain bg-black z-10" />
            )}

            {/* Camera Error Display */}
            {cameraError && (
              <div className="absolute inset-0 z-20 bg-slate-950/90 p-4 text-center text-xs text-red-400 flex flex-col items-center justify-center space-y-2">
                <p>{cameraError}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs bg-slate-800 text-white border-slate-700"
                >
                  Choose File from Gallery Instead
                </Button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            {capturedPhoto ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRetakePhoto}
                  className="text-xs text-slate-300 gap-1 w-full sm:w-auto"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Retake</span>
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => confirmCapturedPhoto(true)}
                    className="text-xs bg-slate-800 text-emerald-400 border-emerald-500/40 hover:bg-slate-700 font-semibold gap-1 flex-1 sm:flex-initial"
                  >
                    <Plus className="size-3.5" />
                    <span>Attach & Take Another</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => confirmCapturedPhoto(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl gap-1 flex-1 sm:flex-initial"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Done</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button type="button" variant="ghost" onClick={stopLiveCamera} className="text-xs text-slate-400">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={snapLivePhoto}
                  disabled={!!cameraError}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold rounded-xl gap-2 px-5 py-2"
                >
                  <Camera className="size-4" />
                  <span>Snap Photo</span>
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PRINTABLE APPRAISAL REPORT MODAL */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-2xl bg-card text-card-foreground rounded-2xl border border-border">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                <span>Annual Faculty Extra Contribution & WWP Report</span>
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Official institutional audit record for annual appraisal and accreditation evidence.
            </DialogDescription>
          </DialogHeader>

          {reportData && (
            <div className="space-y-4 text-xs p-4 bg-muted/40 rounded-xl border border-border">
              <div className="flex justify-between border-b pb-2 border-border">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{reportData.facultyName}</h4>
                  <p className="text-muted-foreground">{reportData.department} • Code: {reportData.employeeCode}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{reportData.level}</Badge>
                  <p className="text-[11px] text-muted-foreground mt-1">Date: {reportData.generatedAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-card p-3 rounded-xl border border-border">
                <div>
                  <span className="text-muted-foreground">Total Verified WWP:</span>
                  <p className="text-xl font-extrabold font-mono text-primary">{reportData.totalVerifiedWWP} WWP</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Verified Activities:</span>
                  <p className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{reportData.totalVerifiedItems} Items</p>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-foreground mb-2">Itemized Verified Contributions</h5>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {reportData.items?.map((item: any) => (
                    <div key={item.id} className="p-2 bg-card rounded-lg border border-border flex justify-between items-center">
                      <div>
                        <p className="font-bold text-foreground">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground">{item.role} • {item.formula}</p>
                      </div>
                      <span className="font-mono font-bold text-primary">+{item.points} WWP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => window.print()} className="text-xs gap-2 border-border">
              <Printer className="size-4" />
              <span>Print / Save PDF</span>
            </Button>
            <Button onClick={() => setIsReportModalOpen(false)} className="bg-primary text-primary-foreground text-xs">
              Close Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
