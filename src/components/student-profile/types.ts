export interface StudentProfileData {
  id: string;
  rollNumber: string;
  registrationNumber: string;
  admissionNumber: string;
  name: string;
  avatarUrl: string;
  initials: string;
  department: string;
  departmentCode: string;
  program: string;
  degree: string;
  branch: string;
  section: string;
  currentSemester: number;
  totalSemesters: number;
  batch: string;
  academicYear: string;
  admissionType: string;
  status: "Active" | "Inactive" | "Suspended" | "Graduated" | "Alumni";
  enrollmentNumber: string;
  cgpa: number;
  maxCgpa: number;
  rank: number;
  totalStudentsInBatch: number;
  attendancePercentage: number;
  feeStatus: "Paid" | "Partial" | "Overdue" | "Exempted";
  feePendingAmount: number;
  libraryBooksIssued: number;
  libraryOverdueCount: number;
  scholarshipName: string;
  scholarshipAmount: number;
  activeBacklogs: number;
  creditsEarned: number;
  totalRequiredCredits: number;
  academicAdvisor: {
    name: string;
    designation: string;
    email: string;
    phone: string;
    avatar: string;
  };
  
  // Personal Details
  personal: {
    gender: string;
    dob: string;
    bloodGroup: string;
    nationality: string;
    religion: string;
    category: string;
    phone: string;
    email: string;
    aadharNumber: string;
    passportNumber: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
    languages: string[];
    maritalStatus: string;
  };

  // Parents / Guardian
  parent: {
    father: {
      name: string;
      occupation: string;
      annualIncome: string;
      phone: string;
      email: string;
      photo?: string;
    };
    mother: {
      name: string;
      occupation: string;
      annualIncome: string;
      phone: string;
      email: string;
      photo?: string;
    };
    guardian?: {
      name: string;
      relationship: string;
      phone: string;
      email: string;
      address: string;
    };
  };

  // Address
  address: {
    permanent: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    current: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    googleMaps: {
      latitude: number;
      longitude: number;
      embedUrl: string;
    };
  };

  // Current Subjects
  currentSubjects: Array<{
    code: string;
    name: string;
    type: "Theory" | "Lab" | "Elective" | "Project";
    credits: number;
    faculty: string;
    attendance: number;
    grade?: string;
  }>;

  // Semester Marks History
  semesterResults: Array<{
    semester: number;
    sgpa: number;
    cgpa: number;
    creditsAttempted: number;
    creditsEarned: number;
    status: "Pass" | "Fail";
    monthYear: string;
  }>;

  // Documents
  documents: Array<{
    id: string;
    title: string;
    category: string;
    fileName: string;
    fileSize: string;
    uploadDate: string;
    status: "Verified" | "Pending" | "Rejected";
    fileUrl: string;
    version: string;
  }>;

  // Medical Records
  medical: {
    bloodGroup: string;
    allergies: string[];
    medicalConditions: string[];
    insurancePolicyNumber: string;
    insuranceProvider: string;
    validTill: string;
    campusDoctorName: string;
    campusDoctorPhone: string;
    disabilityDetails: string;
    vaccinations: Array<{
      name: string;
      date: string;
      status: "Completed" | "Pending";
    }>;
  };

  // Achievements
  achievements: Array<{
    id: string;
    title: string;
    category: "Sports" | "Hackathons" | "Competitions" | "Certifications" | "Awards" | "Internships" | "Research Papers" | "Placement Offers";
    issuedBy: string;
    date: string;
    description: string;
    certificateUrl?: string;
    badgeColor?: string;
  }>;

  // Disciplinary Records
  disciplinary: Array<{
    id: string;
    date: string;
    type: "Warning" | "Suspension" | "Remark" | "Positive Behaviour" | "Counselling";
    title: string;
    description: string;
    actionTaken: string;
    status: "Active" | "Resolved" | "Commended";
    issuedBy: string;
  }>;

  // Attendance Summary
  attendanceSummary: {
    overallPercentage: number;
    monthly: Array<{ month: string; percentage: number; present: number; total: number }>;
    subjectWise: Array<{ code: string; subject: string; attended: number; total: number; percentage: number; status: "Normal" | "Warning" }>;
    leaves: Array<{ id: string; type: string; startDate: string; endDate: string; days: number; reason: string; status: "Approved" | "Pending" | "Rejected" }>;
    heatmap: Array<{ date: string; status: "P" | "A" | "L" | "H" }>;
  };

  // Fees Summary
  feesSummary: {
    totalFee: number;
    paidFee: number;
    pendingFee: number;
    scholarshipConcession: number;
    installments: Array<{
      installmentNo: number;
      title: string;
      dueDate: string;
      amount: number;
      status: "Paid" | "Pending" | "Overdue";
    }>;
    transactions: Array<{
      receiptNo: string;
      date: string;
      mode: string;
      amount: number;
      description: string;
      status: "Successful" | "Pending" | "Failed";
    }>;
  };

  // Library Summary
  librarySummary: {
    booksIssuedCount: number;
    dueBooksCount: number;
    totalFine: number;
    digitalUsageHours: number;
    issuedBooks: Array<{
      id: string;
      title: string;
      author: string;
      isbn: string;
      issueDate: string;
      dueDate: string;
      renewCount: number;
      fine: number;
    }>;
    reservations: Array<{ title: string; reservedDate: string; queuePosition: number }>;
  };

  // Hostel Details
  hostel: {
    block: string;
    roomNo: string;
    floor: string;
    roomType: string;
    messName: string;
    messPlan: string;
    wardenName: string;
    wardenPhone: string;
    outingPasses: Array<{
      id: string;
      destination: string;
      outTime: string;
      expectedInTime: string;
      status: "Approved" | "Pending" | "Used";
    }>;
  };

  // Transport Details
  transport: {
    busNumber: string;
    routeName: string;
    driverName: string;
    driverPhone: string;
    pickupPoint: string;
    dropPoint: string;
    pickupTime: string;
    passValidity: string;
    routeStops: Array<{ stopName: string; time: string; passed: boolean }>;
    currentBusLocation?: { lat: number; lng: number; speed: string; nextStop: string; etaMinutes: number };
  };

  // ERP Timeline
  timeline: Array<{
    id: string;
    date: string;
    title: string;
    category: "Admission" | "Fee Payments" | "Semester Promotion" | "Exam Results" | "Library Activity" | "Certificates" | "Achievements" | "Placement" | "Graduation";
    description: string;
    icon: string;
  }>;

  // Settings
  settings: {
    profileVisibility: "Public" | "Internal" | "Private";
    emailNotifications: boolean;
    smsAlerts: boolean;
    twoFactorEnabled: boolean;
    language: string;
    theme: "light" | "dark" | "system";
    activeSessions: Array<{
      device: string;
      ip: string;
      location: string;
      lastActive: string;
      current: boolean;
    }>;
  };
}
