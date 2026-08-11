# EduSuite Pro ERP Production Checklist

Use this checklist as a quality gate before marking any module or phase as complete and ready for production deployment.

---

## 1. Quality Gates & Architecture

- [ ] **Shared Components**: Leverages design tokens from `@/components/ui/` and base widgets instead of inline custom styling.
- [ ] **Shared Layouts**: Integrates cleanly into `DashboardLayout` without duplicating sidebar or header sections.
- [ ] **Shared Hooks**: Uses centralized state and query hooks (e.g. `useRole()`) to manage state consistency.
- [ ] **Repository Pattern**: No direct API calls or data mutation operations are written in components. All operations must flow through services/repositories.

---

## 2. Routing & Navigation

- [ ] **Parent Layout**: Renders `<Outlet />` (not direct views) to allow nested route child mounting.
- [ ] **Routing Pattern**: Adheres strictly to the flat dot-separated file structure (e.g. `hostel.rooms.tsx`), avoiding deep directories or custom camelCase naming.
- [ ] **Guards**: Role checks are implemented at the layout boundary and return a standard `<ShieldAlert />` (403) on failure.
- [ ] **SPA Links**: All menu, sidebar, and breadcrumb links use `@tanstack/react-router` `<Link>` components with SPA transitions (no standard browser `href` reloads).
- [ ] **Global Boundaries**: Both the general `NotFoundComponent` and the `ErrorComponent` boundaries successfully catch missing paths and rendering errors.

---

## 3. Permissions & Access Control

- [ ] **View Protection**: Module checks `canAccessModule(user, moduleId, 'read')` before displaying elements.
- [ ] **Action Controls**: Create, update, delete, and approve options are enabled dynamically using target action permissions.
- [ ] **Scope Compliance**: Scopes (own, department, school, global) are correctly enforced when querying data lists.

---

## 4. Notifications & Auditing

- [ ] **Notification Triggers**: Key workflows dispatch alerts via `notificationService`.
- [ ] **Audit Logging**: Changes to critical records (approvals, marks entries, fees payments) write logs to the audit register.
- [ ] **Template Synchronization**: Notifications use official templated structures matched to user roles.

---

## 5. Verification & Testing

- [ ] **TypeScript Check**: `tsc --noEmit` passes with 0 type errors.
- [ ] **Build Validation**: Production compilation (`npm run build`) completes cleanly.
- [ ] **Responsive Design**: Viewport scaling behaves cleanly across mobile, tablet, and desktop views.
- [ ] **Refresh & Back/Forward**: Refreshing deep links (`F5`) and using browser navigation arrows works cleanly without blank screens or redirect loops.

---

## 6. Module Assets & Documentation

- [ ] **README.md**: Document features, workflows, and configurations specific to the module.
- [ ] **WORKFLOW.md**: Map institutional workflows (e.g. student admissions flow, library issue lifecycle).
- [ ] **module.json**: Configured metadata and parameters registered in the system registry.
