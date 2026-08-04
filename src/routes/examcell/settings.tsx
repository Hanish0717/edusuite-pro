import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/examcell/settings")({
  head: () => ({
    meta: [{ title: "Exam Cell Settings — EduSuite Pro" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Exam cell settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure default examination rules, grades thresholds, and system preferences.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Panel title="Configuration Panel" icon={Settings}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">
                College Code (for Hall Tickets prefix)
              </label>
              <Input
                defaultValue="HITAM-26"
                className="h-10 text-xs font-semibold rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Default Mid Marks Max
                </label>
                <Input
                  type="number"
                  defaultValue={20}
                  className="h-10 text-xs font-semibold rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Default Assignment Marks Max
                </label>
                <Input
                  type="number"
                  defaultValue={10}
                  className="h-10 text-xs font-semibold rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="bg-brand-gradient text-white rounded-xl h-10 font-bold shadow-glow cursor-pointer">
                <Save className="size-4 mr-2" /> Save Settings
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
