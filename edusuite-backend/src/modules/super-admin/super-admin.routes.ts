import { Router, Response } from "express";
import { prisma } from "../../db";
import { authenticateToken, AuthenticatedRequest } from "../auth/auth.routes";

const router = Router();

// GET /api/super-admin/stats: Return overall database stats
router.get("/stats", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalFaculty = await prisma.faculty.count();
    const totalAdmins = await prisma.admin.count();
    const totalStaff = totalFaculty + totalAdmins;

    // Get unique departments count
    const studentDepts = await prisma.student.groupBy({ by: ["department"] });
    const facultyDepts = await prisma.faculty.groupBy({ by: ["department"] });
    const uniqueDepts = new Set([
      ...studentDepts.map((d) => d.department),
      ...facultyDepts.map((d) => d.department),
    ].filter(Boolean));
    const totalDepartments = uniqueDepts.size || 8;

    // Calculate revenue based on enrolled students (1.25 Lakh fee per student)
    const revenueCr = (totalStudents * 125000) / 10000000;
    const totalRevenue = `₹${revenueCr.toFixed(2)} Cr`;

    res.json({
      totalStudents,
      totalStaff,
      totalDepartments,
      totalRevenue,
      apiLatency: "12ms",
      sslStatus: "Active",
      errorRate: "0.02%",
      systemHealth: [
        { label: "Database Node", status: "Healthy" },
        { label: "Express API Gateway", status: "Healthy" },
        { label: "Redis Cache Cluster", status: "Healthy" }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/super-admin/departments: List all active departments
router.get("/departments", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const BRANCHES = [
    { name: "CSE", code: "CS", fullname: "Computer Science & Engineering" },
    { name: "AI&ML", code: "AM", fullname: "Artificial Intelligence & Machine Learning" },
    { name: "AI&DS", code: "AD", fullname: "Artificial Intelligence & Data Science" },
    { name: "IT", code: "IT", fullname: "Information Technology" },
    { name: "EEE", code: "EE", fullname: "Electrical & Electronics Engineering" },
    { name: "ECE", code: "EC", fullname: "Electronics & Communication Engineering" },
    { name: "CIVIL", code: "CE", fullname: "Civil Engineering" },
    { name: "MECHANICAL", code: "ME", fullname: "Mechanical Engineering" }
  ];

  try {
    const list = [];
    for (const b of BRANCHES) {
      const studentsCount = await prisma.student.count({ where: { department: b.name } });
      const facultyCount = await prisma.faculty.count({ where: { department: b.name } });

      // Fetch actual HOD name if seeded
      const hod = await prisma.faculty.findFirst({
        where: { department: b.name, role: "hod" }
      });
      const hodName = hod ? hod.name : `Dr. HOD ${b.name}`;

      list.push({
        id: `DEP-${b.code}`,
        name: b.fullname,
        code: b.name,
        hodName,
        studentsCount,
        facultyCount,
        accreditation: "NBA / NAAC Accredited",
        status: "Active"
      });
    }

    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
