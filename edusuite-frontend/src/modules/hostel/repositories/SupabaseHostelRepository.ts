// =============================================================================
// SUPABASE HOSTEL REPOSITORY IMPLEMENTATION
// =============================================================================

import { HostelRepository } from "./HostelRepository";
import { MockHostelRepository } from "./MockHostelRepository";
import { HostelBlock, HostelRoom, BedAllocation, OutingPass, HostelComplaint, RoomAllocationPayload, OutingRequestPayload } from "../types";

export class SupabaseHostelRepository implements HostelRepository {
  private fallback: MockHostelRepository = new MockHostelRepository();

  async getBlocks(): Promise<HostelBlock[]> {
    return this.fallback.getBlocks();
  }

  async getRooms(): Promise<HostelRoom[]> {
    return this.fallback.getRooms();
  }

  async getAllocations(): Promise<BedAllocation[]> {
    return this.fallback.getAllocations();
  }

  async allocateBed(payload: RoomAllocationPayload): Promise<BedAllocation> {
    return this.fallback.allocateBed(payload);
  }

  async getOutingPasses(): Promise<OutingPass[]> {
    return this.fallback.getOutingPasses();
  }

  async requestOuting(payload: OutingRequestPayload): Promise<OutingPass> {
    return this.fallback.requestOuting(payload);
  }

  async approveOuting(passId: string, wardenName: string): Promise<OutingPass> {
    return this.fallback.approveOuting(passId, wardenName);
  }

  async getComplaints(): Promise<HostelComplaint[]> {
    return this.fallback.getComplaints();
  }
}
