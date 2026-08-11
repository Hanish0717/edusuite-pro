// =============================================================================
// SUPABASE TRANSPORT REPOSITORY IMPLEMENTATION
// =============================================================================

import { TransportRepository } from "./TransportRepository";
import { MockTransportRepository } from "./MockTransportRepository";
import { TransportRoute, TransportVehicle, TransportDriver, TransportPass, RouteCreatePayload, BusPassIssuePayload } from "../types";

export class SupabaseTransportRepository implements TransportRepository {
  private fallback: MockTransportRepository = new MockTransportRepository();

  async getRoutes(): Promise<TransportRoute[]> {
    return this.fallback.getRoutes();
  }

  async getRouteById(id: string): Promise<TransportRoute | null> {
    return this.fallback.getRouteById(id);
  }

  async createRoute(routeData: RouteCreatePayload): Promise<TransportRoute> {
    return this.fallback.createRoute(routeData);
  }

  async getVehicles(): Promise<TransportVehicle[]> {
    return this.fallback.getVehicles();
  }

  async getDrivers(): Promise<TransportDriver[]> {
    return this.fallback.getDrivers();
  }

  async getPasses(): Promise<TransportPass[]> {
    return this.fallback.getPasses();
  }

  async issuePass(passData: BusPassIssuePayload): Promise<TransportPass> {
    return this.fallback.issuePass(passData);
  }
}
