# Student Lifecycle & Master Registry Module

This is the ERP's gold-standard reference implementation for all 17 feature modules. It manages student registry listings, academic progress dossier files, outstanding fee ledger integration, and fine-grained role capabilities.

## Architecture

The module adheres to a strict layered design:

```
[Page / Route Component]
         │
         ▼
    [Custom Hook] (useStudents)
         │
         ▼
   [Service Layer] (StudentService)
         │
         ▼
 [Repository Factory] (RepositoryFactory)
         │
         ▼
[Interface / Implementation] (Mock / Supabase)
```

## Folder Structure

```
students/
├── pages/             # Dashboard, Registry, Profile Dossier
├── components/        # KPI panels, data tables, dialogs
├── hooks/             # Custom state hooks
├── repositories/      # Decoupled mock & Supabase databases
├── services/          # validations and event triggers
├── constants/         # Permission and department options
├── types/             # Record definitions
└── module.json        # Manifest file
```

## Action-Level Permissions

- `VIEW_STUDENT`: View the central registry roster.
- `CREATE_STUDENT`: Register a new student profile.
- `UPDATE_STUDENT`: Update contact or academic details.
- `DELETE_STUDENT`: Wipe record mapping.
- `PROMOTE_STUDENT`: Advance academic year standing.
- `TRANSFER_STUDENT`: Re-allocate student department/section.
