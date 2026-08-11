import {
  CourseItem,
  MaterialItem,
  AssignmentItem,
  QuizItem,
  LiveClassItem,
  ForumPost,
  CertificateItem,
  LmsKpiMetrics,
} from "./types";

export const MOCK_LMS_KPIS: LmsKpiMetrics = {
  registeredCourses: 12,
  activeCourses: 6,
  completedCourses: 6,
  pendingAssignments: 3,
  upcomingQuizzes: 2,
  studyHours: 148,
  avgQuizScore: 88.5,
  learningProgressPct: 78,
};

export const MOCK_COURSES: CourseItem[] = [
  {
    id: "crs-1",
    code: "CS401",
    name: "Distributed Systems & Cloud Computing",
    faculty: "Dr. Ramesh Nair",
    facultyAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    credits: 4,
    semester: 7,
    status: "Active",
    completionPct: 82,
    nextClass: "Tomorrow at 09:00 AM (Room 302)",
    totalModules: 8,
    completedModules: 6,
    syllabusUrl: "#",
    description: "Fundamental concepts of distributed algorithms, consensus protocols (Raft/Paxos), fault tolerance, MapReduce, and cloud virtualization.",
  },
  {
    id: "crs-2",
    code: "CS402",
    name: "Cryptography & Network Security",
    faculty: "Prof. Sarah Paul",
    facultyAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    credits: 4,
    semester: 7,
    status: "Active",
    completionPct: 75,
    nextClass: "Today at 10:15 AM (Lab 4)",
    totalModules: 10,
    completedModules: 7,
    syllabusUrl: "#",
    description: "Symmetric and asymmetric encryption, AES, RSA, digital signatures, SSL/TLS protocols, zero-knowledge proofs, and network intrusion defense.",
  },
  {
    id: "crs-3",
    code: "CS403",
    name: "Theory of Computation & Automata",
    faculty: "Dr. Ravi Shankar",
    facultyAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    credits: 3,
    semester: 7,
    status: "Active",
    completionPct: 88,
    nextClass: "Today at 12:00 PM (Room 204)",
    totalModules: 6,
    completedModules: 5,
    syllabusUrl: "#",
    description: "Finite automata, regular expressions, context-free grammars, Turing machines, halting problem, and P vs NP complexity classes.",
  },
  {
    id: "crs-4",
    code: "CS404",
    name: "Digital Logic Design & Microprocessors",
    faculty: "Mrs. Priya Sen",
    facultyAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    credits: 4,
    semester: 7,
    status: "Active",
    completionPct: 68,
    nextClass: "Today at 02:00 PM (Hardware Lab 1)",
    totalModules: 8,
    completedModules: 5,
    syllabusUrl: "#",
    description: "Combinational and sequential circuits, 8086 microprocessors, assembly programming, FPGA architecture, and hardware description languages.",
  },
  {
    id: "crs-5",
    code: "CS405",
    name: "Machine Learning & Neural Networks",
    faculty: "Dr. Ananya Roy",
    facultyAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    credits: 4,
    semester: 7,
    status: "Active",
    completionPct: 90,
    nextClass: "Thursday at 11:00 AM (Seminar Hall 1)",
    totalModules: 10,
    completedModules: 9,
    syllabusUrl: "#",
    description: "Supervised and unsupervised learning, gradient descent, backpropagation, Convolutional Networks (CNN), Transformer models, and PyTorch frameworks.",
  },
  {
    id: "crs-6",
    code: "CS406",
    name: "DevOps & Cloud Native Architecture",
    faculty: "Prof. Vikram Malhotra",
    facultyAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    credits: 3,
    semester: 7,
    status: "Active",
    completionPct: 62,
    nextClass: "Friday at 03:00 PM (IT Lab 2)",
    totalModules: 6,
    completedModules: 3,
    syllabusUrl: "#",
    description: "Continuous Integration/Continuous Deployment (CI/CD), Docker containerization, Kubernetes cluster orchestration, Terraform infrastructure as code.",
  },
  {
    id: "crs-7",
    code: "CS301",
    name: "Database Management Systems",
    faculty: "Dr. K. S. Ramanujam",
    facultyAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    credits: 4,
    semester: 5,
    status: "Completed",
    completionPct: 100,
    nextClass: "Course Completed (Grade A+)",
    totalModules: 8,
    completedModules: 8,
    syllabusUrl: "#",
    description: "Relational algebra, SQL, B+ Trees, ACID transactions, 1NF-BCNF normalization, and NoSQL MongoDB fundamentals.",
  },
  {
    id: "crs-8",
    code: "CS302",
    name: "Operating Systems Principles",
    faculty: "Dr. Ramesh Nair",
    facultyAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    credits: 4,
    semester: 5,
    status: "Completed",
    completionPct: 100,
    nextClass: "Course Completed (Grade A)",
    totalModules: 8,
    completedModules: 8,
    syllabusUrl: "#",
    description: "Process scheduling, semaphores and mutexes, virtual memory paging, page replacement algorithms, File system internals.",
  },
  {
    id: "crs-9",
    code: "CS303",
    name: "Design & Analysis of Algorithms",
    faculty: "Prof. Sarah Paul",
    facultyAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    credits: 4,
    semester: 5,
    status: "Completed",
    completionPct: 100,
    nextClass: "Course Completed (Grade A+)",
    totalModules: 8,
    completedModules: 8,
    syllabusUrl: "#",
    description: "Divide & conquer, greedy strategy, dynamic programming, Dijkstra & Bellman-Ford, NP-Completeness proofs.",
  },
  {
    id: "crs-10",
    code: "CS201",
    name: "Data Structures & Algorithms",
    faculty: "Dr. Ananya Roy",
    facultyAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    credits: 4,
    semester: 3,
    status: "Completed",
    completionPct: 100,
    nextClass: "Course Completed (Grade O)",
    totalModules: 8,
    completedModules: 8,
    syllabusUrl: "#",
    description: "Arrays, Linked Lists, Stacks, Queues, Binary Search Trees, AVL Trees, Hash Tables, Graph traversals (BFS/DFS).",
  },
  {
    id: "crs-11",
    code: "CS202",
    name: "Computer Organization & Architecture",
    faculty: "Mrs. Priya Sen",
    facultyAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    credits: 4,
    semester: 3,
    status: "Completed",
    completionPct: 100,
    nextClass: "Course Completed (Grade A)",
    totalModules: 8,
    completedModules: 8,
    syllabusUrl: "#",
    description: "MIPS instruction set architecture, CPU datapath & control unit design, memory hierarchy, cache coherence, pipelined hazards.",
  },
  {
    id: "crs-12",
    code: "CS101",
    name: "Object Oriented Programming in C++",
    faculty: "Dr. Ravi Shankar",
    facultyAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    credits: 4,
    semester: 1,
    status: "Completed",
    completionPct: 100,
    nextClass: "Course Completed (Grade O)",
    totalModules: 8,
    completedModules: 8,
    syllabusUrl: "#",
    description: "Classes, inheritance, polymorphism, virtual functions, templates, STL containers, memory management with pointers.",
  },
];

