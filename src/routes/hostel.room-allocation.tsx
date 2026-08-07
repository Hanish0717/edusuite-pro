import { createFileRoute } from "@tanstack/react-router";
import { HostelRoomsView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/room-allocation")({
  head: () => ({
    meta: [{ title: "Room Allocation — EduSuite Pro Hostel" }],
  }),
  component: HostelRoomAllocationPage,
});

function HostelRoomAllocationPage() {
  return <HostelRoomsView />;
}
