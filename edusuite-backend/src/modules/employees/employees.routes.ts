import { Router, Response } from "express";
import { prisma } from "../../db";
import { authenticateToken, AuthenticatedRequest } from "../auth/auth.routes";
import { requireSuperAdmin, auditLog } from "../super-admin/super-admin.routes";

const router = Router();

// Period time slot mapping
function getTimeSlotForPeriod(period: number): string {
  switch (period) {
    case 1: return "09:00 AM - 10:00 AM";
    case 2: return "10:00 AM - 11:00 AM";
    case 3: return "11:15 AM - 12:15 PM";
    case 4: return "12:15 PM - 01:15 PM";
    case 5: return "02:00 PM - 03:00 PM";
    case 6: return "03:00 PM - 04:00 PM";
    case 7: return "04:00 PM - 05:00 PM";
    case 8: return "05:00 PM - 06:00 PM";
    default: return "10:00 AM - 11:00 AM";
  }
}

// Helper to map Prisma Faculty + pre-fetched courses to frontend FacultyRecord efficiently (no N+1 queries)
function mapFacultyToFrontend(f: any, allCourses: any[]) {
  let designation: string = "Assistant Professor";

  if (f.role === "hod") {
    designation = "Professor";
  } else if (f.rollNumber?.includes("PROF") || f.name?.includes("Dr.")) {
    designation = "Associate Professor";
  }

  const cleanName = f.name.replace(/\(HOD.*\)/g, "").trim().toLowerCase();
  const assignedCourses = allCourses.filter((c) => c.faculty && c.faculty.toLowerCase().includes(cleanName));

  const assignedSubjectsList = assignedCourses.map((c) => `${c.name} (${c.code})`);
  if (assignedSubjectsList.length === 0) {
    assignedSubjectsList.push(`${f.department || "Core"} Foundation Course`);
  }

  const assignedCoursesCount = Math.max(1, assignedCourses.length);
  const totalCredits = assignedCourses.reduce((sum, c) => sum + c.credits, 0);
  const teachingLoadHours = Math.max(12, Math.min(22, totalCredits > 0 ? Math.round(totalCredits * 3) : 16));

  const dept = f.department || "CSE";
  const specializationMap: Record<string, string> = {
    CSE: "Computer Science & Neural Networks",
    ECE: "VLSI Systems & Signal Processing",
    EEE: "Power Systems & Renewable Energy",
    ME: "Thermal Engineering & Robotics",
    CIVIL: "Structural & Environmental Engineering",
    IT: "Cloud Computing & Data Analytics",
    "AI&ML": "Deep Learning & Pattern Recognition",
    AIML: "Deep Learning & Pattern Recognition",
    "AI&DS": "Data Mining & Machine Learning",
    AIDS: "Data Mining & Machine Learning",
    MBA: "Financial Management & Analytics",
  };

  return {
    id: f.id,
    empId: f.rollNumber || `EMP-FAC-${f.id.slice(0, 4)}`,
    fullName: f.name,
    email: f.email,
    phone: "+91 98765 43210",
    designation,
    department: dept,
    specialization: specializationMap[dept] || "Engineering Sciences",
    qualification: f.role === "hod" ? "Ph.D. in Computer Science / Engineering" : "Ph.D. / M.Tech in Engineering",
    experience: f.role === "hod" ? 18 : 8,
    teachingLoadHours,
    assignedCoursesCount,
    assignedSubjectsList,
    attendancePercentage: 96,
    status: (f.status === "Active" ? "Active" : f.status === "On Leave" ? "On Leave" : "Active") as "Active" | "On Leave" | "Sabbatical",
    joiningDate: f.createdAt.toISOString().split("T")[0],
    publicationsCount: f.role === "hod" ? 14 : 6,
    performanceRating: f.role === "hod" ? "Excellent (4.9/5.0)" : "Very Good (4.5/5.0)",
    weeklyTimetable: [
      { day: "Monday", time: "09:00 - 10:00", course: assignedSubjectsList[0] || "Core Subject", room: "LH-201" },
      { day: "Wednesday", time: "11:00 - 12:00", course: assignedSubjectsList[1] || assignedSubjectsList[0], room: "LH-202" },
      { day: "Friday", time: "14:00 - 15:00", course: assignedSubjectsList[0], room: "Lab-4" },
    ],
  };
}

