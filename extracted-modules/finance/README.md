# 💰 EduSuite Pro — Finance & Fee Management Module

A complete, enterprise-grade Institutional Finance, Student Tuition Fee Portal, and Treasury Management system.

---

## 🌟 Key Features
- **💳 Student Fee Collection Receipts**: Student roll-number lookups, instant payment recording (UPI, Net Banking, Card, Demand Draft), reconciliation status, and live CSV export.
- **🧾 Departmental Expense Vouchers**: Lab equipment, software licenses, infra & event vouchers with multi-level approval workflows and audit trails.
- **🎓 Student Fee Portal & Self-Service**:
  - Fee dues summary and breakdown by semester & fee heads.
  - Interactive payment modal with automated receipt generation and QR-code verification.
  - Scholarship & fee concession applications with instant status tracking.
  - Refund requests with live bank transfer tracking.
  - Institutional No-Due Certificate generation and clearance status.
- **🏛️ Finance Dean / Admin Cockpit**: Annual budget allocation vs expenditure, department-level utilization ledger, category donut charts, and statutory audit verification.
- **⚡ Dual Mode Operation**: Production REST API integration with local mock persistence fallback.

---

## 📁 Directory Structure
```text
finance/
├── FinanceComponents.tsx    # Institutional fee collection & expense voucher ledger
├── FinanceService.ts       # API service and transaction/voucher persistence
├── index.ts                # Clean exports
├── views/
│   ├── StudentFinanceView.tsx   # Student-facing fee payment and dues portal
│   └── FinanceDeanView.tsx      # Dean / CFO budget allocation and audit cockpit
├── components/             # Submodules & utilities
│   ├── fee-payments.tsx
│   ├── fee-structure.tsx
│   ├── finance-dashboard.tsx
│   ├── finance-pdf-utils.ts     # Client-side PDF receipt generation
│   ├── mock-data.ts            # Realistic mock datasets
│   ├── no-due.tsx
│   ├── payment-history.tsx
│   ├── receipts.tsx
│   ├── refunds.tsx
│   ├── scholarships.tsx
│   ├── types.ts
│   └── modals/                 # Dialog modals
│       ├── finance-query-modal.tsx
│       ├── payment-modal.tsx
│       ├── receipt-modal.tsx
│       ├── refund-modal.tsx
│       └── scholarship-modal.tsx
```

---

## 🚀 Quick Start / Integration Guide

### 1. Install Dependencies
```bash
npm install lucide-react sonner clsx tailwind-merge recharts @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs
```

### 2. Copy Shared Primitives
Ensure `shared/ui/` and `shared/lib/` components are copied into your project.

### 3. Usage Example (React / Next.js / Vite)
```tsx
import React from "react";
import { FinanceModuleView } from "./finance";
import { StudentFinanceView } from "./finance/views/StudentFinanceView";
import { FinanceDeanView } from "./finance/views/FinanceDeanView";

// 1. Institutional Fee Collection & Vouchers
export function InstitutionalFinancePage() {
  return <FinanceModuleView />;
}

// 2. Student Self-Service Fee Portal
export function StudentPortalPage() {
  return <StudentFinanceView />;
}

// 3. Dean / CFO Budget Cockpit
export function DeanFinancePage() {
  return <FinanceDeanView />;
}
```

---

## 🔌 API Endpoints
| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/finance/transactions` | Fetch all student fee payment records |
| `POST` | `/api/finance/collect` | Record student fee payment |
| `GET` | `/api/finance/vouchers` | Fetch departmental expense vouchers |
| `POST` | `/api/finance/vouchers` | Approve / create expense voucher |
| `GET` | `/api/dean/dashboard?department=finance` | Budget allocation vs expenditure |
