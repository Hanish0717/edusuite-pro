// =============================================================================
// MOCK HOSTEL REPOSITORY IMPLEMENTATION
// =============================================================================

import { HostelRepository } from "./HostelRepository";
import { HostelBlock, HostelRoom, BedAllocation, OutingPass, HostelComplaint, RoomAllocationPayload, OutingRequestPayload } from "../types";

export class MockHostelRepository implements HostelRepository {
  private blocks: HostelBlock[] = [
    {
      id: "BLK-01",
      blockName: "A-Block (Vivekananda Hostel)",
      gender: "Boys",
      wardenName: "Dr. K. Srinivas Rao",
      wardenPhone: "9848099881",
      totalFloors: 4,
      totalRooms: 60,
      totalCapacity: 240,
      occupiedBeds: 210,
      availableBeds: 30,
      status: "Active",
    },
    {
      id: "BLK-02",
      blockName: "B-Block (Sarojini Naidu Hostel)",
      gender: "Girls",
      wardenName: "Prof. M. Lakshmi Devi",
      wardenPhone: "9848099882",
      totalFloors: 4,
      totalRooms: 60,
      totalCapacity: 240,
      occupiedBeds: 225,
      availableBeds: 15,
      status: "Active",
    },
  ];

  private rooms: HostelRoom[] = [
    {
      id: "RM-101",
      blockId: "BLK-01",
      blockName: "A-Block (Vivekananda Hostel)",
      roomNumber: "A-101",
      floor: 1,
      roomType: "Four Sharing",
      capacity: 4,
      occupied: 3,
      status: "Available",
      annualFee: 45000,
    },
  ];

  private allocations: BedAllocation[] = [];
  private passes: OutingPass[] = [];
  private complaints: HostelComplaint[] = [];

  async getBlocks(): Promise<HostelBlock[]> {
    return [...this.blocks];
  }

  async getRooms(): Promise<HostelRoom[]> {
    return [...this.rooms];
  }

  async getAllocations(): Promise<BedAllocation[]> {
    return [...this.allocations];
  }

  async allocateBed(payload: RoomAllocationPayload): Promise<BedAllocation> {
    const block = this.blocks.find((b) => b.id === payload.blockId);
    const room = this.rooms.find((r) => r.id === payload.roomId);

    const newAllocation: BedAllocation = {
      id: `ALLOC-${Date.now()}`,
      studentId: payload.studentId,
      studentName: payload.studentName,
      rollNo: payload.rollNo,
      department: payload.department,
      year: payload.year,
      blockId: payload.blockId,
      blockName: block ? block.blockName : "Hostel Block",
      roomId: payload.roomId,
      roomNumber: room ? room.roomNumber : "R-101",
      bedNumber: payload.bedNumber,
      allocatedDate: new Date().toISOString().split("T")[0],
      feeStatus: "Paid",
    };
    this.allocations.push(newAllocation);
    return newAllocation;
  }

  async getOutingPasses(): Promise<OutingPass[]> {
    return [...this.passes];
  }

  async requestOuting(payload: OutingRequestPayload): Promise<OutingPass> {
    const newPass: OutingPass = {
      id: `OUT-${Date.now()}`,
      passNumber: `GP-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: payload.studentId,
      studentName: payload.studentName,
      rollNo: payload.rollNo,
      blockName: payload.blockName,
      roomNumber: payload.roomNumber,
      outingType: payload.outingType,
      purpose: payload.purpose,
      outTime: payload.outTime,
      expectedInTime: payload.expectedInTime,
      parentConsent: "Approved",
      status: "Requested",
    };
    this.passes.push(newPass);
    return newPass;
  }

  async approveOuting(passId: string, wardenName: string): Promise<OutingPass> {
    const pass = this.passes.find((p) => p.id === passId);
    if (!pass) throw new Error("Outing pass not found");

    pass.status = "Approved";
    return pass;
  }

  async getComplaints(): Promise<HostelComplaint[]> {
    return [...this.complaints];
  }
}
