import { Router, Response } from "express";
import { prisma } from "../../db";
import { authenticateToken, AuthenticatedRequest } from "../auth/auth.routes";

const router = Router();

// GET /api/academics/departments: List dynamic academic departments details
router.get("/departments", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const BRANCHES = [
    { name: "CSE", code: "CS", fullname: "Computer Science & Engineering", established: "2002", labs: 12, acc: "NBA & NAAC A+" },
    { name: "AI&ML", code: "AM", fullname: "Artificial Intelligence & Machine Learning", established: "2020", labs: 8, acc: "NAAC A+" },
    { name: "AI&DS", code: "AD", fullname: "Artificial Intelligence & Data Science", established: "2021", labs: 8, acc: "NAAC A+" },
    { name: "IT", code: "IT", fullname: "Information Technology", established: "2005", labs: 10, acc: "NBA Accredited" },
    { name: "EEE", code: "EE", fullname: "Electrical & Electronics Engineering", established: "2003", labs: 10, acc: "NAAC A+" },
    { name: "ECE", code: "EC", fullname: "Electronics & Communication Engineering", established: "2002", labs: 10, acc: "NBA Accredited" },
    { name: "CIVIL", code: "CE", fullname: "Civil Engineering", established: "2004", labs: 8, acc: "NAAC A+" },
    { name: "MECHANICAL", code: "ME", fullname: "Mechanical Engineering", established: "2002", labs: 10, acc: "NBA Accredited" }
  ];

  try {
    const list = [];
    for (const b of BRANCHES) {
      const studentsCount = await prisma.student.count({ where: { department: b.name } });
      const facultyCount = await prisma.faculty.count({ where: { department: b.name } });

      const hod = await prisma.faculty.findFirst({
        where: { department: b.name, role: "hod" }
      });
      const hodName = hod ? hod.name : `Dr. HOD ${b.name}`;

      list.push({
        id: `DEP-${b.code}`,
        code: b.name,
        name: `${b.fullname} (${b.name})`,
        hodName,
        facultyCount,
        studentCapacity: studentsCount || 60,
        laboratoriesCount: b.labs,
        accreditation: b.acc,
        establishedYear: b.established
      });
    }

    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/academic/subjects: List dynamic course catalog from Course table
router.get("/subjects", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const department = req.query.department as string;
  const semesterStr = req.query.semester as string;
  const search = (req.query.search as string || "").toLowerCase();

  try {
    const whereClause: any = {};

    // Map department code to course code prefix prefix
    if (department && department !== "All" && department !== "All Departments") {
      let codePrefix = "";
      if (department === "CSE") codePrefix = "CS";
      else if (department === "AI&ML") codePrefix = "AM";
      else if (department === "AI&DS") codePrefix = "AD";
      else if (department === "IT") codePrefix = "IT";
      else if (department === "EEE") codePrefix = "EE";
      else if (department === "ECE") codePrefix = "EC";
      else if (department === "CIVIL") codePrefix = "CE";
      else if (department === "MECHANICAL") codePrefix = "ME";

      if (codePrefix) {
        whereClause.code = { startsWith: codePrefix };
      }
    }

    if (semesterStr && semesterStr !== "All" && semesterStr !== "All Semesters") {
      const match = semesterStr.match(/\d+/);
      if (match) {
        whereClause.semester = parseInt(match[0], 10);
      }
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { faculty: { contains: search, mode: "insensitive" } }
      ];
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      orderBy: { code: "asc" }
    });

    const mapped = courses.map((c) => {
      // Map code prefix back to department name
      let deptName = "CSE";
      if (c.code.startsWith("CS")) deptName = "CSE";
      else if (c.code.startsWith("AM")) deptName = "AI&ML";
      else if (c.code.startsWith("AD")) deptName = "AI&DS";
      else if (c.code.startsWith("IT")) deptName = "IT";
      else if (c.code.startsWith("EE")) deptName = "EEE";
      else if (c.code.startsWith("EC")) deptName = "ECE";
      else if (c.code.startsWith("CE")) deptName = "CIVIL";
      else if (c.code.startsWith("ME")) deptName = "MECHANICAL";

      return {
        id: c.id,
        code: c.code,
        name: c.name,
        department: deptName,
        semester: `Semester ${c.semester}`,
        credits: c.credits,
        type: c.category === "Lab" ? "Lab Practical" : "Core Theory",
        instructor: c.faculty,
        regulations: "R24 Regulation",
        prerequisite: "None",
        syllabusOverview: "Core course module, laboratories, and evaluation schemes.",
        theoryHours: c.category === "Lab" ? 0 : 3,
        practicalHours: c.category === "Lab" ? 3 : 0,
        status: "Active"
      };
    });

    res.json(mapped);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/academic/curriculum: List curriculum schemes
router.get("/curriculum", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const department = req.query.department as string;

  try {
    const schemes = [
      { id: "CURR-R24-CSE", regulationCode: "R24 Regulation", programName: "B.Tech Computer Science & Engineering", effectiveBatch: "2026-2030", totalCredits: 160, coreTheoryCredits: 80, labCredits: 32, electiveCredits: 28, projectCredits: 20, status: "Active", dept: "CSE" },
      { id: "CURR-R24-AIML", regulationCode: "R24 Regulation", programName: "B.Tech Artificial Intelligence & ML", effectiveBatch: "2026-2030", totalCredits: 160, coreTheoryCredits: 80, labCredits: 32, electiveCredits: 28, projectCredits: 20, status: "Active", dept: "AI&ML" },
      { id: "CURR-R24-AIDS", regulationCode: "R24 Regulation", programName: "B.Tech Artificial Intelligence & DS", effectiveBatch: "2026-2030", totalCredits: 160, coreTheoryCredits: 80, labCredits: 32, electiveCredits: 28, projectCredits: 20, status: "Active", dept: "AI&DS" },
      { id: "CURR-R24-IT", regulationCode: "R24 Regulation", programName: "B.Tech Information Technology", effectiveBatch: "2026-2030", totalCredits: 160, coreTheoryCredits: 80, labCredits: 32, electiveCredits: 28, projectCredits: 20, status: "Active", dept: "IT" },
      { id: "CURR-R24-EEE", regulationCode: "R24 Regulation", programName: "B.Tech Electrical & Electronics Eng.", effectiveBatch: "2026-2030", totalCredits: 160, coreTheoryCredits: 80, labCredits: 32, electiveCredits: 28, projectCredits: 20, status: "Active", dept: "EEE" },
      { id: "CURR-R24-ECE", regulationCode: "R24 Regulation", programName: "B.Tech Electronics & Comm. Eng.", effectiveBatch: "2026-2030", totalCredits: 160, coreTheoryCredits: 80, labCredits: 32, electiveCredits: 28, projectCredits: 20, status: "Active", dept: "ECE" },
      { id: "CURR-R24-CIV", regulationCode: "R24 Regulation", programName: "B.Tech Civil Engineering", effectiveBatch: "2026-2030", totalCredits: 160, coreTheoryCredits: 80, labCredits: 32, electiveCredits: 28, projectCredits: 20, status: "Active", dept: "CIVIL" },
      { id: "CURR-R24-MECH", regulationCode: "R24 Regulation", programName: "B.Tech Mechanical Engineering", effectiveBatch: "2026-2030", totalCredits: 160, coreTheoryCredits: 80, labCredits: 32, electiveCredits: 28, projectCredits: 20, status: "Active", dept: "MECHANICAL" }
    ];

    if (department && department !== "All" && department !== "All Departments") {
      res.json(schemes.filter((s) => s.dept === department));
    } else {
      res.json(schemes);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
