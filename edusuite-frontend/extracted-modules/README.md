# 📦 EduSuite Pro — Extracted Attendance & Finance Modules

This package contains the complete, portable **Attendance Management** and **Institutional & Student Finance** modules extracted from EduSuite Pro.

---

## 📦 What's Included

```text
extracted-modules/
├── attendance/                 # 📋 Complete Attendance System
│   ├── AttendanceComponents.tsx   # Institutional attendance cockpit (3 subparts)
│   ├── AttendanceService.ts      # API & mock data layer
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── index.ts                  # Main export entry point
│   ├── README.md                 # Attendance documentation
│   ├── views/                    # Ready-to-use page views
│   └── components/               # 15+ specialized attendance subcomponents
│
├── finance/                    # 💰 Complete Finance & Fee System
│   ├── FinanceComponents.tsx     # Institutional collection & expense vouchers
│   ├── FinanceService.ts         # API & mock transaction layer
│   ├── index.ts                  # Main export entry point
│   ├── README.md                 # Finance documentation
│   ├── views/
│   │   ├── StudentFinanceView.tsx # Student fee dues, payment, & receipts portal
│   │   └── FinanceDeanView.tsx    # Dean / CFO budget allocation cockpit
│   ├── components/               # 10+ finance subcomponents & PDF receipt generator
│   └── modals/                   # Payment, receipt, refund & scholarship dialogs
│
└── shared/                     # 🛠️ Required Shared Primitives
    ├── lib/                      # api.ts (fetch client) & utils.ts (cn helper)
    ├── ui/                       # Radix / Tailwind UI components (Button, Input, etc.)
    └── styles.css                # CSS variables and design tokens
```

---

## 🚀 How to Use in Another Project

### Step 1: Copy the Folder
Copy `attendance/`, `finance/`, and `shared/` into your target React / Next.js / Vite project's `src/` directory:
```text
my-project/src/
├── attendance/
├── finance/
└── shared/
```

### Step 2: Install Peer Dependencies
```bash
npm install lucide-react sonner clsx tailwind-merge recharts @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-progress @radix-ui/react-tabs @radix-ui/react-slot class-variance-authority
```

### Step 3: Mount the Modules

#### Attendance:
```tsx
import { AttendanceModuleView } from "./attendance";

export function MyAttendancePage() {
  return <AttendanceModuleView initialTab="all-classes-attendance" />;
}
```

#### Finance:
```tsx
import { FinanceModuleView } from "./finance";
import { StudentFinanceView } from "./finance/views/StudentFinanceView";
import { FinanceDeanView } from "./finance/views/FinanceDeanView";

// 1. Admin Fee Collection & Expense Vouchers:
export function AdminFinancePage() {
  return <FinanceModuleView />;
}

// 2. Student Fee Dues & Payments:
export function StudentFeesPage() {
  return <StudentFinanceView />;
}

// 3. Dean / CFO Budget Allocation Cockpit:
export function DeanBudgetPage() {
  return <FinanceDeanView />;
}
```

---

## 🗄️ Standalone ZIP Files
Pre-packaged ZIP archives are available in `extracted-zips/`:
- `attendance-module.zip`: Attendance module + subcomponents + docs
- `finance-module.zip`: Finance module + student portal + dean cockpit + docs
- `edusuite-attendance-and-finance-all-in-one.zip`: Complete bundle with shared UI & utilities
