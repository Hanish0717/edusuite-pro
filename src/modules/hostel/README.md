# Hostel Management Module (v2 Golden Architecture)

## Overview
The Hostel Management Module manages student residential blocks, room & bed allocations, warden outing pass approvals, mess meal fee tracking, and hostel maintenance complaints.

## Architectural Standard
Conforms strictly to the **Golden Module Template (v2)**:
- **Decoupled Repositories**: Data access flows through `HostelRepository` contract via `RepositoryFactory`.
- **Validation Tier**: Input validation enforced by `HostelValidator`.
- **Event-Driven Integration**: Fires system events via `HostelEvents`.
- **RBAC Enforcement**: Actions checked via `useHostelPermissions`.
