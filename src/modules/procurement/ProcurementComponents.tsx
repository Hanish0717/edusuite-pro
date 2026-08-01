import React, { useEffect, useState } from "react";
import { ShoppingBag, Plus, GitPullRequest, CheckCircle2, Clock, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchPurchaseOrders, type PurchaseOrder } from "./ProcurementService";

export function ProcurementModuleView() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <ShoppingBag className="size-6 text-primary" /> Purchase & Procurement Module
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage vendor quotations, purchase requisitions, and multi-stage approval workflows.
          </p>
        </div>
        <Button className="bg-brand-gradient text-white gap-2 font-semibold shadow-glow">
          <Plus className="size-4" /> Raise Purchase Requisition
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Total Open Requisitions</span>
          <p className="text-2xl font-bold font-mono text-primary">{orders.length} Purchase Orders</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Total Commitment Value</span>
          <p className="text-2xl font-bold font-mono text-emerald-600">
            ₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Pending Approvals</span>
          <p className="text-2xl font-bold font-mono text-amber-600">
            {orders.filter((o) => !o.approvalStatus.includes("Approved")).length} Requests
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-bold text-base flex items-center gap-2">
          <GitPullRequest className="size-4 text-primary" /> Active Purchase Requisitions Ledger
        </h3>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading purchase requisitions...</p>
        ) : (
          <div className="divide-y divide-border/50">
            {orders.map((po) => (
              <div key={po.poNumber} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-primary">{po.poNumber}</span>
                    <Badge variant="outline" className="text-[0.65rem] font-mono">
                      {po.department} Dept
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{po.itemsDescription}</h4>
                  <p className="text-xs text-muted-foreground">
                    Vendor: <span className="font-semibold text-foreground">{po.vendorName}</span> | Requested by: <span className="font-medium text-foreground">{po.requestedBy}</span> on {po.requestDate}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="font-mono font-bold text-base text-emerald-600">
                    ₹{po.totalAmount.toLocaleString("en-IN")}
                  </span>
                  <Badge
                    className={
                      po.approvalStatus.includes("Approved")
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }
                  >
                    {po.approvalStatus.includes("Approved") ? <CheckCircle2 className="size-3 mr-1 inline" /> : <Clock className="size-3 mr-1 inline" />}
                    {po.approvalStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
