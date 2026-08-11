import { useState } from "react";
import { Users, Plus, ShieldCheck, Clock, XCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";
import { DelegationRecord } from "@/types/approval";
import { toast } from "sonner";

interface DelegationManagerProps {
  delegations: DelegationRecord[];
  onCreateDelegation: (delegation: Omit<DelegationRecord, "id" | "createdDate" | "status">) => void;
  onRevokeDelegation: (id: string) => void;
}

export function DelegationManager({
  delegations,
  onCreateDelegation,
  onRevokeDelegation,
}: DelegationManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [delegatorRole, setDelegatorRole] = useState("Dean");
  const [delegatorName, setDelegatorName] = useState("Dr. S. K. Gupta");
  const [delegateeRole, setDelegateeRole] = useState("Vice Dean");
  const [delegateeName, setDelegateeName] = useState("Prof. R. V. Sharma");
  const [scope, setScope] = useState("Academic Attendance & Course Overrides");
  const [validFrom, setValidFrom] = useState("2026-08-04");
  const [validUntil, setValidUntil] = useState("2026-08-14");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegatorName.trim() || !delegateeName.trim()) {
      toast.error("Please enter both delegator and delegatee names.");
      return;
    }

    onCreateDelegation({
      delegatorRole,
      delegatorName: delegatorName.trim(),
      delegateeRole,
      delegateeName: delegateeName.trim(),
      validFrom,
      validUntil,
      scope,
    });

    toast.success(`Delegation assigned from ${delegatorName} to ${delegateeName}`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Temporary Approval Authority Delegation"
        description="Super Admin can delegate approval privileges during leaves or executive absences with strict auto-expiration dates"
        action={
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-gradient text-xs font-bold cursor-pointer gap-1.5"
          >
            <Plus className="size-4" /> Create New Delegation
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground font-mono uppercase text-[0.68rem] tracking-wider">
                <th className="py-2.5 px-3">Delegation ID</th>
                <th className="py-2.5 px-3">Delegator (Primary)</th>
                <th className="py-2.5 px-3">Delegatee (Designated)</th>
                <th className="py-2.5 px-3">Scope / Module</th>
                <th className="py-2.5 px-3">Validity Window</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {delegations.map((del) => (
                <tr key={del.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-primary">{del.id}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-foreground block">{del.delegatorName}</span>
                    <span className="text-[0.68rem] font-mono text-muted-foreground">{del.delegatorRole}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                      {del.delegateeName}
                    </span>
                    <span className="text-[0.68rem] font-mono text-muted-foreground">{del.delegateeRole}</span>
                  </td>
                  <td className="py-3 px-3 max-w-[180px] truncate text-muted-foreground">
                    {del.scope}
                  </td>
                  <td className="py-3 px-3 font-mono text-[0.72rem]">
                    {del.validFrom} → {del.validUntil}
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      className={
                        del.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : del.status === "Revoked"
                          ? "bg-destructive/10 text-destructive border-destructive/30"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {del.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {del.status === "Active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          onRevokeDelegation(del.id);
                          toast.warning(`Revoked delegation ${del.id}`);
                        }}
                        className="text-destructive hover:bg-destructive/10 text-xs h-7 px-2 cursor-pointer"
                      >
                        <XCircle className="size-3.5 mr-1" /> Revoke
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* CREATE DELEGATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-soft">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-extrabold flex items-center gap-2">
                <UserCheck className="size-5 text-primary" /> Assign Approval Delegation
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Delegator Role:
                  </label>
                  <select
                    value={delegatorRole}
                    onChange={(e) => setDelegatorRole(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium cursor-pointer"
                  >
                    <option value="Dean">Dean</option>
                    <option value="HOD">HOD</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Finance Officer">Finance Officer</option>
                    <option value="Principal">Principal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Delegator Name:
                  </label>
                  <Input
                    value={delegatorName}
                    onChange={(e) => setDelegatorName(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Delegatee Role:
                  </label>
                  <select
                    value={delegateeRole}
                    onChange={(e) => setDelegateeRole(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium cursor-pointer"
                  >
                    <option value="Vice Dean">Vice Dean</option>
                    <option value="Senior Faculty">Senior Faculty</option>
                    <option value="Assistant HR">Assistant HR</option>
                    <option value="Assistant Finance Officer">Assistant Finance Officer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Delegatee Name:
                  </label>
                  <Input
                    value={delegateeName}
                    onChange={(e) => setDelegateeName(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Valid From Date:
                  </label>
                  <Input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Valid Until Date:
                  </label>
                  <Input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Delegation Scope / Permissions:
                </label>
                <Input
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="e.g. Attendance Overrides & Course Sign-offs"
                  className="text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/80">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand-gradient text-xs font-bold cursor-pointer">
                  Assign Delegation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
