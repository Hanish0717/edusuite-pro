import { useState } from "react";
import { ToggleLeft, ToggleRight, Database } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Settings() {
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [riskAssessment, setRiskAssessment] = useState(true);
  const [chatbotAutoReply, setChatbotAutoReply] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Panel
        title="AI Thresholds & Integrations"
        description="Configure target triggers and automated webhook dispatches."
      >
        <div className="space-y-6 max-w-2xl pt-2">
          {/* Attendance setting */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h4 className="font-bold text-sm text-foreground">Automated Attendance Shortage Warnings</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dispatch SMS/Emails automatically if predicted end-sem attendance falls below 75%.
              </p>
            </div>
            <button
              onClick={() => {
                setAttendanceAlerts(!attendanceAlerts);
                toast.success(`Automated attendance triggers ${!attendanceAlerts ? "Enabled" : "Disabled"}.`);
              }}
              className="cursor-pointer text-primary hover:opacity-80 shrink-0"
            >
              {attendanceAlerts ? (
                <ToggleRight className="size-8 text-primary" />
              ) : (
                <ToggleLeft className="size-8 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Risk setting */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h4 className="font-bold text-sm text-foreground">Risk Classification Alerts to HODs</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Notify Department Heads when student academic risk scores scale past 80.
              </p>
            </div>
            <button
              onClick={() => {
                setRiskAssessment(!riskAssessment);
                toast.success(`HOD risk dispatches ${!riskAssessment ? "Enabled" : "Disabled"}.`);
              }}
              className="cursor-pointer text-primary hover:opacity-80 shrink-0"
            >
              {riskAssessment ? (
                <ToggleRight className="size-8 text-primary" />
              ) : (
                <ToggleLeft className="size-8 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Chatbot settings */}
          <div className="flex items-center justify-between pb-2">
            <div>
              <h4 className="font-bold text-sm text-foreground">LMS & Assignment Chatbot Auto-Response</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Authorize the LLM chatbot to resolve pending student assignments.
              </p>
            </div>
            <button
              onClick={() => {
                setChatbotAutoReply(!chatbotAutoReply);
                toast.success(`LMS chatbot answers ${!chatbotAutoReply ? "Enabled" : "Disabled"}.`);
              }}
              className="cursor-pointer text-primary hover:opacity-80 shrink-0"
            >
              {chatbotAutoReply ? (
                <ToggleRight className="size-8 text-primary" />
              ) : (
                <ToggleLeft className="size-8 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="pt-4 flex gap-2">
            <Button
              onClick={() => toast.success("Configuration successfully stored.")}
              className="bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer gap-1.5"
            >
              <Database className="size-3.5" /> Save Global Settings
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
