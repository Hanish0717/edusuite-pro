# Database & Seeding Standards

This document establishes schema validation rules and database mock-seeding procedures.

## Seeding Conventions

- **Mock Seeds**: Place mock seeds in the module's `services/mockData.ts`.
- **Casing & Consistency**: Department names and codes must align with `DepartmentCode` definitions.
- **Relational Keys**: Use matching student and faculty IDs to ensure clean joins.
