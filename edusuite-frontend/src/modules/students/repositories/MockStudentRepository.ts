import type { IStudentRepository } from "./StudentRepository";
import type { StudentRecord, StudentDocument, StudentTimelineEvent } from "../types";

const INITIAL_MOCK_STUDENTS: StudentRecord[] = [
  {
    id: "STU-1001",
    rollNo: "22CSE001",
    fullName: "Aarav Sharma",
    email: "aarav.sharma@college.edu",
    phone: "+91 9876543210",
    gender: "Male",
    department: "CSE",
    academicYear: "Year 3",
    semester: 6,
    batchCode: "2023-2027",
    section: "A",
    cgpa: 9.12,
    attendancePct: 94.5,
    feeStatus: "Paid",
    feeAmount: 85000,
    feePaid: 85000,
    guardianName: "Rajesh Sharma",
    guardianPhone: "+91 9876500001",
    enrollmentDate: "2023-08-10",
    status: "Active",
    hostelResident: true,
    hostelRoom: "Block A - Room 302",
    transportUser: false,
    placementEligible: true,
    placementStatus: "In-Progress",
    scholarshipStudent: false,
  },
  {
    id: "STU-1002",
    rollNo: "22ECE042",
    fullName: "Ananya Iyer",
    email: "ananya.iyer@college.edu",
    phone: "+91 9123456789",
    gender: "Female",
    department: "ECE",
    academicYear: "Year 3",
    semester: 6,
    batchCode: "2023-2027",
    section: "B",
    cgpa: 8.65,
    attendancePct: 89.2,
    feeStatus: "Paid",
    feeAmount: 85000,
    feePaid: 85000,
    guardianName: "Srinivasan Iyer",
    guardianPhone: "+91 9123400002",
    enrollmentDate: "2023-08-12",
    status: "Active",
    hostelResident: false,
    transportUser: true,
    transportRoute: "Route 12 - Route A",
    placementEligible: true,
    placementStatus: "Placed",
    scholarshipStudent: true,
  },
  {
    id: "STU-1003",
    rollNo: "23AIDS018",
    fullName: "Vikramaditya Rao",
    email: "vikram.rao@college.edu",
    phone: "+91 9988776655",
    gender: "Male",
    department: "AI&DS",
    academicYear: "Year 2",
    semester: 4,
    batchCode: "2024-2028",
    section: "A",
    cgpa: 8.90,
    attendancePct: 74.0,
    feeStatus: "Partial",
    feeAmount: 90000,
    feePaid: 45000,
    guardianName: "Murali Rao",
    guardianPhone: "+91 9988700003",
    enrollmentDate: "2024-08-14",
    status: "Risk",
    hostelResident: true,
    hostelRoom: "Block B - Room 104",
    transportUser: false,
    placementEligible: false,
    scholarshipStudent: false,
  },
  {
    id: "STU-1004",
    rollNo: "21ME075",
    fullName: "Karthik Verma",
    email: "karthik.v@college.edu",
    phone: "+91 9765432109",
    gender: "Male",
    department: "ME",
    academicYear: "Year 4",
    semester: 8,
    batchCode: "2022-2026",
    section: "C",
    cgpa: 7.85,
    attendancePct: 68.5,
    feeStatus: "Pending",
    feeAmount: 80000,
    feePaid: 0,
    guardianName: "Sunil Verma",
    guardianPhone: "+91 9765400004",
    enrollmentDate: "2022-08-01",
    status: "Risk",
    hostelResident: false,
    transportUser: true,
    transportRoute: "Route 3 - Route C",
    placementEligible: true,
    placementStatus: "Applied",
    scholarshipStudent: false,
  },
  {
    id: "STU-1005",
    rollNo: "24BIO009",
    fullName: "Diya Deshmukh",
    email: "diya.d@college.edu",
    phone: "+91 9848022334",
    gender: "Female",
    department: "Biotech",
    academicYear: "Year 1",
    semester: 2,
    batchCode: "2025-2029",
    section: "A",
    cgpa: 9.40,
    attendancePct: 96.8,
    feeStatus: "Paid",
    feeAmount: 75000,
    feePaid: 75000,
    guardianName: "Prakash Deshmukh",
    guardianPhone: "+91 9848000005",
    enrollmentDate: "2025-08-15",
    status: "Active",
    hostelResident: false,
    transportUser: false,
    placementEligible: false,
    scholarshipStudent: true,
  },
];

