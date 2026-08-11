// =============================================================================
// MOCK TRANSPORT REPOSITORY IMPLEMENTATION
// =============================================================================

import { TransportRepository } from "./TransportRepository";
import { TransportRoute, TransportVehicle, TransportDriver, TransportPass, RouteCreatePayload, BusPassIssuePayload } from "../types";

export class MockTransportRepository implements TransportRepository {
  private routes: TransportRoute[] = [
    {
      id: "RT-01",
      routeName: "Route 1 - Srikakulam Central",
      routeCode: "R-101",
      startPoint: "Srikakulam Bus Complex",
      destination: "Campus Gate 1",
      totalDistanceKm: 34,
      totalDurationMin: 45,
      totalStops: 8,
      busNumber: "AP-39-T-1001",
      driverName: "K. Satish Sharma",
      driverPhone: "9848011221",
      fareMonthly: 1800,
      occupancy: "48 / 50",
      capacity: 50,
      status: "Active",
    },
    {
      id: "RT-02",
      routeName: "Route 2 - Vizianagaram Junction",
      routeCode: "R-102",
      startPoint: "Vizianagaram Clock Tower",
      destination: "Campus Main Quad",
      totalDistanceKm: 42,
      totalDurationMin: 55,
      totalStops: 10,
      busNumber: "AP-39-T-1002",
      driverName: "M. Ramesh Babu",
      driverPhone: "9848033442",
      fareMonthly: 2200,
      occupancy: "42 / 50",
      capacity: 50,
      status: "Active",
    },
  ];

  private vehicles: TransportVehicle[] = [
    {
      id: "VH-01",
      busNumber: "AP-39-T-1001",
      model: "Ashok Leyland Viking",
      registrationNumber: "AP-39-T-1001",
      capacity: 50,
      fuelType: "Diesel",
      currentKm: 45200,
      lastServiceDate: "2024-06-10",
      nextServiceDue: "2024-09-10",
      insuranceExpiry: "2025-03-31",
      fitnessCertificateExpiry: "2025-05-30",
      status: "Operational",
    },
  ];

  private drivers: TransportDriver[] = [
    {
      id: "DR-01",
      name: "K. Satish Sharma",
      phone: "9848011221",
      licenseNumber: "AP09201500441",
      licenseExpiry: "2028-12-31",
      experienceYears: 12,
      assignedVehicleId: "VH-01",
      status: "Active",
    },
  ];

  private passes: TransportPass[] = [];

  async getRoutes(): Promise<TransportRoute[]> {
    return [...this.routes];
  }

  async getRouteById(id: string): Promise<TransportRoute | null> {
    return this.routes.find((r) => r.id === id) || null;
  }

  async createRoute(payload: RouteCreatePayload): Promise<TransportRoute> {
    const newRoute: TransportRoute = {
      id: `RT-${Date.now()}`,
      routeName: payload.routeName,
      routeCode: payload.routeCode,
      startPoint: payload.startPoint,
      destination: payload.destination,
      totalDistanceKm: 25,
      totalDurationMin: 35,
      totalStops: 5,
      busNumber: payload.busNumber,
      driverName: payload.driverName,
      driverPhone: "9848000000",
      fareMonthly: payload.fareMonthly,
      occupancy: `0 / ${payload.capacity}`,
      capacity: payload.capacity,
      status: "Active",
    };
    this.routes.push(newRoute);
    return newRoute;
  }

  async getVehicles(): Promise<TransportVehicle[]> {
    return [...this.vehicles];
  }

  async getDrivers(): Promise<TransportDriver[]> {
    return [...this.drivers];
  }

  async getPasses(): Promise<TransportPass[]> {
    return [...this.passes];
  }

  async issuePass(payload: BusPassIssuePayload): Promise<TransportPass> {
    const route = await this.getRouteById(payload.routeId);
    const newPass: TransportPass = {
      id: `PASS-${Date.now()}`,
      passNumber: `BP-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: payload.userId,
      userName: payload.userName,
      userType: payload.userType,
      department: payload.department,
      routeId: payload.routeId,
      routeName: route ? route.routeName : "Assigned Route",
      pickupStop: payload.pickupStop,
      validFrom: new Date().toISOString().split("T")[0],
      validTo: payload.validTo,
      feeAmount: payload.feeAmount,
      paymentStatus: "Paid",
      qrCode: `QR-BP-${Date.now()}`,
      status: "Active",
    };
    this.passes.push(newPass);
    return newPass;
  }
}
