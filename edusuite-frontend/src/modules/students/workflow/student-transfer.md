# Student Department/Section Transfer Workflow

This document covers department transfers and section re-allocations.

## Transfer Procedure

1. **Transfer Request**: Initiated by HOD or student via administrative registry.
2. **Availability Check**: Verify section capacity in the target department.
3. **Execution**: Update the student's `department` and `section` attributes.
4. **Audit Logger**: Log old and new department settings in the student's timeline.
5. **Decoupled Notification**: Dispatches the `student:transferred` event to sync workspace rosters.

## Event Payload Format

```json
{
  "studentId": "std-001",
  "oldDept": "ME",
  "oldSec": "A",
  "newDept": "CSE",
  "newSec": "B"
}
```
