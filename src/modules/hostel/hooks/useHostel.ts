// =============================================================================
// HOSTEL MODULE V2 MAIN REACT HOOK
// =============================================================================

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { HostelValidator } from "../validators/HostelValidator";
import { HostelEvents } from "../events/HostelEvents";
import { HostelBlock, HostelRoom, BedAllocation, OutingPass, HostelComplaint, RoomAllocationPayload, OutingRequestPayload } from "../types";

export function useHostel() {
  const repository = RepositoryFactory.getRepository(true);

  const [blocks, setBlocks] = useState<HostelBlock[]>([]);
  const [rooms, setRooms] = useState<HostelRoom[]>([]);
  const [allocations, setAllocations] = useState<BedAllocation[]>([]);
  const [passes, setPasses] = useState<OutingPass[]>([]);
  const [complaints, setComplaints] = useState<HostelComplaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedBlocks, fetchedRooms, fetchedAllocations, fetchedPasses, fetchedComplaints] = await Promise.all([
        repository.getBlocks(),
        repository.getRooms(),
        repository.getAllocations(),
        repository.getOutingPasses(),
        repository.getComplaints(),
      ]);
      setBlocks(fetchedBlocks);
      setRooms(fetchedRooms);
      setAllocations(fetchedAllocations);
      setPasses(fetchedPasses);
      setComplaints(fetchedComplaints);
    } catch (error) {
      toast.error("Failed to load Hostel data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAllocateBed = async (payload: RoomAllocationPayload) => {
    const { isValid, errors } = HostelValidator.validateAllocation(payload);
    if (!isValid) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    try {
      const newAllocation = await repository.allocateBed(payload);
      setAllocations((prev) => [newAllocation, ...prev]);
      HostelEvents.publish("hostel:room_allocated", {
        allocationId: newAllocation.id,
        studentId: payload.studentId,
        roomId: payload.roomId,
        bedNumber: payload.bedNumber,
      });
      toast.success("Hostel bed allocated successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to allocate bed.");
      return false;
    }
  };

  const handleRequestOuting = async (payload: OutingRequestPayload) => {
    const { isValid, errors } = HostelValidator.validateOutingRequest(payload);
    if (!isValid) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    try {
      const newPass = await repository.requestOuting(payload);
      setPasses((prev) => [newPass, ...prev]);
      HostelEvents.publish("hostel:outing_requested", {
        passId: newPass.id,
        studentId: payload.studentId,
        outTime: payload.outTime,
      });
      toast.success("Outing pass requested!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to request outing.");
      return false;
    }
  };

  const handleApproveOuting = async (passId: string, wardenName: string) => {
    try {
      const updatedPass = await repository.approveOuting(passId, wardenName);
      setPasses((prev) => prev.map((p) => (p.id === passId ? updatedPass : p)));
      HostelEvents.publish("hostel:outing_approved", {
        passId,
        studentId: updatedPass.studentId,
        approvedBy: wardenName,
      });
      toast.success("Outing pass approved!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to approve outing.");
      return false;
    }
  };

  return {
    blocks,
    rooms,
    allocations,
    passes,
    complaints,
    loading,
    allocateBed: handleAllocateBed,
    requestOuting: handleRequestOuting,
    approveOuting: handleApproveOuting,
    refresh: loadData,
  };
}
