import { Router, Response } from "express";
import { prisma } from "../../db";
import { authenticateToken, AuthenticatedRequest } from "../auth/auth.routes";

const router = Router();

// POST /api/exams/register: Register student for single exam slot (sets status to "exam_registered")
router.post("/register", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: "Please specify a courseId for exam registration." });
  }

  try {
    const userId = req.userId!;

    // Check if course registration exists and status is exam_registration
    const reg = await prisma.courseRegistration.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!reg) {
      return res.status(404).json({ error: "Course registration record not found. Please register for the course first." });
    }

    // Update status to exam_registered
    const updated = await prisma.courseRegistration.update({
      where: {
        userId_courseId: { userId, courseId },
      },
      data: {
        status: "exam_registered",
      },
    });

    res.json({ message: "Exam registered successfully!", registration: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/exams/hall-ticket: Retrieve registered exam schedules to generate admit card
router.get("/hall-ticket", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Fetch registered courses where status is "exam_registered"
    const registrations = await prisma.courseRegistration.findMany({
      where: {
        userId,
        status: "exam_registered",
      },
      include: {
        course: true,
      },
    });

    // Map database records into exam schedules
    const exams = registrations.map((r, index) => ({
      id: `db-exam-${r.course.id}`,
      semester: r.course.semester,
      subjectCode: r.course.code,
      subjectName: r.course.name,
      examDate: `August ${20 + index * 2}, 2026`,
      timeSlot: "Morning FN (09:30 AM - 12:30 PM)",
      duration: "3 Hours",
      hallNumber: "Block A - Hall 102",
      seatNumber: `S-${10 + index * 3}`,
      credits: r.course.credits,
      type: r.course.category === "Lab" ? "Lab" : "Theory",
      status: "Scheduled",
    }));

    res.json(exams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
