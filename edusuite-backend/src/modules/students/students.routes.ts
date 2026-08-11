import { Router, Response } from "express";
import { prisma } from "../../db";
import { authenticateToken, AuthenticatedRequest } from "../auth/auth.routes";

const router = Router();

// GET /api/students: List students dynamically with pagination, search, and department filters
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const department = req.query.department as string;
  const search = (req.query.search as string || "").toLowerCase();
  const semesterStr = req.query.semester as string;
  const section = req.query.section as string;
  const page = parseInt(req.query.page as string || "1", 10);
  const limit = parseInt(req.query.limit as string || "10", 10);

  try {
    const whereClause: any = {};

    // 1. Filter by Department
    if (department && department !== "All" && department !== "All Departments") {
      whereClause.department = department;
    }

    // 2. Filter by Semester
    if (semesterStr && semesterStr !== "All" && semesterStr !== "All Semesters") {
      // Extract numeric value from "Semester X" or "X"
      const match = semesterStr.match(/\d+/);
      if (match) {
        whereClause.semester = parseInt(match[0], 10);
      }
    }

    // 3. Filter by Section
    if (section && section !== "All" && section !== "All Sections") {
      whereClause.section = section;
    }

    // 4. Apply Search query (matching name, email, or rollNumber)
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { rollNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    // Query database with pagination and parent details
    const totalCount = await prisma.student.count({ where: whereClause });
    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        parent: true,
      },
      orderBy: { rollNumber: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Map database student objects to frontend StudentRecord structure
    const mappedStudents = students.map((s) => {
      const year = s.year || Math.ceil((s.semester || 1) / 2);
      const startYear = 2026 - (4 - year);
      const batchCode = `${startYear}-${startYear + 4}`;

      return {
        id: s.id,
        rollNo: s.rollNumber,
        fullName: s.name,
        email: s.email,
        phone: "+91 9876543210",
        department: s.department || "CSE",
        academicYear: `Year ${year} (Sem ${s.semester})`,
        batchCode,
        cgpa: s.cgpa || 8.5,
        attendancePct: 92.4, // Default placeholder for display
        feeStatus: "Paid" as const,
        guardianName: s.parent ? s.parent.name.replace(" (Parent)", "") : "Guardian Name",
        guardianPhone: "+91 9876500001",
        enrollmentDate: s.createdAt.toISOString().split("T")[0],
        semester: `Semester ${s.semester}`,
        section: s.section || "A",
        creditsEarned: s.creditsEarned || 0,
        status: "Active" as const,
      };
    });

    res.json({
      students: mappedStudents,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/students: Create new student record
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { rollNo, fullName, email, department, semester, section, cgpa } = req.body;

  try {
    const student = await prisma.student.create({
      data: {
        rollNumber: rollNo || `26CS${Math.floor(100 + Math.random() * 900)}`,
        name: fullName || "New Student",
        email: email || `student-${Math.random().toString(36).substring(7)}@cms.com`,
        password: "password123", // default password
        department: department || "CSE",
        semester: parseInt(semester, 10) || 1,
        section: section || "A",
        cgpa: parseFloat(cgpa) || 8.5,
        creditsEarned: 0,
      },
    });

    res.status(201).json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
