export interface SectionInfo {
  sectionId: string; // e.g. "CSE-A"
  sectionName: string; // e.g. "CSE-A"
  department: string; // e.g. "Computer Science & Engineering"
  deptCode: string; // e.g. "CSE"
  semester: string; // e.g. "Semester 5"
  academicYear: string; // e.g. "2026-27"
  regulation: string; // e.g. "R22"
  strength: number; // e.g. 64
  classAdvisor: string; // e.g. "Dr. Rahul Kumar"
  room: string; // e.g. "A-302"
}

export interface SectionTimetableSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  timeSlot: string; // e.g. "09:00 - 10:00"
  subject: string;
  code: string;
  faculty: string;
  facultyEmail: string;
  facultyDesignation: string;
  facultyCabin: string;
  consultationHours: string;
  room: string;
  building: string;
  type: "Theory" | "Lab" | "Tutorial" | "Project" | "Seminar" | "Mentoring";
  credits: number;
  weeklyHours: number;
  unitInProgress: string;
  currentTopic: string;
  nextTopic: string;
  completionPercentage: number;
}

export interface SectionTimetableData {
  sectionInfo: SectionInfo;
  weeklyTimetable: SectionTimetableSlot[];
  summary: {
    totalSubjects: number;
    theoryClasses: number;
    labSessions: number;
    freePeriods: number;
    todaysClassesCount: number;
    upcomingClass: string;
  };
}

// ──────────────── MOCK GENERATOR DYNAMICALLY BY DEPT & SECTION ────────────────

