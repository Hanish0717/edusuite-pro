import React, { useEffect, useState } from "react";
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle,
  Search,
  RefreshCw,
  Download,
  Filter,
  Layers,
  Edit,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  Building2,
  DollarSign,
  TrendingDown,
  Box,
  PlusCircle,
  Barcode,
  Calendar,
  BarChart3,
  Settings2,
  Truck,
  ClipboardCheck,
  ShieldCheck,
  ArrowRight,
  Siren,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  fetchInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  INITIAL_INVENTORY_ITEMS,
  type InventoryItem,
} from "./InventoryService";

const CATEGORIES = [
  "All Categories",
  "IT Hardware",
  "Lab Equipment",
  "Furniture",
  "Stationery",
  "Sports Gear",
];

const STATUS_OPTIONS = ["All Statuses", "In Stock", "Low Stock", "Out of Stock"];

type InventoryDashboardSectionId =
  "settings" | "analytics" | "procurement" | "vendors" | "monitoring" | "audit" | "approvals";

const INVENTORY_DASHBOARD_SECTIONS: Array<{
  id: InventoryDashboardSectionId;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClassName: string;
  summary: string;
}> = [
  {
    id: "settings",
    title: "Inventory Settings",
    description: "Tune thresholds, storage rules, and campus-wide inventory defaults.",
    icon: Settings2,
    accentClassName: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    summary: "Core control plane",
  },
  {
    id: "analytics",
    title: "Inventory Analytics",
    description: "Track valuation, category mix, and stock health across the campus.",
    icon: BarChart3,
    accentClassName: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    summary: "Live KPI intelligence",
  },
  {
    id: "procurement",
    title: "Procurement Policies",
    description: "Standardize reorder approval, preferred sourcing, and purchase rules.",
    icon: ClipboardCheck,
    accentClassName: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    summary: "Policy guardrails",
  },
  {
    id: "vendors",
    title: "Vendor Management",
    description: "Coordinate approved suppliers, SLA status, and fulfilment performance.",
    icon: Truck,
    accentClassName: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    summary: "Supplier operations",
  },
  {
    id: "monitoring",
    title: "Asset Monitoring",
    description: "Watch low-stock assets, locations, and restock urgency in real time.",
    icon: Package,
    accentClassName: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    summary: "Health and movement",
  },
  {
    id: "audit",
    title: "Audit & Compliance",
    description: "Keep a traceable inventory history for inspections and reviews.",
    icon: ShieldCheck,
    accentClassName: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    summary: "Governance trail",
  },
  {
    id: "approvals",
    title: "Emergency Approvals",
    description: "Fast-track critical purchases and urgent stock release decisions.",
    icon: Siren,
    accentClassName: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    summary: "Critical response lane",
  },
];

const PROCUREMENT_METRICS = [
  {
    label: "Total Purchase Requests",
    value: "128",
    note: "18 raised this week",
    icon: ClipboardCheck,
    accentClassName: "text-slate-600",
  },
  {
    label: "Pending Approvals",
    value: "24",
    note: "Awaiting authority sign-off",
    icon: AlertTriangle,
    accentClassName: "text-amber-600",
  },
  {
    label: "Active Purchase Orders",
    value: "42",
    note: "Vendor execution in progress",
    icon: Truck,
    accentClassName: "text-blue-600",
  },
  {
    label: "Pending Deliveries",
    value: "15",
    note: "Due within 7 days",
    icon: Package,
    accentClassName: "text-violet-600",
  },
  {
    label: "Pending Payments",
    value: "₹3.8L",
    note: "Invoices awaiting release",
    icon: DollarSign,
    accentClassName: "text-emerald-600",
  },
  {
    label: "Monthly/Yearly Spending",
    value: "₹9.4L / ₹1.12Cr",
    note: "Month / fiscal year",
    icon: Calendar,
    accentClassName: "text-rose-600",
  },
  {
    label: "Budget Utilization",
    value: "68%",
    note: "Within approved range",
    icon: BarChart3,
    accentClassName: "text-indigo-600",
  },
  {
    label: "Vendor Performance",
    value: "94.2%",
    note: "On-time fulfilment average",
    icon: Truck,
    accentClassName: "text-amber-700",
  },
  {
    label: "Procurement Analytics",
    value: "Live",
    note: "Trend + delay visibility",
    icon: TrendingDown,
    accentClassName: "text-teal-600",
  },
];

