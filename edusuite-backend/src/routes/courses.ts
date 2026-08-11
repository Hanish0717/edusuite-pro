import { Router, Response } from "express";
import { prisma } from "../db";
import { authenticateToken, AuthenticatedRequest } from "./auth";

const router = Router();

// GET /api/courses: Fetch offered courses catalog for active semester
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    const semester = user.semester || 6;

    // Fetch all courses offered in this semester
    const courses = await prisma.course.findMany({
      where: { semester },
    });

    // Fetch existing registrations for this student to append active status flags
    const registrations = await prisma.courseRegistration.findMany({
      where: { userId: user.id },
    });

    // Map registrations status back to catalog courses
    const mappedCourses = courses.map((c) => {
      const reg = registrations.find((r) => r.courseId === c.id);
      return {
        id: c.id,
        code: c.code,
        name: c.name,
        faculty: c.faculty,
        credits: c.credits,
        category: c.category,
        semester: c.semester,
        status: reg ? reg.status : "course_registration",
        isRegistered: reg ? true : false,
      };
    });

    res.json(mappedCourses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/courses/register: Moves selected courses to "exam_registration" directly
router.post("/register", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { courseIds } = req.body; // Array of course IDs

  if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
    return res.status(400).json({ error: "Please select at least one course." });
  }

  try {
    const userId = req.userId!;

    // Batch upsert course registrations as "exam_registration" status
    const operations = courseIds.map((courseId) =>
      prisma.courseRegistration.upsert({
        where: {
          userId_courseId: { userId, courseId },
        },
        update: {
          status: "exam_registration",
        },
        create: {
          userId,
          courseId,
          status: "exam_registration",
        },
      })
    );

    await Promise.all(operations);
    res.json({ message: "Courses registered and moved to exam registration successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/courses/nptel: Save NPTEL certificate files and complete verification
router.post("/nptel", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { submissions } = req.body;
  // submissions is array of: { courseId: string, isNptel: boolean, certificateName?: string, comments?: string }

  if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
    return res.status(400).json({ error: "No NPTEL details provided." });
  }

  try {
    const userId = req.userId!;

    const operations = submissions.map(async (sub) => {
      const { courseId, isNptel, certificateName, comments } = sub;

      if (isNptel) {
        if (!certificateName) {
          throw new Error(`NPTEL certificate upload required for courseId ${courseId}`);
        }

        // Save NPTEL Record log
        await prisma.nptelRecord.upsert({
          where: {
            userId_courseId: { userId, courseId },
          },
          update: {
            certificateName,
            comments,
          },
          create: {
            userId,
            courseId,
            certificateName,
            comments,
          },
        });

        // Set status to "nptel_completed" in course registration
        await prisma.courseRegistration.upsert({
          where: {
            userId_courseId: { userId, courseId },
          },
          update: {
            status: "nptel_completed",
          },
          create: {
            userId,
            courseId,
            status: "nptel_completed",
          },
        });
      } else {
        // Not NPTEL course: move it directly to "exam_registration" status
        await prisma.courseRegistration.upsert({
          where: {
            userId_courseId: { userId, courseId },
          },
          update: {
            status: "exam_registration",
          },
          create: {
            userId,
            courseId,
            status: "exam_registration",
          },
        });
      }
    });

    await Promise.all(operations);
    res.json({ message: "NPTEL details and exam registrations successfully submitted!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
