# Coding Guidelines & Standards

This document establishes TypeScript standards, naming conventions, and best practices.

## Coding Conventions

- **Strong Typing**: Avoid using `any`. Declare strict type mappings in `types/index.ts`.
- **Custom Hooks**: Every asynchronous operation must be wrapped inside a domain-specific custom hook.
- **Shared Primitives**: Rely strictly on the shared layout and UI component library.
