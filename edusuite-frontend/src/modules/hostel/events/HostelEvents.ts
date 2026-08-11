// =============================================================================
// HOSTEL MODULE V2 EVENT BUS PUBLISHER
// =============================================================================

export interface HostelEventMap {
  "hostel:room_allocated": { allocationId: string; studentId: string; roomId: string; bedNumber: string };
  "hostel:outing_requested": { passId: string; studentId: string; outTime: string };
  "hostel:outing_approved": { passId: string; studentId: string; approvedBy: string };
  "hostel:complaint_raised": { complaintId: string; category: string; priority: string };
}

export class HostelEvents {
  static publish<K extends keyof HostelEventMap>(event: K, payload: HostelEventMap[K]): void {
    if (typeof window !== "undefined") {
      const customEvent = new CustomEvent(event, { detail: payload });
      window.dispatchEvent(customEvent);
    }
  }

  static subscribe<K extends keyof HostelEventMap>(
    event: K,
    callback: (payload: HostelEventMap[K]) => void
  ): () => void {
    if (typeof window !== "undefined") {
      const handler = (e: Event) => callback((e as CustomEvent).detail);
      window.addEventListener(event, handler);
      return () => window.removeEventListener(event, handler);
    }
    return () => {};
  }
}
