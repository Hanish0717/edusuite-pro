# Standard ERP Module Template

This directory establishes the official scaffold and structure required for every ERP module.

---

## 1. Directory Structure

Ensure your module adheres exactly to the layout below:

```text
module/
│
├── pages/                 # Routing pages & views
├── components/            # UI components
│   ├── cards/             # Metric cards, visual panels
│   ├── tables/            # Dedicated tables
│   ├── dialogs/           # Modal dialogs
│   ├── forms/             # Component form wrappers
│   └── layout/            # Module sidebar/nav elements
│
├── hooks/                 # Custom state hooks
├── services/              # API and mock data drivers
├── repositories/          # Repository Pattern interfaces & selectors
├── constants/             # Module permission codes, menu configs
├── types/                 # TypeScript interfaces
├── utils/                 # General helpers
├── workflow/              # Workflow definitions
├── README.md              # Technical overview
├── WORKFLOW.md            # Mermaid graph maps
└── module.json            # Manifest file
```

---

## 2. Integration Pipeline

1. **Scaffold**: Copy this folder and rename it to your target module name.
2. **Manifest**: Configure metadata and feature toggles inside `module.json`.
3. **Register**: Add module sidebar routes to `src/shared/config/navigation.config.ts`.
4. **Implement**: Create repository interfaces, mock implementations, hooks, and views following the guidelines in the `docs/` folder.
