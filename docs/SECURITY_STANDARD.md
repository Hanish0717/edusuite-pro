# Security & Authorization Standards

This document establishes role-based authorization patterns.

## Authorization Standards

- **Role Checks**: Restrict pages using the global `RoleGuard` component.
- **Context Access**: Consume permissions via `usePermissions()` in page views.
- **Granular Actions**: Render action buttons (e.g. override, manual notifications) conditionally based on specific role permissions.
