# Module Standardization & Layout Blueprint

Every module must comply with the template directory structure to maintain uniform architecture.

## Structure Blueprint

```
src/modules/your-module/
├── pages/          # Full page views
├── components/     # Module widgets and cards
├── services/       # Service clients (Axios connectors)
├── hooks/          # Domain hooks
├── constants/      # Configuration lists
├── types/          # Typings
├── README.md       # Architectural summary
├── WORKFLOW.md     # Flowchart documentation
└── module.json     # Feature manifest
```

All dynamic pages must declare their properties in `module.json` for dynamic route discovery.
