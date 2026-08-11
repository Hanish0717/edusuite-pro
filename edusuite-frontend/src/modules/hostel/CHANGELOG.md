# Hostel Module Changelog

## [2.0.0] - 2026-08-10
### Refactored
- Upgraded Hostel module architecture to Golden Module Template (v2).
- Added Decoupled Repository pattern supporting Mock and Supabase data sources.
- Enforced validation layer via `HostelValidator.ts`.
- Integrated custom event publishing via `HostelEvents.ts`.
