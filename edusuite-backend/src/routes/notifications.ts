import { Router, Response } from "express";
import { prisma } from "../db";
import { authenticateToken, AuthenticatedRequest } from "./auth";

const router = Router();

// GET /api/notifications: Fetch notifications list for logged-in user
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notifications/:id/read: Mark a notification as read
router.put("/:id/read", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const userId = req.userId!;

    // Ensure the notification belongs to this user
    const n = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!n) {
      return res.status(404).json({ error: "Notification not found." });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json({ message: "Notification marked as read.", notification: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
