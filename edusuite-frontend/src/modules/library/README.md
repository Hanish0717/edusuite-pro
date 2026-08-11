# Library Management Module (v2 Golden Architecture)

## Overview
The Library Management Module provides end-to-end ERP operations for university libraries, including physical book cataloging, ISBN/barcode processing, student and faculty circulation (issue/return), fine collection, reading hall seat reservation, and digital eBook management.

## Master A to Z Documentation
For full pin-to-pin documentation of every sub-module, function, search filter, reducer action, and store state, see [src/librarian/README.md](file:///d:/project/edusuite-pro/src/librarian/README.md).

## Architectural Standard
Conforms strictly to the **Golden Module Template (v2)**:
- **Decoupled Repositories**: Data access flows through `LibraryRepository` contract via `RepositoryFactory`.
- **Validation Tier**: Input validation enforced by `LibraryValidator`.
- **Event-Driven Integration**: Fires system events via `LibraryEvents`.
- **RBAC Enforcement**: Actions checked via `useLibraryPermissions`.

## Directory Structure
```text
library/
├── components/          # Reusable UI components
├── constants/           # Permissions and category configurations
├── events/              # Event bus publishers
├── hooks/               # React custom hooks
├── pages/               # Top-level view containers
├── repositories/        # Repository contracts and implementations
├── services/            # Domain service logic
├── types/               # TypeScript interface definitions
├── validators/          # Payload validators
├── module.json          # Module metadata manifest
└── index.ts             # Main entry point
```
