import { NoticeItem, DeadlineItem, HolidayItem } from "./types";

export const SAMPLE_INITIAL_NOTICES: NoticeItem[] = [
  {
    id: "not-001",
    title: "Semester V Class Timetable Published",
    shortDescription: "Revised class schedule for B.Tech Semester V students effective from next Monday. All students are advised to check lab batch allocations.",
    fullNotice: "This is to inform all B.Tech Semester V students that the final class timetable for the autumn session has been published. The schedule incorporates updated lab slot allocations and elective sessions. Attendance is mandatory from day one. Any clashes or requests for batch swaps must be submitted through the Department HOD office before 5:00 PM tomorrow.",
    category: "Academics",
    priority: "High",
    department: "CSE Department",
    issuedBy: "Dr. A. K. Sharma (HOD CSE)",
    publishedDate: "Today",
    expiryDate: "2026-08-15",
    read: false,
    bookmarked: true,
    pinned: true,
    attachments: [
      { id: "att-1", name: "CSE_Sem5_Timetable_Final.pdf", type: "pdf", size: "1.4 MB", url: "#" },
      { id: "att-2", name: "Lab_Batch_Allocation.pdf", type: "pdf", size: "850 KB", url: "#" }
    ],
    relatedLinks: [
      { title: "Academic Portal Schedule", url: "#" }
    ]
  },
  {
    id: "not-002",
    title: "Mid Semester Examination Schedule Released",
    shortDescription: "Official schedule for Mid Semester Examinations for all UG and PG batches. Hall tickets will be issued 3 days prior.",
    fullNotice: "The Controller of Examinations has officially released the timetable for Mid Semester Examinations. Examinations will be conducted in two shifts daily (9:30 AM to 11:30 AM and 2:00 PM to 4:00 PM). Students must carry valid physical ID cards and printed hall tickets into the examination halls. Mobile phones and electronic gadgets are strictly prohibited.",
    category: "Examinations",
    priority: "Urgent",
    department: "Controller of Examinations",
    issuedBy: "Prof. R. V. Ramanathan",
    publishedDate: "Yesterday",
    expiryDate: "2026-08-25",
    read: false,
    bookmarked: false,
    pinned: true,
    attachments: [
      { id: "att-3", name: "Mid_Sem_Exam_Schedule_Autumn2026.pdf", type: "pdf", size: "2.1 MB", url: "#" }
    ]
  },
  {
    id: "not-003",
    title: "TCS & Google Cloud Placement Drive 2026 — Online Assessment Live!",
    shortDescription: "Official campus recruitment online assessment for final year B.Tech students. Read all instructions carefully before starting the exam.",
    fullNotice: `OFFICIAL TPO ANNOUNCEMENT & EXAMINATION BRIEFING:

📌 WHAT IS THIS EXAM?
This is the official proctored online screening assessment for the TCS Ninja/Digital & Google Cloud Campus Recruitment Drive 2026, authorized by the Training & Placement Cell (TPO).

🎯 WHY IS IT CONDUCTED?
This placement assessment evaluates eligible candidates for Software Development Engineer (SDE-1), Cloud Systems Engineer, and Digital profiles across participating corporate recruiters.

📚 WHAT DOES THE EXAM COVER?
- Section 1: Technical & Aptitude MCQs (20 Questions - 20 Marks)
- Section 2: Live Coding & System Challenges (2 Problems - 50 Marks)

⚠️ IMPORTANT EXAM INSTRUCTIONS & RULES TO FOLLOW:
1. Duration: 90 Minutes continuous timed session once started.
2. Verification: Authenticate using your official college email ID (e.g. 23341a4229@college.edu.in) and Roll/Hall Ticket number.
3. Proctoring: AI WebCam & Tab-switch monitoring is active throughout the exam.
4. Malpractice Policy: Switching tabs or leaving full-screen mode more than 3 times will trigger auto-flagging to the TPO.
5. Submission: Click 'Submit Exam' upon completing all sections to log your verified score to the TPO HR portal.`,
    category: "Placements",
    priority: "Urgent",
    department: "Training & Placement Cell",
    issuedBy: "Mr. Suresh Kumar (Chief Placement Officer - TPO)",
    publishedDate: "Today",
    expiryDate: "2026-08-10",
    read: false,
    bookmarked: true,
    pinned: true,
    attachments: [
      { id: "att-4", name: "TPO_Placement_Exam_Guidelines_2026.pdf", type: "pdf", size: "1.1 MB", url: "#" }
    ],
    relatedLinks: [
      { title: "Direct Placement Exam Link (/exam/take)", url: "/exam/take?id=AST-GGL-01" }
    ]
  },

  {
    id: "not-004",
    title: "State Merit Scholarship Renewal Notification",
    shortDescription: "Applications invited for renewal of State Merit Scholarship for Academic Year 2026-27. Income certificates required.",
    fullNotice: "All existing beneficiaries of the State Merit Scholarship scheme are informed that the portal for scholarship renewal is now open. Students must upload certified income certificates issued after April 1, 2026, fee receipts, and previous semester marksheets. Hard copies must be submitted to the Scholarship Cell Window No. 4.",
    category: "Scholarships",
    priority: "High",
    department: "Scholarship Cell",
    issuedBy: "Scholarship Admin Desk",
    publishedDate: "3 days ago",
    expiryDate: "2026-08-20",
    read: false,
    bookmarked: false,
    pinned: false,
    attachments: [
      { id: "att-5", name: "Scholarship_Renewal_Form.pdf", type: "pdf", size: "620 KB", url: "#" }
    ]
  },
  {
    id: "not-005",
    title: "Digital Library Access Updated",
    shortDescription: "IEEE, ScienceDirect, and ACM Digital Library subscriptions renewed for 2026. Off-campus VPN access available.",
    fullNotice: "The Central Library has renewed institutional subscriptions for IEEE Xplore, ScienceDirect, SpringerLink, and ACM Digital Library. Students can access premium research journals and e-books both on campus and via remote VPN access. Login credentials have been dispatched to student official email addresses.",
    category: "Library",
    priority: "Normal",
    department: "Central Library",
    issuedBy: "Dr. Sunita Rao (Chief Librarian)",
    publishedDate: "Today",
    expiryDate: "2026-12-31",
    read: true,
    bookmarked: false,
    pinned: false,
    attachments: [
      { id: "att-6", name: "Library_Remote_Access_Guide.pdf", type: "pdf", size: "1.8 MB", url: "#" }
    ]
  },
  {
    id: "not-006",
    title: "Hostel Fee Payment Deadline",
    shortDescription: "Final call for hostel and mess fee payment for the upcoming semester. Late fine applicable after due date.",
    fullNotice: "All resident students residing in Boys and Girls hostels are instructed to clear their hostel room rent and mess advance for the odd semester. Payments must be processed through the online student ERP payment gateway. Failure to pay by the deadline will attract a late fine of ₹100 per day.",
    category: "Hostel",
    priority: "High",
    department: "Hostel Office",
    issuedBy: "Chief Warden Office",
    publishedDate: "Yesterday",
    expiryDate: "2026-08-12",
    read: false,
    bookmarked: false,
    pinned: false,
    attachments: [
      { id: "att-7", name: "Hostel_Fee_Structure_2026.pdf", type: "pdf", size: "450 KB", url: "#" }
    ]
  },
  {
    id: "not-007",
    title: "Bus Route Changes from Monday",
    shortDescription: "Route No. 4 and Route No. 11 modified due to highway flyover construction. Revised timings announced.",
    fullNotice: "Due to ongoing municipal flyover construction near City Square, college bus Route 4 (North Zone) and Route 11 (East Ring Road) have been rerouted. Buses will board 10 minutes earlier than normal schedule at designated pickup points. Transport passes must be presented to the bus marshal upon boarding.",
    category: "Transport",
    priority: "Normal",
    department: "Transport Office",
    issuedBy: "Mr. G. K. Menon (Transport Manager)",
    publishedDate: "Today",
    expiryDate: "2026-09-01",
    read: true,
    bookmarked: false,
    pinned: false,
    attachments: [
      { id: "att-8", name: "Revised_Bus_Routes_Schedule.pdf", type: "pdf", size: "980 KB", url: "#" }
    ]
  },
  {
    id: "not-008",
    title: "Annual Technical Fest Registration Started",
    shortDescription: "InnovateX 2026 annual tech fest registrations open! Hackathons, robotics, coding challenges & prizes worth ₹5 Lakhs.",
    fullNotice: "Student Affairs & Tech Club are excited to announce InnovateX 2026 - National Level Technical Festival. Events include 24-hour Hackathon, RoboWars, Paper Presentation, Bug Hunt, and AI Project Expo. Registration is free for internal college students. Grand prizes and trophies will be awarded during the valedictory ceremony.",
    category: "Events",
    priority: "High",
    department: "Student Affairs",
    issuedBy: "Dean Student Welfare",
    publishedDate: "Today",
    expiryDate: "2026-08-30",
    read: false,
    bookmarked: true,
    pinned: true,
    attachments: [
      { id: "att-9", name: "InnovateX_Brochure.pdf", type: "pdf", size: "3.5 MB", url: "#" },
      { id: "att-10", name: "Event_Rulebook.pdf", type: "pdf", size: "1.2 MB", url: "#" }
    ]
  }
];

