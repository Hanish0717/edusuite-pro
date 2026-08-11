# Student Graduation & Alumni Workflow

This document tracks the workflow when a student graduates.

## Graduation Checklist

1. **Credit Requirements**: Confirm total academic credits meet program standards.
2. **Finance Clearance**: Verify zero outstanding balance (`feeAmount` matches `feePaid`).
3. **Library Clearance**: Ensure no books are currently borrowed.
4. **Hostel & Transport Checkout**: Confirm roommate keys are returned and bus passes revoked.
5. **Transition Update**: Set student `status` to `Graduated` and `placementEligible` to `false`.
6. **Alumni Creation**: Publish a `student:graduated` event to export demographics to the Alumni database.
