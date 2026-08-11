import { Router, Response } from "express";
import { prisma } from "../../db";
import { authenticateToken, AuthenticatedRequest } from "../auth/auth.routes";

const router = Router();

// GET /api/employee: Query all Faculty and Admin records from PostgreSQL database
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Fetch all seeded Faculty
    const faculties = await prisma.faculty.findMany({
      orderBy: { name: "asc" }
    });

    // Fetch all seeded Admins
    const admins = await prisma.admin.findMany({
      orderBy: { name: "asc" }
    });

    const mappedFaculties = faculties.map((f) => {
      let roleFlag = "isMentor";
      let designation = "Assistant Professor";

      if (f.role === "hod") {
        roleFlag = "isHod";
        designation = "Professor & HOD";
      }

      return {
        id: f.id,
        name: f.name,
        email: f.email,
        phone: "+91 98765 43210",
        department: f.department || "CSE",
        designation,
        employmentType: "Full Time" as const,
        qualification: "Ph.D. in Engineering / Sciences",
        salaryGrade: f.role === "hod" ? "Level 14 (Prof)" : "Level 10 (Asst)",
        status: "Active" as const,
        joinDate: f.createdAt.toISOString().split("T")[0],
        roleFlag,
      };
    });

    const mappedAdmins = admins.map((a) => {
      let roleFlag = "isAdmin";
      let designation = "System Administrator";

      if (a.role === "principal") {
        roleFlag = "isPrincipal";
        designation = "Principal & Executive Director";
      } else if (a.role === "vice_principal") {
        roleFlag = "isVicePrincipal";
        designation = "Vice Principal";
      } else if (a.role.includes("dean")) {
        roleFlag = "isDean";
        designation = a.name.includes("Dean") ? a.name : `${a.role.replace("_", " ").toUpperCase()}`;
      } else if (a.role === "exam_cell") {
        roleFlag = "isExamController";
        designation = "Controller of Examinations";
      } else if (a.role === "librarian") {
        roleFlag = "isLibraryAdmin";
        designation = "Chief Librarian";
      } else if (a.role === "placement") {
        roleFlag = "isPlacementOfficer";
        designation = "Head of Training & Placement";
      } else if (a.role === "warden") {
        roleFlag = "isHostelWarden";
        designation = "Hostel Chief Warden";
      } else if (a.role === "transport") {
        roleFlag = "isTransportOfficer";
        designation = "Transport General Manager";
      } else if (a.role === "accounts") {
        roleFlag = "isFinanceOfficer";
        designation = "Accounts & Finance Lead";
      } else if (a.role === "lms") {
        roleFlag = "isLMSAdmin";
        designation = "Learning Systems Manager";
      }

      return {
        id: a.id,
        name: a.name,
        email: a.email,
        phone: "+91 98765 43210",
        department: a.department || "Admin",
        designation,
        employmentType: "Full Time" as const,
        qualification: "Post Graduate / MBA / Ph.D.",
        salaryGrade: "Level 12 (Admin)",
        status: "Active" as const,
        joinDate: a.createdAt.toISOString().split("T")[0],
        roleFlag,
      };
    });

    res.json([...mappedFaculties, ...mappedAdmins]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/employee: Create new faculty/staff record
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, department, designation, roleFlag } = req.body;

  try {
    const isHod = roleFlag === "isHod";
    const isFaculty = roleFlag === "isMentor" || roleFlag === "isClassAdvisor";

    if (isFaculty || isHod) {
      const faculty = await prisma.faculty.create({
        data: {
          rollNumber: `FAC-GEN-${Math.floor(100 + Math.random() * 900)}`,
          name: name || "New Faculty Member",
          email: email || `faculty-${Math.random().toString(36).substring(7)}@cms.com`,
          password: "password123",
          role: isHod ? "hod" : "faculty",
          department: department || "CSE",
        },
      });
      res.status(201).json(faculty);
    } else {
      const admin = await prisma.admin.create({
        data: {
          rollNumber: `ADM-GEN-${Math.floor(100 + Math.random() * 900)}`,
          name: name || "New Admin Staff",
          email: email || `admin-${Math.random().toString(36).substring(7)}@cms.com`,
          password: "password123",
          role: "admin",
          department: department || "Admin",
        },
      });
      res.status(201).json(admin);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