const INITIAL_MOCK_DOCUMENTS: Record<string, StudentDocument[]> = {
  "STU-1001": [
    { id: "DOC-1", name: "10th Marksheet", type: "Certificate", status: "Verified", uploadedAt: "2023-08-10", fileUrl: "#" },
    { id: "DOC-2", name: "12th Marksheet", type: "Certificate", status: "Verified", uploadedAt: "2023-08-10", fileUrl: "#" },
    { id: "DOC-3", name: "Aadhaar Card Copy", type: "Identity Proof", status: "Verified", uploadedAt: "2023-08-10", fileUrl: "#" },
  ],
  "STU-1002": [
    { id: "DOC-4", name: "10th Marksheet", type: "Certificate", status: "Verified", uploadedAt: "2023-08-12", fileUrl: "#" },
    { id: "DOC-5", name: "12th Marksheet", type: "Certificate", status: "Verified", uploadedAt: "2023-08-12", fileUrl: "#" },
  ],
};

const INITIAL_MOCK_TIMELINE: Record<string, StudentTimelineEvent[]> = {
  "STU-1001": [
    { id: "EVT-1", title: "Admission Registered", description: "Completed registration online", timestamp: "2023-08-10T10:00:00Z", type: "system", actor: "Admissions Desk" },
    { id: "EVT-2", title: "Tuition Fees Assigned", description: "Assigned annual fees of Rs 85,000", timestamp: "2023-08-10T11:00:00Z", type: "finance", actor: "Finance Office" },
    { id: "EVT-3", title: "LMS Activation", description: "ERP and LMS account activated", timestamp: "2023-08-10T14:30:00Z", type: "system", actor: "IT Admin" },
    { id: "EVT-4", title: "Hostel Allotted", description: "Allocated Room 302, Block A", timestamp: "2023-08-11T09:00:00Z", type: "hostel", actor: "Hostel Warden" },
    { id: "EVT-5", title: "Semester 5 Results Published", description: "GPA achieved: 9.12", timestamp: "2025-06-15T15:00:00Z", type: "academic", actor: "CoE Registry" },
  ],
  "STU-1002": [
    { id: "EVT-6", title: "Admission Registered", description: "Completed registration online", timestamp: "2023-08-12T10:00:00Z", type: "system", actor: "Admissions Desk" },
    { id: "EVT-7", title: "Scholarship Approved", description: "Approved merit-cum-means scholarship", timestamp: "2023-08-12T11:30:00Z", type: "finance", actor: "Principal Office" },
  ],
};

export class MockStudentRepository implements IStudentRepository {
  private students: StudentRecord[] = [...INITIAL_MOCK_STUDENTS];
  private documents: Record<string, StudentDocument[]> = { ...INITIAL_MOCK_DOCUMENTS };
  private timeline: Record<string, StudentTimelineEvent[]> = { ...INITIAL_MOCK_TIMELINE };

  async getAll(): Promise<StudentRecord[]> {
    return this.students;
  }

  async getById(id: string): Promise<StudentRecord | null> {
    const s = this.students.find((x) => x.id === id || x.rollNo === id);
    return s || null;
  }

  async create(student: Partial<StudentRecord>): Promise<StudentRecord> {
    const newStudent: StudentRecord = {
      id: `STU-${Math.floor(1006 + Math.random() * 900)}`,
      rollNo: student.rollNo || `24CSE${Math.floor(100 + Math.random() * 900)}`,
      fullName: student.fullName || "New Student",
      email: student.email || "student@college.edu",
      phone: student.phone || "+91 9000000000",
      gender: student.gender || "Male",
      department: student.department || "CSE",
      academicYear: student.academicYear || "Year 1",
      semester: student.semester || 1,
      batchCode: student.batchCode || "2024-2028",
      section: student.section || "A",
      cgpa: Number(student.cgpa) || 8.0,
      attendancePct: Number(student.attendancePct) || 90.0,
      feeStatus: student.feeStatus || "Paid",
      feeAmount: student.feeAmount || 85000,
      feePaid: student.feePaid || (student.feeStatus === "Paid" ? 85000 : student.feeStatus === "Partial" ? 40000 : 0),
      guardianName: student.guardianName || "Parent / Guardian",
      guardianPhone: student.guardianPhone || "+91 9000000001",
      enrollmentDate: student.enrollmentDate || new Date().toISOString().split("T")[0],
      status: student.status || "Active",
      hostelResident: student.hostelResident || false,
      transportUser: student.transportUser || false,
      placementEligible: student.placementEligible || false,
      scholarshipStudent: student.scholarshipStudent || false,
    };
    
    this.students.push(newStudent);
    this.documents[newStudent.id] = [
      { id: `DOC-${Math.floor(Math.random() * 1000)}`, name: "Admission Certificate", type: "Certificate", status: "Verified", uploadedAt: newStudent.enrollmentDate, fileUrl: "#" }
    ];
    this.timeline[newStudent.id] = [
      { id: `EVT-${Math.floor(Math.random() * 1000)}`, title: "ERP Record Generated", description: "Created registration record in ERP registry", timestamp: new Date().toISOString(), type: "system", actor: "IT Admin" }
    ];
    
    return newStudent;
  }

