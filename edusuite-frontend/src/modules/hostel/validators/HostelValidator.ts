// =============================================================================
// HOSTEL MODULE V2 INPUT VALIDATOR
// =============================================================================

import { RoomAllocationPayload, OutingRequestPayload } from "../types";

export class HostelValidator {
  static validateAllocation(payload: Partial<RoomAllocationPayload>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.studentId || payload.studentId.trim() === "") {
      errors.push("Student ID is required.");
    }
    if (!payload.blockId || payload.blockId.trim() === "") {
      errors.push("Hostel Block Selection is required.");
    }
    if (!payload.roomId || payload.roomId.trim() === "") {
      errors.push("Room Selection is required.");
    }
    if (!payload.bedNumber || payload.bedNumber.trim() === "") {
      errors.push("Bed Designation is required.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateOutingRequest(payload: Partial<OutingRequestPayload>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.studentId || payload.studentId.trim() === "") {
      errors.push("Student ID is required.");
    }
    if (!payload.purpose || payload.purpose.trim() === "") {
      errors.push("Outing Purpose is required.");
    }
    if (!payload.outTime || payload.outTime.trim() === "") {
      errors.push("Expected Departure Time is required.");
    }
    if (!payload.expectedInTime || payload.expectedInTime.trim() === "") {
      errors.push("Expected Return Time is required.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
