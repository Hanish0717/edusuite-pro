export interface SessionPlannerResource {
  title: string;
  type: "PPT" | "Lab Manual" | "Reference Book" | "Video" | "Question Bank" | "NPTEL Link";
  link: string;
}

export interface TeachingHourItem {
  hourNumber: number;
  unitNumber: number;
  unitTitle: string;
  topic: string;
  subtopics: string[];
  learningObjectives: string[];
  teachingMethod: "Lecture" | "Interactive PPT" | "Whiteboard & Problem Solving" | "Lab Demo" | "Group Discussion" | "Case Study";
  status: "Completed" | "In Progress" | "Upcoming";
  completionDate?: string;
  estimatedDate?: string;
  allocatedTime?: string;
  resources: SessionPlannerResource[];
}

export interface UnitBreakdownItem {
  unitNumber: number;
  title: string;
  allocatedHours: number;
  completedHours: number;
  remainingHours: number;
  progressPercentage: number;
}

export interface SessionPlannerOverview {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  department: string;
  semester: string;
  regulation: string;
  totalTeachingHours: number;
  completedHours: number;
  remainingHours: number;
  syllabusCompletionPercentage: number;
  estimatedCompletionDate: string;
  todaysPlannedTopic: {
    hourNumber: number;
    allocatedTime: string;
    topic: string;
    subtopics: string[];
    teachingMethod: string;
    resourcesRequired: string[];
    status: "Completed" | "In Progress" | "Upcoming";
  };
  nextTopic: {
    hourNumber: number;
    topic: string;
    estimatedDate: string;
  };
}

export interface SessionPlannerFullData {
  overview: SessionPlannerOverview;
  unitBreakdown: UnitBreakdownItem[];
  teachingHours: TeachingHourItem[];
  coveredTopics: {
    hourNumber: number;
    topic: string;
    completionDate: string;
    hoursUsed: number;
  }[];
  remainingTopics: {
    hourNumber: number;
    topic: string;
    estimatedDate: string;
    hoursRemaining: number;
  }[];
  timeline: {
    hourNumber: number;
    topic: string;
    status: "Completed" | "In Progress" | "Upcoming";
    date: string;
  }[];
  analytics: {
    totalHours: number;
    hoursCompleted: number;
    hoursRemaining: number;
    expectedProgress: number;
    actualProgress: number;
    unitCompletionRates: { unit: string; percentage: number }[];
  };
}

