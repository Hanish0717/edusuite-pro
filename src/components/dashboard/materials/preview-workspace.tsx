import { Eye, FileText, Play, Image as ImageIcon } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";

interface PreviewWorkspaceProps {
  fileType: "PDF" | "PPT" | "Video" | "DOC" | "ZIP";
  title: string;
}

export function PreviewWorkspace({ fileType, title }: PreviewWorkspaceProps) {
  return (
    <Panel
      title="ERP Document Preview Workspace"
      description="Simulated secure container rendering study worksheets in the web app"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="border rounded-2xl bg-muted/40 p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[220px]">
        {/* Render mockup players depending on format */}
        {fileType === "Video" ? (
          <div className="relative w-full aspect-video rounded-xl bg-black border flex items-center justify-center group overflow-hidden">
            <span className="grid size-12 place-items-center rounded-full bg-white/20 backdrop-blur-md text-white group-hover:scale-110 transition-transform">
              <Play className="size-6 fill-white" />
            </span>
            <p className="absolute bottom-2 left-2 text-[0.55rem] text-white/80 font-mono">Video Player: {title}</p>
          </div>
        ) : (
          <div className="space-y-3 flex flex-col items-center">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              {fileType === "PDF" ? <FileText className="size-5" /> : <ImageIcon className="size-5" />}
            </span>
            <div>
              <p className="font-extrabold text-[0.72rem] text-foreground leading-normal">{title}</p>
              <p className="text-[0.6rem] text-muted-foreground mt-0.5">Mock Secure {fileType} container loaded successfully.</p>
            </div>
            <div className="flex gap-2 pt-2 text-[0.6rem] font-bold text-muted-foreground">
              <span>Zoom 100%</span>
              <span>&middot;</span>
              <span>Page 1 of 12</span>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
