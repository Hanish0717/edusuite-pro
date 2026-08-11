import { FileMinus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-3xl bg-card space-y-4 text-xs">
      <div className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <FileMinus className="size-6" />
      </div>
      <div>
        <h3 className="text-sm font-extrabold text-foreground">No study materials uploaded</h3>
        <p className="text-[0.7rem] text-muted-foreground mt-0.5 leading-normal max-w-[280px]">
          There are no reference worksheets or notes files matching your active search and filters.
        </p>
      </div>
    </div>
  );
}