// Department-aware syllabus templates
const SYLLABUS_TEMPLATES: Record<string, { units: { title: string; hours: number; topics: { topic: string; subtopics: string[]; objectives: string[] }[] }[] }> = {
  "Operating Systems": {
    units: [
      {
        title: "Introduction to Operating Systems",
        hours: 10,
        topics: [
          { topic: "Introduction to Operating Systems", subtopics: ["OS Overview", "Historical Context", "System Goals"], objectives: ["What is an OS", "Types of OS", "Functions of OS"] },
          { topic: "Operating System Architecture", subtopics: ["Kernel Structure", "Monolithic vs Microkernel", "Layered Approach"], objectives: ["Monolithic Architecture", "Layered System", "Microkernel Design"] },
          { topic: "System Calls & Interface", subtopics: ["User Mode vs Kernel Mode", "Trap & Interrupt Handlers", "API vs System Calls"], objectives: ["Definition & Syntax", "POSIX Types", "Exec & Fork Examples"] },
          { topic: "Process Concept & Management", subtopics: ["PCB Structure", "Process States", "Context Switching"], objectives: ["PCB Fields", "State Diagrams", "Switch Overhead"] },
          { topic: "Operations on Processes", subtopics: ["Creation & Termination", "Process Trees", "Zombies & Orphans"], objectives: ["fork() & exec()", "wait() System Call", "Orphan Process Management"] }
        ]
      },
      {
        title: "Process Management & CPU Scheduling",
        hours: 12,
        topics: [
          { topic: "CPU Scheduling Fundamentals", subtopics: ["CPU-I/O Burst Cycles", "Scheduler Types", "Preemptive vs Non-Preemptive"], objectives: ["Short-term Scheduler", "Preemption Rules", "Burst Estimation"] },
          { topic: "Scheduling Algorithms - FCFS & SJF", subtopics: ["First Come First Served", "Shortest Job First", "SRTF Preemptive"], objectives: ["Gantt Chart Analysis", "Average Waiting Time", "Starvation Issues"] },
          { topic: "Priority & Round Robin Scheduling", subtopics: ["Time Quantum Selection", "Priority Inversion", "Multi-Level Queue"], objectives: ["Time Slicing Impact", "Response Time Limits", "Multi-Level Feedback"] },
          { topic: "Process Synchronization", subtopics: ["Critical Section Problem", "Peterson's Solution", "Hardware Locks"], objectives: ["Mutual Exclusion", "Progress Requirement", "Bounded Waiting"] },
          { topic: "Semaphores & Monitors", subtopics: ["Counting vs Binary Semaphores", "Wait & Signal Primitives", "Producer-Consumer Problem"], objectives: ["Semaphore Syntax", "Deadlock Risks", "Monitor Invariants"] }
        ]
      },
      {
        title: "Deadlocks & Memory Management",
        hours: 10,
        topics: [
          { topic: "Deadlock Characterization", subtopics: ["Resource Allocation Graphs", "Four Necessary Conditions"], objectives: ["Mutual Exclusion", "Hold and Wait", "No Preemption & Circular Wait"] },
          { topic: "Banker's Algorithm & Prevention", subtopics: ["Safe State Verification", "Resource-Request Protocol"], objectives: ["Safety Algorithm", "Resource Allocation Safety", "Prevention Techniques"] },
          { topic: "Contiguous Memory Allocation", subtopics: ["Fixed vs Dynamic Partitioning", "Fragmentation Issues"], objectives: ["First Fit", "Best Fit", "Worst Fit Performance"] },
          { topic: "Paging & Segmentation", subtopics: ["Page Table Architecture", "TLB Caching", "Segment Tables"], objectives: ["Address Translation", "TLB Hit Ratio", "Internal Fragmentation"] }
        ]
      },
      {
        title: "Virtual Memory Management",
        hours: 10,
        topics: [
          { topic: "Demand Paging & Page Faults", subtopics: ["Valid/Invalid Bits", "Page Fault Handling Sequence"], objectives: ["Lazy Swapping", "Page Fault Overhead", "Hardware Support"] },
          { topic: "Page Replacement Algorithms", subtopics: ["FIFO", "Optimal Page Replacement", "LRU & Approximation"], objectives: ["Belady's Anomaly", "LRU Implementation", "Clock Algorithm"] },
          { topic: "Allocation of Frames & Thrashing", subtopics: ["Equal vs Proportional", "Working Set Model", "Page Fault Frequency"], objectives: ["Thrashing Detection", "Working Set Window", "Local vs Global Allocation"] }
        ]
      },
      {
        title: "Storage & File Systems",
        hours: 8,
        topics: [
          { topic: "File System Structure & Mounting", subtopics: ["File Attributes", "Directory Hierarchy", "File Access Methods"], objectives: ["File Control Block (FCB)", "Directory Organization", "Mounting Semantics"] },
          { topic: "Disk Scheduling & RAID", subtopics: ["FCFS", "SSTF", "SCAN & C-SCAN Disk Scheduling", "RAID Levels 0-5"], objectives: ["Disk Latency", "Head Movement Optimization", "RAID Redundancy"] }
        ]
      }
    ]
  },
  "Thermodynamics": {
    units: [
      {
        title: "Basic Concepts & Zeroth Law",
        hours: 10,
        topics: [
          { topic: "Thermodynamic Systems & Control Volumes", subtopics: ["Open, Closed, Isolated Systems", "Properties & State"], objectives: ["Intensive vs Extensive", "State Postulate", "Quasi-equilibrium Process"] },
          { topic: "Zeroth Law & Temperature Scales", subtopics: ["Thermal Equilibrium", "Thermometric Properties"], objectives: ["Zeroth Law Significance", "Celsius vs Kelvin Scales", "Ideal Gas Scale"] },
          { topic: "Work & Heat Transfers", subtopics: ["Boundary Work", "Path Functions", "Sign Conventions"], objectives: ["pdV Work Calculations", "Specific Heat Capacities", "Transient Work"] }
        ]
      },
      {
        title: "First Law of Thermodynamics",
        hours: 12,
        topics: [
          { topic: "First Law for Closed Systems", subtopics: ["Internal Energy", "Cyclic Processes", "Joule's Experiment"], objectives: ["First Law Energy Balance", "Enthalpy Definition", "Property Tables"] },
          { topic: "Steady Flow Energy Equation (SFEE)", subtopics: ["Control Volume Analysis", "Nozzles, Turbines, Compressors"], objectives: ["SFEE Applications", "Mass Balance Equations", "Throttle Valves"] }
        ]
      },
      {
        title: "Second Law & Entropy",
        hours: 10,
        topics: [
          { topic: "Kelvin-Planck & Clausius Statements", subtopics: ["Thermal Reservoirs", "Heat Engines", "Refrigerators"], objectives: ["Thermal Efficiency", "COP of Refrigerators", "Equivalence Proofs"] },
          { topic: "Carnot Cycle & Entropy Principle", subtopics: ["Reversible Processes", "Carnot Principles", "Clausius Inequality"], objectives: ["Carnot Efficiency Limit", "Entropy Change Calculation", "T-s Diagrams"] }
        ]
      }
    ]
  },
  "Power Systems": {
    units: [
      {
        title: "Transmission Line Parameters",
        hours: 10,
        topics: [
          { topic: "Structure of Power Systems", subtopics: ["Generation, Transmission, Distribution", "Single-line Diagrams"], objectives: ["Voltage Levels", "Grid Interconnections", "Per-Unit Representation"] },
          { topic: "Inductance & Capacitance Calculations", subtopics: ["GMD & GMR Concepts", "Transposition of Lines"], objectives: ["3-phase Line Inductance", "Bundled Conductors", "Capacitance to Ground"] }
        ]
      },
      {
        title: "Performance of Transmission Lines",
        hours: 12,
        topics: [
          { topic: "Short & Medium Transmission Lines", subtopics: ["Nominal T & Pi Models", "ABCD Constants"], objectives: ["Voltage Regulation", "Transmission Efficiency", "Vector Diagrams"] },
          { topic: "Long Transmission Lines & Ferranti Effect", subtopics: ["Rigorous Solution", "Surge Impedance Loading"], objectives: ["Wave Propagation", "Ferranti Phenomenon", "Line Compensation"] }
        ]
      }
    ]
  }
};

