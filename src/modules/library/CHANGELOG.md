# Library Module Changelog

## [2.0.0] - 2026-08-10
### Refactored
- Upgraded Library module architecture from monolithic single-file layout to Golden Module Template (v2).
- Added decoupled Repository Factory pattern supporting Mock and Supabase data sources.
- Implemented Zod/Payload validation in `LibraryValidator.ts`.
- Integrated inter-module events via `LibraryEvents.ts`.
