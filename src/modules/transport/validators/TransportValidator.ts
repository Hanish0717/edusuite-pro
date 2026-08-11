// =============================================================================
// TRANSPORT MODULE V2 INPUT VALIDATOR
// =============================================================================

import { RouteCreatePayload, BusPassIssuePayload } from "../types";

export class TransportValidator {
  static validateRoute(payload: Partial<RouteCreatePayload>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.routeName || payload.routeName.trim() === "") {
      errors.push("Route Name is required.");
    }
    if (!payload.routeCode || payload.routeCode.trim() === "") {
      errors.push("Route Code is required.");
    }
    if (!payload.startPoint || payload.startPoint.trim() === "") {
      errors.push("Start Origin Point is required.");
    }
    if (!payload.destination || payload.destination.trim() === "") {
      errors.push("Destination Point is required.");
    }
    if (payload.fareMonthly === undefined || payload.fareMonthly <= 0) {
      errors.push("Monthly fare must be greater than zero.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateBusPass(payload: Partial<BusPassIssuePayload>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.userId || payload.userId.trim() === "") {
      errors.push("User ID (Student/Faculty) is required.");
    }
    if (!payload.routeId || payload.routeId.trim() === "") {
      errors.push("Route selection is required.");
    }
    if (!payload.pickupStop || payload.pickupStop.trim() === "") {
      errors.push("Pickup Stop is required.");
    }
    if (!payload.validTo || payload.validTo.trim() === "") {
      errors.push("Validity Expiry Date is required.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