// Generic fallback generator for any subject
function generateGenericUnits(subjectName: string) {
  return [
    {
      title: `Unit 1: Fundamentals of ${subjectName}`,
      hours: 10,
      topics: [
        { topic: `Introduction to ${subjectName}`, subtopics: ["Core Definitions", "Historical Evolution", "Industry Scope"], objectives: ["Basic Terminology", "Key Architecture", "Standard Conventions"] },
        { topic: `Foundational Principles & Theories`, subtopics: ["Primary Theorems", "Mathematical Formulations"], objectives: ["Theorem Derivations", "Basic Problem Solving", "Analytical Limits"] },
        { topic: `System Classification & Standards`, subtopics: ["Standard Categories", "Operational Modes"], objectives: ["Classification Schemes", "IEEE/ISO Guidelines", "Real-world Norms"] }
      ]
    },
    {
      title: `Unit 2: Core Analysis & Modeling`,
      hours: 12,
      topics: [
        { topic: `Analytical Methods & Equations`, subtopics: ["Mathematical Modeling", "State Equations"], objectives: ["System Response", "Parameter Estimation", "Simulink & CAD Tools"] },
        { topic: `Optimization & Performance Evaluation`, subtopics: ["Efficiency Metrics", "Error Limits"], objectives: ["Performance Bounds", "Optimization Rules", "Tradeoff Analysis"] }
      ]
    },
    {
      title: `Unit 3: Advanced Applications & Implementation`,
      hours: 10,
      topics: [
        { topic: `Advanced Synthesis & Design`, subtopics: ["Circuit/Logic Synthesis", "Case Studies"], objectives: ["System Synthesis", "Fault Tolerance", "Security & Safety"] },
        { topic: `Emerging Trends & Future Directions`, subtopics: ["Industry 4.0 Standards", "Research Frontiers"], objectives: ["AI/ML Integration", "Sustainable Practices", "Project Case Studies"] }
      ]
    }
  ];
}

/**
 * MOCK API: GET /faculty/subjects/{subjectId}/session-planner
 */
