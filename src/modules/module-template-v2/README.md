# Golden Module Template (v2)

This folder contains the standardized blueprint boilerplate for all EduSuite Pro ERP modules.

## How to clone this template

1. Copy the `module-template-v2` directory to a new directory under `src/modules/` (e.g. `academics`).
2. Search and replace all occurrences of `Module` (case sensitive) with your module name (e.g. `Academic`).
3. Define your types inside `types/index.ts` and constants in `constants/index.ts`.
4. Implement specific queries in the repository interfaces and services.
5. Create file-based routes under `src/routes/` mounting the custom entry points.
