import { Router, Response } from "express";
import { prisma } from "../../db";
import { authenticateToken, AuthenticatedRequest } from "../auth/auth.routes";
import fs from "fs";
import path from "path";

const router = Router();

// Helper to check if faculty is assigned to a course
async function isFacultyAssignedToCourse(facultyId: string, courseId: string): Promise<boolean> {
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });
  if (!course) return false;

  // Try parsing JSON format first
  try {
    if (course.faculty && course.faculty.startsWith("[")) {
      const sections = JSON.parse(course.faculty);
      if (Array.isArray(sections)) {
        return sections.some((s: any) => s.mentor_id === facultyId);
      }
    }
  } catch (e) {
    // Ignore JSON error
  }

  // Fallback to name matching
  const faculty = await prisma.faculty.findUnique({
    where: { id: facultyId }
  });
  if (faculty && course.faculty && course.faculty.includes(faculty.name)) {
    return true;
  }

  // HOD fallback: allow if HOD is in the same department
  if (faculty && faculty.role === "hod" && faculty.department === course.department) {
    return true;
  }

  return false;
}

// GET /api/lms/resources: Get offered LMS resources
router.get("/resources", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resourceType, subjectId, facultyId } = req.query;

    // Student specific filtering: only show enrolled subjects or department-level general resources
    if (req.userRole === "student") {
      const registrations = await prisma.courseRegistration.findMany({
        where: { userId: req.userId },
        select: { courseId: true }
      });
      const courseIds = registrations.map(r => r.courseId);

      const student = await prisma.student.findUnique({
        where: { id: req.userId },
        select: { department: true }
      });

      const resources = await prisma.lmsResource.findMany({
        where: {
          OR: [
            { subjectId: { in: courseIds } },
            { 
              subjectId: null,
              departmentId: student?.department || undefined 
            }
          ],
          resourceType: (resourceType as string) || undefined,
          isPublished: true
        },
        include: {
          faculty: {
            select: { id: true, name: true, email: true, department: true }
          },
          course: true
        },
        orderBy: { createdAt: "desc" }
      });

      const mapped = resources.map((r) => ({
        id: r.id,
        title: r.title,
        type: "PDF Document",
        subject: r.course ? `${r.course.code}: ${r.course.name}` : "General Resource",
        department: r.departmentId || "CSE",
        size: r.fileSize || "0 KB",
        url: r.fileUrl || "",
        uploadedBy: r.faculty.name,
        createdAt: r.createdAt.toISOString().split("T")[0]
      }));

      return res.json(mapped);
    }

    // Faculty or HOD/Admin general query
    const whereClause: any = {};
    if (resourceType) whereClause.resourceType = resourceType as string;
    if (subjectId) whereClause.subjectId = subjectId as string;
    if (facultyId) whereClause.facultyId = facultyId as string;

    const resources = await prisma.lmsResource.findMany({
      where: whereClause,
      include: {
        faculty: {
          select: { id: true, name: true, email: true, department: true }
        },
        course: true
      },
      orderBy: { createdAt: "desc" }
    });

    const mapped = resources.map((r) => ({
      id: r.id,
      title: r.title,
      type: "PDF Document",
      subject: r.course ? `${r.course.code}: ${r.course.name}` : "General Resource",
      department: r.departmentId || "CSE",
      size: r.fileSize || "0 KB",
      url: r.fileUrl || "",
      uploadedBy: r.faculty.name,
      createdAt: r.createdAt.toISOString().split("T")[0]
    }));

    return res.json(mapped);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/student/lms/resources: Alias endpoint for student LMS
