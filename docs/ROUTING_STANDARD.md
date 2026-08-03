# EduSuite Pro Routing & Navigation Standards

This document defines the official routing conventions, layout structures, Role-Based Access Control (RBAC) matrix, and validation rules for the EduSuite Pro platform. All future ERP modules must adhere to these standards to ensure route stability, secure access controls, and a consistent user experience.

---

## 1. URL & File-Naming Conventions

The platform uses flat file-based routing provided by `@tanstack/react-router`. 

### Approved Routing Pattern
All modules must be structured under their respective role namespace as flat dot-separated files:
```text
/login                          --> src/routes/login.tsx
/<role>                         --> src/routes/<role>.tsx (Parent Layout Shield)
/<role>/dashboard               --> src/routes/<role>.dashboard.tsx (Role Landing Page)
/<role>/<feature>               --> src/routes/<role>.<feature>.tsx (Sub-module Page)
/<role>/<feature>/<detail>      --> src/routes/<role>.<feature>._$<id>.tsx (Detail Page)
```

### Examples
* `/student/dashboard`
* `/student/attendance`
* `/faculty/dashboard`
* `/hostel/dashboard`
* `/hostel/rooms`
* `/library/dashboard`
* `/library/books`
* `/transport/dashboard`

### Forbidden Patterns (Antipatterns)
Never create routes nested under generic folders or with inverted role directories:
```text
❌ /dashboard/student           (Incorrect: role must prefix dashboard)
❌ /dashboard/faculty           (Incorrect: role must prefix dashboard)
❌ /hostel-dashboard            (Incorrect: must be dot-separated sub-route)
❌ /hostel/hostelHome           (Incorrect: inconsistent naming)
```

---

## 2. Parent Layout Requirements

Every core role route (e.g. `/student`, `/faculty`, `/hostel`) acts as a layout shell and access shield. 

### Rules for `src/routes/<role>.tsx`
1. **Never Render Feature Views Directly**: The parent route component must only render the page layout scaffolding, sidebars, headers, and the child route `<Outlet />`.
2. **Access Guards**: Implement role verification inside the component or using a `beforeLoad` hook. If unauthorized, render the standardized `<ShieldAlert />` (Access Denied / 403) template.

### Layout Implementation Template
```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/hostel")({
  component: HostelLayout,
});

function HostelLayout() {
  const { role, flags } = useRole();
  
  // Verify user role & specific privilege flags
  const hasAccess = role === "super-admin" || role === "super_admin" || flags.includes("isHostelWarden");

  if (!hasAccess) {
    return (
      <div className="flex h-screen items-center justify-center p-4 bg-background">
        <div className="text-center max-w-md border border-destructive/20 bg-destructive/5 rounded-2xl p-6">
          <ShieldAlert className="size-10 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-bold">Access Denied</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            You require Hostel Warden privileges to view this section.
          </p>
          <Button asChild className="rounded-xl">
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
```

---

## 3. Official Role-Based Access Control (RBAC) Matrix

| User Role | Target Path | Access Allowed | Redirect / Shield Behavior |
| :--- | :--- | :---: | :--- |
| **Super Admin** | `/*` (All routes) | ✅ | Allowed to view all administrative systems |
| **Student** | `/student/dashboard` | ✅ | Primary landing interface |
| **Student** | `/student/*` (courses, lms, results, etc) | ✅ | Own-scoped personal record pages |
| **Student** | `/faculty/*` | ❌ | Blocks access, displays **Access Denied (403)** screen |
| **Student** | `/hostel/*` | ❌ | Blocks access, displays **Access Denied (403)** screen |
| **Student** | `/library/*` | ❌ | Blocks access, displays **Access Denied (403)** screen |
| **Student** | `/transport/*` | ❌ | Blocks access, displays **Access Denied (403)** screen |
| **Student** | `/super-admin/*` | ❌ | Blocks access, displays **Access Denied (403)** screen |
| **Staff (Faculty)** | `/faculty/dashboard` | ✅ | Personal schedule & class advisor tools |
| **Staff (Faculty)** | `/student/*` | ❌ | Blocks access, displays **Access Denied (403)** screen |
| **Staff (HOD)** | `/hod/dashboard` | ✅ | Departmental control panel |
| **Staff (Hostel Warden)** | `/hostel/dashboard` | ✅ | Room allotments & mess ledgers |
| **Staff (Librarian)** | `/library/dashboard` | ✅ | Book cataloguing & issue desks |
| **Staff (Transport Officer)** | `/transport/dashboard` | ✅ | Route mappings & vehicle statuses |
| **Staff (Finance Officer)** | `/finance/dashboard` | ✅ | Fee receipts & accounting ledgers |
| **Parent** | `/parent/dashboard` | ✅ | Student monitoring panel |
| **Parent** | `/faculty/*` | ❌ | Blocks access, displays **Access Denied (403)** screen |
| **External Recruiter** | `/external-user/dashboard` | ✅ | ATS candidate workspace |

---

## 4. Single-Page Application (SPA) Transition Rules

1. **Internal Links**: Always use TanStack Router `<Link>` components rather than native html `<a href>` tags for internal pages. This prevents full document reloads and maintains component state.
2. **Breadcrumbs**: Breadcrumbs must mount React-Router Link components via the `asChild` property to trigger SPA transitions:
   ```tsx
   <BreadcrumbLink asChild>
     <Link to={href}>{label}</Link>
   </BreadcrumbLink>
   ```

---

## 5. Deployment Server Rewrite Rule for SPA Routing

Since Vite builds are deployed as Single-Page Applications (SPA), a reload (`F5`) on a deep link like `/hostel/rooms` will return a `404 Not Found` if the server is not configured to rewrite all routing requests to `index.html`.

### Configuration for Server Rewrite (e.g. Nginx / Cloudflare Pages)

#### Cloudflare Pages / Wrangler (`_redirects`):
```text
/*  /index.html  200
```

#### Nginx (`nginx.conf`):
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
