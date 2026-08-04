import { MapPin, Building2, Eye } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RoomAllocation } from "@/data/faculty-mock-data";

interface RoomAllocationTableProps {
  allocations: RoomAllocation[];
}

export function RoomAllocationTable({ allocations }: RoomAllocationTableProps) {
  return (
    <Panel
      title="Room & Lab Allocations"
      description="Assigned venues, capacities, and lab session directories"
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="overflow-x-auto text-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead className="w-[100px]">Room Number</TableHead>
              <TableHead className="w-[100px]">Building</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px] text-right">Capacity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map((alloc, idx) => (
              <TableRow key={idx} className="hover:bg-muted/40">
                <TableCell className="font-semibold text-xs">{alloc.subject} <span className="font-mono text-muted-foreground text-[0.65rem]">({alloc.code})</span></TableCell>
                <TableCell className="font-mono text-xs font-semibold flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-3" /> {alloc.room}
                </TableCell>
                <TableCell className="text-xs font-semibold">
                  <span className="flex items-center gap-1"><Building2 className="size-3 text-primary/60" /> {alloc.building}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[0.6rem] font-bold py-0.5 px-2 rounded-xl border ${
                      alloc.type === "Lab"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}
                  >
                    {alloc.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold text-right text-muted-foreground">
                  {alloc.capacity} Seats
                </TableCell>
              </TableRow>
            ))}
            {allocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-6">
                  No rooms or labs allocated.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Panel>
  );
}
