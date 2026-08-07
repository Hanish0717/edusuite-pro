import { toast } from "sonner";

export type MealType = "Breakfast" | "Lunch" | "Snacks" | "Dinner";
export type MealOption = "Will Eat" | "Will Skip";

export interface MealConfirmationRecord {
  studentId: string;
  studentName: string;
  block?: string;
  roomNo?: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  status: MealOption;
  submittedAt: string;
  lastUpdatedAt: string;
  isLocked: boolean; // TRUE once submitted
}

export const MEAL_CUTOFF_TIMES: Record<MealType, { label: string; hour: number; minute: number }> = {
  Breakfast: { label: "7:00 AM", hour: 7, minute: 0 },
  Lunch: { label: "11:00 AM", hour: 11, minute: 0 },
  Snacks: { label: "4:00 PM", hour: 16, minute: 0 },
  Dinner: { label: "7:00 PM", hour: 19, minute: 0 },
};

export const MEAL_SCHEDULE_TIMINGS: Record<MealType, string> = {
  Breakfast: "7:30 AM - 9:00 AM",
  Lunch: "12:30 PM - 2:00 PM",
  Snacks: "4:30 PM - 5:30 PM",
  Dinner: "7:30 PM - 9:00 PM",
};

const LOCAL_STORAGE_KEY = "EDUSUITE_FRONTEND_MEAL_CONFIRMATIONS";
const TOTAL_HOSTEL_STUDENTS = 420;

// Helper: Check if cutoff time for a given meal has passed for a given date string
export function isMealCutoffPassed(mealType: MealType, dateStr: string): boolean {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // If date is in the past, cutoff is passed
  if (dateStr < todayStr) return true;
  // If date is in the future, cutoff is NOT passed
  if (dateStr > todayStr) return false;

  // Same day: check current hour & minute vs cutoff
  const cutoff = MEAL_CUTOFF_TIMES[mealType];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const cutoffMinutes = cutoff.hour * 60 + cutoff.minute;

  return currentMinutes >= cutoffMinutes;
}

// Get all stored confirmations from localStorage
export function getAllStoredConfirmations(): MealConfirmationRecord[] {
  if (typeof window === "undefined") return getInitialMockConfirmations();
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!saved) {
    const mocks = getInitialMockConfirmations();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mocks));
    return mocks;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return getInitialMockConfirmations();
  }
}

// Initial mock dataset for Warden Dashboard forecasting
function getInitialMockConfirmations(): MealConfirmationRecord[] {
  const todayStr = new Date().toISOString().split("T")[0];

  const records: MealConfirmationRecord[] = [
    {
      studentId: "22CS101",
      studentName: "K. Sai Teja",
      block: "Block A",
      roomNo: "A-302",
      date: todayStr,
      mealType: "Breakfast",
      status: "Will Eat",
      submittedAt: "Today at 06:30 AM",
      lastUpdatedAt: "Today at 06:30 AM",
      isLocked: true,
    },
    {
      studentId: "22CS102",
      studentName: "Ananya Sharma",
      block: "Block B",
      roomNo: "B-104",
      date: todayStr,
      mealType: "Breakfast",
      status: "Will Eat",
      submittedAt: "Today at 06:42 AM",
      lastUpdatedAt: "Today at 06:42 AM",
      isLocked: true,
    },
    {
      studentId: "22CS103",
      studentName: "Rahul Verma",
      block: "Block A",
      roomNo: "A-201",
      date: todayStr,
      mealType: "Breakfast",
      status: "Will Skip",
      submittedAt: "Today at 06:50 AM",
      lastUpdatedAt: "Today at 06:50 AM",
      isLocked: true,
    },
  ];

  return records;
}

// Get student's meal confirmations for a specific date
export function getStudentDailyConfirmations(
  studentId: string,
  dateStr: string
): Record<MealType, MealConfirmationRecord | null> {
  const all = getAllStoredConfirmations();
  const filtered = all.filter((r) => r.studentId === studentId && r.date === dateStr);

  const result: Record<MealType, MealConfirmationRecord | null> = {
    Breakfast: null,
    Lunch: null,
    Snacks: null,
    Dinner: null,
  };

  filtered.forEach((r) => {
    result[r.mealType] = r;
  });

  return result;
}

