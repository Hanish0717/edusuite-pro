import React, { useEffect, useState } from "react";
import { Package, Plus, AlertTriangle, CheckCircle, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchInventoryItems, type InventoryItem } from "./InventoryService";

export function InventoryModuleView() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventoryItems()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <Package className="size-6 text-primary" /> Inventory & Asset Tracking Module
          </h1>
          <p className="text-sm text-muted-foreground">
            Track lab equipment, IT assets, stationery thresholds, and campus store locations.
          </p>
        </div>
        <Button className="bg-brand-gradient text-white gap-2 font-semibold shadow-glow">
          <Plus className="size-4" /> Register New Asset
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search assets by name, category, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="outline" className="font-mono text-xs py-1.5 px-3">
          Low Stock Alerts: {items.filter((i) => i.status !== "In Stock").length}
        </Badge>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading asset inventory...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-mono text-[0.68rem]">
                  {item.id}
                </Badge>
                <Badge
                  className={
                    item.status === "In Stock"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : item.status === "Low Stock"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-red-500/10 text-red-600 border-red-500/20"
                  }
                >
                  {item.status !== "In Stock" && <AlertTriangle className="size-3 mr-1 inline" />}
                  {item.status === "In Stock" && <CheckCircle className="size-3 mr-1 inline" />}
                  {item.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Category: <span className="font-semibold text-primary">{item.category}</span> | Location: <span className="font-medium text-foreground">{item.location}</span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                <div>
                  <span className="text-muted-foreground">Quantity: </span>
                  <span className="font-bold font-mono text-foreground text-sm">{item.quantity}</span>
                  <span className="text-[0.65rem] text-muted-foreground ml-1">(Min: {item.minThreshold})</span>
                </div>
                <div className="text-right font-mono font-bold text-foreground">
                  ₹{item.unitCost.toLocaleString("en-IN")} / unit
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
