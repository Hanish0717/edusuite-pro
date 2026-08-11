import { AlertTriangle, UserX, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DangerZone() {
  const handleDeactivate = () => {
    toast.error("Deactivate Request Submitted", {
      description: "Department admin review required to deactivate faculty portal access.",
    });
  };

  const handleDelete = () => {
    toast.error("Account Deletion Restricted", {
      description: "Contact Institute Super Admin to delete employee records.",
    });
  };

  const handleLogoutAll = () => {
    toast.success("Logging out of all active sessions...", {
      description: "Redirecting to security sign-in page.",
    });
  };

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-rose-500/20">
        <div className="size-9 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <AlertTriangle className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-rose-600 dark:text-rose-400">Danger Zone</h3>
          <p className="text-xs text-muted-foreground">Irreversible account actions, security revocation, and profile deactivation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Deactivate Account */}
        <div className="p-4 rounded-xl border border-rose-500/20 bg-background/60 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-foreground flex items-center gap-1.5">
              <UserX className="size-3.5 text-rose-500" /> Deactivate Account
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Temporarily disable your faculty portal access. Account can be reactivated by Admin.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-bold text-rose-600 border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-950/30 w-full"
            onClick={handleDeactivate}
          >
            Deactivate Account
          </Button>
        </div>

        {/* Logout All Devices */}
        <div className="p-4 rounded-xl border border-rose-500/20 bg-background/60 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-foreground flex items-center gap-1.5">
              <LogOut className="size-3.5 text-rose-500" /> Logout All Devices
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Revoke active authentication tokens across all mobile, desktop, and web sessions.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-bold text-rose-600 border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-950/30 w-full"
            onClick={handleLogoutAll}
          >
            Logout All Devices
          </Button>
        </div>

        {/* Delete Account */}
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Trash2 className="size-3.5" /> Delete Account Permanently
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Permanently purge faculty login credentials and active preferences from the institute database.
            </p>
          </div>
          <Button
            size="sm"
            className="h-8 text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 w-full"
            onClick={handleDelete}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
