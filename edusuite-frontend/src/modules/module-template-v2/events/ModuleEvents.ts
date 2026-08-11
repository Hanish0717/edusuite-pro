export const ModuleEvents = {
  CREATED: "module:created",
  UPDATED: "module:updated",
  DELETED: "module:deleted",

  publish(event: string, payload: any): void {
    console.log(`[ModuleEvents] Publishing event: ${event}`, payload);
    if (typeof window !== "undefined") {
      const customEvent = new CustomEvent(event, { detail: payload });
      window.dispatchEvent(customEvent);
    }
  }
} as const;