export function fetchSectionTimetable(
  sectionId: string,
  deptCode: string = "CSE"
): SectionTimetableData {
  const isCSE = deptCode === "CSE";
  const isECE = deptCode === "ECE";
  const isEEE = deptCode === "EEE";
  const isME = deptCode === "ME";
  const isCivil = deptCode === "CIVIL" || deptCode === "Civil";
  const isMBA = deptCode === "MBA";

  const deptName = isCSE
    ? "Computer Science & Engineering"
    : isECE
    ? "Electronics & Communication Engineering"
    : isEEE
    ? "Electrical & Electronics Engineering"
    : isME
    ? "Mechanical Engineering"
    : isCivil
    ? "Civil Engineering"
    : isMBA
    ? "Master of Business Administration"
    : "Department of Mathematics";

  const subj1 = isCSE ? "Operating Systems" : isECE ? "Digital Electronics" : isEEE ? "Power Systems" : isME ? "Thermodynamics" : isCivil ? "Surveying" : isMBA ? "Organizational Behavior" : "Linear Algebra";
  const subj2 = isCSE ? "Database Management Systems" : isECE ? "Signals & Systems" : isEEE ? "Electrical Machines" : isME ? "CAD/CAM" : isCivil ? "Reinforced Concrete" : isMBA ? "Marketing Management" : "Differential Calculus";
  const subj3 = isCSE ? "Computer Networks" : isECE ? "Microcontrollers" : isEEE ? "Control Systems" : isME ? "Fluid Mechanics" : isCivil ? "Structural Analysis" : isMBA ? "Financial Accounting" : "Probability & Statistics";
  const subj4 = isCSE ? "Design & Analysis of Algorithms" : isECE ? "VLSI Design" : isEEE ? "Power Electronics" : isME ? "Kinematics of Machinery" : isCivil ? "Geotechnical Engineering" : isMBA ? "Human Resource Management" : "Discrete Mathematics";
  const subj5 = isCSE ? "Compiler Design" : isECE ? "Antennas & Wave Propagation" : isEEE ? "Renewable Energy" : isME ? "Manufacturing Technology" : isCivil ? "Transportation Engineering" : isMBA ? "Business Analytics" : "Numerical Methods";

  const fac1 = `Dr. A. Sharma (${deptCode})`;
  const fac2 = `Prof. M. Verma (${deptCode})`;
  const fac3 = `Dr. K. Patel (${deptCode})`;
  const fac4 = `Prof. S. Rao (${deptCode})`;
  const fac5 = `Dr. R. Kumar (${deptCode})`;

  const room = isCSE ? "A-302" : isME ? "B-204" : isCivil ? "C-105" : isECE ? "E-201" : "M-401";
  const advisor = isCSE ? "Dr. Rahul Kumar" : isME ? "Prof. V. K. Singh" : isCivil ? "Dr. P. S. Rao" : "Dr. N. Reddy";

  const days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday")[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timeSlots = [
    "09:00 - 10:00",
    "10:15 - 11:15",
    "11:30 - 12:30",
    "13:30 - 14:30",
    "14:30 - 15:30",
    "15:30 - 16:30",
  ];

  const slots: SectionTimetableSlot[] = [];

  days.forEach((day, dIdx) => {
    timeSlots.forEach((ts, tIdx) => {
      // Pick subject based on day and period
      let subject = subj1;
      let faculty = fac1;
      let type: "Theory" | "Lab" | "Tutorial" | "Project" | "Seminar" | "Mentoring" = "Theory";
      let unit = "Unit 2";
      let currentTopic = "Core Concept & Architectures";
      let nextTopic = "Advanced Applications & Scheduling";
      let compPct = 65;

      const pattern = (dIdx + tIdx) % 5;
      if (pattern === 0) {
        subject = subj1;
        faculty = fac1;
        type = tIdx > 3 ? "Lab" : "Theory";
        unit = "Unit 2";
        currentTopic = "Process Management & CPU Scheduling";
        nextTopic = "Synchronization Invariants";
        compPct = 72;
      } else if (pattern === 1) {
        subject = subj2;
        faculty = fac2;
        type = "Theory";
        unit = "Unit 3";
        currentTopic = "Relational Algebra & Normal Forms";
        nextTopic = "ACID Properties & Transactions";
        compPct = 58;
      } else if (pattern === 2) {
        subject = subj3;
        faculty = fac3;
        type = tIdx === 4 ? "Tutorial" : "Theory";
        unit = "Unit 1";
        currentTopic = "Network Topology & OSI Protocol Stacks";
        nextTopic = "TCP/IP Packet Routing";
        compPct = 84;
      } else if (pattern === 3) {
        subject = subj4;
        faculty = fac4;
        type = "Theory";
        unit = "Unit 4";
        currentTopic = "Dynamic Programming & Greedy Approximations";
        nextTopic = "NP-Completeness Invariants";
        compPct = 45;
      } else {
        subject = subj5;
        faculty = fac5;
        type = tIdx > 4 ? "Mentoring" : "Theory";
        unit = "Unit 2";
        currentTopic = "Syntax Analysis & LR Parsers";
        nextTopic = "Intermediate Code Generation";
        compPct = 60;
      }

      slots.push({
        id: `sec-${sectionId}-${day.slice(0, 3)}-${tIdx}`,
        day,
        timeSlot: ts,
        subject,
        code: subject.split(" ").map((w) => w[0]).join("").toUpperCase() + "30" + ((pattern % 5) + 1),
        faculty,
        facultyEmail: `${faculty.toLowerCase().replace(/[^a-z]/g, "")}@college.edu`,
        facultyDesignation: "Associate Professor",
        facultyCabin: `Faculty Wing ${room[0]}-40${(pattern % 3) + 1}`,
        consultationHours: "Tue & Thu 15:30 - 16:30",
        room: type === "Lab" ? `Lab-${room}` : room,
        building: `${deptCode} Academic Block`,
        type,
        credits: type === "Lab" ? 2 : 4,
        weeklyHours: type === "Lab" ? 4 : 3,
        unitInProgress: unit,
        currentTopic,
        nextTopic,
        completionPercentage: compPct,
      });
    });
  });

  return {
    sectionInfo: {
      sectionId,
      sectionName: sectionId,
      department: deptName,
      deptCode,
      semester: "Semester 5",
      academicYear: "2026–27",
      regulation: "R22",
      strength: 64,
      classAdvisor: advisor,
      room,
    },
    weeklyTimetable: slots,
    summary: {
      totalSubjects: 5,
      theoryClasses: 18,
      labSessions: 6,
      freePeriods: 4,
      todaysClassesCount: 4,
      upcomingClass: `${subj1} (${room}) at 09:00 AM`,
    },
  };
}
