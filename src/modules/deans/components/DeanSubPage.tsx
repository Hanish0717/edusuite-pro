// Shared stub component for dean sub-pages that haven't been built out yet.
// Each sub-page uses this to render a contextual placeholder with the page title.
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import { toast } from "sonner";

interface DeanSubPageProps {
  title: string;
  description?: string;
  dean: string;
}

export function DeanSubPage({ title, description, dean }: DeanSubPageProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {description || `${dean} — ${title}`}
        </p>
      </div>
      <Panel
        title={title}
        description={`${dean} module — detailed content is loading`}
      >
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <Construction className="size-12 text-primary/40" />
          <div>
            <p className="font-bold text-lg">{title}</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              This page is part of the <strong>{dean}</strong> portal.
              The full module content will render here.
            </p>
          </div>
          <Button
            onClick={() => toast.success(`${title} action triggered`)}
            className="mt-2"
          >
            Open {title}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