// PROGRAMMATICALLY GENERATE 200 MATERIALS
const categoriesList: MaterialItem["category"][] = [
  "Lecture Notes",
  "PPTs",
  "PDFs",
  "Lab Manuals",
  "Reference Books",
  "Recorded Videos",
  "Code Files",
  "Previous Papers",
];

const courseCodes = ["CS401", "CS402", "CS403", "CS404", "CS405", "CS406"];
const facultyNames = ["Dr. Ramesh Nair", "Prof. Sarah Paul", "Dr. Ravi Shankar", "Mrs. Priya Sen", "Dr. Ananya Roy"];

export const MOCK_MATERIALS: MaterialItem[] = Array.from({ length: 200 }).map((_, idx) => {
  const cCode = courseCodes[idx % courseCodes.length];
  const category = categoriesList[idx % categoriesList.length];
  const faculty = facultyNames[idx % facultyNames.length];
  const day = (idx % 28) + 1;
  const month = idx % 2 === 0 ? "Jul" : "Aug";
  const sizeMb = ((idx % 15) + 1.2).toFixed(1);

  return {
    id: `mat-${idx + 1}`,
    title: `${cCode} ${category} - Module ${ (idx % 8) + 1 }: Advanced Topics & Solutions`,
    courseCode: cCode,
    category: category,
    faculty: faculty,
    uploadDate: `${month} ${day < 10 ? "0" + day : day}, 2026`,
    fileType: category === "PPTs" ? "PPTX" : category === "Code Files" ? "ZIP/CPP" : category === "Recorded Videos" ? "MP4" : "PDF",
    downloads: 140 + (idx * 7) % 500,
    size: `${sizeMb} MB`,
    isBookmarked: idx % 5 === 0,
    fileUrl: "#",
  };
});

