import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ClipboardList, BookOpen, Clock } from "lucide-react";

import { FolderExplorer } from "./folder-explorer";
import { PreviewWorkspace } from "./preview-workspace";
import { DownloadAnalytics } from "./download-analytics";
import { MaterialTimeline } from "./material-timeline";
import { VersionHistory } from "./version-history";
import { QuickActions } from "./quick-actions";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface MaterialDetailDrawerProps {
  material: StudyMaterialItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaterialDetailDrawer({ material, open, onOpenChange }: MaterialDetailDrawerProps) {
  if (!material) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[650px] overflow-y-auto rounded-l-3xl p-6 text-xs">
        <SheetHeader className="border-b border-border pb-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground font-mono font-bold text-[0.65rem] uppercase">
            <span>Code: {material.code}</span>
            <span>&middot;</span>
            <span>Size: {material.fileSize}</span>
            <span>&middot;</span>
            <span>AY {material.academicYear}</span>
          </div>
          <SheetTitle className="font-display text-lg font-extrabold text-foreground leading-snug">
            {material.title}
          </SheetTitle>
          <SheetDescription className="font-medium text-muted-foreground text-[0.7rem] leading-normal">
            Section: {material.section} &middot; Unit: {material.unit} &middot; Category: {material.category}
          </SheetDescription>
        </SheetHeader>

        {/* Tab panels */}
        <Tabs defaultValue="preview" className="w-full mt-6 space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto gap-1 bg-muted p-1 rounded-2xl">
            <TabsTrigger value="preview" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Preview</TabsTrigger>
            <TabsTrigger value="explorer" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Explorer</TabsTrigger>
            <TabsTrigger value="versions" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Versions</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Stats</TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Logs</TabsTrigger>
            <TabsTrigger value="actions" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Actions</TabsTrigger>
          </TabsList>

          {/* TAB CONTENTS */}
          <div className="focus-visible:outline-none">
            {/* PREVIEW WORKSPACE */}
            <TabsContent value="preview" className="focus-visible:outline-none space-y-4">
              <PreviewWorkspace fileType={material.fileType} title={material.title} />
            </TabsContent>

            {/* FOLDER EXPLORER TREE */}
            <TabsContent value="explorer" className="focus-visible:outline-none space-y-4">
              <FolderExplorer material={material} />
            </TabsContent>

            {/* VERSION HISTORY */}
            <TabsContent value="versions" className="focus-visible:outline-none space-y-4">
              <VersionHistory versions={material.versions} />
            </TabsContent>

            {/* DOWNLOAD ANALYTICS */}
            <TabsContent value="analytics" className="focus-visible:outline-none space-y-4">
              <DownloadAnalytics />
            </TabsContent>

            {/* MATERIAL TIMELINE */}
            <TabsContent value="timeline" className="focus-visible:outline-none space-y-4">
              <MaterialTimeline timeline={material.timeline} />
            </TabsContent>

            {/* QUICK ACTIONS */}
            <TabsContent value="actions" className="focus-visible:outline-none space-y-4">
              <QuickActions materialId={material.id} />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
