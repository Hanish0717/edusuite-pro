// =============================================================================
// HOSTEL MODULE V2 REPOSITORY CONTRACT INTERFACE
// =============================================================================

import { HostelBlock, HostelRoom, BedAllocation, OutingPass, HostelComplaint, RoomAllocationPayload, OutingRequestPayload } from "../types";

export interface HostelRepository {
  getBlocks(): Promise<HostelBlock[]>;
  getRooms(): Promise<HostelRoom[]>;
  
  getAllocations(): Promise<BedAllocation[]>;
  allocateBed(payload: RoomAllocationPayload): Promise<BedAllocation>;
  
  getOutingPasses(): Promise<OutingPass[]>;
  requestOuting(payload: OutingRequestPayload): Promise<OutingPass>;
  approveOuting(passId: string, wardenName: string): Promise<OutingPass>;
  
  getComplaints(): Promise<HostelComplaint[]>;
}
