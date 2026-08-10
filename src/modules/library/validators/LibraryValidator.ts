// =============================================================================
// LIBRARY MODULE V2 INPUT VALIDATOR
// =============================================================================

import { BookIssuePayload, BookReturnPayload, FinePaymentPayload } from "../types";

export class LibraryValidator {
  static validateIssuePayload(payload: Partial<BookIssuePayload>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.bookId || payload.bookId.trim() === "") {
      errors.push("Book Selection is required.");
    }
    if (!payload.memberId || payload.memberId.trim() === "") {
      errors.push("Member / Student ID is required.");
    }
    if (!payload.dueDate || payload.dueDate.trim() === "") {
      errors.push("Due Date is required.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateReturnPayload(payload: Partial<BookReturnPayload>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.issueId || payload.issueId.trim() === "") {
      errors.push("Active Issue Record ID is required.");
    }
    if (!payload.returnCondition) {
      errors.push("Return Condition must be specified.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateFinePayment(payload: Partial<FinePaymentPayload>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.fineId) {
      errors.push("Fine Record ID is required.");
    }
    if (payload.amountPaid === undefined || payload.amountPaid <= 0) {
      errors.push("Amount paid must be greater than zero.");
    }
    if (!payload.paymentMode) {
      errors.push("Payment Mode is required.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
