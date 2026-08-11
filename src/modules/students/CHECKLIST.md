# Module Quality & Compliance Checklist

Use this checklist when building or auditing any of the 17 ERP modules to ensure 100% architectural parity.

## 1. Directory Structure Compliance
- [ ] Sub-directories segregated correctly (`pages/`, `components/`, `hooks/`, `repositories/`, `services/`, `dialogs/`, `types/`, `constants/`, `events/`, `validators/`, `workflow/`).
- [ ] Export entrypoint configured at `index.ts` of the module root.

## 2. Decoupled Data Pattern
- [ ] Interface defined in `<ModuleName>Repository.ts`.
- [ ] Config-driven `RepositoryFactory.ts` dynamically maps provider subclasses (Mock, Supabase).
- [ ] Interface supports standard query options (`search`, `sort`, `filter`, `paginate`, `bulkAction`).

## 3. Operations & Validation
- [ ] Inputs validated using a dedicated `<ModuleName>Validator.ts` class before mutation.
- [ ] Lifecycle modifications published via a dedicated `<ModuleName>Events.ts` handler.

## 4. UI & Access Control
- [ ] Actions and triggers gated using the module's custom permissions hook.
- [ ] Navigation targets define breadcrumb `pageMeta` structures.
- [ ] Cross-module integrations connected via a dedicated Connections hub or cards.

## 5. Documentation Package
- [ ] `README.md` explains design principles and directory mapping.
- [ ] `WORKFLOW.md` explains visual charts and lifecycle states.
- [ ] `CHANGELOG.md` tracks releases.
- [ ] `module.json` defines version, icons, dependencies, permissions, and future endpoints.
