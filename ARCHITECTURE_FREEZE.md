# EduSuite Pro ERP: Architecture Freeze Policy

> **Architecture Freeze Policy:** Any architectural change (folder structure, routing conventions, repository pattern, shared component contracts, notification platform, or permission engine) must be reviewed and approved before implementation. New modules must conform to the Golden Module Template (v2) and existing standards.

---

## 1. Folder Structure Standard

Every module MUST implement this exact directory structure:

```text
module/
│
├── pages/                  # Route level container pages
├── components/             # Reusable UI sub-components
│   ├── cards/
│   ├── tables/
│   ├── forms/
│   ├── dialogs/
│   ├── layout/
│   ├── filters/
│   └── charts/
│
├── hooks/                  # Custom React hooks (state management, API hooks)
├── services/               # Core business logic layer (validations, calculations)
├── repositories/           # Decoupled Repository Pattern contracts and classes
├── validators/             # Form and API payload input validators
├── events/                 # Module-specific event publishing class
├── workflow/               # Visual and MD lifecycle workflow documentation
├── constants/              # Fixed values, configurations, permission lists
├── types/                  # TypeScript interface definitions
├── utils/                  # Domain specific helper functions
├── assets/                 # SVGs, images, static resources
│
├── README.md               # Developer onboarding guide
├── WORKFLOW.md             # Visual lifecycle process documentation
├── CHANGELOG.md            # Release track history
├── CHECKLIST.md            # Module compliance checkpoints
├── module.json             # Module registration metadata manifest
└── index.ts                # Main module entrypoint exports
```

---

## 2. Decoupled Repository Request Flow

No React component or hook is allowed to access the database or external APIs directly. Every data access operation must follow this flow:

```text
UI Page / Component
       │
       ▼
React Hook (useModule)
       │
       ▼
Business Service (ModuleService)
       │
       ▼
Repository Factory (RepositoryFactory)
       │
       ├── Mock Repository (MockModuleRepository)
       └── Supabase Repository (SupabaseModuleRepository)
```

---

## 3. Decoupled Communication (Event Bus)

Modules must never import and trigger mutations on other modules directly. Inter-module integration must be achieved via event publication:

```text
Target Module Mutation
        │
        ▼
<ModuleName>Events.publish(...)
        │
        ▼
Global Event Bus (dispatchEvent)
        │
        ▼
Event Subscriber (e.g. Notifications, Audit Logger, AI Analytics)
```

---

## 4. Input Validation Standard

All business validation rules must reside outside UI files. React forms must call validators defined in `<ModuleName>Validator.ts` before mutations are executed in the service tier.

---

## 5. Metadata Registry Manifest (`module.json`)

Every module folder must include a `module.json` file registering:
* `name`, `version`, `category`, `owner`, `icon`
* `permissions` (Granular action gates: `VIEW`, `CREATE`, `UPDATE`, `DELETE`, etc.)
* `dependencies` (Dependent modules)
* `routes` (Assigned routing paths)
* `events` (Published events)
* `notifications` (Fired notifications)
* `futureApis` (Required API endpoints)

---

## 6. Permissions & RBAC Standard

Never perform role checks (e.g., `role === 'admin'`) inside components. Map actions to permissions constants inside your hook:

```typescript
const { can } = useModulePermissions();
if (can("DELETE_RECORD")) {
  // render delete button
}
```

---

## 7. Recommended Module Development Order

All future modules must be built in dependency order to prevent mock dependency loops:

```text
Phase 1: Academics -> Faculty -> Admissions
Phase 2: Attendance -> Examination -> LMS -> Library
Phase 3: Finance -> Hostel -> Transport
Phase 4: Placements -> Alumni
Phase 5: AI & Analytics -> Notifications -> System Settings
```
