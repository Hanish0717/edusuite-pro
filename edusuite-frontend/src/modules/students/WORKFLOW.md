# Student Lifecycle Workflows

This document tracks the comprehensive lifecycle stages of a student record inside the EduSuite Pro ERP.

## Lifecycle Milestones

```mermaid
graph TD
    Admission[1. Admission Registered] --> Verify[2. Documents Verified]
    Verify --> RollGen[3. Roll Number Allocated]
    RollGen --> Allocation[4. Department & Section Assigned]
    Allocation --> FeeAssign[5. Tuition Fee Assigned]
    FeeAssign --> PortalAct[6. LMS & Library Activated]
    PortalAct --> Tracking[7. Attendance & Academic Tracking]
    Tracking --> Exams[8. Internal & Semester Examinations]
    Exams --> Placement[9. Placement Standing Drive]
    Placement --> Alumni[10. Graduated Alumni Status]
```

## Decoupled Event Publication Pipeline

Instead of hardcoupling notifications inside the Students domain, actions publish global events caught by the Notification Platform.

```mermaid
sequenceDiagram
    participant S as StudentService
    participant EB as EventBus
    participant NP as NotificationPlatform
    participant P as Parents/Students

    S->>EB: publish(student:promoted, studentId)
    EB->>NP: receive event trigger
    NP->>NP: fetch contact numbers & templates
    NP->>P: send SMS/Email/In-App Alert
```