  async update(id: string, updates: Partial<StudentRecord>): Promise<StudentRecord> {
    const idx = this.students.findIndex((x) => x.id === id || x.rollNo === id);
    if (idx === -1) throw new Error("Student not found");
    
    const updated = { ...this.students[idx], ...updates } as StudentRecord;
    this.students[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const lengthBefore = this.students.length;
    this.students = this.students.filter((x) => x.id !== id && x.rollNo !== id);
    return this.students.length < lengthBefore;
  }

  async getDocuments(studentId: string): Promise<StudentDocument[]> {
    return this.documents[studentId] || [];
  }

  async uploadDocument(studentId: string, doc: Partial<StudentDocument>): Promise<StudentDocument> {
    if (!this.documents[studentId]) this.documents[studentId] = [];
    
    const newDoc: StudentDocument = {
      id: `DOC-${Math.floor(Math.random() * 1000)}`,
      name: doc.name || "Uploaded Document",
      type: doc.type || "Other",
      status: doc.status || "Pending",
      uploadedAt: new Date().toISOString().split("T")[0],
      fileUrl: doc.fileUrl || "#",
    };
    this.documents[studentId].push(newDoc);
    return newDoc;
  }

  async verifyDocument(studentId: string, docId: string, status: "Verified" | "Rejected"): Promise<boolean> {
    const docs = this.documents[studentId];
    if (!docs) return false;
    
    const doc = docs.find((x) => x.id === docId);
    if (!doc) return false;
    
    doc.status = status;
    return true;
  }

  async getTimeline(studentId: string): Promise<StudentTimelineEvent[]> {
    return this.timeline[studentId] || [];
  }

  async addTimelineEvent(studentId: string, event: Partial<StudentTimelineEvent>): Promise<StudentTimelineEvent> {
    if (!this.timeline[studentId]) this.timeline[studentId] = [];
    
    const newEvent: StudentTimelineEvent = {
      id: `EVT-${Math.floor(Math.random() * 1000)}`,
      title: event.title || "Lifecycle Update",
      description: event.description || "",
      timestamp: new Date().toISOString(),
      type: event.type || "system",
      actor: event.actor || "System Scheduler",
    };
    this.timeline[studentId].push(newEvent);
    return newEvent;
  }

  async search(params: any): Promise<any> {
    let result = [...this.students];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    if (params.filters) {
      Object.keys(params.filters).forEach((key) => {
        const val = params.filters?.[key];
        if (val !== undefined && val !== "") {
          result = result.filter((s) => String((s as any)[key]) === String(val));
        }
      });
    }

    if (params.sort) {
      const { field, order } = params.sort;
      result.sort((a, b) => {
        const valA = (a as any)[field];
        const valB = (b as any)[field];
        if (valA === undefined || valB === undefined) return 0;
        if (typeof valA === "number" && typeof valB === "number") {
          return order === "asc" ? valA - valB : valB - valA;
        }
        return order === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    const total = result.length;
    const page = params.pagination?.page || 1;
    const limit = params.pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
    };
  }

  async bulkAction(ids: string[], action: string, payload?: any): Promise<boolean> {
    if (action === "delete") {
      this.students = this.students.filter((x) => !ids.includes(x.id));
      return true;
    }
    if (action === "promote") {
      this.students = this.students.map((s) => {
        if (ids.includes(s.id)) {
          return {
            ...s,
            academicYear: payload?.academicYear || s.academicYear,
            semester: payload?.semester || s.semester,
          };
        }
        return s;
      });
      return true;
    }
    return false;
  }
}
