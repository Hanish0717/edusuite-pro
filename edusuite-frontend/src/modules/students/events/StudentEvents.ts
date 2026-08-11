export const StudentEvents = {
  CREATED: "student:created",
  UPDATED: "student:updated",
  DELETED: "student:deleted",
  TRANSFERRED: "student:transferred",
  PROMOTED: "student:promoted",
  GRADUATED: "student:graduated",
  DOCUMENT_VERIFIED: "student:document_verified",

  /**
   * Dispatches a decoupled event to the ERP Event Bus (represented via custom browser events)
   */
  publish(event: string, payload: any): void {
    console.log(`[StudentEvents] Publishing event: ${event}`, payload);
    if (typeof window !== "undefined") {
      const customEvent = new CustomEvent(event, { detail: payload });
      window.dispatchEvent(customEvent);
    }
  }
} as const;