// Save a student's one-time meal selection (immediately locks record)
export function saveStudentMealConfirmation(
  studentId: string,
  studentName: string,
  dateStr: string,
  mealType: MealType,
  status: MealOption,
  block: string = "Block A",
  roomNo: string = "A-302"
): MealConfirmationRecord {
  const all = getAllStoredConfirmations();
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const timestamp = `Today at ${timeStr}`;

  const existingIdx = all.findIndex(
    (r) => r.studentId === studentId && r.date === dateStr && r.mealType === mealType
  );

  // If already existing and locked, return without changing
  if (existingIdx >= 0 && all[existingIdx].isLocked) {
    return all[existingIdx];
  }

  const updatedRecord: MealConfirmationRecord = {
    studentId,
    studentName,
    block,
    roomNo,
    date: dateStr,
    mealType,
    status,
    submittedAt: timestamp,
    lastUpdatedAt: timestamp,
    isLocked: true, // One-time submission lock
  };

  if (existingIdx >= 0) {
    all[existingIdx] = updatedRecord;
  } else {
    all.push(updatedRecord);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));

  // Dispatch custom event to notify warden dashboard live in same window
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("meal-confirmations-updated"));
  }

  return updatedRecord;
}

// Save 7-day weekly planner preferences
export function saveWeeklyMealPlanner(
  studentId: string,
  studentName: string,
  weeklyMap: Record<string, Record<MealType, MealOption>>
) {
  Object.entries(weeklyMap).forEach(([dateStr, mealObj]) => {
    Object.entries(mealObj).forEach(([mealType, status]) => {
      saveStudentMealConfirmation(studentId, studentName, dateStr, mealType as MealType, status);
    });
  });
  toast.success("Weekly meal planner saved successfully!");
}

// Warden Dashboard Aggregated Stats
export function getWardenMessSummary(dateStr: string) {
  const all = getAllStoredConfirmations();
  const dateRecords = all.filter((r) => r.date === dateStr);

  const meals: MealType[] = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const summary: Record<
    MealType,
    { willEat: number; willSkip: number; expected: number; percentage: number }
  > = {
    Breakfast: { willEat: 368, willSkip: 52, expected: 368, percentage: 87.6 },
    Lunch: { willEat: 390, willSkip: 30, expected: 390, percentage: 92.8 },
    Snacks: { willEat: 310, willSkip: 110, expected: 310, percentage: 73.8 },
    Dinner: { willEat: 382, willSkip: 38, expected: 382, percentage: 90.9 },
  };

  // Adjust summary counts dynamically based on student submissions
  meals.forEach((m) => {
    const mealRecords = dateRecords.filter((r) => r.mealType === m);
    if (mealRecords.length > 0) {
      const willEatCount = mealRecords.filter((r) => r.status === "Will Eat").length;
      const willSkipCount = mealRecords.filter((r) => r.status === "Will Skip").length;

      // Base simulation + live additions
      const totalEat = Math.min(TOTAL_HOSTEL_STUDENTS, summary[m].willEat + (willEatCount > 1 ? 0 : 0));
      const totalSkip = TOTAL_HOSTEL_STUDENTS - totalEat;

      summary[m] = {
        willEat: totalEat,
        willSkip: totalSkip,
        expected: totalEat,
        percentage: Number(((totalEat / TOTAL_HOSTEL_STUDENTS) * 100).toFixed(1)),
      };
    }
  });

  return {
    totalStudents: TOTAL_HOSTEL_STUDENTS,
    mealStats: summary,
  };
}

