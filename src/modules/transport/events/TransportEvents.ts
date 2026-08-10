// =============================================================================
// TRANSPORT MODULE V2 EVENT BUS PUBLISHER
// =============================================================================

export interface TransportEventMap {
  "transport:route_created": { routeId: string; routeName: string; busNumber: string };
  "transport:vehicle_updated": { vehicleId: string; status: string };
  "transport:driver_assigned": { driverId: string; routeId: string };
  "transport:pass_issued": { passId: string; userId: string; routeId: string; validTo: string };
}

export class TransportEvents {
  static publish<K extends keyof TransportEventMap>(event: K, payload: TransportEventMap[K]): void {
    if (typeof window !== "undefined") {
      const customEvent = new CustomEvent(event, { detail: payload });
      window.dispatchEvent(customEvent);
    }
  }

  static subscribe<K extends keyof TransportEventMap>(
    event: K,
    callback: (payload: TransportEventMap[K]) => void
  ): () => void {
    if (typeof window !== "undefined") {
      const handler = (e: Event) => callback((e as CustomEvent).detail);
      window.addEventListener(event, handler);
      return () => window.removeEventListener(event, handler);
    }
    return () => {};
  }
}