// GENERATE 50 ASSIGNMENTS
export const MOCK_ASSIGNMENTS: AssignmentItem[] = Array.from({ length: 50 }).map((_, idx) => {
  const cCode = courseCodes[idx % courseCodes.length];
  const statuses: AssignmentItem["status"][] = ["Pending", "Submitted", "Graded", "Overdue", "In Review"];
  const status = idx < 3 ? "Pending" : statuses[idx % statuses.length];
  const submissionTypes: AssignmentItem["submissionType"][] = ["Online PDF", "Code File", "ZIP Archive", "Rich Text"];

  return {
    id: `asg-${idx + 1}`,
    courseCode: cCode,
    title: `${cCode} Problem Set ${ (idx % 5) + 1 }: ${
      idx % 3 === 0 ? "RPC Implementation & MapReduce" : idx % 3 === 1 ? "AES 256 Encryption & RSA Proofs" : "Grammar Normalization & Turing Simulator"
    }`,
    faculty: facultyNames[idx % facultyNames.length],
    assignedDate: `Jul ${10 + (idx % 15)}, 2026`,
    dueDate: `Aug ${ (idx % 12) + 4 }, 2026`,
    status: status,
    marks: status === "Graded" ? `${24 + (idx % 6)} / 30` : "- / 30",
    totalMarks: 30,
    submissionType: submissionTypes[idx % submissionTypes.length],
    isLateSubmissionAllowed: true,
    lateFeeDeduction: "10% mark deduction per 24 hours late.",
    instructions: "Complete all theoretical proofs and code scripts. Ensure code is well documented with comments and unit test cases.",
    submissionDate: status === "Submitted" || status === "Graded" ? `Aug 01, 2026 at 11:20 PM` : undefined,
    gradeFeedback: status === "Graded" ? "Excellent mathematical logic and robust unit test coverage. Good work!" : undefined,
  };
});

// GENERATE 30 QUIZZES
export const MOCK_QUIZZES: QuizItem[] = Array.from({ length: 30 }).map((_, idx) => {
  const cCode = courseCodes[idx % courseCodes.length];
  const statuses: QuizItem["status"][] = ["Available", "Attempted", "Passed", "Expired"];
  const status = idx < 2 ? "Available" : statuses[idx % statuses.length];

  return {
    id: `qz-${idx + 1}`,
    name: `${cCode} Quiz ${ (idx % 4) + 1 }: ${idx % 2 === 0 ? "Consensus Algorithms & Hash Functions" : "Context Free Grammars & FPGA Logic"}`,
    courseCode: cCode,
    faculty: facultyNames[idx % facultyNames.length],
    durationMins: 20,
    questionsCount: 10,
    totalMarks: 20,
    maxAttempts: 2,
    attemptsUsed: status === "Available" ? 0 : 1,
    deadline: `Aug ${ (idx % 10) + 5 }, 2026`,
    status: status,
    scoreObtained: status === "Passed" || status === "Attempted" ? 18 : undefined,
    questions: [
      {
        id: 1,
        question: "Which algorithm guarantee consensus in an asynchronous distributed system with crash faults?",
        options: ["Raft", "Paxos", "Two-Phase Commit", "Both Raft and Paxos"],
        correctAnswer: 3,
        explanation: "Both Raft and Paxos provide safety and liveness under asynchronous crash-stop failure assumptions.",
      },
      {
        id: 2,
        question: "What is the key size of standard AES (Advanced Encryption Standard)?",
        options: ["64 bits", "128, 192, or 256 bits", "512 bits", "1024 bits"],
        correctAnswer: 1,
        explanation: "AES supports symmetric key lengths of 128, 192, and 256 bits.",
      },
      {
        id: 3,
        question: "Which machine model accepts Context-Free Languages (CFL)?",
        options: ["Finite State Automata", "Pushdown Automata (PDA)", "Linear Bounded Automata", "Turing Machine"],
        correctAnswer: 1,
        explanation: "Pushdown Automata equipped with a stack accept context-free languages.",
      },
    ],
  };
});

