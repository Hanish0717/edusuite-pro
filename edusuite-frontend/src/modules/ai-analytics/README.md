# AI & Analytics Module

## Purpose
The **AI & Analytics** suite provides cross-institutional forecasting and risk analysis powered by Machine Learning classifiers (LSTM and XGBoost), allowing administrators and educators to identify academic warnings, automate notifications, and query data in natural language.

---

## Workflow Diagram
For complete details of operational data transitions, check [WORKFLOW.md](file:///f:/Projects/Edusuite/src/modules/ai-analytics/WORKFLOW.md).

---

## Features
1. **Attendance Forecasts**: Recurrent Neural Networks (LSTM) mapping biometric logs to semester-end attendance thresholds.
2. **Student Risk & Retention**: Classifiers scoring student profiles on internal grades, dues, and learning progress.
3. **AI Campus Chatbot**: LLM assistant resolving student queries regarding timetables, assignments, and exam hall-tickets.
4. **Compliance Audits**: Compilation and export engine for boards in PDF, Excel, and CSV formats.
5. **Real-time Alert Dispatcher**: Trigger warning alerts across SMTP and SMS channels.

---

## Connected Modules & Dependencies
This module interacts with other core systems as documented below:
- **Attendance**: Pulls biometric logs to trigger LSTM forecasting pipelines.
- **Student Profile**: Retrieves student IDs, enrollment histories, and department scopes.
- **Examinations**: Extracts semester internal marks to evaluate risk scores.
- **Finance (Fees)**: Pulls dues statuses to flag students with outstanding accounts.
- **LMS**: Inspects quiz logs and assignment timelines.
- **Hostel / Transport**: Tracks occupancy and transit details.

---

## Nested Routes Map
- `/ai-analytics/dashboard` -> Centralized KPI visualizer
- `/ai-analytics/attendance-prediction` -> Biometric predictions grid
- `/ai-analytics/student-risk` -> Academic risk index table
- `/ai-analytics/chatbot` -> Interactive LLM chat
- `/ai-analytics/reports` -> Complied download cards
- `/ai-analytics/notifications` -> Real-time alert logs
- `/ai-analytics/model-insights` -> Training metric parameters
- `/ai-analytics/settings` -> Automation triggers

---

## Permissions & RBAC Settings
Access matrix defined in `constants/permissions.ts`:
- **VIEW_DASHBOARD**: `["super-admin", "staff", "student", "parent"]`
- **VIEW_PREDICTIONS**: `["super-admin", "staff", "student", "parent"]`
- **TRIGGER_ALERTS**: `["super-admin", "staff"]`
- **UPDATE_RECOMMENDATIONS**: `["super-admin", "staff"]`
- **EXPORT_REPORTS**: `["super-admin", "staff"]`

---

## Future Backend APIs
Endpoints registered in `services/mockApi.ts`:
- `GET /attendance/predictions?department=[CODE]`
- `POST /attendance/alert`
- `GET /risk/assessments?department=[CODE]`
- `PUT /risk/recommendation`
- `POST /chatbot/message`
- `GET /reports/list`
- `POST /reports/export`
- `GET /notifications/list`
- `POST /notifications/trigger`

---

## Enterprise Guidelines
> **No module may directly import components from another module. Shared functionality must always be placed under `src/shared` and reused from there. Module-to-module interaction must happen through shared services, routing, or APIs, never by importing internal module components.**
