import { ErpUpdateItem } from "./types";

export const CURRENT_ERP_VERSION = "v4.8.2";
export const RELEASE_VERSION = "v4.8.2";

export const mockErpUpdates: ErpUpdateItem[] = [
  {
    id: "upd-001",
    version: "v4.8.2",
    title: "New AI Attendance Prediction Module",
    category: "New Feature",
    status: "Released",
    isRead: false,
    isPinned: true,
    publishedDate: "July 30, 2026",
    shortDescription: "Machine-learning powered attendance forecasting algorithm to notify students before eligibility drops below 75%.",
    fullDescription: "The new AI Attendance Prediction Module analyzes subject-by-subject attendance trends, timetable schedules, and historical leave patterns to forecast eligibility for mid-term and semester final examinations. Students receive proactive automated alerts when attendance risk increases.",
    featuresAdded: [
      "Real-time attendance percentage risk score calculation",
      "Automated low-attendance warnings sent via email & SMS",
      "Interactive subject-wise breakdown meter with required class simulator",
      "Counselor escalation workflow for high-risk students"
    ],
    attachmentName: "AI_Attendance_Prediction_Release_Notes.pdf",
    attachmentUrl: "#"
  },
  {
    id: "upd-002",
    version: "v4.8.0",
    title: "Online Fee Payment Gateway Upgraded",
    category: "Enhancement",
    status: "Released",
    isRead: false,
    isPinned: true,
    publishedDate: "July 25, 2026",
    shortDescription: "Integrated multi-bank UPI auto-reconciliation and instant receipt generation with 0% transaction failure fallback.",
    fullDescription: "Our student finance portal now features an upgraded payment engine supporting multi-bank UPI QR codes, net banking, debit/credit cards, and automated fee receipt generation with zero manual verification delay.",
    featuresAdded: [
      "Instant dynamic UPI QR code scanning for fee payment",
      "Auto-generated cryptographically signed PDF payment receipts",
      "Automatic refund trigger for failed banking gateway transactions",
      "Installment breakdown view in student finance dashboard"
    ],
    attachmentName: "Payment_Gateway_Upgrade_Guide.pdf",
    attachmentUrl: "#"
  },
  {
    id: "upd-003",
    version: "v4.7.9",
    title: "Exam Hall Ticket Generation Improved",
    category: "Bug Fix",
    status: "Released",
    isRead: true,
    publishedDate: "July 20, 2026",
    shortDescription: "Fixed seating allotment barcode layout rendering issues on Safari and iOS browsers.",
    fullDescription: "Resolved a layout glitch where hall ticket barcodes were clipping during PDF print preview on iOS Safari devices. Vector SVG barcode rendering has been implemented for crisp high-resolution printing.",
    featuresAdded: [
      "Cross-browser SVG vector barcode rendering",
      "One-click hall ticket download with candidate exam schedule",
      "Enhanced QR code verification seal for invigilators"
    ],
  },
  {
    id: "upd-004",
    version: "v4.7.5",
    title: "Hostel Management Module Released",
    category: "New Feature",
    status: "Released",
    isRead: false,
    isPinned: true,
    publishedDate: "July 15, 2026",
    shortDescription: "Full student hostel portal with room allotment, digital QR gate pass generation, mess menu feedback, and maintenance ticket tracking.",
    fullDescription: "Students can now view room profile details, roommate contacts, mess timings, weekly menus, request digital QR gate passes, lodge room maintenance complaints, and pay annual hostel dues seamlessly.",
    featuresAdded: [
      "Digital QR Gate Pass generator with parent SMS approval",
      "Roommate profiles & room inventory inspection sheet",
      "Central Mess weekly menu viewer & meal rating feedback",
      "Emergency SOS alert trigger connected to Hostel Warden Desk"
    ],
    attachmentName: "Hostel_Module_Student_Guide.pdf",
    attachmentUrl: "#"
  },
  {
    id: "upd-005",
    version: "v4.7.0",
    title: "Student Dashboard Redesigned",
    category: "Enhancement",
    status: "Released",
    isRead: true,
    publishedDate: "July 10, 2026",
    shortDescription: "Sleeker, faster dashboard with dark mode micro-animations, customizable quick action tiles, and real-time announcement widget.",
    fullDescription: "The student dashboard has been upgraded to a modern CampX-inspired glassmorphic aesthetic. Key metrics like active CGPA, attendance summary, current LMS progress, and pending fee alerts are visible at a glance.",
    featuresAdded: [
      "Customizable quick action shortcut bar",
      "Dark mode visual polish and soft ambient glows",
      "Integrated Live Class join button & schedule countdown"
    ],
  },
  {
    id: "upd-006",
    version: "v4.6.8",
    title: "Placement Portal Integration",
    category: "New Feature",
    status: "Released",
    isRead: true,
    publishedDate: "July 05, 2026",
    shortDescription: "Seamless placement drive applications, recruiter scheduling, assessment tracking, and instant job offer letter downloads.",
    fullDescription: "The new Placement & Career Services module enables eligible students to browse upcoming campus drives, submit applications, take online assessment tests, and track interview stages.",
    featuresAdded: [
      "One-click campus drive application process",
      "Recruiter interview schedule calendar integration",
      "Official Offer Letter repository with digital signature verification"
    ],
  },
  {
    id: "upd-007",
    version: "v4.6.5",
    title: "ERP Maintenance Completed Successfully",
    category: "Maintenance",
    status: "Completed",
    isRead: true,
    publishedDate: "June 28, 2026",
    shortDescription: "Scheduled database indexing and cloud server infrastructure expansion to support peak exam result concurrency.",
    fullDescription: "Our technical operations team completed scheduled cloud infrastructure upgrades, database query optimization, and load balancer scaling to ensure 99.99% uptime during semester result publications.",
    featuresAdded: [
      "3x faster page load times across all modules",
      "Zero-downtime database indexing",
      "Enhanced DDoS protection and edge CDN caching"
    ],
  },
  {
    id: "upd-008",
    version: "v4.6.0",
    title: "Digital ID Card QR Verification Added",
    category: "Security",
    status: "Released",
    isRead: true,
    publishedDate: "June 24, 2026",
    shortDescription: "Cryptographically signed QR codes added to student digital identity cards for secure campus entry scanning.",
    fullDescription: "Digital Student ID Cards now contain cryptographically signed dynamic QR codes that can be scanned by campus security guards, library turnstiles, and exam hall invigilators for instantaneous verification.",
    featuresAdded: [
      "Offline RSA signature verification for security scanners",
      "Dynamic anti-spoofing timestamp watermark",
      "Instant ID card download for mobile wallet storage"
    ],
    attachmentName: "Digital_ID_Verification_Security.pdf",
    attachmentUrl: "#"
  },
];

export const upcomingFeaturesList = [
  { name: "AI Timetable Auto-Scheduler v5.0", targetDate: "Q3 2026" },
  { name: "Mobile App Push Notifications", targetDate: "Aug 2026" },
  { name: "Alumni Network & Career Mentorship", targetDate: "Sept 2026" },
];
