import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

// Load environment configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

import { seedDatabase } from "./seeder";

// Database Seeder Utility Route
app.post("/api/db/seed", async (req, res) => {
  try {
    await seedDatabase();
    res.json({ message: "Database seeded successfully!" });
  } catch (error: any) {
    console.error("Seeder error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Import modular routes from modules folder
import authRoutes from "./modules/auth/auth.routes";
import courseRoutes from "./modules/courses/courses.routes";
import examRoutes from "./modules/exams/exams.routes";
import attendanceRoutes from "./modules/attendance/attendance.routes";
import notificationRoutes from "./modules/notifications/notifications.routes";
import studentRoutes from "./modules/students/students.routes";
import studentPortalRoutes from "./modules/students/student-portal.routes";
import employeeRoutes from "./modules/employees/employees.routes";
import superAdminRoutes from "./modules/super-admin/super-admin.routes";
import academicsRoutes from "./modules/academics/academics.routes";
import deanRoutes from "./modules/dean/dean.routes";
import hostelRoutes from "./modules/hostel/hostel.routes";

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/student", studentPortalRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/academics", academicsRoutes);
app.use("/api/academic", academicsRoutes);
app.use("/api/dean", deanRoutes);
app.use("/api/hostel", hostelRoutes);

// Boot server
app.listen(PORT, () => {
  console.log(`EduSuite Backend API Server is listening on http://localhost:${PORT}`);
});

