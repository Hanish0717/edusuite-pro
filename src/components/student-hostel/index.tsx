import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  BedDouble,
  Building,
  Key,
  ShieldCheck,
  Utensils,
  CreditCard,
  QrCode,
  AlertTriangle,
  Wrench,
  Users,
  Bell,
  Download,
  Shield,
  Copy,
  Phone,
  Loader2,
  Calendar,
  Clock,
  PhoneCall,
  Plus,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
  Wifi,
  Sparkles,
  Zap,
  Droplets,
  Shirt,
  HeartPulse,
  Send,
  Printer,
  ChevronRight,
  UserCheck,
  Star,
  MapPin,
  Share2,
  X,
  HelpCircle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import {
  mockRoomDetails,
  mockHostelInfo,
  mockWeeklyMessMenu,
  mockGatePasses,
  mockComplaints,
  mockMaintenanceRequests,
  mockFeeReceipts,
  mockVisitors,
  mockHostelNotices
} from "./mock-data";
import hostelRules from "./hostel-rules.json";
import {
  GatePassRecord,
  ComplaintRecord,
  MaintenanceRequest,
  FeeReceipt,
  VisitorRecord,
} from "./types";

export const StudentHostelModule: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  // Navigation / Filter state
  const [activeMessTab, setActiveMessTab] = useState<"today" | "tomorrow" | "weekly" | "special">("today");
  const [activeGatePassTab, setActiveGatePassTab] = useState<"form" | "active" | "history">("active");
  const [selectedComplaintCategory, setSelectedComplaintCategory] = useState<string>("Electricity");

  // Dynamic API State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load initial states from local storage or defaults
  const [roomDetails, setRoomDetails] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_ROOM") : null;
    return saved ? JSON.parse(saved) : mockRoomDetails;
  });

  const [hostelInfo, setHostelInfo] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_INFO") : null;
    return saved ? JSON.parse(saved) : mockHostelInfo;
  });

  const [messPlan, setMessPlan] = useState(() => {
    return (typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_MESS_PLAN") : null) || "Veg Plan";
  });

  const [pendingFee, setPendingFee] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_PENDING_FEE") : null;
    return saved ? Number(saved) : 22500;
  });

  const [gatePasses, setGatePasses] = useState<any[]>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_GATE_PASSES") : null;
    if (saved) return JSON.parse(saved);
    return mockGatePasses.map((gp, idx) => ({
      ...gp,
      gatePassId: gp.refId || `GP-2026-00000${idx + 1}`,
      studentName: "K. Sai Teja",
      studentId: "22CS101",
      hostel: "Boys Hostel Block A",
      room: "Room A-305",
      generatedTime: gp.outDate ? `${gp.outDate} 10:00 AM` : "2026-08-04 10:15 AM",
      approvedBy: gp.status === "Approved" ? "Warden Dr. S. Ramesh" : "N/A"
    }));
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_COMPLAINTS") : null;
    return saved ? JSON.parse(saved) : mockComplaints;
  });

  const [leaves, setLeaves] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("EDUSUITE_FRONTEND_LEAVES");
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: "LV-2026-0001",
        leaveType: "Festival Leave",
        purpose: "Going home for Diwali",
        destination: "Vijayawada, Andhra Pradesh",
        startDate: "2026-08-15",
        endDate: "2026-08-20",
        emergencyContact: "+91 98490 12345",
        remarks: "Will travel by train",
        status: "Approved",
        appliedDate: "2026-08-01",
      },
      {
        id: "LV-2026-0002",
        leaveType: "Weekend Outing",
        purpose: "Visiting local relative",
        destination: "Gachibowli, Hyderabad",
        startDate: "2026-08-08",
        endDate: "2026-08-09",
        emergencyContact: "+91 98490 12345",
        remarks: "Local metro travel",
        status: "Approved",
        appliedDate: "2026-08-03",
      }
    ];
  });

  const [activeLeaveModalTab, setActiveLeaveModalTab] = useState<"apply" | "history">("apply");

  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_LEAVES", JSON.stringify(leaves));
  }, [leaves]);

  const [maintenanceReqs, setMaintenanceReqs] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_MAINTENANCE") : null;
    return saved ? JSON.parse(saved) : mockMaintenanceRequests;
  });

  const [feeReceipts, setFeeReceipts] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_FEE_RECEIPTS") : null;
    return saved ? JSON.parse(saved) : mockFeeReceipts;
  });

  const [visitors, setVisitors] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_VISITORS") : null;
    return saved ? JSON.parse(saved) : mockVisitors;
  });

  const [notices, setNotices] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_NOTICES") : null;
    return saved ? JSON.parse(saved) : mockHostelNotices;
  });

  // Modal states
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isGatePassModalOpen, setIsGatePassModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isMessFeedbackModalOpen, setIsMessFeedbackModalOpen] = useState(false);
  const [isRoomDetailsModalOpen, setIsRoomDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isWardenContactModalOpen, setIsWardenContactModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [rulesSearchQuery, setRulesSearchQuery] = useState("");
  const [rulesLoading, setRulesLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    room: true,
    mess: true,
    visitor: true,
    gatepass: true,
    leave: true,
    safety: true,
    prohibited: true,
    disciplinary: true,
    emergency: true,
  });

  useEffect(() => {
    if (isRulesModalOpen) {
      setRulesLoading(true);
      const timer = setTimeout(() => setRulesLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isRulesModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsRulesModalOpen(false);
        setIsIdCardModalOpen(false);
      }
    };
    if (isRulesModalOpen || isIdCardModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRulesModalOpen, isIdCardModalOpen]);

  const filteredRules = useMemo(() => {
    if (!rulesSearchQuery.trim()) return hostelRules;
    const query = rulesSearchQuery.toLowerCase();
    return hostelRules.map(section => {
      const matchingItems = section.items.filter(item => 
        item.toLowerCase().includes(query)
      );
      if (section.title.toLowerCase().includes(query) || matchingItems.length > 0) {
        return {
          ...section,
          items: section.title.toLowerCase().includes(query) ? section.items : matchingItems
        };
      }
      return null;
    }).filter((section): section is typeof hostelRules[0] => section !== null);
  }, [rulesSearchQuery, isRulesModalOpen]);

  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case "Users": return <Users className="h-4 w-4 text-primary" />;
      case "BedDouble": return <BedDouble className="h-4 w-4 text-primary" />;
      case "Utensils": return <Utensils className="h-4 w-4 text-primary" />;
      case "UserCheck": return <UserCheck className="h-4 w-4 text-primary" />;
      case "QrCode": return <QrCode className="h-4 w-4 text-primary" />;
      case "Calendar": return <Calendar className="h-4 w-4 text-primary" />;
      case "ShieldCheck": return <ShieldCheck className="h-4 w-4 text-primary" />;
      case "AlertTriangle": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "XCircle": return <XCircle className="h-4 w-4 text-red-500" />;
      case "HeartPulse": return <HeartPulse className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    console.log("Download button clicked");
    
    const elementToCapture = cardRef.current || document.getElementById("hostel-id-card-preview-container");
    if (elementToCapture) {
      console.log("Card reference found");
    } else {
      console.warn("Card reference not found, falling back to ID lookup");
    }

    setDownloadingPdf(true);
    const toastId = toast.loading("Initializing PDF engine and loading libraries...");

    try {
      // Dynamic imports to handle SSR and package bundler variance safely
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default || html2canvasModule;

      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

      if (!elementToCapture) {
        throw new Error("ID card preview element could not be found in the DOM.");
      }

      console.log("html2canvas started");
      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: true,
      });
      console.log("html2canvas completed");

      console.log("PDF created");
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [54, 85.6], // Standard CR80 ID Card dimensions (54mm width, 85.6mm height)
      });

      pdf.addImage(imgData, "PNG", 0, 0, 54, 85.6, undefined, "FAST");
      
      console.log("Calling pdf.save()");
      const studentId = "22CS101";
      pdf.save(`Hostel_ID_${studentId}.pdf`);
      
      console.log("Download complete");
      toast.success("Hostel ID Card downloaded successfully!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || String(error), { id: toastId });
    } finally {
      setDownloadingPdf(false);
      console.log("Finished");
    }
  };

  const [downloadingRulesPdf, setDownloadingRulesPdf] = useState(false);

  const handleDownloadRulesPdf = async () => {
    setDownloadingRulesPdf(true);
    const toastId = toast.loading("Loading PDF writer...");

    try {
      console.log("[HostelRules] Loading jsPDF...");
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

      console.log("[HostelRules] jsPDF loaded. Building Rules Handbook document...");
      toast.loading("Generating handbook contents...", { id: toastId });

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageHeight = doc.internal.pageSize.height; // 297mm
      const pageWidth = doc.internal.pageSize.width;   // 210mm
      const margin = 20; // 20mm margins
      const contentWidth = pageWidth - (margin * 2); // 170mm
      let yOffset = 25; // starting y position

      const checkPageBreak = (neededHeight: number) => {
        if (yOffset + neededHeight > pageHeight - margin - 15) {
          doc.addPage();
          yOffset = 25;
          drawPageDecorator();
        }
      };

      const drawPageDecorator = () => {
        // Draw header line
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.5);
        doc.line(margin, 15, pageWidth - margin, 15);
        
        // Header text
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text("EDUSUITE UNIVERSITY — HOSTEL RULES HANDBOOK", margin, 12);
        
        // Draw footer line
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        
        // Footer text with page number
        const pageCount = doc.internal.getNumberOfPages();
        doc.text(`Page ${pageCount}`, pageWidth - margin, pageHeight - 11, { align: "right" });
        doc.text("CONFIDENTIAL — FOR HOSTEL RESIDENTS ONLY", margin, pageHeight - 11);
      };

      // Draw first page header
      drawPageDecorator();

      // Title Section
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235); // primary #2563EB
      doc.text("Hostel Rules & Regulations", margin, yOffset);
      yOffset += 10;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(`Generated Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin, yOffset);
      yOffset += 15;

      // Map rules dynamic sections
      hostelRules.forEach((section) => {
        // Section Title
        checkPageBreak(15);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(section.title, margin, yOffset);
        yOffset += 6;

        // Draw section underline
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(0.3);
        doc.line(margin, yOffset - 1, margin + 20, yOffset - 1);
        yOffset += 4;

        // Items list
        section.items.forEach((item, index) => {
          const ruleText = `${index + 1}. ${item}`;
          const splitText = doc.splitTextToSize(ruleText, contentWidth - 8);
          const blockHeight = splitText.length * 5 + 3; // roughly 5mm per line

          checkPageBreak(blockHeight);
          
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(51, 65, 85); // slate-700
          
          // Render item bullet / text
          doc.text(splitText, margin + 4, yOffset);
          yOffset += blockHeight;
        });

        yOffset += 6; // Spacing after section
      });

      // Save the generated document
      doc.save("Hostel_Rules_Handbook.pdf");
      console.log("[HostelRules] Handbook downloaded successfully.");
      toast.success("Hostel Rules Handbook downloaded successfully!", { id: toastId });
    } catch (error: any) {
      console.error("[HostelRules] Rules PDF generation failed:", error);
      toast.error(`Rules PDF generation failed: ${error?.message || error}`, { id: toastId });
    } finally {
      setDownloadingRulesPdf(false);
    }
  };

  const [downloadingReceipts, setDownloadingReceipts] = useState<Record<string, boolean>>({});

  const getQrCodeDataUrl = (data: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Cannot generate QR code URL on server"));
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          } else {
            reject(new Error("Failed to get canvas context"));
          }
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error("Failed to load QR code image from API"));
    });
  };

  const handleDownloadReceipt = async (rcp: any) => {
    setDownloadingReceipts((prev) => ({ ...prev, [rcp.receiptNo]: true }));
    const toastId = toast.loading(`Generating PDF receipt for ${rcp.receiptNo}...`);

    try {
      console.log(`[Receipt] Loading libraries for ${rcp.receiptNo}...`);
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

      console.log(`[Receipt] Library loaded. Building A4 Receipt...`);
      toast.loading(`Structuring PDF receipt data...`, { id: toastId });

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.width; // 210
      const pageHeight = doc.internal.pageSize.height; // 297
      const margin = 20;

      // Draw main border
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.5);
      doc.rect(margin - 5, margin - 5, pageWidth - (margin - 5) * 2, pageHeight - (margin - 5) * 2);

      // Decorative Header Banner
      doc.setFillColor(37, 99, 235); // Blue primary #2563EB
      doc.rect(margin, margin, pageWidth - margin * 2, 8, "F");

      let y = margin + 18;

      // College Name
      doc.setTextColor(30, 41, 59); // slate-800
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.text("EDUSUITE UNIVERSITY", margin, y);

      // Right aligned Doc Title
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235); // primary #2563EB
      doc.text("PAYMENT RECEIPT", pageWidth - margin, y, { align: "right" });
      y += 6;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text("Hostel Management System", margin, y);
      y += 12;

      // Split into Left and Right Info sections
      // Left: Receipt & Date Info
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); // slate-600

      doc.setFont("Helvetica", "bold");
      doc.text("Receipt Details", margin, y);
      doc.setFont("Helvetica", "normal");
      y += 6;

      doc.text(`Receipt No: `, margin, y);
      doc.setFont("Helvetica", "bold");
      doc.text(rcp.receiptNo, margin + 25, y);
      doc.setFont("Helvetica", "normal");
      y += 5;

      doc.text(`Payment Date: ${rcp.date}`, margin, y);
      y += 5;
      doc.text(`Status: `, margin, y);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(16, 185, 129); // emerald-500
      doc.text(rcp.status || "Paid", margin + 25, y);
      doc.setTextColor(71, 85, 105);
      doc.setFont("Helvetica", "normal");

      // Right: Student Info
      let rightY = y - 16;
      doc.setFont("Helvetica", "bold");
      doc.text("Student Info", pageWidth - margin - 80, rightY);
      doc.setFont("Helvetica", "normal");
      rightY += 6;

      doc.text(`Name: K. Sai Teja`, pageWidth - margin - 80, rightY);
      rightY += 5;
      doc.text(`Student ID: 22CS101`, pageWidth - margin - 80, rightY);
      rightY += 5;
      doc.text(`Dept: Computer Science & Engg`, pageWidth - margin - 80, rightY);
      rightY += 5;
      doc.text(`Room: Boys Hostel A, Rm A-305`, pageWidth - margin - 80, rightY);

      y = Math.max(y, rightY) + 12;

      // Horizontal Divider
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Transaction Details Table Header
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85); // slate-700
      doc.text("Fee Description", margin + 5, y + 5.5);
      doc.text("Category", margin + 70, y + 5.5);
      doc.text("Transaction ID", margin + 110, y + 5.5);
      doc.text("Amount Paid", pageWidth - margin - 5, y + 5.5, { align: "right" });
      y += 8;

      // Table Row
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); // slate-600

      const txnId = `TXN-HST-${rcp.receiptNo.split('-').pop()}-8923`;
      doc.text(rcp.term, margin + 5, y + 6);
      doc.text("Hostel & Mess Fee", margin + 70, y + 6);
      doc.text(txnId, margin + 110, y + 6);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(rcp.amount, pageWidth - margin - 5, y + 6, { align: "right" });
      y += 12;

      // Horizontal line
      doc.setDrawColor(241, 245, 249); // slate-100
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // Amount box
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(pageWidth - margin - 75, y, 75, 12, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235); // Blue primary
      doc.text("Total Paid:", pageWidth - margin - 70, y + 7.5);
      doc.text(rcp.amount, pageWidth - margin - 5, y + 7.5, { align: "right" });
      y += 25;

      // QR Code generation
      const qrData = `Receipt:${rcp.receiptNo}|Student:22CS101|Txn:${txnId}`;
      try {
        console.log("[Receipt] Fetching QR Code from online API...");
        const qrDataUrl = await getQrCodeDataUrl(qrData);
        doc.addImage(qrDataUrl, "PNG", margin, y, 30, 30);
      } catch (qrError) {
        console.warn("[Receipt] QR API failed, rendering custom verification stamp fallback:", qrError);
        // Fallback: draw circular verification seal
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(0.8);
        doc.circle(margin + 15, y + 15, 13);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(37, 99, 235);
        doc.text("EDUSUITE", margin + 6, y + 13);
        doc.text("VERIFIED", margin + 6, y + 17);
        doc.text("SECURE", margin + 8, y + 21);
      }

      // Seal and Signature area on the right
      const rightSideX = pageWidth - margin - 60;
      
      // College Seal Placeholder
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.5);
      doc.circle(rightSideX + 15, y + 15, 12);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("OFFICIAL SEAL", rightSideX + 6, y + 16);

      // Signature Area
      doc.line(rightSideX + 40, y + 23, pageWidth - margin, y + 23);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text("Authorized Warden", rightSideX + 40, y + 27);
      y += 40;

      // Terms and Footer
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("Terms & Conditions:", margin, y);
      y += 4;
      doc.text("1. This receipt is automatically generated and confirmed upon realization of banking transfer.", margin, y);
      y += 3.5;
      doc.text("2. Hostel allocation is governed by the Rules and Regulations of the University Hostel Board.", margin, y);
      y += 10;

      // Footer divider and details
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
      doc.text("EduSuite Pro ERP | Hostel Management Office", margin, y);
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - margin, y, { align: "right" });

      // Save PDF
      doc.save(`Receipt_${rcp.receiptNo}.pdf`);
      console.log(`[Receipt] Receipt ${rcp.receiptNo} saved.`);
      toast.success(`Receipt ${rcp.receiptNo} downloaded successfully!`, { id: toastId });
    } catch (error: any) {
      console.error("[Receipt] Receipt download failed:", error);
      toast.error(`Receipt download failed: ${error?.message || error}`, { id: toastId });
    } finally {
      setDownloadingReceipts((prev) => ({ ...prev, [rcp.receiptNo]: false }));
    }
  };

  const [sosHistory, setSosHistory] = useState<any[]>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("EDUSUITE_FRONTEND_SOS") : null;
    return saved ? JSON.parse(saved) : [];
  });

  const [isSosConfirmOpen, setIsSosConfirmOpen] = useState(false);
  const [isSosSuccessOpen, setIsSosSuccessOpen] = useState(false);
  const [activeSosRequest, setActiveSosRequest] = useState<any>(null);
  const [sosCooldown, setSosCooldown] = useState(0);
  const [sosLoading, setSosLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("EDUSUITE_FRONTEND_SOS", JSON.stringify(sosHistory));
    }
  }, [sosHistory]);

  useEffect(() => {
    if (sosCooldown <= 0) return;
    const timer = setInterval(() => {
      setSosCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [sosCooldown]);

  const confirmAndSendSOS = () => {
    setSosLoading(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      
      const newSosId = `SOS-2026-00000${sosHistory.length + 1}`;
      const newSos = {
        sosId: newSosId,
        date: dateStr,
        time: timeStr,
        status: "Emergency Alert Sent",
        studentName: "K. Sai Teja",
        studentId: "22CS101",
        block: "Boys Hostel - Block A",
        room: "A-305",
      };

      setSosHistory((prev) => [newSos, ...prev]);
      setActiveSosRequest(newSos);
      
      // Simulate Warden Notification Object
      console.warn("================ CRITICAL SOS ALERT TRIGGERED ================");
      console.warn(`SOS ID: ${newSosId}`);
      console.warn(`Student: K. Sai Teja (22CS101)`);
      console.warn(`Location: Boys Hostel - Block A, Room A-305`);
      console.warn(`Time: ${dateStr} ${timeStr}`);
      console.warn("Priority: CRITICAL");
      console.warn("Notification payload sent to Chief Warden desk & Emergency Security Dispatch.");
      console.warn("==============================================================");
      
      toast.error("Emergency Alert Sent!");
      toast.error("Hostel Warden Notified!");

      setSosCooldown(60);
      setSosLoading(false);
      setIsSosConfirmOpen(false);
      setIsSosSuccessOpen(true);

      // Simulate Warden Acknowledgment after 6 seconds
      setTimeout(() => {
        setSosHistory((prev) => 
          prev.map((item) => 
            item.sosId === newSosId ? { ...item, status: "Acknowledged" } : item
          )
        );
        toast.success(`Emergency SOS ${newSosId} Acknowledged by Warden!`);
      }, 6000);

    }, 2500); // 2.5 seconds loading
  };

  // Selected pass details modal
  const [selectedPass, setSelectedPass] = useState<any>(null);

  const [gatePassForm, setGatePassForm] = useState({
    purpose: "Weekend Home Visit",
    destination: "Home / Local",
    outDate: "2026-08-10",
    outTime: "05:00 PM",
    returnDate: "2026-08-12",
    returnTime: "08:00 PM",
    guardianContact: "+91 98490 12345",
    travelMode: "Bus",
    remarks: "",
  });

  const [complaintForm, setComplaintForm] = useState({
    category: "Electricity",
    priority: "Medium" as "Low" | "Medium" | "High" | "Urgent",
    description: "",
  });

  const [leaveForm, setLeaveForm] = useState({
    leaveType: "Festival Leave",
    purpose: "",
    destination: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    emergencyContact: "",
    remarks: "",
  });

  const [messFeedbackForm, setMessFeedbackForm] = useState({
    mealType: "Lunch",
    rating: 4,
    comments: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: "₹22,500",
    term: "Autumn Semester 2026 (Part 2)",
  });

  const [visitorForm, setVisitorForm] = useState({
    visitorName: "",
    relationship: "",
    date: new Date().toISOString().split("T")[0],
    inTime: "04:00 PM",
    outTime: "08:00 PM",
  });

  const [lastMessFeedbackTime, setLastMessFeedbackTime] = useState<Record<string, number>>({});

  // Synchronize state changes back to localStorage
  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_ROOM", JSON.stringify(roomDetails));
  }, [roomDetails]);

  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_INFO", JSON.stringify(hostelInfo));
  }, [hostelInfo]);

  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_MESS_PLAN", messPlan);
  }, [messPlan]);

  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_PENDING_FEE", pendingFee.toString());
  }, [pendingFee]);

  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_GATE_PASSES", JSON.stringify(gatePasses));
  }, [gatePasses]);

  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_COMPLAINTS", JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_MAINTENANCE", JSON.stringify(maintenanceReqs));
  }, [maintenanceReqs]);

  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_FEE_RECEIPTS", JSON.stringify(feeReceipts));
  }, [feeReceipts]);

  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_VISITORS", JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem("EDUSUITE_FRONTEND_NOTICES", JSON.stringify(notices));
  }, [notices]);

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleGenerateGatePass = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const newId = `GP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const newPass = {
        id: `gp-${Date.now()}`,
        gatePassId: newId,
        refId: newId,
        studentName: "K. Sai Teja",
        studentId: "22CS101",
        hostel: roomDetails.block,
        room: roomDetails.roomNumber,
        purpose: gatePassForm.purpose,
        destination: gatePassForm.destination,
        status: "Pending Approval",
        outDate: gatePassForm.outDate,
        outTime: gatePassForm.outTime,
        returnDate: gatePassForm.returnDate,
        returnTime: gatePassForm.returnTime,
        guardianApproval: `Pending Parent/Warden Approval (SMS sent to ${gatePassForm.guardianContact})`,
        generatedTime: new Date().toLocaleString(),
        approvedBy: "Pending",
        travelMode: gatePassForm.travelMode,
        remarks: gatePassForm.remarks,
        qrCodeUrl: "",
      };
      setGatePasses((prev) => [newPass, ...prev]);
      toast.success(`Gate Pass Request ${newId} Generated (Pending Approval)!`);
      setActiveGatePassTab("active");
      setIsGatePassModalOpen(false);
      setSubmitting(false);
    }, 600);
  };

  const handleCancelGatePass = (id: string) => {
    setGatePasses((prev) =>
      prev.map((gp) => {
        if (gp.id === id) {
          toast.success(`Gate Pass ${gp.gatePassId || gp.refId} has been Cancelled!`);
          return { ...gp, status: "Cancelled" };
        }
        return gp;
      })
    );
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.description.trim()) {
      toast.error("Please provide a description of the complaint.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const ticketNo = `HST-CMP-${Math.floor(100 + Math.random() * 900)}`;
      const newComplaint = {
        id: `cmp-${Date.now()}`,
        ticketNo,
        category: complaintForm.category,
        priority: complaintForm.priority,
        description: complaintForm.description,
        status: "Pending",
        assignedStaff: "Warden Office Queue",
        dateRaised: new Date().toISOString().split("T")[0],
      };
      setComplaints((prev: any) => [newComplaint, ...prev]);

      const newMaint = {
        id: `maint-${Date.now()}`,
        reqNo: `MAINT-${Math.floor(100 + Math.random() * 900)}`,
        item: `Fix: ${complaintForm.description.substring(0, 30)}`,
        category: complaintForm.category,
        status: "Pending",
        assignedStaff: "Pending Assignment",
        date: new Date().toISOString().split("T")[0],
      };
      setMaintenanceReqs((prev: any) => [newMaint, ...prev]);

      toast.success("Complaint logged & Maintenance ticket generated!");
      setComplaintForm({ category: "Electricity", priority: "Medium", description: "" });
      setIsComplaintModalOpen(false);
      setSubmitting(false);
    }, 600);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const newId = `LV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newLeave = {
        id: newId,
        leaveType: leaveForm.leaveType,
        purpose: leaveForm.purpose,
        destination: leaveForm.destination,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        emergencyContact: leaveForm.emergencyContact,
        remarks: leaveForm.remarks,
        status: "Pending",
        appliedDate: new Date().toISOString().split("T")[0],
      };
      setLeaves((prev) => [newLeave, ...prev]);
      toast.success(`Leave Application ${newId} submitted to Warden Office for approval!`);
      // Reset form
      setLeaveForm({
        leaveType: "Festival Leave",
        purpose: "",
        destination: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
        emergencyContact: "",
        remarks: "",
      });
      setIsLeaveModalOpen(false);
      setSubmitting(false);
    }, 600);
  };

  const handleMessFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `${messFeedbackForm.mealType}-${new Date().toDateString()}`;
    if (lastMessFeedbackTime[key]) {
      toast.error(`You have already submitted feedback for ${messFeedbackForm.mealType} today.`);
      setIsMessFeedbackModalOpen(false);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setLastMessFeedbackTime((prev) => ({ ...prev, [key]: Date.now() }));
      toast.success("Thank you! Your feedback has been submitted to the Mess Committee.");
      setIsMessFeedbackModalOpen(false);
      setSubmitting(false);
    }, 600);
  };

  const handlePayHostelFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const payAmount = pendingFee;
      setPendingFee(0);
      const receiptNo = `RCP-HST-2026-00${feeReceipts.length + 1}`;
      const newReceipt = {
        receiptNo,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        amount: `₹${payAmount.toLocaleString()}`,
        term: paymentForm.term,
        status: "Paid",
        downloadUrl: "#",
      };
      setFeeReceipts((prev: any) => [newReceipt, ...prev]);
      toast.success(`Payment of ₹${payAmount.toLocaleString()} processed successfully! Dues cleared.`);
      setIsPaymentModalOpen(false);
      setSubmitting(false);
    }, 800);
  };

  const handleAddVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorForm.visitorName.trim() || !visitorForm.relationship.trim()) {
      toast.error("Please fill in all visitor details.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newVisitor = {
        id: `vis-${Date.now()}`,
        visitorName: visitorForm.visitorName,
        relationship: visitorForm.relationship,
        date: visitorForm.date,
        inTime: visitorForm.inTime,
        outTime: visitorForm.outTime,
        approvedBy: "Auto Approved",
        verificationStatus: "Verified",
      };
      setVisitors((prev: any) => [newVisitor, ...prev]);
      toast.success("Visitor registered! Visitor Pass reference created.");
      setIsVisitorModalOpen(false);
      setVisitorForm({
        visitorName: "",
        relationship: "",
        date: new Date().toISOString().split("T")[0],
        inTime: "04:00 PM",
        outTime: "08:00 PM",
      });
      setSubmitting(false);
    }, 600);
  };

  const handleTriggerEmergencySOS = () => {
    if (sosCooldown > 0) {
      toast.error(`Please wait ${sosCooldown} seconds before triggering another emergency alert.`);
      return;
    }
    setIsSosConfirmOpen(true);
  };

  const handleDownloadHostelId = () => {
    setIsIdCardModalOpen(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Hostel data refreshed!");
    setRoomDetails(mockRoomDetails);
    setHostelInfo(mockHostelInfo);
    setMessPlan("Veg Plan");
    setPendingFee(22500);
    setGatePasses(mockGatePasses.map((gp, idx) => ({
      ...gp,
      gatePassId: gp.refId || `GP-2026-00000${idx + 1}`,
      studentName: "K. Sai Teja",
      studentId: "22CS101",
      hostel: "Boys Hostel Block A",
      room: "Room A-305",
      generatedTime: gp.outDate ? `${gp.outDate} 10:00 AM` : "2026-08-04 10:15 AM",
      approvedBy: gp.status === "Approved" ? "Warden Dr. S. Ramesh" : "N/A"
    })));
    setComplaints(mockComplaints);
    setMaintenanceReqs(mockMaintenanceRequests);
    setFeeReceipts(mockFeeReceipts);
    setVisitors(mockVisitors);
    setNotices(mockHostelNotices);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const todayMenu = mockWeeklyMessMenu[0]; // Monday
  const tomorrowMenu = mockWeeklyMessMenu[1]; // Tuesday

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-2">
        {/* Breadcrumb Navigation */}
        <div className="h-4 w-40 bg-muted/60 rounded-md" />

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="h-8 w-60 bg-muted/80 rounded-lg" />
            <div className="h-4 w-96 bg-muted/50 rounded-md" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-9 w-32 bg-muted/80 rounded-lg" />
            <div className="h-9 w-36 bg-muted/80 rounded-lg" />
            <div className="h-9 w-32 bg-muted/80 rounded-lg" />
            <div className="h-9 w-32 bg-muted/80 rounded-lg" />
          </div>
        </div>

        {/* 8 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-3.5 h-20 rounded-xl border border-border bg-card/60" />
          ))}
        </div>

        {/* Room details & roommates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 rounded-xl border border-border bg-card/60" />
          <div className="lg:col-span-2 h-64 rounded-xl border border-border bg-card/60" />
        </div>

        {/* Mess menu details */}
        <div className="h-64 rounded-xl border border-border bg-card/60" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
        <span>Home</span>
        <span>&gt;</span>
        <span>Student</span>
        <span>&gt;</span>
        <span className="text-foreground font-semibold">Hostel Management</span>
      </div>

      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <BedDouble className="h-7 w-7 text-primary" /> Hostel Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage hostel accommodation, room details, mess services, gate passes, complaints and hostel payments.
          </p>
        </div>

        {/* Header Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLeaveModalOpen(true)}
            className="text-xs gap-1.5 border-border hover:border-primary"
          >
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Apply Hostel Leave
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsGatePassModalOpen(true)}
            className="text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <QrCode className="h-4 w-4" /> Generate Gate Pass
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadHostelId}
            className="text-xs gap-1.5 border-border hover:border-primary"
          >
            <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Download Hostel ID
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWardenContactModalOpen(true)}
            className="text-xs gap-1.5 border-border hover:border-primary"
          >
            <PhoneCall className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Contact Warden
          </Button>
        </div>
      </div>

      {/* OVERVIEW DASHBOARD KPI CARDS (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* KPI 1: Hostel Block */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Hostel Block
          </span>
          <p className="text-base font-bold text-foreground line-clamp-1">{roomDetails.block.split(" - ")[1] || "Block A"}</p>
          <span className="text-[10px] text-muted-foreground block">Boys Hostel</span>
        </div>

        {/* KPI 2: Room Number */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Room Number
          </span>
          <p className="text-base font-bold text-primary">{roomDetails.roomNumber}</p>
          <span className="text-[10px] text-muted-foreground block">3rd Floor</span>
        </div>

        {/* KPI 3: Bed Number */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Bed Number
          </span>
          <p className="text-base font-bold text-foreground">Bed-2</p>
          <span className="text-[10px] text-muted-foreground block">Window Side</span>
        </div>

        {/* KPI 4: Room Type */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Room Type
          </span>
          <p className="text-sm font-bold text-foreground line-clamp-1">{roomDetails.roomType.replace("Triple Sharing (AC)", "Triple sharing")}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">AC Deluxe</span>
        </div>

        {/* KPI 5: Hostel Status */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-emerald-500/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Hostel Status
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" /> Active
          </span>
          <span className="text-[10px] text-muted-foreground block">Verified Student</span>
        </div>

        {/* KPI 6: Mess Plan */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Mess Plan
          </span>
          <p className="text-base font-bold text-foreground">{messPlan}</p>
          <span className="text-[10px] text-muted-foreground block">Standard Board</span>
        </div>

        {/* KPI 7: Pending Fee */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-emerald-500/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Pending Fee
          </span>
          <p className={`text-base font-bold ${pendingFee > 0 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
            {pendingFee > 0 ? `₹${pendingFee.toLocaleString()}` : "₹0"}
          </p>
          <span className="text-[10px] text-muted-foreground block">
            {pendingFee > 0 ? "Dues Pending" : "All Fees Cleared"}
          </span>
        </div>

        {/* KPI 8: Gate Passes */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-purple-500/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Gate Passes
          </span>
          <p className="text-base font-bold text-purple-600 dark:text-purple-400">{gatePasses.length}</p>
          <span className="text-[10px] text-muted-foreground block">Total Issued</span>
        </div>
      </div>

      {/* ROOM DETAILS & ROOMMATES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Profile Card */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" /> Room Profile
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRoomDetailsModalOpen(true)}
              className="text-xs h-7 gap-1"
            >
              View Inventory <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Room Number</span>
              <span className="font-bold text-foreground text-sm">{roomDetails.roomNumber}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Hostel Block</span>
              <span className="font-semibold text-foreground">{roomDetails.block}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Floor</span>
              <span className="font-semibold text-foreground">{roomDetails.floor}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Room Type</span>
              <span className="font-semibold text-foreground">{roomDetails.roomType}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Capacity & Occupancy</span>
              <span className="font-semibold text-foreground">
                {roomDetails.capacity} Beds ({roomDetails.occupancy} Occupied)
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Hostel Resident Since</span>
              <span className="font-semibold text-foreground">{roomDetails.hostelSince}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Expected Checkout</span>
              <span className="font-semibold text-foreground">{roomDetails.expectedCheckout}</span>
            </div>
          </div>
        </div>

        {/* Roommate Profile Cards */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Roommate Profiles ({roomDetails.roommates.length})
            </h3>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              All Verified Inmates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roomDetails.roommates.map((rm: any) => (
              <div
                key={rm.id}
                className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-all flex items-start gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0 border border-primary/20">
                  {rm.avatar}
                </div>
                <div className="space-y-1 flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground text-sm">{rm.name}</h4>
                    <span className="text-[10px] font-semibold text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                      {rm.rollNo}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium">{rm.department}</p>
                  <p className="text-muted-foreground">{rm.semester}</p>
                  <p className="text-primary font-semibold pt-1 flex items-center gap-1">
                    <PhoneCall className="h-3 w-3" /> {rm.contact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOSTEL INFORMATION & AMENITIES */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" /> Hostel Information & Amenities
            </h3>
            <p className="text-xs text-muted-foreground">{hostelInfo.name} — Contact details and facilities</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRulesModalOpen(true)}
            className="text-xs gap-1"
          >
            <FileText className="h-3.5 w-3.5" /> Hostel Rules
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/60">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> Address & Location
            </p>
            <p className="text-muted-foreground leading-relaxed">{hostelInfo.address}</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/60">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-primary" /> Warden Desk
            </p>
            <p className="text-muted-foreground">Chief Warden: <span className="font-semibold text-foreground">{hostelInfo.wardenName}</span></p>
            <p className="text-muted-foreground">Assistant: <span className="font-semibold text-foreground">{hostelInfo.assistantWarden}</span></p>
            <p className="text-muted-foreground">Office Timing: {hostelInfo.officeTiming}</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/60">
            <p className="font-bold text-foreground flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <PhoneCall className="h-4 w-4" /> Emergency Contact
            </p>
            <p className="text-foreground font-bold">{hostelInfo.emergencyContact}</p>
            <Button
              variant="destructive"
              size="sm"
              disabled={sosCooldown > 0}
              onClick={handleTriggerEmergencySOS}
              className="w-full text-xs h-7 mt-1 gap-1"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {sosCooldown > 0 ? `SOS (Cooldown ${sosCooldown}s)` : "Trigger Emergency SOS"}
            </Button>

            {sosHistory.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                  <span>SOS History</span>
                  <span className="text-[9px] lowercase font-normal">latest first</span>
                </p>
                <div className="max-h-[145px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                  {sosHistory.map((sos) => (
                    <div key={sos.sosId} className="p-2 rounded bg-red-500/5 dark:bg-red-500/10 border border-red-500/15 text-[10px] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold font-mono text-foreground">{sos.sosId}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${
                          sos.status === "Acknowledged" 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                            : "bg-red-500/10 text-red-600 border-red-500/20 animate-pulse"
                        }`}>
                          {sos.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{sos.date} @ {sos.time}</span>
                        {sos.status === "Emergency Alert Sent" && (
                          <span className="text-[9px] text-amber-600 dark:text-amber-400 animate-pulse">Pending...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Amenities */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-blue-500/10 text-blue-600">
              <Wifi className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Wi-Fi Internet</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{hostelInfo.amenities.wifi}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-purple-500/10 text-purple-600">
              <Shirt className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Laundry Service</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{hostelInfo.amenities.laundry}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-600">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Water Supply</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{hostelInfo.amenities.water}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-amber-500/10 text-amber-600">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Power Backup</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{hostelInfo.amenities.powerBackup}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600">
              <HeartPulse className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Medical Room</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{hostelInfo.amenities.medicalRoom}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MESS DETAILS SECTION */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" /> Central Mess Services & Timings
            </h3>
            <p className="text-xs text-muted-foreground">Current Plan: <span className="font-semibold text-foreground">{messPlan}</span></p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMessFeedbackModalOpen(true)}
              className="text-xs gap-1"
            >
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Meal Feedback
            </Button>
          </div>
        </div>

        {/* Timings Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Breakfast</span>
            <p className="font-bold text-foreground mt-0.5">07:30 AM - 09:15 AM</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Lunch</span>
            <p className="font-bold text-foreground mt-0.5">12:30 PM - 02:15 PM</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Evening Snacks</span>
            <p className="font-bold text-foreground mt-0.5">05:00 PM - 06:15 PM</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Dinner</span>
            <p className="font-bold text-foreground mt-0.5">07:45 PM - 09:30 PM</p>
          </div>
        </div>

        {/* Mess Menu Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          {[
            { id: "today", label: "Today's Menu (Mon)" },
            { id: "tomorrow", label: "Tomorrow's Menu (Tue)" },
            { id: "weekly", label: "Weekly Schedule" },
            { id: "special", label: "Special Feast" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMessTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMessTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Menu Tab Content */}
        {activeMessTab === "today" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Breakfast</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{todayMenu.breakfast}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Lunch</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{todayMenu.lunch}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Snacks</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{todayMenu.snacks}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Dinner</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{todayMenu.dinner}</p>
            </div>
          </div>
        )}

        {activeMessTab === "tomorrow" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Breakfast</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{tomorrowMenu.breakfast}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Lunch</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{tomorrowMenu.lunch}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Snacks</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{tomorrowMenu.snacks}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Dinner</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{tomorrowMenu.dinner}</p>
            </div>
          </div>
        )}

        {activeMessTab === "weekly" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-3">Day</th>
                  <th className="p-3">Breakfast</th>
                  <th className="p-3">Lunch</th>
                  <th className="p-3">Snacks</th>
                  <th className="p-3">Dinner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {mockWeeklyMessMenu.map((m) => (
                  <tr key={m.day} className="hover:bg-muted/20">
                    <td className="p-3 font-bold text-foreground">{m.day}</td>
                    <td className="p-3 text-muted-foreground">{m.breakfast}</td>
                    <td className="p-3 text-muted-foreground">{m.lunch}</td>
                    <td className="p-3 text-muted-foreground">{m.snacks}</td>
                    <td className="p-3 text-muted-foreground">{m.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeMessTab === "special" && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/[0.04] text-xs space-y-2">
            <h4 className="font-bold text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Upcoming Sunday Feast Special
            </h4>
            <p className="text-foreground leading-relaxed">
              Special Feast Day: Hyderabadi Veg Biryani, Mirchi Ka Salan, Paneer Butter Masala, Butter Naan, and Chocolate Ice Cream Sundae served for all hostel residents during Sunday Lunch & Dinner!
            </p>
          </div>
        )}
      </div>

      {/* HOSTEL FEES & PAYMENT HISTORY */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Hostel Fee Management & Payment History
            </h3>
            <p className="text-xs text-muted-foreground">Track annual hostel fees, installments, and receipts</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsPaymentModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <CreditCard className="h-3.5 w-3.5" /> Pay Hostel Fee
          </Button>
        </div>

        {/* Fee Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-border bg-card space-y-1">
            <span className="text-muted-foreground text-[11px] block">Total Hostel Fee (Annual)</span>
            <p className="text-xl font-bold text-foreground">₹45,000</p>
            <span className="text-[10px] text-muted-foreground block">Room & Mess Combined</span>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-1">
            <span className="text-muted-foreground text-[11px] block">Paid Amount</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{(45000 - pendingFee).toLocaleString()}</p>
            <span className={`text-[10px] font-medium block ${pendingFee > 0 ? "text-amber-500" : "text-emerald-600"}`}>
              {pendingFee > 0 ? `${(((45000 - pendingFee) / 45000) * 100).toFixed(0)}% Paid` : "100% Cleared"}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-1">
            <span className="text-muted-foreground text-[11px] block">Pending Amount</span>
            <p className={`text-xl font-bold ${pendingFee > 0 ? "text-red-500" : "text-foreground"}`}>₹{pendingFee.toLocaleString()}</p>
            <span className="text-[10px] text-muted-foreground block">
              {pendingFee > 0 ? "Outstanding Dues" : "No Dues Outstanding"}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-1">
            <span className="text-muted-foreground text-[11px] block">Next Due Date</span>
            <p className="text-base font-bold text-primary">{pendingFee > 0 ? "Immediate" : "Cleared"}</p>
            <span className="text-[10px] text-muted-foreground block">
              {pendingFee > 0 ? "Payment overdue" : "Next term: 15 Jan 2027"}
            </span>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment History</h4>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-3">Receipt Number</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Term / Description</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {feeReceipts.map((rcp: any) => (
                  <tr key={rcp.receiptNo} className="hover:bg-muted/20">
                    <td className="p-3 font-mono font-bold text-foreground">{rcp.receiptNo}</td>
                    <td className="p-3 text-muted-foreground">{rcp.date}</td>
                    <td className="p-3 text-foreground font-medium">{rcp.term}</td>
                    <td className="p-3 font-bold text-foreground">{rcp.amount}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {rcp.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloadingReceipts[rcp.receiptNo]}
                        onClick={() => handleDownloadReceipt(rcp)}
                        className="text-xs h-7 gap-1"
                      >
                        {downloadingReceipts[rcp.receiptNo] ? (
                          <>
                            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></span>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3" /> Download Receipt
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GATE PASS MANAGEMENT SECTION */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" /> Gate Pass Management
            </h3>
            <p className="text-xs text-muted-foreground">Request, view and present digital QR gate passes for campus entry & exit</p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "active", label: "Active Pass (QR Code)" },
              { id: "form", label: "Generate Gate Pass" },
              { id: "history", label: "Previous Gate Passes" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveGatePassTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeGatePassTab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Active Gate Pass Cards Grid */}
        {activeGatePassTab === "active" && (
          <div className="space-y-4">
            {gatePasses.filter(gp => gp.status === "Approved" || gp.status === "Pending").length === 0 ? (
              <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                <QrCode className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
                <p className="font-semibold text-sm">No Active Gate Pass</p>
                <p className="text-xs">Generate a new gate pass request to see your active QR code pass here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gatePasses
                  .filter(gp => gp.status === "Approved" || gp.status === "Pending")
                  .map((gp) => (
                    <div
                      key={gp.id}
                      className="border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Card Header */}
                      <div className="p-4 border-b border-border/80 bg-muted/10 flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary">{gp.gatePassId || gp.refId}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            gp.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}
                        >
                          {gp.status}
                        </span>
                      </div>

                      {/* QR Code (Centered) */}
                      <div className="p-5 flex flex-col items-center justify-center bg-muted/5 border-b border-border/40 min-h-[180px]">
                        <div className="p-3 bg-white rounded-xl shadow-xs border border-border flex items-center justify-center w-[130px] h-[130px] transition-transform duration-300 group-hover:scale-105">
                          <QRCode
                            value={gp.gatePassId || gp.refId || "GP-PASS-ACTIVE"}
                            size={100}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-2 block font-mono">Scan at Guard Post</span>
                      </div>

                      {/* Details */}
                      <div className="p-4 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Student Name</span>
                              <span className="font-semibold text-foreground">{gp.studentName || "K. Sai Teja"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Student ID</span>
                              <span className="font-semibold text-foreground">{gp.studentId || "22CS101"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Hostel Block</span>
                              <span className="font-semibold text-foreground truncate block">{gp.hostel || roomDetails.block}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Room Number</span>
                              <span className="font-semibold text-foreground">{gp.room || roomDetails.roomNumber}</span>
                            </div>
                          </div>

                          <div className="border-t border-border/60 pt-2 space-y-1 text-[11px]">
                            <div>
                              <span className="text-muted-foreground text-[10px]">Destination:</span>{" "}
                              <span className="font-medium text-foreground">{gp.destination}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-[10px]">Purpose:</span>{" "}
                              <span className="font-medium text-foreground">{gp.purpose}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-[10px]">Outing:</span>{" "}
                              <span className="font-semibold text-foreground">
                                {gp.outDate} @ {gp.outTime}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-[10px]">Return:</span>{" "}
                              <span className="font-semibold text-foreground">
                                {gp.returnDate} @ {gp.returnTime}
                              </span>
                            </div>
                            {gp.guardianApproval && (
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                {gp.guardianApproval}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/60">
                          <Button variant="outline" size="sm" onClick={() => setSelectedPass(gp)} className="text-[11px] h-7.5">
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelGatePass(gp.id)}
                            className="text-[11px] h-7.5 text-red-500 hover:text-red-600 dark:hover:text-red-400 border-red-500/20 hover:bg-red-500/5"
                          >
                            Cancel Request
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Gate Pass Form */}
        {activeGatePassTab === "form" && (
          <form onSubmit={handleGenerateGatePass} className="space-y-4 text-xs max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Outing Purpose</label>
                <select
                  value={gatePassForm.purpose}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, purpose: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="Local Outing">Local Outing (City)</option>
                  <option value="Weekend Home Visit">Weekend Home Visit</option>
                  <option value="Medical Consultation">Medical Consultation</option>
                  <option value="Official Academic Work">Official Academic Work</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Destination</label>
                <input
                  type="text"
                  value={gatePassForm.destination}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, destination: e.target.value })}
                  placeholder="e.g. City Mall / Home Town"
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Out Date</label>
                <input
                  type="date"
                  value={gatePassForm.outDate}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, outDate: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Out Time</label>
                <input
                  type="text"
                  value={gatePassForm.outTime}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, outTime: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Expected Return Date</label>
                <input
                  type="date"
                  value={gatePassForm.returnDate}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, returnDate: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Expected Return Time</label>
                <input
                  type="text"
                  value={gatePassForm.returnTime}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, returnTime: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-foreground">Guardian Approval Mobile Number</label>
                <input
                  type="tel"
                  value={gatePassForm.guardianContact}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, guardianContact: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
                <p className="text-[11px] text-muted-foreground">Automated SMS verification code will be sent to guardian mobile number.</p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Mode of Travel</label>
                <select
                  value={gatePassForm.travelMode}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, travelMode: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="Bus">Bus</option>
                  <option value="Train">Train</option>
                  <option value="Flight">Flight</option>
                  <option value="Personal Vehicle">Personal Vehicle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Remarks</label>
                <textarea
                  value={gatePassForm.remarks}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, remarks: e.target.value })}
                  rows={2}
                  placeholder="Any additional remarks..."
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <Button type="submit" className="text-xs gap-1.5" disabled={submitting}>
              <Send className="h-3.5 w-3.5" /> Submit Gate Pass Request
            </Button>
          </form>
        )}

        {/* Tab 3: Previous Passes Grid */}
        {activeGatePassTab === "history" && (
          <div className="space-y-4">
            {gatePasses.filter(gp => gp.status !== "Approved" && gp.status !== "Pending").length === 0 ? (
              <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                <QrCode className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
                <p className="font-semibold text-sm">No Previous Gate Passes</p>
                <p className="text-xs">Your expired, completed or cancelled passes will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gatePasses
                  .filter(gp => gp.status !== "Approved" && gp.status !== "Pending")
                  .map((gp) => (
                    <div
                      key={gp.id}
                      className="border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Card Header */}
                      <div className="p-4 border-b border-border/80 bg-muted/10 flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary">{gp.gatePassId || gp.refId}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            gp.status === "Cancelled"
                              ? "bg-red-500/10 text-red-700 border-red-500/20"
                              : gp.status === "Rejected"
                              ? "bg-red-500/10 text-red-600 border-red-500/20"
                              : gp.status === "Expired"
                              ? "bg-gray-500/10 text-gray-600 border-gray-500/20"
                              : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          }`}
                        >
                          {gp.status}
                        </span>
                      </div>

                      {/* QR Code (Centered) */}
                      <div className="p-5 flex flex-col items-center justify-center bg-muted/5 border-b border-border/40 min-h-[180px] opacity-60">
                        <div className="p-3 bg-white rounded-xl shadow-xs border border-border flex items-center justify-center w-[130px] h-[130px]">
                          <QRCode
                            value={gp.gatePassId || gp.refId || "GP-PASS-EXPIRED"}
                            size={100}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-2 block font-mono">Inactive Code</span>
                      </div>

                      {/* Details */}
                      <div className="p-4 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Student Name</span>
                              <span className="font-semibold text-foreground">{gp.studentName || "K. Sai Teja"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Student ID</span>
                              <span className="font-semibold text-foreground">{gp.studentId || "22CS101"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Hostel Block</span>
                              <span className="font-semibold text-foreground truncate block">{gp.hostel || roomDetails.block}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Room Number</span>
                              <span className="font-semibold text-foreground">{gp.room || roomDetails.roomNumber}</span>
                            </div>
                          </div>

                          <div className="border-t border-border/60 pt-2 space-y-1 text-[11px]">
                            <div>
                              <span className="text-muted-foreground text-[10px]">Destination:</span>{" "}
                              <span className="font-medium text-foreground">{gp.destination}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-[10px]">Purpose:</span>{" "}
                              <span className="font-medium text-foreground">{gp.purpose}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-[10px]">Outing:</span>{" "}
                              <span className="font-semibold text-foreground">
                                {gp.outDate} @ {gp.outTime}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-[10px]">Return:</span>{" "}
                              <span className="font-semibold text-foreground">
                                {gp.returnDate} @ {gp.returnTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/60">
                          <Button variant="outline" size="sm" onClick={() => setSelectedPass(gp)} className="text-[11px] h-7.5 w-full col-span-2">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* HOSTEL COMPLAINTS & ISSUE REDRESSAL */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" /> Hostel Complaints & Support Desk
            </h3>
            <p className="text-xs text-muted-foreground">Lodge electrical, plumbing, internet or room maintenance issues</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsComplaintModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Submit Complaint
          </Button>
        </div>

        {/* 8 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { id: "Electricity", label: "Electricity", icon: Zap, color: "text-amber-500 bg-amber-500/10" },
            { id: "Water", label: "Water", icon: Droplets, color: "text-blue-500 bg-blue-500/10" },
            { id: "Cleaning", label: "Cleaning", icon: Sparkles, color: "text-emerald-500 bg-emerald-500/10" },
            { id: "Furniture", label: "Furniture", icon: BedDouble, color: "text-purple-500 bg-purple-500/10" },
            { id: "Internet", label: "Internet", icon: Wifi, color: "text-cyan-500 bg-cyan-500/10" },
            { id: "Mess", label: "Mess", icon: Utensils, color: "text-orange-500 bg-orange-500/10" },
            { id: "Security", label: "Security", icon: ShieldCheck, color: "text-indigo-500 bg-indigo-500/10" },
            { id: "Other", label: "Other", icon: HelpCircle, color: "text-slate-500 bg-slate-500/10" },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedComplaintCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedComplaintCategory(cat.id);
                  setComplaintForm((prev) => ({ ...prev, category: cat.id }));
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-1.5 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className={`p-2 rounded-lg ${cat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-foreground line-clamp-1">{cat.label}</span>
              </div>
            );
          })}
        </div>

        {/* Complaint History Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Complaint & Ticket History</h4>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Staff</th>
                  <th className="p-3">Date Raised</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20">
                    <td className="p-3 font-mono font-bold text-foreground">{c.ticketNo}</td>
                    <td className="p-3 font-semibold text-foreground">{c.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        c.priority === "High" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground max-w-xs line-clamp-1">{c.description}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.status === "Resolved"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{c.assignedStaff}</td>
                    <td className="p-3 text-muted-foreground">{c.dateRaised}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ROOM MAINTENANCE & VISITOR MANAGEMENT (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Requests */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" /> Room Maintenance
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsComplaintModalOpen(true)}
              className="text-xs gap-1 h-7"
            >
              Raise Request
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-border bg-muted/20 text-center">
              <span className="text-muted-foreground text-[10px] block">Pending</span>
              <span className="font-bold text-foreground text-base">
                {maintenanceReqs.filter((r: any) => r.status === "Pending").length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-center">
              <span className="text-amber-600 dark:text-amber-400 text-[10px] font-semibold block">In Progress</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-base">
                {maintenanceReqs.filter((r: any) => r.status === "In Progress" || r.status === "Assigned").length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-center">
              <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold block">Completed</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                {maintenanceReqs.filter((r: any) => r.status === "Completed" || r.status === "Resolved").length}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {maintenanceReqs.map((mr) => (
              <div key={mr.id} className="p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{mr.item}</p>
                  <span className="text-[11px] text-muted-foreground">{mr.reqNo} • {mr.assignedStaff}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  mr.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                }`}>
                  {mr.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Management */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" /> Visitor Management
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisitorModalOpen(true)}
              className="text-xs gap-1 h-7"
            >
              Add Visitor
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-2.5">Visitor</th>
                  <th className="p-2.5">Relation</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">In - Out</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-muted/20">
                    <td className="p-2.5 font-semibold text-foreground">{v.visitorName}</td>
                    <td className="p-2.5 text-muted-foreground">{v.relationship}</td>
                    <td className="p-2.5 text-muted-foreground">{v.date}</td>
                    <td className="p-2.5 text-muted-foreground">{v.inTime} - {v.outTime}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {v.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HOSTEL NOTICES & ANNOUNCEMENTS */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> Latest Hostel Notices & Circulars
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Navigating to all Hostel Notices stream...")}
            className="text-xs gap-1"
          >
            View All Circulars
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {notices.map((hn: any) => (
            <div key={hn.id} className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px]">
                  {hn.category}
                </span>
                <span className="text-muted-foreground text-[11px]">{hn.date}</span>
              </div>
              <h4 className="font-bold text-foreground text-sm">{hn.title}</h4>
              <p className="text-muted-foreground leading-relaxed line-clamp-2">{hn.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* MODALS SECTION */}
      {/* ================================================== */}

      {/* Modal 1: Apply Hostel Leave */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Apply Hostel Leave
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsLeaveModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex border-b border-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveLeaveModalTab("apply")}
                className={`flex-1 py-2 text-center border-b-2 transition-all ${
                  activeLeaveModalTab === "apply"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                New Request
              </button>
              <button
                type="button"
                onClick={() => setActiveLeaveModalTab("history")}
                className={`flex-1 py-2 text-center border-b-2 transition-all ${
                  activeLeaveModalTab === "history"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Previous Requests ({leaves.length})
              </button>
            </div>

            {activeLeaveModalTab === "history" ? (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 text-xs">
                {leaves.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No previous leave requests.</p>
                ) : (
                  leaves.map((lv) => (
                    <div key={lv.id} className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-xs">{lv.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          lv.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : lv.status === "Pending"
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            : "bg-red-500/10 text-red-600 border border-red-500/20"
                        }`}>
                          {lv.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                        <div><span className="font-medium text-foreground">Type:</span> {lv.leaveType}</div>
                        <div><span className="font-medium text-foreground">Applied:</span> {lv.appliedDate}</div>
                        <div className="col-span-2"><span className="font-medium text-foreground">Dates:</span> {lv.startDate} to {lv.endDate}</div>
                        <div className="col-span-2"><span className="font-medium text-foreground">Destination:</span> {lv.destination}</div>
                        <div className="col-span-2"><span className="font-medium text-foreground">Purpose:</span> {lv.purpose}</div>
                        {lv.remarks && <div className="col-span-2"><span className="font-medium text-foreground">Remarks:</span> {lv.remarks}</div>}
                      </div>
                    </div>
                  ))
                )}
                <div className="flex justify-end pt-2">
                  <Button size="sm" onClick={() => setIsLeaveModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Leave Type</label>
                    <select
                      value={leaveForm.leaveType}
                      onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    >
                      <option value="Festival Leave">Festival Leave</option>
                      <option value="Medical Leave">Medical Leave</option>
                      <option value="Weekend Visit">Weekend Visit</option>
                      <option value="Official Outing">Official Outing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Emergency Contact</label>
                    <input
                      type="tel"
                      value={leaveForm.emergencyContact}
                      onChange={(e) => setLeaveForm({ ...leaveForm, emergencyContact: e.target.value })}
                      placeholder="e.g. +91 98490 12345"
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Out Date</label>
                    <input
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Return Date</label>
                    <input
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Destination</label>
                  <input
                    type="text"
                    value={leaveForm.destination}
                    onChange={(e) => setLeaveForm({ ...leaveForm, destination: e.target.value })}
                    placeholder="Complete Address of Destination"
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Purpose of Leave</label>
                  <textarea
                    value={leaveForm.purpose}
                    onChange={(e) => setLeaveForm({ ...leaveForm, purpose: e.target.value })}
                    rows={2}
                    placeholder="State detailed purpose for leaving..."
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Remarks (Optional)</label>
                  <textarea
                    value={leaveForm.remarks}
                    onChange={(e) => setLeaveForm({ ...leaveForm, remarks: e.target.value })}
                    rows={1.5}
                    placeholder="Any additional remarks..."
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsLeaveModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Submit Leave Application
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Gate Pass Modal */}
      {isGatePassModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" /> Generate Quick Gate Pass
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsGatePassModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleGenerateGatePass} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Outing Purpose</label>
                <select
                  value={gatePassForm.purpose}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, purpose: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="Local Outing">Local Outing (City)</option>
                  <option value="Weekend Home Visit">Weekend Home Visit</option>
                  <option value="Medical Consultation">Medical Consultation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Destination</label>
                <input
                  type="text"
                  value={gatePassForm.destination}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, destination: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Out Date</label>
                  <input
                    type="date"
                    value={gatePassForm.outDate}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, outDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Out Time</label>
                  <input
                    type="text"
                    value={gatePassForm.outTime}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, outTime: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Return Date</label>
                  <input
                    type="date"
                    value={gatePassForm.returnDate}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, returnDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Return Time</label>
                  <input
                    type="text"
                    value={gatePassForm.returnTime}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, returnTime: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Mode of Travel</label>
                <select
                  value={gatePassForm.travelMode}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, travelMode: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="Bus">Bus</option>
                  <option value="Train">Train</option>
                  <option value="Flight">Flight</option>
                  <option value="Personal Vehicle">Personal Vehicle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Remarks</label>
                <textarea
                  value={gatePassForm.remarks}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, remarks: e.target.value })}
                  rows={2}
                  placeholder="Any additional remarks..."
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsGatePassModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Submit Pass Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Submit Complaint Modal */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" /> Lodge Hostel Complaint
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsComplaintModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Category</label>
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water / Plumbing</option>
                    <option value="Cleaning">Housekeeping / Cleaning</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Internet">Internet / Wi-Fi</option>
                    <option value="Mess">Mess Food</option>
                    <option value="Security">Security / Lock</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Priority</label>
                  <select
                    value={complaintForm.priority}
                    onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Complaint Description</label>
                <textarea
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  rows={3}
                  placeholder="Describe the issue clearly..."
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Upload Image Proof (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsComplaintModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Lodge Complaint Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Mess Feedback Modal */}
      {isMessFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Utensils className="h-5 w-5 text-amber-500" /> Meal & Mess Feedback
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsMessFeedbackModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleMessFeedbackSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Meal Type</label>
                <select
                  value={messFeedbackForm.mealType}
                  onChange={(e) => setMessFeedbackForm({ ...messFeedbackForm, mealType: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Evening Snacks</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Overall Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMessFeedbackForm({ ...messFeedbackForm, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`h-6 w-6 ${star <= messFeedbackForm.rating ? "text-amber-500 fill-amber-500" : "text-muted border-muted"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Comments / Suggestion</label>
                <textarea
                  value={messFeedbackForm.comments}
                  onChange={(e) => setMessFeedbackForm({ ...messFeedbackForm, comments: e.target.value })}
                  rows={3}
                  placeholder="Share details regarding food taste, hygiene, quantity..."
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsMessFeedbackModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Room Details & Inventory Modal */}
      {isRoomDetailsModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" /> Room A-305 Detailed Inventory
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsRoomDetailsModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-muted-foreground">List of physical assets allocated to Room A-305:</p>
              <div className="space-y-2 border border-border rounded-lg p-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span>3 Wooden Study Tables & Chairs</span>
                  <span className="text-emerald-600 font-semibold">Good Condition</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                  <span>3 Wooden Single Beds & Mattresses</span>
                  <span className="text-emerald-600 font-semibold">Good Condition</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                  <span>3 Steel Almirahs with Key Locks</span>
                  <span className="text-emerald-600 font-semibold">Good Condition</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                  <span>1.5 Ton Split Air Conditioner</span>
                  <span className="text-emerald-600 font-semibold">Serviced (July 2026)</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                  <span>2 Ceiling Fans & LED Tube Lights</span>
                  <span className="text-amber-600 font-semibold">1 Light Replacement Pending</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setIsRoomDetailsModalOpen(false)}>
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Pay Hostel Fee Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" /> Pay Hostel Fee Online
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsPaymentModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1 text-center">
              <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">All Outstanding Hostel Dues Are Cleared!</p>
              <p className="text-muted-foreground">Your total paid amount for 2026-27 is ₹45,000.</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setIsPaymentModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: Add Visitor Modal */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" /> Register Hostel Visitor
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsVisitorModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsVisitorModalOpen(false);
                alert("Visitor Pass registered! Present ID proof at Hostel Security Gate.");
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Visitor Full Name</label>
                <input type="text" placeholder="e.g. Suresh Kumar" className="w-full p-2 rounded-lg border border-border bg-background text-foreground" required />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Relationship</label>
                <input type="text" placeholder="e.g. Father / Mother / Brother" className="w-full p-2 rounded-lg border border-border bg-background text-foreground" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Visiting Date</label>
                  <input type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full p-2 rounded-lg border border-border bg-background text-foreground" required />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Expected In Time</label>
                  <input type="text" defaultValue="04:00 PM" className="w-full p-2 rounded-lg border border-border bg-background text-foreground" required />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsVisitorModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Register Visitor Pass
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warden Contact Modal */}
      {isWardenContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-primary" /> Warden Office Desk Contacts
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsWardenContactModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/20 border border-border space-y-2">
                <div>
                  <p className="font-bold text-foreground text-sm">Chief Warden: {mockHostelInfo.wardenName}</p>
                  <p className="text-muted-foreground mt-0.5">Office: Block A Warden Chamber (Ground Floor)</p>
                  <p className="text-muted-foreground mt-0.5">Timings: 09:00 AM - 01:00 PM, 04:00 PM - 06:00 PM</p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
                  <a
                    href="tel:+919444412345"
                    onClick={() => toast.success("Dialing Chief Warden: +91 94444 12345")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-semibold transition-colors"
                  >
                    <PhoneCall className="h-3.5 w-3.5" /> Call Chief Warden
                  </a>
                  <a
                    href="mailto:chiefwarden@edusuite.edu.in"
                    onClick={() => toast.success("Opening Email Composer to Chief Warden...")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-semibold transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("+919444412345");
                      toast.success("Chief Warden phone number copied to clipboard!");
                    }}
                    className="h-8 text-[11px] px-2.5"
                  >
                    Copy Phone
                  </Button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/20 border border-border space-y-2">
                <div>
                  <p className="font-bold text-foreground text-sm">Assistant Warden: {mockHostelInfo.assistantWarden}</p>
                  <p className="text-muted-foreground mt-0.5">Office: Block A Security Control Room</p>
                  <p className="text-muted-foreground mt-0.5">Timings: 08:00 AM - 08:00 PM (Rotational)</p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
                  <a
                    href="tel:+919444467890"
                    onClick={() => toast.success("Dialing Assistant Warden: +91 94444 67890")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-semibold transition-colors"
                  >
                    <PhoneCall className="h-3.5 w-3.5" /> Call Assistant Warden
                  </a>
                  <a
                    href="mailto:wardendesk.blocka@edusuite.edu.in"
                    onClick={() => toast.success("Opening Email Composer to Assistant Warden...")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-semibold transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("+919444467890");
                      toast.success("Assistant Warden phone number copied to clipboard!");
                    }}
                    className="h-8 text-[11px] px-2.5"
                  >
                    Copy Phone
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <Button size="sm" onClick={() => setIsWardenContactModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency SOS Confirmation Dialog */}
      {isSosConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-red-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2 rounded-full bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold">Emergency SOS</h3>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to send an emergency alert to the Hostel Warden? This should only be used in genuine emergencies.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={sosLoading} 
                onClick={() => setIsSosConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                disabled={sosLoading}
                onClick={confirmAndSendSOS}
                className="gap-2"
              >
                {sosLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending SOS...
                  </>
                ) : (
                  "Send SOS"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Alert Sent Success Dialog */}
      {isSosSuccessOpen && activeSosRequest && (
        <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border-2 border-red-500 rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
              <h3 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" /> Emergency Alert Sent Successfully
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsSosSuccessOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs space-y-3 text-foreground">
              <p className="font-semibold text-red-600 dark:text-red-400">
                Your emergency request has been sent to the Hostel Warden. Please stay where you are if it is safe to do so. The hostel staff will respond as soon as possible.
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3.5 rounded-xl bg-muted/40 border border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">SOS ID</span>
                  <span className="font-bold font-mono text-foreground">{activeSosRequest.sosId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Date & Time</span>
                  <span className="font-semibold text-foreground">{activeSosRequest.date} @ {activeSosRequest.time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Hostel Block</span>
                  <span className="font-semibold text-foreground">{activeSosRequest.block}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Room Number</span>
                  <span className="font-semibold text-foreground">{activeSosRequest.room}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Student Name</span>
                  <span className="font-semibold text-foreground">{activeSosRequest.studentName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Student ID</span>
                  <span className="font-semibold text-foreground">{activeSosRequest.studentId}</span>
                </div>
              </div>

              {/* Quick Emergency Actions */}
              <div className="space-y-1.5 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick Actions</p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${mockHostelInfo.emergencyContact}`}
                    onClick={() => toast.success("Calling Warden Desk...")}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border border-border bg-background hover:bg-muted/30 transition-all text-center"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-[9px] font-bold">Call Warden</span>
                  </a>
                  <a
                    href="tel:+919444411111"
                    onClick={() => toast.success("Calling Campus Security...")}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border border-border bg-background hover:bg-muted/30 transition-all text-center"
                  >
                    <Shield className="h-4 w-4 text-red-500" />
                    <span className="text-[9px] font-bold">Call Security</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("+91 94444 12345");
                      toast.success("Emergency Contact Copied!");
                    }}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border border-border bg-background hover:bg-muted/30 transition-all text-center"
                  >
                    <Copy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[9px] font-bold">Copy Number</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="destructive" size="sm" onClick={() => setIsSosSuccessOpen(false)}>
                Dismiss SOS Alert
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 8: Selected Gate Pass Details (View Pass Modal) */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" /> Gate Pass Verification
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedPass(null)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center space-y-2 border border-border p-4 rounded-xl bg-muted/10">
                <div className="p-2.5 bg-white rounded-lg border border-border">
                  <QRCode
                    value={selectedPass.gatePassId || selectedPass.refId || "GP-PASS-DETAILS"}
                    size={110}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{selectedPass.gatePassId || selectedPass.refId}</span>
              </div>

              {/* Details grid */}
              <div className="sm:col-span-2 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3.5 rounded-xl bg-muted/20 border border-border">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Student Name</span>
                    <p className="font-bold text-foreground">{selectedPass.studentName || "K. Sai Teja"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Student ID</span>
                    <p className="font-bold text-foreground">{selectedPass.studentId || "22CS101"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Hostel Block</span>
                    <p className="font-semibold text-foreground">{selectedPass.hostel || roomDetails.block}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Room Number</span>
                    <p className="font-semibold text-foreground">{selectedPass.room || roomDetails.roomNumber}</p>
                  </div>
                  <div className="col-span-2 border-t border-border/40 pt-1.5 mt-1">
                    <span className="text-muted-foreground block text-[10px]">Purpose</span>
                    <p className="font-semibold text-foreground">{selectedPass.purpose}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-[10px]">Destination</span>
                    <p className="font-semibold text-foreground">{selectedPass.destination}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Out Date & Time</span>
                    <p className="font-semibold text-foreground">{selectedPass.outDate} @ {selectedPass.outTime}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Return Date & Time</span>
                    <p className="font-semibold text-foreground">{selectedPass.returnDate} @ {selectedPass.returnTime}</p>
                  </div>
                  <div className="col-span-2 border-t border-border/40 pt-1.5 mt-1">
                    <span className="text-muted-foreground block text-[10px]">Status & Approvals</span>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedPass.guardianApproval || "Authorized and Verified"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.success(`Printing Gate Pass details for ${selectedPass.gatePassId || selectedPass.refId}...`);
                    window.print();
                  }}
                  className="text-xs gap-1"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Pass
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.success(`Downloading PDF for Gate Pass ${selectedPass.gatePassId || selectedPass.refId}...`);
                  }}
                  className="text-xs gap-1"
                >
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {(selectedPass.status === "Approved" || selectedPass.status === "Pending") && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      handleCancelGatePass(selectedPass.id);
                      setSelectedPass(null);
                    }}
                    className="text-xs"
                  >
                    Cancel Pass
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setSelectedPass(null)} className="text-xs">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 9: Hostel ID Card Preview & Download */}
      {isIdCardModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsIdCardModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm md:max-w-2xl bg-card border border-border rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #hostel-id-card-preview-container, #hostel-id-card-preview-container * {
                  visibility: visible !important;
                }
                #hostel-id-card-preview-container {
                  position: fixed !important;
                  left: 50% !important;
                  top: 50% !important;
                  transform: translate(-50%, -50%) scale(1.8) !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: white !important;
                  color: black !important;
                }
              }
            `}</style>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" /> Hostel ID Card Preview
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsIdCardModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Card Container wrapper for center and scaling */}
              <div className="flex flex-col items-center justify-center p-1 sm:p-2">
                {/* Premium Physical ID Card Preview */}
                <div 
                  ref={cardRef}
                  id="hostel-id-card-preview-container"
                  className="relative overflow-hidden w-full max-w-[260px] xs:max-w-[280px] aspect-[2.75/4.25] rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 via-background to-background shadow-lg flex flex-col justify-between p-5 text-xs text-foreground bg-white dark:bg-slate-900"
                >
                  {/* Header Bar */}
                  <div className="absolute top-0 inset-x-0 h-14 bg-primary flex items-center justify-between px-4 text-white">
                    <div className="flex flex-col">
                      <span className="font-bold tracking-wide uppercase text-[10px]">EduSuite University</span>
                      <span className="text-[7px] tracking-wider opacity-90 uppercase">Hostel Administration</span>
                    </div>
                    <Building className="h-6 w-6 text-white opacity-85" />
                  </div>

                  {/* Spacing for Header Bar */}
                  <div className="h-10"></div>

                  {/* Student Photo */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="h-20 w-20 rounded-full border-2 border-primary bg-primary/10 overflow-hidden flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">ST</span>
                    </div>
                    <div className="text-center">
                      <h4 className="font-extrabold text-sm text-foreground tracking-tight">K. Sai Teja</h4>
                      <p className="font-semibold text-primary text-[10px]">Student ID: 22CS101</p>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="space-y-1.5 border-t border-b border-border/60 py-2 my-1 text-[10px]">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      <div>
                        <span className="text-muted-foreground block text-[8px] uppercase">Department</span>
                        <span className="font-bold text-foreground truncate block">Computer Science</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[8px] uppercase">Hostel Block</span>
                        <span className="font-bold text-foreground truncate block">{roomDetails.block || "Block A"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[8px] uppercase">Room No</span>
                        <span className="font-bold text-foreground">{roomDetails.roomNumber || "A-305"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[8px] uppercase">Blood Group</span>
                        <span className="font-bold text-foreground font-mono">O+ Positive</span>
                      </div>
                    </div>
                    <div className="pt-0.5">
                      <span className="text-muted-foreground block text-[8px] uppercase">Emergency Contact</span>
                      <span className="font-mono font-bold text-foreground">+91 98490 12345</span>
                    </div>
                  </div>

                  {/* QR Code Check-in Verification */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col text-[8px] text-muted-foreground uppercase">
                      <span>Authorized Card</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">Active Member</span>
                    </div>
                    <div className="p-1 bg-white rounded border border-border">
                      <QRCode
                        value="EDUSUITE-HOSTEL-ID-22CS101"
                        size={40}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox="0 0 256 256"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Details & Help Guide on Right Side (hidden on mobile, visible on desktop/tablet) */}
              <div className="space-y-4 text-xs">
                <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-3">
                  <p className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                    <Building className="h-4 w-4 text-primary" /> Active Identification Card
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between border-b border-border/40 pb-1.5">
                      <span className="text-muted-foreground">Resident Name:</span>
                      <span className="font-bold text-foreground">K. Sai Teja</span>
                    </div>
                    <div className="flex justify-between border-b border-border/40 pb-1.5">
                      <span className="text-muted-foreground">Registration ID:</span>
                      <span className="font-bold text-foreground font-mono">22CS101</span>
                    </div>
                    <div className="flex justify-between border-b border-border/40 pb-1.5">
                      <span className="text-muted-foreground">Block & Room:</span>
                      <span className="font-bold text-foreground">{roomDetails.block || "Block A"} — Room {roomDetails.roomNumber || "A-305"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verification:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Verified Resident</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-2">
                  <p className="font-bold text-primary text-xs">Card Instructions</p>
                  <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground text-[11px] leading-relaxed">
                    <li>This card must be produced on demand at the hostel entry/exit gates.</li>
                    <li>The QR code contains encrypted registration details for check-in audits.</li>
                    <li>For physical card copies, choose "Print Layout" and enable background graphics in your browser settings.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success("Opening Print dialog for Hostel ID...");
                  window.print();
                }}
                className="text-xs gap-1.5 w-full sm:w-auto"
              >
                <Printer className="h-3.5 w-3.5" /> Print Layout
              </Button>
              <Button
                size="sm"
                disabled={downloadingPdf}
                onClick={handleDownloadPdf}
                className="text-xs gap-1.5 w-full sm:w-auto"
              >
                {downloadingPdf ? (
                  <>
                    <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-background"></span>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" /> Download ID (PDF)
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 10: Hostel Rules & Regulations */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Hostel Rules & Regulations
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Code of conduct and guidelines for hostel residents</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsRulesModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 py-3 border-b border-border text-xs">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search rules by keyword (e.g. curfew, quiet hours)..."
                  value={rulesSearchQuery}
                  onChange={(e) => setRulesSearchQuery(e.target.value)}
                  className="w-full p-2.5 pl-8 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="absolute left-2.5 top-3 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                {rulesSearchQuery && (
                  <button
                    onClick={() => setRulesSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allExpanded = Object.keys(expandedSections).reduce((acc, key) => {
                      acc[key] = true;
                      return acc;
                    }, {} as Record<string, boolean>);
                    setExpandedSections(allExpanded);
                  }}
                  className="text-xs h-9"
                >
                  Expand All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allCollapsed = Object.keys(expandedSections).reduce((acc, key) => {
                      acc[key] = false;
                      return acc;
                    }, {} as Record<string, boolean>);
                    setExpandedSections(allCollapsed);
                  }}
                  className="text-xs h-9"
                >
                  Collapse All
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
              {rulesLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-xs text-muted-foreground">Loading rules handbook...</p>
                </div>
              ) : filteredRules.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-xl bg-muted/10">
                  <AlertTriangle className="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
                  <p className="font-semibold text-sm text-foreground">No matching rules found</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Try searching for other terms like 'visitors', 'mess', or 'curfew'.</p>
                  <Button variant="outline" size="sm" onClick={() => setRulesSearchQuery("")} className="mt-3 text-xs">
                    Clear Search Query
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredRules.map((section) => {
                    const isExpanded = expandedSections[section.id] ?? true;
                    return (
                      <div key={section.id} className="border border-border rounded-xl bg-card overflow-hidden">
                        <button
                          onClick={() => setExpandedSections({ ...expandedSections, [section.id]: !isExpanded })}
                          className="w-full flex items-center justify-between p-3.5 bg-muted/10 hover:bg-muted/20 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2.5 font-bold text-xs text-foreground">
                            {getSectionIcon(section.icon)}
                            <span>{section.title}</span>
                          </div>
                          <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                        </button>
                        
                        {isExpanded && (
                          <div className="p-4 pt-2 border-t border-border/50 bg-background/30 text-xs">
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                              {section.items.map((item, idx) => (
                                <li key={idx} className="hover:text-foreground transition-colors">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.success("Opening print dialog for Hostel Rules handbook...");
                    window.print();
                  }}
                  className="text-xs gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Rules
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={downloadingRulesPdf}
                  onClick={handleDownloadRulesPdf}
                  className="text-xs gap-1.5 font-medium"
                >
                  {downloadingRulesPdf ? (
                    <>
                      <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></span>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" /> Download Handbook (PDF)
                    </>
                  )}
                </Button>
              </div>
              <Button size="sm" onClick={() => setIsRulesModalOpen(false)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHostelModule;