const PROCUREMENT_QUICK_ACTIONS = [
  "Create purchase request",
  "Review pending approvals",
  "Raise emergency procurement",
  "Export procurement report",
];

export function InventoryModuleView() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [activeDashboardSection, setActiveDashboardSection] =
    useState<InventoryDashboardSectionId>("settings");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: "",
    category: "IT Hardware",
    quantity: 10,
    minThreshold: 5,
    unitCost: 5000,
    location: "Central Stores",
    serialNumber: "",
    status: "In Stock",
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchInventoryItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      (item.serialNumber && item.serialNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All Categories" || item.category === selectedCategory;

    const matchesStatus = selectedStatus === "All Statuses" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // KPI Metrics
  const totalItems = items.length;
  const totalValuation = items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);
  const lowStockCount = items.filter((i) => i.status !== "In Stock").length;
  const inStockCount = items.filter((i) => i.status === "In Stock").length;
  const categoryTotals = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity;
    return acc;
  }, {});
  const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const topCategoryName = topCategoryEntry?.[0] || "N/A";
  const topCategoryUnits = topCategoryEntry?.[1] || 0;
  const monitoredItems = items.filter((item) => item.status !== "In Stock");
  const activeSection =
    INVENTORY_DASHBOARD_SECTIONS.find((section) => section.id === activeDashboardSection) ||
    INVENTORY_DASHBOARD_SECTIONS[0];

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      category: "IT Hardware",
      quantity: 25,
      minThreshold: 10,
      unitCost: 15000,
      location: "CSE Lab 3 (Block A)",
      serialNumber: `SN-HW-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "In Stock",
    });
    setIsAddDialogOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleOpenView = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleOpenRestock = (item: InventoryItem) => {
    setSelectedItem(item);
    setRestockQty(10);
    setIsRestockDialogOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Please provide an asset item name.");
      return;
    }
    const created = await addInventoryItem(formData);
    setItems((prev) => [created, ...prev]);
    setIsAddDialogOpen(false);
    toast.success(`Asset "${created.name}" registered with ID ${created.id}!`);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    const qty = Number(formData.quantity) || 0;
    const min = Number(formData.minThreshold) || 5;
    const computedStatus = qty === 0 ? "Out of Stock" : qty <= min ? "Low Stock" : "In Stock";

    const updatedData = { ...formData, status: computedStatus };
    await updateInventoryItem(selectedItem.id, updatedData);
    setItems((prev) =>
      prev.map((i) => (i.id === selectedItem.id ? ({ ...i, ...updatedData } as InventoryItem) : i)),
    );
    setIsEditDialogOpen(false);
    toast.success(`Asset "${formData.name}" updated successfully!`);
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    const newQty = selectedItem.quantity + Number(restockQty);
    const computedStatus = newQty <= selectedItem.minThreshold ? "Low Stock" : "In Stock";
    const today = new Date().toISOString().split("T")[0];

    await updateInventoryItem(selectedItem.id, {
      quantity: newQty,
      status: computedStatus,
      lastRestockedOn: today,
    });

    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id
          ? { ...i, quantity: newQty, status: computedStatus, lastRestockedOn: today }
          : i,
      ),
    );

    setIsRestockDialogOpen(false);
    toast.success(
      `Restocked ${restockQty} units of ${selectedItem.name}. New Quantity: ${newQty} (${computedStatus})!`,
    );
  };

  const handleDelete = async (item: InventoryItem) => {
    if (confirm(`Are you sure you want to delete asset ${item.name} (${item.id})?`)) {
      await deleteInventoryItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success(`Asset ${item.name} deleted from inventory.`);
    }
  };

  const handleSectionAction = () => {
    if (activeDashboardSection === "settings") {
      handleOpenAdd();
      return;
    }

    if (activeDashboardSection === "monitoring") {
      const nextItem = monitoredItems[0];
      if (nextItem) {
        handleOpenRestock(nextItem);
        return;
      }
    }

    if (activeDashboardSection === "approvals") {
      toast.success("Emergency approval queue opened for high-priority inventory actions.");
      return;
    }

    if (activeDashboardSection === "audit") {
      handleExportCSV();
      return;
    }

    toast.info(`${activeSection.title} is configured inside the inventory dashboard.`);
  };

  const renderSectionPanel = () => {
    switch (activeDashboardSection) {
      case "settings":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Default Store</p>
              <p className="text-sm font-bold text-foreground">Central Stores Basement</p>
              <p className="text-[0.68rem] text-muted-foreground">
                Centralized catalog source for all inventory items.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Auto Reorder Trigger
              </p>
              <p className="text-sm font-bold text-foreground">At or below minimum threshold</p>
              <p className="text-[0.68rem] text-muted-foreground">
                Promotes stock control and proactive replenishment.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Asset Tagging</p>
              <p className="text-sm font-bold text-foreground">Serial + campus location tracking</p>
              <p className="text-[0.68rem] text-muted-foreground">
                Supports accountability for high-value assets.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Primary Action
              </p>
              <p className="text-sm font-bold text-foreground">Register new asset items</p>
              <p className="text-[0.68rem] text-muted-foreground">
                Use this panel to onboard new inventory records quickly.
              </p>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="text-[0.68rem] uppercase text-muted-foreground font-semibold">
                  Inventory valuation
                </p>
                <p className="text-lg font-bold text-emerald-600">
                  ₹{totalValuation.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="text-[0.68rem] uppercase text-muted-foreground font-semibold">
                  Healthy stock ratio
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {Math.round((inStockCount / Math.max(totalItems, 1)) * 100)}%
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="text-[0.68rem] uppercase text-muted-foreground font-semibold">
                  Top category
                </p>
                <p className="text-lg font-bold text-foreground">{topCategoryName}</p>
                <p className="text-[0.68rem] text-muted-foreground">
                  {topCategoryUnits} units tracked
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Operational insight</p>
                <Badge variant="outline" className="text-[0.68rem]">
                  Real-time dashboard
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Low stock alerts, category mix, and valuation trends are surfaced from the live item
                catalog.
              </p>
            </div>
          </div>
        );
      case "procurement":
        return (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {PROCUREMENT_METRICS.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-muted-foreground">
                        {metric.label}
                      </p>
                      <Icon className={`size-4 ${metric.accentClassName}`} />
                    </div>
                    <p className={`text-lg font-bold ${metric.accentClassName}`}>{metric.value}</p>
                    <p className="text-[0.68rem] text-muted-foreground">{metric.note}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Procurement analytics</p>
                    <p className="text-xs text-muted-foreground">
                      Budget, cycle time, vendor health, and approval bottlenecks in one view.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[0.68rem]">
                    Live snapshot
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Budget utilization</span>
                    <span className="font-semibold text-foreground">68%</span>
                  </div>
                  <div className="h-2 rounded-full bg-border/70 overflow-hidden">
                    <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary to-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-xl border border-border/60 bg-card p-3">
                    <p className="text-[0.68rem] text-muted-foreground uppercase font-semibold">
                      Avg. approval time
                    </p>
                    <p className="text-sm font-bold text-foreground">2.4 days</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card p-3">
                    <p className="text-[0.68rem] text-muted-foreground uppercase font-semibold">
                      Delayed POs
                    </p>
                    <p className="text-sm font-bold text-amber-600">6 orders</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card p-3">
                    <p className="text-[0.68rem] text-muted-foreground uppercase font-semibold">
                      Vendor SLA
                    </p>
                    <p className="text-sm font-bold text-emerald-600">94.2%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Quick actions</p>
                    <p className="text-xs text-muted-foreground">
                      Fast access to high-frequency procurement operations.
                    </p>
                  </div>
                  <PlusCircle className="size-4 text-primary" />
                </div>

                <div className="space-y-2.5">
                  {PROCUREMENT_QUICK_ACTIONS.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      className="w-full justify-between h-10 text-xs font-semibold border-border hover:bg-accent"
                      onClick={() => toast.info(`${action} opened from procurement dashboard.`)}
                    >
                      <span>{action}</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">Procurement policy</p>
                <p className="text-xs text-muted-foreground">
                  Requests above threshold should move through approval before vendor release.
                </p>
                <Badge variant="outline" className="w-fit text-[0.68rem]">
                  Principal + Admin review
                </Badge>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">Budget guardrails</p>
                <p className="text-xs text-muted-foreground">
                  Keep monthly spending within plan and flag emergency purchases for fast-track
                  review.
                </p>
                <Badge variant="outline" className="w-fit text-[0.68rem]">
                  Finance pre-clearance
                </Badge>
              </div>
            </div>
          </div>
        );
      case "vendors":
        return (
          <div className="space-y-3">
            {[
              ["Campus Tech Supply Co.", "Active SLA", "98% on-time fulfilment"],
              ["Lab Instruments India", "Pending renewal", "High-value equipment vendor"],
              ["Stationery & Print Hub", "Preferred", "Fast turnaround for consumables"],
            ].map(([name, status, note]) => (
              <div
                key={name}
                className="rounded-2xl border border-border/70 bg-muted/30 p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{note}</p>
                </div>
                <Badge variant="outline" className="text-[0.68rem]">
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        );
      case "monitoring":
        return (
          <div className="space-y-3">
            {monitoredItems.length > 0 ? (
              monitoredItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/70 bg-muted/30 p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.location} • Qty {item.quantity} / Min {item.minThreshold}
                    </p>
                  </div>
                  <Badge
                    className={
                      item.status === "Low Stock"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                        : "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="text-sm font-semibold text-foreground">
                  All monitored items are healthy
                </p>
                <p className="text-xs text-muted-foreground">
                  No low-stock or out-of-stock items are currently flagged.
                </p>
              </div>
            )}
          </div>
        );
      case "audit":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Change logging</p>
              <p className="text-xs text-muted-foreground">
                Every asset update, restock, and delete action should remain traceable.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Inspection readiness</p>
              <p className="text-xs text-muted-foreground">
                Exportable catalog records support internal and external audits.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Compliance checks</p>
              <p className="text-xs text-muted-foreground">
                Review serial numbers, location history, and restock dates regularly.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Export ready</p>
              <p className="text-xs text-muted-foreground">
                Use the export action to generate a CSV audit snapshot.
              </p>
            </div>
          </div>
        );
      case "approvals":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Emergency request lane</p>
              <p className="text-xs text-muted-foreground">
                Escalate urgent restocks or replacement needs without waiting for the standard
                queue.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Critical response window</p>
              <p className="text-xs text-muted-foreground">
                Use for outage recovery, lab continuity, and safety-related replenishment.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Approval visibility</p>
              <p className="text-xs text-muted-foreground">
                Super admin can fast-track the request and push it to purchasing immediately.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Fallback action</p>
              <p className="text-xs text-muted-foreground">
                If no urgent item exists, the queue stays ready for the next critical event.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Asset Name",
      "Category",
      "Quantity",
      "Min Threshold",
      "Unit Cost (INR)",
      "Total Valuation (INR)",
      "Location",
      "Serial Number",
      "Status",
      "Last Restocked",
    ];
    const rows = filtered.map((i) => [
      i.id,
      `"${i.name}"`,
      i.category,
      i.quantity,
      i.minThreshold,
      i.unitCost,
      i.quantity * i.unitCost,
      `"${i.location}"`,
      `"${i.serialNumber || "N/A"}"`,
      i.status,
      i.lastRestockedOn || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Inventory_Catalog_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} inventory items to CSV!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Package className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Inventory & Asset Tracking Module
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Campus Stores Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Track lab equipment, IT assets, stationery thresholds, and campus store locations.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <Download className="size-3.5" /> Export Catalog
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
          >
            <Plus className="size-4" /> Register New Asset
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Unique Assets</span>
            <Box className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{totalItems} Items</p>
          <p className="text-[0.68rem] text-muted-foreground">Cataloged across labs & stores</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Inventory Value</span>
            <DollarSign className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">
            ₹{totalValuation.toLocaleString("en-IN")}
          </p>
          <p className="text-[0.68rem] text-muted-foreground">Asset replacement value</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Healthy Stock</span>
            <CheckCircle className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">{inStockCount} Items</p>
          <p className="text-[0.68rem] text-muted-foreground">Above minimum threshold</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">{lowStockCount} Items</p>
          <p className="text-[0.68rem] text-amber-600 font-medium">Reorder required</p>
        </div>
      </div>

      {/* Inventory Dashboard Control Center */}
      <div className="grid gap-4 xl:grid-cols-[1.05fr_1.35fr]">
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Box className="size-5 text-primary" /> Inventory Control Center
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Jump between inventory settings, analytics, procurement, vendors, monitoring, audit,
                and approvals.
              </p>
            </div>
            <Badge variant="outline" className="text-[0.68rem] text-primary border-primary/30">
              Super Admin Ready
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INVENTORY_DASHBOARD_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = section.id === activeDashboardSection;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveDashboardSection(section.id)}
                  className={`text-left rounded-2xl border p-4 transition-all space-y-3 shadow-sm hover:-translate-y-0.5 hover:border-primary/50 ${
                    isActive ? "border-primary/40 bg-primary/5" : "border-border/70 bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className={`p-2.5 rounded-xl border ${section.accentClassName}`}>
                      <Icon className="size-5" />
                    </div>
                    {isActive && (
                      <Badge className="bg-primary text-primary-foreground text-[0.68rem]">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-foreground">{section.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground font-medium uppercase tracking-wide">
                    <span>{section.summary}</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-foreground">{activeSection.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{activeSection.description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSectionAction}
              className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
            >
              {activeDashboardSection === "settings"
                ? "Open Asset Registration"
                : activeDashboardSection === "analytics"
                  ? "Refresh Analytics"
                  : activeDashboardSection === "procurement"
                    ? "Review Policies"
                    : activeDashboardSection === "vendors"
                      ? "Open Vendor Queue"
                      : activeDashboardSection === "monitoring"
                        ? "Restock Highlighted Item"
                        : activeDashboardSection === "audit"
                          ? "Export Audit Snapshot"
                          : "Trigger Emergency Approval"}
            </Button>
          </div>

          {renderSectionPanel()}

          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4 flex items-start gap-3">
            <Calendar className="size-4 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">Operational note</p>
              <p className="text-[0.68rem] text-muted-foreground">
                The tile content is wired to the live inventory catalog, so low-stock status,
                valuation, and export actions stay in sync with the asset list below.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by asset name, category, location, serial..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-9 w-full sm:w-[160px] text-xs" aria-label="Category Filter">
              <Layers className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-xs">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs" aria-label="Status Filter">
              <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((st) => (
                <SelectItem key={st} value={st} className="text-xs">
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-muted/40 self-end sm:self-auto">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="size-7 rounded-md"
            title="Grid View"
          >
            <LayoutGrid className="size-3.5" />
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("table")}
            className="size-7 rounded-md"
            title="Table View"
          >
            <List className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Assets View (Grid vs Table) */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
          <RefreshCw className="size-5 animate-spin text-primary" />
          Loading asset catalog...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card/50 space-y-3">
          <Package className="size-8 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">No assets found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No inventory items matched your search filters. Try adjusting your search query or
            status filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All Categories");
              setSelectedStatus("All Statuses");
            }}
            className="text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-[0.68rem] bg-muted">
                    {item.id}
                  </Badge>
                  <Badge
                    className={
                      item.status === "In Stock"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                        : item.status === "Low Stock"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                          : "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                    }
                  >
                    {item.status !== "In Stock" && <AlertTriangle className="size-3 mr-1 inline" />}
                    {item.status === "In Stock" && <CheckCircle className="size-3 mr-1 inline" />}
                    {item.status}
                  </Badge>
                </div>

                {/* Name & Category */}
                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Category: <span className="font-semibold text-primary">{item.category}</span>
                  </p>
                </div>

                {/* Location & Serial */}
                <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-primary/70 shrink-0" /> Location:
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[200px]">
                      {item.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Barcode className="size-3.5 text-primary/70 shrink-0" /> Serial No:
                    </span>
                    <span className="font-mono text-foreground">{item.serialNumber || "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 font-mono">
                    <div>
                      <span className="text-muted-foreground font-sans">Stock: </span>
                      <span className="font-bold text-foreground text-sm">{item.quantity}</span>
                      <span className="text-[0.65rem] text-muted-foreground ml-1">
                        (Min: {item.minThreshold})
                      </span>
                    </div>
                    <div className="text-right font-bold text-emerald-600">
                      ₹{item.unitCost.toLocaleString("en-IN")} / unit
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenView(item)}
                  className="h-8 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Eye className="size-3.5" /> Details
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenRestock(item)}
                    className="h-8 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 gap-1 px-2"
                  >
                    <PlusCircle className="size-3.5" /> Restock
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(item)}
                    className="size-8 text-muted-foreground hover:text-primary"
                    title="Edit Asset"
                  >
                    <Edit className="size-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item)}
                    className="size-8 text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
                    title="Delete Asset"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="p-3.5 pl-4">Asset ID</th>
                  <th className="p-3.5">Asset Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5 font-mono">Qty (Min)</th>
                  <th className="p-3.5 font-mono">Unit Cost</th>
                  <th className="p-3.5 font-mono">Total Valuation</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 pl-4 font-mono font-bold text-foreground">{item.id}</td>
                    <td className="p-3.5 font-semibold text-foreground">{item.name}</td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="font-mono text-[0.68rem]">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-muted-foreground">{item.location}</td>
                    <td className="p-3.5 font-mono font-bold text-foreground">
                      {item.quantity}{" "}
                      <span className="text-[0.65rem] font-normal text-muted-foreground">
                        ({item.minThreshold})
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-muted-foreground">
                      ₹{item.unitCost.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-600">
                      ₹{(item.quantity * item.unitCost).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5">
                      <Badge
                        className={
                          item.status === "In Stock"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                            : item.status === "Low Stock"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                              : "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenRestock(item)}
                          className="h-7 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                          + Restock
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenView(item)}
                          className="size-7 text-muted-foreground hover:text-foreground"
                          title="View Details"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(item)}
                          className="size-7 text-muted-foreground hover:text-primary"
                          title="Edit Asset"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item)}
                          className="size-7 text-muted-foreground hover:text-red-600"
                          title="Delete Asset"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIALOG 1: REGISTER NEW ASSET MODAL */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Register New Campus Asset
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add lab equipment, IT hardware, or stationery to the central inventory catalog.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Asset Name *</Label>
                <Input
                  required
                  placeholder="e.g. Tektronix Oscilloscopes"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({ ...formData, category: val as InventoryItem["category"] })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-xs">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Initial Quantity</Label>
                <Input
                  type="number"
                  required
                  value={formData.quantity || ""}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Min Threshold (Reorder Point)</Label>
                <Input
                  type="number"
                  required
                  value={formData.minThreshold || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, minThreshold: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Unit Cost (₹)</Label>
                <Input
                  type="number"
                  required
                  value={formData.unitCost || ""}
                  onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Campus Location</Label>
                <Input
                  placeholder="e.g. ECE VLSI Lab"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Serial / Model Number</Label>
              <Input
                placeholder="e.g. SN-TEK-88102"
                value={formData.serialNumber || ""}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="h-9 text-xs font-mono"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Register Asset Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: EDIT ASSET MODAL */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit className="size-5 text-primary" /> Edit Asset ({selectedItem?.id})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update quantity, location, reorder thresholds, and serial numbers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Asset Name</Label>
                <Input
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({ ...formData, category: val as InventoryItem["category"] })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-xs">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Current Quantity</Label>
                <Input
                  type="number"
                  required
                  value={formData.quantity ?? ""}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Min Threshold Point</Label>
                <Input
                  type="number"
                  required
                  value={formData.minThreshold ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, minThreshold: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Unit Cost (₹)</Label>
                <Input
                  type="number"
                  required
                  value={formData.unitCost ?? ""}
                  onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Campus Location</Label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Serial Number</Label>
              <Input
                value={formData.serialNumber || ""}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="h-9 text-xs font-mono"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Save Asset Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: RESTOCK QUANTITY MODAL */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <PlusCircle className="size-5 text-emerald-600" /> Restock Asset ({selectedItem?.name}
              )
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add new stock units received from purchase order delivery.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form onSubmit={handleRestockSubmit} className="space-y-4 pt-1">
              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1 text-xs">
                <div>
                  <span className="text-muted-foreground">Current Stock: </span>
                  <span className="font-bold font-mono text-foreground text-sm">
                    {selectedItem.quantity} units
                  </span>
                  <span className="text-[0.68rem] text-muted-foreground ml-1">
                    (Min: {selectedItem.minThreshold})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location: </span>
                  <span className="font-medium text-foreground">{selectedItem.location}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Additional Units to Add *</Label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <DialogFooter className="pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRestockDialogOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Confirm Restock (+{restockQty} units)
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: VIEW ASSET DOSSIER MODAL */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Package className="size-5 text-primary" /> Asset Specification Dossier
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selectedItem.id}
                  </Badge>
                  <Badge
                    className={
                      selectedItem.status === "In Stock"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }
                  >
                    {selectedItem.status}
                  </Badge>
                </div>
                <h2 className="text-base font-bold text-foreground">{selectedItem.name}</h2>
                <p className="text-xs text-primary font-medium">{selectedItem.category}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60 font-mono">
                  <span className="text-muted-foreground font-sans">Current Quantity:</span>
                  <span className="font-bold text-foreground text-sm">
                    {selectedItem.quantity} units (Min: {selectedItem.minThreshold})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60 font-mono">
                  <span className="text-muted-foreground font-sans">Unit Cost:</span>
                  <span className="font-bold text-foreground">
                    ₹{selectedItem.unitCost.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30 font-mono">
                  <span className="text-foreground font-bold font-sans">TOTAL VALUATION:</span>
                  <span className="font-bold text-base text-primary">
                    ₹{(selectedItem.quantity * selectedItem.unitCost).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Campus Location:</span>
                  <span className="font-medium text-foreground">{selectedItem.location}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Serial Number:</span>
                  <span className="font-mono text-foreground">
                    {selectedItem.serialNumber || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Last Restocked:</span>
                  <span className="font-mono text-foreground">
                    {selectedItem.lastRestockedOn || "N/A"}
                  </span>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="w-full text-xs"
                >
                  Close Dossier
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