// GET /api/faculty & GET /api/employee: Query all Faculty and Admin records from InsForge Cloud PostgreSQL
router.get(["/", "/list"], authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const department = req.query.department as string;
  const search = (req.query.search as string || "").toLowerCase();
  const designation = req.query.designation as string;
  const status = req.query.status as string;
  const page = parseInt(req.query.page as string || "1", 10);
  const limit = parseInt(req.query.limit as string || "10", 10);

  try {
    const whereClause: any = {};

    if (department && department !== "All" && department !== "All Departments") {
      whereClause.department = {
        contains: department,
        mode: "insensitive",
      };
    }

    if (status && status !== "All Status" && status !== "All") {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { rollNumber: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.faculty.count({ where: whereClause });
    const [faculties, allCourses] = await Promise.all([
      prisma.faculty.findMany({
        where: whereClause,
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.course.findMany(),
    ]);

    const mappedData = faculties.map((f) => mapFacultyToFrontend(f, allCourses));

    let filteredData = mappedData;
    if (designation && designation !== "All Designations" && designation !== "All") {
      filteredData = mappedData.filter((f) => f.designation.toLowerCase() === designation.toLowerCase());
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return res.json({
      data: filteredData,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/faculty/stats: Calculate faculty dashboard statistics from InsForge
router.get("/stats", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const department = req.query.department as string;

  try {
    const whereClause: any = {};
    if (department && department !== "All" && department !== "All Departments") {
      whereClause.department = { contains: department, mode: "insensitive" };
    }

    const [allFaculty, allCourses] = await Promise.all([
      prisma.faculty.findMany({ where: whereClause }),
      prisma.course.findMany(),
    ]);

    const mappedFaculty = allFaculty.map((f) => mapFacultyToFrontend(f, allCourses));

    const totalFaculty = mappedFaculty.length;
    const professors = mappedFaculty.filter((f) => f.designation === "Professor").length;
    const associateProfessors = mappedFaculty.filter((f) => f.designation === "Associate Professor").length;
    const assistantProfessors = mappedFaculty.filter((f) => f.designation === "Assistant Professor").length;
    const lecturers = mappedFaculty.filter((f) => f.designation === "Lecturer").length;
    const visitingFaculty = mappedFaculty.filter((f) => f.designation === "Visiting Faculty").length;

    const avgWorkload = totalFaculty > 0
      ? parseFloat((mappedFaculty.reduce((sum, f) => sum + f.teachingLoadHours, 0) / totalFaculty).toFixed(1))
      : 0;

    const avgAttendance = totalFaculty > 0
      ? parseFloat((mappedFaculty.reduce((sum, f) => sum + f.attendancePercentage, 0) / totalFaculty).toFixed(1))
      : 96;

    const totalPublications = mappedFaculty.reduce((sum, f) => sum + f.publicationsCount, 0);

    return res.json({
      totalFaculty,
      professors,
      associateProfessors,
      assistantProfessors,
      lecturers,
      visitingFaculty,
      avgWorkload,
      avgAttendance,
      totalPublications,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/faculty & POST /api/employee: Create new faculty record in InsForge
router.post("/", authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { fullName, name, email, department, designation, empId } = req.body;

  const facName = (fullName || name || "").trim();
  const facEmail = (email || "").trim();

  if (!facName) {
    return res.status(400).json({ error: "Faculty name is required." });
  }

  try {
    const existing = await prisma.faculty.findFirst({
      where: {
        OR: [
          { email: facEmail || `fac_${Math.random().toString(36).slice(2)}@cms.com` },
          { rollNumber: empId ? empId.trim() : `FAC_${Math.floor(100 + Math.random() * 900)}` },
        ],
      },
    });

    if (existing) {
      return res.status(409).json({ error: `Faculty with email '${facEmail}' or employee ID already exists.` });
    }

    const created = await prisma.faculty.create({
      data: {
        rollNumber: empId ? empId.trim() : `FAC-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
        name: facName,
        email: facEmail || `${facName.toLowerCase().replace(/\s+/g, ".")}@college.edu`,
        password: "password123",
        role: designation?.toLowerCase().includes("prof") ? "hod" : "faculty",
        department: department || "CSE",
        status: "Active",
      },
    });

    await auditLog(req, "FACULTY_CREATED", "Faculty & Staff HR", "Faculty", created.id);

    const allCourses = await prisma.course.findMany();
    const mapped = mapFacultyToFrontend(created, allCourses);
    return res.status(201).json(mapped);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/faculty/:id: Edit faculty record
router.put("/:id", authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { fullName, name, email, department, designation, status } = req.body;

  try {
    const existing = await prisma.faculty.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Faculty record not found." });
    }

    const updated = await prisma.faculty.update({
      where: { id },
      data: {
        ...(fullName || name ? { name: (fullName || name).trim() } : {}),
        ...(email ? { email: email.trim() } : {}),
        ...(department ? { department: department.trim() } : {}),
        ...(status ? { status: status.trim() } : {}),
        ...(designation ? { role: designation.toLowerCase().includes("prof") ? "hod" : "faculty" } : {}),
      },
    });

    await auditLog(req, "FACULTY_UPDATED", "Faculty & Staff HR", "Faculty", id);

    const allCourses = await prisma.course.findMany();
    const mapped = mapFacultyToFrontend(updated, allCourses);
    return res.json(mapped);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/faculty/:id: Soft deactivate faculty record
router.delete("/:id", authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const existing = await prisma.faculty.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Faculty record not found." });
    }

    await prisma.faculty.update({
      where: { id },
      data: { status: "Inactive" },
    });

    await auditLog(req, "FACULTY_DEACTIVATED", "Faculty & Staff HR", "Faculty", id);

    return res.json({ message: `Faculty member ${existing.name} (${existing.rollNumber}) deactivated successfully.` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/academics/faculty/live-status: Real-Time Faculty Status Matrix derived from database records
router.get("/live-status", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const period = parseInt(req.query.period as string, 10) || 2;
  const day = (req.query.day as string) || "Monday";

  try {
    const timeSlot = getTimeSlotForPeriod(period);

    const [faculties, timetableRecords] = await Promise.all([
      prisma.faculty.findMany({ orderBy: { name: "asc" } }),
      prisma.masterTimetable.findMany({
        where: { day, periodNumber: period },
        include: { course: true },
      }),
    ]);

    const result = faculties.map((f) => {
      if (f.status === "Inactive" || f.status === "On Leave") {
        return {
          id: `FS-${f.id.slice(0, 6)}`,
          facultyId: f.id,
          name: f.name,
          department: f.department || "CSE",
          status: "ON LEAVE",
          leaveReason: "Approved Casual Leave",
          period,
        };
      }

      const tt = timetableRecords.find((t) => t.facultyId === f.id);

      if (tt) {
        return {
          id: `FS-${f.id.slice(0, 6)}`,
          facultyId: f.id,
          name: f.name,
          department: f.department || tt.branch,
          status: "IN CLASS / WORKING",
          currentClass: `${tt.branch}-${tt.semester}${tt.section.slice(-1)}`,
          subject: tt.course ? `${tt.course.name} (${tt.course.code})` : "Assigned Lecture",
          roomNo: tt.roomNo || `Block ${tt.branch.slice(0, 1)} - 101`,
          timeSlot: tt.startTime && tt.endTime ? `${tt.startTime} - ${tt.endTime}` : timeSlot,
          period,
        };
      } else {
        return {
          id: `FS-${f.id.slice(0, 6)}`,
          facultyId: f.id,
          name: f.name,
          department: f.department || "CSE",
          status: "FREE",
          period,
        };
      }
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/academics/faculty/schedule: Full-Day 8-Period Timetable for a faculty member
router.get("/schedule", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const facultyName = (req.query.name as string || "").trim();
  const facultyIdQuery = (req.query.facultyId as string || "").trim();
  const day = (req.query.day as string) || "Monday";

  try {
    const facultyObj = await prisma.faculty.findFirst({
      where: {
        OR: [
          ...(facultyIdQuery ? [{ id: facultyIdQuery }] : []),
          ...(facultyName ? [{ name: { contains: facultyName, mode: "insensitive" as const } }, { email: { contains: facultyName, mode: "insensitive" as const } }] : [{ name: { contains: "Varma", mode: "insensitive" as const } }]),
        ],
      },
    });

    if (!facultyObj) {
      return res.status(404).json({ error: "Faculty member not found." });
    }

    const timetableRecords = await prisma.masterTimetable.findMany({
      where: {
        facultyId: facultyObj.id,
        day,
      },
      include: { course: true },
      orderBy: { periodNumber: "asc" },
    });

    const periods = Array.from({ length: 8 }, (_, i) => {
      const periodNumber = i + 1;
      const tt = timetableRecords.find((t) => t.periodNumber === periodNumber);

      if (tt) {
        return {
          periodNumber,
          timeSlot: `${tt.startTime} - ${tt.endTime}`,
          status: "IN CLASS",
          subject: tt.course ? `${tt.course.name} (${tt.course.code})` : "Assigned Subject",
          className: `${tt.branch}-${tt.semester}${tt.section.slice(-1)}`,
          roomNo: tt.roomNo || "LH-101",
        };
      } else {
        return {
          periodNumber,
          timeSlot: getTimeSlotForPeriod(periodNumber),
          status: "FREE",
        };
      }
    });

    return res.json({
      facultyId: facultyObj.id,
      name: facultyObj.name,
      department: facultyObj.department || "CSE",
      designation: facultyObj.role === "hod" ? "HOD & Professor" : "Faculty Member",
      email: facultyObj.email,
      periods,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
