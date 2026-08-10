import { SubjectCard } from "./subject-card";
import { EmptyState } from "./empty-state";
import type { SubjectItem } from "@/data/faculty-mock-data";

interface SubjectGridProps {
  subjects: SubjectItem[];
  onSelectSubject: (subject: SubjectItem) => void;
}

export function SubjectGrid({ subjects, onSelectSubject }: SubjectGridProps) {
  if (subjects.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((sub) => (
        <SubjectCard
          key={sub.id}
          subject={sub}
          onClick={() => onSelectSubject(sub)}
        />
      ))}
    </div>
  );
}
