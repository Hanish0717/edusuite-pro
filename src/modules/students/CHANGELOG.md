# Changelog - Students Module

All notable changes to the Students module will be documented in this file.

## [1.1.0] - 2026-08-03
### Added
- Added `workflow/` documentation folder containing `student-lifecycle.md`, `student-promotion.md`, `student-transfer.md`, and `student-graduation.md`.
- Added `events/StudentEvents.ts` to manage event types and decoupled DOM event publication.
- Added validation layer (`validators/StudentValidator.ts`) checking format and requirement criteria.
- Added permission hooks (`hooks/useStudentPermissions.ts`) gating access control elements.
- Exposed breadcrumb page metadata (`pageMeta`) in Students Registry and Dossier pages.
- Exposed `search()` and `bulkAction()` methods inside the Repository contract.

### Changed
- Refactored `StudentService.ts` to validate fields via `StudentValidator` and publish to the Event Bus via `StudentEvents`.
- Refactored `RepositoryFactory.ts` to utilize a lookup registry map of repository providers.

## [1.0.0] - 2026-08-03
### Added
- Initial release containing clean Student Registry roster dashboard and tabbed dossier profiles.
