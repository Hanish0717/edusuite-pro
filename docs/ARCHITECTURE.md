# ERP Architecture & Module Standardization Standards

This document establishes the official frozen specifications, coding standards, directory structures, and module contracts for all 17 institutional modules. All developments must comply with these guidelines.

---

## 1. Directory Structure Blueprint

Every module directory in `src/modules/` must follow the identical structure below. No exceptions.

```text
src/modules/your-module/
├── pages/              # Page route components
├── components/         # Local UI widgets & module-specific components
├── hooks/              # Custom React hooks (mediates UI and Repository layers)
├── services/           # Service layer coordinating repositories
├── repositories/       # Repositories (implements driver switches - Mock or Supabase)
├── constants/          # Module constants & lookup maps
├── types/              # TypeScript types and interface contracts
├── utils/              # Helper utility functions
├── workflow/           # Approval engines & custom pipelines
│
├── README.md           # Documentation: module description, routing and role mapping
├── WORKFLOW.md         # Documentation: business workflows and event notification logs
└── module.json         # Module Registry Manifest (metadata, version, dependencies, permissions)
```

---

## 2. Decoupled Repository Pattern

To keep the UI backend-agnostic, modules must not fetch endpoints directly from pages or hooks. Data flow must strictly run through:

```text
UI Page / Component
       │
       ▼
React Custom Hook (e.g. useAttendance)
       │
       ▼
Service layer (Coordinates audits & business rules)
       │
       ▼
Repository Interface (Abstracts database calls)
       │
       ▼
Repository Driver (MockRepository OR SupabaseRepository)
```

- When Supabase is integrated, **only** the Repository Driver implementation is swapped. Pages, hooks, and services remain completely untouched.

---

## 3. Centralized Notification Protocol

Modules must NEVER instantiate or import notification components (`NotificationFactory`, `NotificationEngine`, or `NotificationRepository`) directly.
All notification dispatches must flow through the central `NotificationService` public API or publish via `EventBus`:

```typescript
import { notificationService } from "@/shared/notifications";

await notificationService.notify({
  eventCode: "ATTENDANCE_LOW",
  collegeId: "GMR",
  variables: { studentName: "John Doe", percentage: "72%", studentId: "STD-904" }
});
```

---

## 4. Permission Declarations

Access permissions are declared inside pages and mapped inside `module.json` according to the standard permission array:
```typescript
permissions: [
  "VIEW",     // View dashboards and index tables
  "CREATE",   // Insert records
  "UPDATE",   // Modify existing records
  "DELETE",   // Remove/soft-delete records
  "EXPORT"    // Export tables to CSV or PDF
]
```
The central `PermissionEngine` dynamically intercepts routing and component mounting based on the logged-in role's permission matrix.

---

## 5. Routing Contracts

Every module exposes a single nested root entrypoint hook in the global layout routing hierarchy.
- **Root Routing Path**: `/modules/your-module`
- **Internal Routing**: Sub-pages and tabs are managed internally by the module's router.

---

## 6. Design System Standard

Ad-hoc styling, custom input overrides, and hardcoded hex colors are strictly prohibited.
- Colors, margins, padding, typography, shadow effects, and border-radius tokens must come from the shared **Design System** configuration.
- Shared components (e.g. `DataTable`, `Form`, buttons, and inputs) must be used.

---

## 7. Recommended Module Build Order

To minimize circular dependencies, modules must be built in sequential phases:

### Phase 1: Foundation
1. **Admissions**
2. **Students**
3. **Faculty**
4. **Academics**

### Phase 2: Academic Core
5. **Attendance**
6. **Examination**
7. **LMS**
8. **Library**

### Phase 3: Operations
9. **Finance**
10. **Hostel**
11. **Transport**

### Phase 4: Career
12. **Placements**
13. **Alumni**

### Phase 5: Management
14. **HRMS**
15. **AI & Analytics**
16. **Reports**

### Phase 6: Administration
17. **Super Admin**