// 15 LIVE CLASSES
export const MOCK_LIVE_CLASSES: LiveClassItem[] = Array.from({ length: 15 }).map((_, idx) => {
  const cCode = courseCodes[idx % courseCodes.length];
  const cItem = MOCK_COURSES.find((c) => c.code === cCode)!;
  const statuses: LiveClassItem["status"][] = ["Live Now", "Upcoming", "Completed"];
  const status = idx === 0 ? "Live Now" : idx < 6 ? "Upcoming" : "Completed";

  return {
    id: `live-${idx + 1}`,
    courseCode: cCode,
    courseName: cItem ? cItem.name : "Computer Science Lecture",
    faculty: facultyNames[idx % facultyNames.length],
    meetingTime: idx === 0 ? "NOW (10:15 AM - 11:45 AM)" : `Aug ${ (idx % 5) + 2 }, 2026 at 10:00 AM`,
    duration: "1 hour 30 mins",
    platform: idx % 2 === 0 ? "EduSuite Virtual Room" : "Google Meet",
    status: status,
    attendanceStatus: status === "Completed" ? "Present" : "Pending",
    joinUrl: "https://meet.edusuite.pro/live-room-" + (idx + 1),
    recordingUrl: status === "Completed" ? "#" : undefined,
    notesUrl: "#",
  };
});

// 100 DISCUSSION POSTS
export const MOCK_FORUM_POSTS: ForumPost[] = Array.from({ length: 100 }).map((_, idx) => {
  const cCode = courseCodes[idx % courseCodes.length];

  return {
    id: `post-${idx + 1}`,
    courseCode: cCode,
    author: idx % 3 === 0 ? "Dr. Ramesh Nair" : idx % 3 === 1 ? "Siddharth Rao" : "Aditya Verma",
    authorRole: idx % 3 === 0 ? "Faculty" : "Student",
    authorAvatar: idx % 3 === 0 ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    title: `Clarification on ${cCode} ${idx % 2 === 0 ? "Consensus Proofs & Vector Clocks" : "RSA Decryption Edge Cases"}`,
    content: "Could anyone explain how the leader election term increment in Raft avoids split-brain during network partition?",
    tags: [cCode, "Exam Query", "Lab Doubt", "Lecture 4"],
    upvotes: 12 + (idx * 3) % 40,
    isUpvoted: idx % 4 === 0,
    isPinned: idx < 3,
    hasFacultyReply: true,
    createdAt: `${ (idx % 5) + 1 } hours ago`,
    replies: [
      {
        id: `r-1`,
        author: "Dr. Ramesh Nair",
        authorRole: "Faculty",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        content: "In Raft, a candidate must receive votes from a strict majority (N/2 + 1) of nodes. Two majorities cannot exist in disjoint partitions simultaneously.",
        createdAt: "30 mins ago",
        upvotes: 18,
      },
    ],
  };
});

// 20 CERTIFICATES
export const MOCK_CERTIFICATES: CertificateItem[] = Array.from({ length: 20 }).map((_, idx) => {
  const types: CertificateItem["type"][] = [
    "Completed Course",
    "Workshop",
    "Internship",
    "Hackathon",
    "Skill Badge",
  ];
  const type = types[idx % types.length];

  return {
    id: `cert-${idx + 1}`,
    title: `${
      type === "Completed Course"
        ? "Advanced Algorithms & Data Structures Specialization"
        : type === "Workshop"
        ? "AWS Cloud Architecture & Kubernetes DevOps Workshop"
        : type === "Hackathon"
        ? "National Smart India AI Hackathon 2026 - First Runner Up"
        : "Full Stack Web Development & Microservices Certificate"
    }`,
    type: type,
    issuer: idx % 2 === 0 ? "EduSuite Academic Council" : "AWS & Microsoft Certification Guild",
    issueDate: `Jun ${ (idx % 20) + 1 }, 2026`,
    credentialId: `EDU-CERT-2026-984${idx}`,
    verifyQrUrl: "#",
    pdfUrl: "#",
    skills: ["Algorithms", "Cloud Architecture", "Distributed Systems", "Kubernetes"],
  };
});
