import {
  mockAttendancePredictions,
  mockStudentRisks,
  mockReports,
  mockNotifications,
} from "./mockData";
import type { AITriggerNotification } from "../types";

export class mockApi {
  static async delay(ms = 350) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async get<T>(url: string, params?: any): Promise<T> {
    await this.delay();
    console.log(`[Mock API GET] Request to "${url}"`, params);

    if (url.startsWith("/attendance/predictions")) {
      const dept = params?.department;
      if (dept) {
        return mockAttendancePredictions.filter((p) => p.department === dept) as any;
      }
      return mockAttendancePredictions as any;
    }

    if (url.startsWith("/risk/assessments")) {
      const dept = params?.department;
      if (dept) {
        return mockStudentRisks.filter((r) => r.department === dept) as any;
      }
      return mockStudentRisks as any;
    }

    if (url.startsWith("/reports/list")) {
      return mockReports as any;
    }

    if (url.startsWith("/notifications/list")) {
      return mockNotifications as any;
    }

    throw new Error(`404 Not Found: GET "${url}"`);
  }

  static async post<T>(url: string, data?: any): Promise<T> {
    await this.delay(500);
    console.log(`[Mock API POST] Request to "${url}"`, data);

    if (url === "/attendance/alert") {
      return { success: true } as any;
    }

    if (url === "/chatbot/message") {
      const reply = await mockChatbotMessage(data.text);
      return reply as any;
    }

    if (url === "/reports/export") {
      return { success: true } as any;
    }

    if (url === "/notifications/trigger") {
      const newAlert: AITriggerNotification = {
        id: `NOT-${Math.floor(100 + Math.random() * 900)}`,
        studentId: data.studentId,
        studentName: data.studentName,
        triggerType: data.triggerType,
        channel: data.channel,
        recipient: data.recipient,
        message: data.message,
        timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "Sent",
      };
      mockNotifications.unshift(newAlert);
      return newAlert as any;
    }

    throw new Error(`404 Not Found: POST "${url}"`);
  }

  static async put<T>(url: string, data?: any): Promise<T> {
    await this.delay(400);
    console.log(`[Mock API PUT] Request to "${url}"`, data);

    if (url === "/risk/recommendation") {
      const student = mockStudentRisks.find((r) => r.studentId === data.studentId);
      if (student) {
        student.recommendation = data.recommendation;
        return { success: true } as any;
      }
      throw new Error(`Student ${data.studentId} not found`);
    }

    throw new Error(`404 Not Found: PUT "${url}"`);
  }

  static async delete<T>(url: string): Promise<T> {
    await this.delay(300);
    console.log(`[Mock API DELETE] Request to "${url}"`);
    throw new Error(`404 Not Found: DELETE "${url}"`);
  }
}

// Internal chatbot resolver helper
async function mockChatbotMessage(text: string) {
  const cleaned = text.trim().toLowerCase();
  let reply = "I am your campus AI Assistant. You can ask me about your attendance, timetable, hall ticket, fees, classes, placements, or assignments.";
  let type: "text" | "table" | "chart" = "text";
  let data: any = undefined;

  if (cleaned.includes("attendance")) {
    reply = "Your current attendance is **84%**, and our AI forecasting model predicts it will rise to **88%** by the end of this semester, provided you maintain current weekly patterns.";
  } else if (cleaned.includes("timetable") || cleaned.includes("class")) {
    reply = "Here is your class schedule for today (B.Tech CSE - Semester 6):";
    type = "table";
    data = [
      { period: "Period 1 (09:00 AM)", subject: "Distributed Systems", tutor: "Dr. Suresh Babu" },
      { period: "Period 2 (11:00 AM)", subject: "Compiler Design", tutor: "Dr. Ravi Kumar" },
      { period: "Period 3 (02:00 PM)", subject: "Robotics Lab Practical", tutor: "Dr. Prasad" },
    ];
  } else if (cleaned.includes("ticket") || cleaned.includes("exam")) {
    reply = "Your Hall Ticket for **B.Tech CSE Semester 6 End-Semester Examinations** has been verified by the Exam Cell. It is ready for download.";
  } else if (cleaned.includes("fee")) {
    reply = "Your tuition and library fee status for this academic year is fully **Paid**. You have a pending transport fee of **Rs 15,000** due by **2026-08-15**.";
  } else if (cleaned.includes("placement") || cleaned.includes("eligible")) {
    reply = "Yes, you are fully eligible for placement drives! Your CGPA of **8.4** meets the required threshold of **7.0**, and you have zero active backlogs.";
    type = "chart";
    data = [
      { criterion: "CGPA (8.4/7.0)", met: true },
      { criterion: "Active Backlogs (0)", met: true },
      { criterion: "Attendance (84%)", met: true },
    ];
  } else if (cleaned.includes("assignment") || cleaned.includes("pending")) {
    reply = "You have **2 pending assignments** in your LMS portal:";
    type = "table";
    data = [
      { task: "Compiler Design Syntax Analyzer", due: "2026-08-03", weight: "10%" },
      { task: "Web Security Audit Lab Report", due: "2026-08-06", weight: "15%" },
    ];
  } else if (cleaned.includes("report")) {
    reply = "An AI Attendance Shortage Forecast Report for CSE has been compiled and is ready for export in the Reports tab.";
  }

  return {
    id: `MSG-${Date.now()}`,
    sender: "bot",
    text: reply,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    type,
    data,
  };
}