const DEPARTMENTS = [
  "CSE Department",
  "ECE Department",
  "EEE Department",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "AI & Data Science",
  "Cyber Security",
  "Controller of Examinations",
  "Training & Placement Cell",
  "Scholarship Cell",
  "Central Library",
  "Hostel Office",
  "Transport Office",
  "Student Affairs",
  "Sports Board",
  "Finance Office",
  "Academic Council",
  "Research & Development",
  "Dean Office"
];

const CATEGORIES: NoticeItem["category"][] = [
  "Academics",
  "Examinations",
  "Placements",
  "Scholarships",
  "Events",
  "Hostel",
  "Transport",
  "Library"
];

const PRIORITIES: NoticeItem["priority"][] = ["Urgent", "High", "Normal", "Low"];

// Generate ~100 realistic notices
export function generateMockNotices(): NoticeItem[] {
  const notices: NoticeItem[] = [...SAMPLE_INITIAL_NOTICES];

  const templates = [
    { title: "Special Tutorial Classes for Mathematics III", cat: "Academics", dept: "Academic Council" },
    { title: "NPTEL Online Course Credit Transfer Guidelines", cat: "Academics", dept: "CSE Department" },
    { title: "Practical Lab Examination Re-evaluation Results", cat: "Examinations", dept: "Controller of Examinations" },
    { title: "Infosys Placement Registration and Mock Test", cat: "Placements", dept: "Training & Placement Cell" },
    { title: "Post Metric Scholarship Disbursement Update", cat: "Scholarships", dept: "Scholarship Cell" },
    { title: "Book Renewal and Overnight Circulation Rules", cat: "Library", dept: "Central Library" },
    { title: "Night Out Pass Application Process Revised", cat: "Hostel", dept: "Hostel Office" },
    { title: "College Bus Fee Receipt Verification", cat: "Transport", dept: "Transport Office" },
    { title: "Inter-College Sports Championship Trials", cat: "Events", dept: "Sports Board" },
    { title: "Minor Project Submission Deadline Extended", cat: "Academics", dept: "ECE Department" },
    { title: "Elective Course Opting Window for Next Semester", cat: "Academics", dept: "Information Technology" },
    { title: "Supplementary Examination Fee Notification", cat: "Examinations", dept: "Controller of Examinations" },
    { title: "Amazon Web Services Workshop & Certification", cat: "Events", dept: "AI & Data Science" },
    { title: "Cognizant GenC Placement Assessment Date", cat: "Placements", dept: "Training & Placement Cell" },
    { title: "National Level Hackathon Team Formation Call", cat: "Events", dept: "Cyber Security" },
    { title: "Hostel Mess Menu Feedback Form Open", cat: "Hostel", dept: "Hostel Office" },
    { title: "Campus Network & Wi-Fi Maintenance Schedule", cat: "Academics", dept: "Research & Development" },
    { title: "Fee Receipt Collection Window Hours", cat: "Finance", dept: "Finance Office" }
  ];

  for (let i = 9; i <= 100; i++) {
    const tmpl = templates[i % templates.length];
    const category = (tmpl.cat as NoticeItem["category"]) || CATEGORIES[i % CATEGORIES.length];
    const department = DEPARTMENTS[i % DEPARTMENTS.length];
    const priority = PRIORITIES[i % PRIORITIES.length];
    const isRead = i % 3 !== 0;
    const isBookmarked = i % 7 === 0;
    const isPinned = i <= 12;

    const daysAgo = Math.floor(i / 4);
    const dateStr = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

    notices.push({
      id: `not-${String(i).padStart(3, "0")}`,
      title: `${tmpl.title} #${i}`,
      shortDescription: `Official notice regarding ${tmpl.title.toLowerCase()} issued for registered students of ${department}. Please review complete details and deadlines.`,
      fullNotice: `Notice #${i}: All concerned students of ${department} are hereby informed about ${tmpl.title.toLowerCase()}. The administration requires all eligible candidates to read the guidelines carefully, adhere to stated timelines, and submit necessary forms before the closing date. Contact your respective department coordinator for any clarification.`,
      category,
      priority,
      department,
      issuedBy: `Admin Desk (${department})`,
      publishedDate: dateStr,
      expiryDate: "2026-09-30",
      read: isRead,
      bookmarked: isBookmarked,
      pinned: isPinned,
      attachments: i % 2 === 0 ? [
        { id: `att-${i}-1`, name: `${category}_Guidelines_Doc.pdf`, type: "pdf", size: "1.2 MB", url: "#" }
      ] : undefined
    });
  }

  return notices;
}

export const SIDEBAR_DEADLINES: DeadlineItem[] = [
  { id: "d1", title: "Mid-Sem Exam Registration", date: "Aug 10, 2026", category: "Examinations", urgent: true },
  { id: "d2", title: "TCS Placement Portal Form", date: "Aug 12, 2026", category: "Placements", urgent: true },
  { id: "d3", title: "Hostel Fee Clearance", date: "Aug 15, 2026", category: "Hostel", urgent: false },
  { id: "d4", title: "Scholarship Renewal Submit", date: "Aug 20, 2026", category: "Scholarships", urgent: false }
];

export const SIDEBAR_HOLIDAYS: HolidayItem[] = [
  { id: "h1", title: "Independence Day", date: "Aug 15, 2026", day: "Saturday" },
  { id: "h2", title: "Ganesh Chaturthi", date: "Aug 27, 2026", day: "Thursday" },
  { id: "h3", title: "Teachers' Day Break", date: "Sep 05, 2026", day: "Saturday" },
  { id: "h4", title: "Gandhi Jayanti", date: "Oct 02, 2026", day: "Friday" }
];