export async function fetchSessionPlannerData(
  subjectName: string,
  subjectCode: string,
  department: string,
  semester: string,
  regulation: string = "R22"
): Promise<SessionPlannerFullData> {
  // Artificial latency simulation
  await new Promise((res) => setTimeout(res, 250));

  const template = SYLLABUS_TEMPLATES[subjectName] || { units: generateGenericUnits(subjectName) };
  
  const unitBreakdown: UnitBreakdownItem[] = [];
  const teachingHours: TeachingHourItem[] = [];
  let globalHourCounter = 1;

  template.units.forEach((u, uIdx) => {
    const unitNum = uIdx + 1;
    let completedInUnit = 0;

    u.topics.forEach((t) => {
      // Allocate 2 hours per topic
      for (let h = 0; h < 2; h++) {
        const hourNum = globalHourCounter++;
        const isCompleted = hourNum <= 7;
        const isInProgress = hourNum === 8;
        const isUpcoming = hourNum > 8;

        if (isCompleted) completedInUnit++;

        teachingHours.push({
          hourNumber: hourNum,
          unitNumber: unitNum,
          unitTitle: u.title,
          topic: t.topic + (h > 0 ? " (Part 2)" : ""),
          subtopics: t.subtopics,
          learningObjectives: t.objectives,
          teachingMethod: h === 0 ? "Lecture" : "Interactive PPT",
          status: isCompleted ? "Completed" : isInProgress ? "In Progress" : "Upcoming",
          completionDate: isCompleted ? `2026-08-0${Math.min(9, hourNum)}` : undefined,
          estimatedDate: !isCompleted ? `2026-08-${10 + hourNum}` : undefined,
          allocatedTime: isInProgress ? "09:00–10:00 AM" : undefined,
          resources: [
            { title: `${t.topic} Lecture Deck.pptx`, type: "PPT", link: "#" },
            { title: `${subjectName} Lab Manual - Experiment ${hourNum}.pdf`, type: "Lab Manual", link: "#" },
            { title: `NPTEL Module on ${t.topic}`, type: "NPTEL Link", link: "#" },
            { title: `Standard Textbook Reference Ch. ${unitNum}`, type: "Reference Book", link: "#" }
          ]
        });
      }
    });

    unitBreakdown.push({
      unitNumber: unitNum,
      title: u.title,
      allocatedHours: u.hours,
      completedHours: Math.min(u.hours, completedInUnit),
      remainingHours: Math.max(0, u.hours - completedInUnit),
      progressPercentage: Math.round((Math.min(u.hours, completedInUnit) / u.hours) * 100)
    });
  });

  const totalHours = teachingHours.length;
  const completedHours = teachingHours.filter((h) => h.status === "Completed").length;
  const remainingHours = totalHours - completedHours;
  const completionPercentage = Math.round((completedHours / totalHours) * 100);

  const todaysHour = teachingHours.find((h) => h.status === "In Progress") || teachingHours[0];
  const nextHour = teachingHours.find((h) => h.status === "Upcoming") || teachingHours[teachingHours.length - 1];

  const coveredTopics = teachingHours
    .filter((h) => h.status === "Completed")
    .map((h) => ({
      hourNumber: h.hourNumber,
      topic: h.topic,
      completionDate: h.completionDate || "2026-08-01",
      hoursUsed: 1
    }));

  const remainingTopics = teachingHours
    .filter((h) => h.status === "Upcoming" || h.status === "In Progress")
    .map((h) => ({
      hourNumber: h.hourNumber,
      topic: h.topic,
      estimatedDate: h.estimatedDate || "2026-08-15",
      hoursRemaining: 1
    }));

  const timeline = teachingHours.map((h) => ({
    hourNumber: h.hourNumber,
    topic: h.topic,
    status: h.status,
    date: h.completionDate || h.estimatedDate || "2026-08-10"
  }));

  return {
    overview: {
      subjectId: `SUBJ-${subjectCode.toLowerCase()}`,
      subjectName,
      subjectCode,
      department,
      semester,
      regulation,
      totalTeachingHours: totalHours,
      completedHours,
      remainingHours,
      syllabusCompletionPercentage: completionPercentage,
      estimatedCompletionDate: "2026-09-30",
      todaysPlannedTopic: {
        hourNumber: todaysHour.hourNumber,
        allocatedTime: "09:00–10:00 AM",
        topic: todaysHour.topic,
        subtopics: todaysHour.subtopics,
        teachingMethod: todaysHour.teachingMethod,
        resourcesRequired: ["Interactive PPT", "Whiteboard", "Live Code Demo"],
        status: todaysHour.status
      },
      nextTopic: {
        hourNumber: nextHour.hourNumber,
        topic: nextHour.topic,
        estimatedDate: nextHour.estimatedDate || "2026-08-11"
      }
    },
    unitBreakdown,
    teachingHours,
    coveredTopics,
    remainingTopics,
    timeline,
    analytics: {
      totalHours,
      hoursCompleted: completedHours,
      hoursRemaining: remainingHours,
      expectedProgress: 35,
      actualProgress: completionPercentage,
      unitCompletionRates: unitBreakdown.map((u) => ({
        unit: `Unit ${u.unitNumber}`,
        percentage: u.progressPercentage
      }))
    }
  };
}
