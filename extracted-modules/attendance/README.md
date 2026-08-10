# 📋 EduSuite Pro — Attendance & Biometric Tracking Module

A modular, production-ready Attendance Management system for higher education institutions, universities, and enterprise ERPs.

---

## 🌟 Key Features
- **🏛️ All Classes Attendance Dashboard**: Real-time institutional overview with Daily, Weekly, and Monthly timeframe filters, department grouping, search, and defaulter shortage alerts (`<75%`).
- **📝 Faculty Period Marking Portal**: Period-wise session roster with one-click `Mark All Present`, single-tap toggle buttons for `Present / Absent / Late`, and instant submission.
- **📊 Daily Attendance Records Ledger**: Full search and multi-filtering (Department, Section, Attendance Range `Above 90%`, `75%-90%`, `Below 75%`), live CSV export, modal details view, and medical condonation approval workflow.
- **📈 Comprehensive KPI Cards**: Institutional average rate, biometric/RFID present counts, absent tally, and condonation shortage alerts.
- **⚡ Dual Mode Operation**: Works seamlessly with real REST API endpoints and includes robust local mock data fallback out of the box.

---

## 📁 Directory Structure
```text
attendance/
├── AttendanceComponents.tsx    # Complete 3-subpart institutional attendance cockpit
├── AttendanceService.ts       # API service and mock dataset persistence
├── types.ts                   # Type definitions & interfaces
├── index.ts                   # Clean entry point exports
├── views/
│   ├── FacultyAttendanceView.tsx  # Faculty attendance dashboard with timetable & register
│   └── AttendancePageRoute.tsx    # TanStack / Next.js / React Router wrapper
└── components/                # Modular subcomponents
    ├── attendance-analytics.tsx
    ├── attendance-calendar.tsx
    ├── attendance-form.tsx
    ├── attendance-header.tsx
    ├── attendance-history.tsx
    ├── attendance-register.tsx
    ├── leave-request-panel.tsx
    ├── low-attendance-alerts.tsx
    ├── quick-actions.tsx
    ├── search-filter-bar.tsx
    ├── skeleton-loader.tsx
    ├── statistics-cards.tsx
    ├── student-attendance-table.tsx
    └── today-classes.tsx
```

---

## 🚀 Quick Start / Integration Guide

### 1. Install Dependencies
```bash
npm install lucide-react sonner clsx tailwind-merge @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-progress @radix-ui/react-tabs
```

### 2. Copy Shared Primitives
Copy the files from `shared/ui/` and `shared/lib/` into your project's `components/ui/` and `lib/` folders (or adjust import paths).

### 3. Usage Example (React / Next.js / Vite)
```tsx
import React from "react";
import { AttendanceModuleView } from "./attendance";

export default function AttendancePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      {/* initialTab options: "all-classes-attendance" | "attendance-mark" | "records" */}
      <AttendanceModuleView initialTab="all-classes-attendance" />
    </div>
  );
}
```

---

## 🔌 API Endpoints
| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/attendance` | Fetch all attendance sessions |
| `POST` | `/api/attendance` | Create / submit new attendance session |
| `PUT` | `/api/attendance/:id` | Update attendance or grant condonation |
| `DELETE` | `/api/attendance/:id` | Remove attendance log |
| `GET` | `/api/academics/all-classes-attendance` | Super admin / HOD multi-class attendance |
| `POST` | `/api/attendance/mark` | Period-wise student roster submission |