router.get("/student/resources", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const registrations = await prisma.courseRegistration.findMany({
      where: { userId: req.userId },
      select: { courseId: true }
    });
    const courseIds = registrations.map(r => r.courseId);

    const student = await prisma.student.findUnique({
      where: { id: req.userId },
      select: { department: true }
    });

    const resources = await prisma.lmsResource.findMany({
      where: {
        OR: [
          { subjectId: { in: courseIds } },
          { 
            subjectId: null,
            departmentId: student?.department || undefined 
          }
        ],
        resourceType: (req.query.resourceType as string) || undefined,
        isPublished: true
      },
      include: {
        faculty: {
          select: { id: true, name: true, email: true, department: true }
        },
        course: true
      },
      orderBy: { createdAt: "desc" }
    });

    console.log("=== student/resources endpoint ===");
    console.log("req.userId:", req.userId);
    console.log("student department:", student?.department);
    console.log("courseIds:", courseIds);
    console.log("resources count:", resources.length);

    const mapped = resources.map((r) => ({
      id: r.id,
      title: r.title,
      type: "PDF Document",
      subject: r.course ? `${r.course.code}: ${r.course.name}` : "General Resource",
      department: r.departmentId || "CSE",
      size: r.fileSize || "0 KB",
      url: r.fileUrl || "",
      uploadedBy: r.faculty.name,
      createdAt: r.createdAt.toISOString().split("T")[0]
    }));

    return res.json(mapped);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/lms/resources/count: Dynamic document count
router.get("/resources/count", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const count = await prisma.lmsResource.count({
      where: { resourceType: "STUDY_NOTE" }
    });
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/lms/resources: Create new resource (supports base64 PDF upload)
router.post("/resources", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { title, subjectId, resourceType, fileName, fileSize, fileData } = req.body;

  if (!title || !resourceType) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Check roles: only faculty, HOD, or admins allowed
  const isAuthorizedRole = ["faculty", "hod", "admin", "super_admin"].includes(req.userRole || "");
  if (!isAuthorizedRole) {
    return res.status(403).json({ error: "Unauthorized role for uploads." });
  }

  try {
    let departmentId = null;
    if (subjectId) {
      // Determine target course
      const course = await prisma.course.findUnique({
        where: { id: subjectId }
      });
      if (!course) {
        return res.status(400).json({ error: "Related subject not found." });
      }
      departmentId = course.department;

      // Check faculty authorization for subject (skip if super_admin / admin)
      const isAdmin = ["admin", "super_admin"].includes(req.userRole || "");
      if (!isAdmin) {
        const assigned = await isFacultyAssignedToCourse(req.userId!, subjectId);
        if (!assigned) {
          return res.status(403).json({ error: "You are not assigned to teach this subject." });
        }
      }
    } else {
      // Fallback: use faculty's department if available
      const faculty = await prisma.faculty.findUnique({
        where: { id: req.userId }
      });
      departmentId = faculty?.department || null;
    }

    let fileUrl = "";
    let finalFileName = fileName || "document.pdf";
    let finalMimeType = "application/pdf";

    // Decode and save base64 file data if present
    if (fileData) {
      // Validate file format on backend
      const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid file format. Base64 payload incorrect." });
      }

      finalMimeType = matches[1];
      const base64Content = matches[2];

      if (finalMimeType !== "application/pdf" && !finalFileName.endsWith(".pdf")) {
        return res.status(400).json({ error: "Only PDF files are accepted." });
      }

      // Create uploads directory if not exists
      const uploadDir = path.join(__dirname, "../../../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate unique safe file name
      const fileExt = ".pdf";
      const fileUuid = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const safeName = `${fileUuid}${fileExt}`;
      const filePath = path.join(uploadDir, safeName);

      // Write binary data to disk
      fs.writeFileSync(filePath, Buffer.from(base64Content, "base64"));

      // Configure host url path
      fileUrl = `/uploads/${safeName}`;
    }

    // Save metadata in database
    const resource = await prisma.lmsResource.create({
      data: {
        title,
        resourceType,
        facultyId: req.userId!,
        subjectId: subjectId || null,
        departmentId: departmentId,
        fileUrl,
        fileName: finalFileName,
        fileSize: fileSize || "unknown",
        mimeType: finalMimeType,
        isPublished: true
      },
      include: {
        faculty: {
          select: { name: true }
        },
        course: true
      }
    });

    res.status(201).json(resource);
  } catch (error: any) {
    console.error("LMS upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/lms/resources/:id: Deletes study note
router.delete("/resources/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const resource = await prisma.lmsResource.findUnique({
      where: { id }
    });

    if (!resource) {
      return res.status(404).json({ error: "LMS resource not found." });
    }

    // Access control: only owner or admin can delete
    const isOwner = resource.facultyId === req.userId;
    const isAdmin = ["admin", "super_admin"].includes(req.userRole || "");

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Access denied. You do not own this resource." });
    }

    // Delete associated physical file from storage
    if (resource.fileUrl) {
      const fileName = path.basename(resource.fileUrl);
      const filePath = path.join(__dirname, "../../../uploads", fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Failed to delete physical file:", e);
        }
      }
    }

    // Delete database record
    await prisma.lmsResource.delete({
      where: { id }
    });

    res.json({ message: "LMS resource deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
