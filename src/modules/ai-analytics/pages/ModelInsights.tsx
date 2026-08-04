import { Brain, Sparkles } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ModelInsights() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid gap-6 md:grid-cols-2">
        <Panel
          title="Attendance Forecast Model (LSTM)"
          description="Recurrent Neural Networks tracking chronological student check-ins."
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-semibold">Model Architecture</span>
              <span className="font-bold font-mono">LSTM (3 Layers)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-semibold">Training Loss</span>
              <span className="font-bold font-mono text-emerald-600">0.024 (MAE)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-semibold">Validation Accuracy</span>
              <span className="font-bold font-mono text-primary">94.2%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-semibold">Last Trained</span>
              <span className="font-bold font-mono">2026-08-01 02:00 AM</span>
            </div>
            <div className="border-t border-border/40 pt-4 flex gap-2">
              <Button
                onClick={() => toast.success("Attendance model training queued.")}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer gap-1.5"
              >
                <Brain className="size-3.5" /> Retrain Model
              </Button>
            </div>
          </div>
        </Panel>

        <Panel
          title="Academic Risk Classifier (XGBoost)"
          description="Gradient boosted decision trees identifying cohort performance indicators."
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-semibold">Model Architecture</span>
              <span className="font-bold font-mono">XGBoost Classifier</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-semibold">F1-Score</span>
              <span className="font-bold font-mono text-emerald-600">0.912</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-semibold">Precision / Recall</span>
              <span className="font-bold font-mono text-primary">0.898 / 0.924</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-semibold">Dataset Records</span>
              <span className="font-bold font-mono">14,200 checkpoints</span>
            </div>
            <div className="border-t border-border/40 pt-4 flex gap-2">
              <Button
                onClick={() => toast.success("XGBoost classifier optimization started.")}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer gap-1.5"
              >
                <Sparkles className="size-3.5" /> Optimize Trees
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
