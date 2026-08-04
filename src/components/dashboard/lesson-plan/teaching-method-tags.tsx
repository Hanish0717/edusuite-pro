import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";

interface TeachingMethodTagsProps {
  methods: string[];
}

export function TeachingMethodTags({ methods }: TeachingMethodTagsProps) {
  return (
    <Panel
      title="Teaching Methodologies Mapped"
      description="Active pedagogy techniques declared for syllabus delivery"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="flex flex-wrap gap-2 pt-1">
        {methods.map((method, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="rounded-lg bg-indigo-500/5 text-indigo-600 border border-indigo-500/10 py-1.5 px-3 font-semibold text-[0.68rem]"
          >
            {method}
          </Badge>
        ))}
      </div>
    </Panel>
  );
}
