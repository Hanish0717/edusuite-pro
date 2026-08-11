// =============================================================================
// TRANSPORT MODULE V2 REPOSITORY CONTRACT INTERFACE
// =============================================================================

import { TransportRoute, TransportVehicle, TransportDriver, TransportPass, RouteCreatePayload, BusPassIssuePayload } from "../types";

export interface TransportRepository {
  getRoutes(): Promise<TransportRoute[]>;
  getRouteById(id: string): Promise<TransportRoute | null>;
  createRoute(routeData: RouteCreatePayload): Promise<TransportRoute>;
  
  getVehicles(): Promise<TransportVehicle[]>;
  getDrivers(): Promise<TransportDriver[]>;
  
  getPasses(): Promise<TransportPass[]>;
  issuePass(passData: BusPassIssuePayload): Promise<TransportPass>;
}