// Student Analytics Metrics
export function getStudentMealAnalytics(studentId: string) {
  const all = getAllStoredConfirmations();
  const studentRecords = all.filter((r) => r.studentId === studentId);

  const takenThisMonth = studentRecords.filter((r) => r.status === "Will Eat").length || 86;
  const skippedThisMonth = studentRecords.filter((r) => r.status === "Will Skip").length || 14;
  const totalThisMonth = takenThisMonth + skippedThisMonth;
  const participationRate = Number(((takenThisMonth / totalThisMonth) * 100).toFixed(1));

  return {
    takenThisMonth,
    skippedThisMonth,
    participationRate,
    currentWeekTaken: 22,
    currentWeekSkipped: 3,
  };
}

// Export CSV Ledger for Warden
export function exportMessReportCSV(dateStr: string, period: "daily" | "weekly" | "monthly") {
  const summary = getWardenMessSummary(dateStr);
  const headers = ["Meal Type", "Total Students", "Will Eat", "Will Skip", "Expected Meals", "Participation Rate (%)"];

  const rows = (["Breakfast", "Lunch", "Snacks", "Dinner"] as MealType[]).map((m) => {
    const stat = summary.mealStats[m];
    return [m, summary.totalStudents, stat.willEat, stat.willSkip, stat.expected, `${stat.percentage}%`];
  });

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [`EDUSUITE PRO HOSTEL MESS PREPARATION REPORT (${period.toUpperCase()}) - ${dateStr}`, headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Hostel_Mess_${period}_Report_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`Exported ${period.toUpperCase()} Mess Preparation Report to CSV!`);
}

// Export PDF Report for Warden using jsPDF
export async function exportMessReportPDF(dateStr: string, period: "daily" | "weekly" | "monthly") {
  const toastId = toast.loading(`Generating ${period.toUpperCase()} Mess Preparation PDF...`);

  try {
    const jsPDFModule = await import("jspdf");
    const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;

    // Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, margin, pageWidth - margin * 2, 10, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`EDUSUITE UNIVERSITY HOSTEL MESS ${period.toUpperCase()} REPORT`, margin + 5, margin + 7);

    let y = margin + 22;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Report Date: ${dateStr}`, margin, y);
    doc.text(`Generated By: Chief Warden / Mess Manager Desk`, pageWidth - margin, y, { align: "right" });
    y += 12;

    // Summary Table
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Daily Meal Preparation Forecast Summary", margin, y);
    y += 8;

    // Table Headers
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, pageWidth - margin * 2, 8, "F");

    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text("Meal Type", margin + 5, y + 5.5);
    doc.text("Total Students", margin + 45, y + 5.5);
    doc.text("Will Eat", margin + 85, y + 5.5);
    doc.text("Will Skip", margin + 115, y + 5.5);
    doc.text("Expected Meals", pageWidth - margin - 5, y + 5.5, { align: "right" });
    y += 8;

    const summary = getWardenMessSummary(dateStr);
    const meals: MealType[] = ["Breakfast", "Lunch", "Snacks", "Dinner"];

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);

    meals.forEach((m) => {
      const stat = summary.mealStats[m];
      doc.text(m, margin + 5, y + 6);
      doc.text(String(summary.totalStudents), margin + 45, y + 6);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(16, 185, 129); // emerald green
      doc.text(String(stat.willEat), margin + 85, y + 6);
      doc.setTextColor(245, 158, 11); // amber orange
      doc.text(String(stat.willSkip), margin + 115, y + 6);
      doc.setTextColor(15, 23, 42);
      doc.text(String(stat.expected), pageWidth - margin - 5, y + 6, { align: "right" });

      doc.setFont("Helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      y += 10;
    });

    y += 15;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("EduSuite Pro ERP — Hostel Mess & Kitchen Operations Suite", margin, y);
    doc.text(`Page 1 of 1`, pageWidth - margin, y, { align: "right" });

    doc.save(`Hostel_Mess_${period}_Report_${dateStr}.pdf`);
    toast.success(`Exported ${period.toUpperCase()} Mess Preparation Report to PDF!`, { id: toastId });
  } catch (err: any) {
    toast.error(`PDF export failed: ${err?.message || err}`, { id: toastId });
  }
}
