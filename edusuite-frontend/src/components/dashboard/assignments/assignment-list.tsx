import { AssignmentCard } from "./assignment-card";
import { EmptyState } from "./empty-state";
import type { AssignmentItem } from "@/data/faculty-mock-data";

interface AssignmentListProps {
  assignments: AssignmentItem[];
  onSelectAssignment: (assignment: AssignmentItem) => void;
}

export function AssignmentList({ assignments, onSelectAssignment }: AssignmentListProps) {
  if (assignments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assignments.map((item) => (
        <AssignmentCard
          key={item.id}
          assignment={item}
          onClick={() => onSelectAssignment(item)}
        />
      ))}
    </div>
  );
}
