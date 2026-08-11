# Student Academic Promotion Workflow

This document outlines the standard operational procedure for advancing a student's academic standing (year and semester).

## Promotion Steps

1. **Eligibility Audit**: Verify that the student has paid outstanding dues and has no pending disciplinary restrictions.
2. **Rollover Trigger**: The Registrar triggers academic year promotion.
3. **Record Update**: The student's `academicYear` and `semester` are updated in the master database registry.
4. **Audit Logger**: A timeline audit event is logged (`studentRepository.addTimelineEvent`).
5. **Notification Dispatch**: A global `student:promoted` event is published, triggering SMS and email messages to parents.

## Event Payload Format

```json
{
  "studentId": "std-001",
  "newYear": "Year 2",
  "newSemester": 3
}
```
