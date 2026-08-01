# ERP System Architecture Standards

This document establishes the decoupled three-tier module architecture for all 17 system modules.

## Three-Tier Isolation Layers

```
┌───────────────────────────────────────────────┐
│                 View Layer                    │
│      (Pages, Visual Pipeline, Widgets)        │
└───────────────┬───────────────┬───────────────┘
                │               │
                ▼               ▼
┌───────────────────────────────────────────────┐
│                 Hooks Layer                   │
│         (React State, Event Triggers)         │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│               Service API Layer               │
│          (Fetch, Axios API Client)            │
└───────────────────────────────────────────────┘
```

1. **View Layer (`pages/`, `components/`)**:
   - Contains only presentation widgets.
   - Absolutely no raw HTTP endpoints, Axios connections, or state modification logic.
   - Decoupled from service layer by customs hooks.

2. **Hooks Layer (`hooks/`)**:
   - Manages asynchronous states, filters, search scopes, and dialog state bindings.
   - Exposes raw query flags to views.

3. **Services API Layer (`services/`)**:
   - Handles network queries.
   - Follows standard CRUD signatures (list, create, update, delete).
