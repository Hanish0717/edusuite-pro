import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Package,
  ShoppingCart,
  Building,
  CheckCircle2,
  Plus,
  Search,
  GitBranch,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [{ title: "Inventory & Procurement — EduSuite Pro" }],
  }),
  component: InventoryPage,
});

const initialItems = [
  {
    id: "INV-101",
    name: "Dell OptiPlex 7090 Desktop",
    category: "IT Hardware",
    stock: "85 Units",
    location: "Lab 3 & 4 (CSE)",
    reorderLevel: "10 Units",
    status: "In Stock",
  },
  {
    id: "INV-102",
    name: "Digital Storage Oscilloscopes",
    category: "Electronics Equipment",
    stock: "4 Units",
    location: "ECE Hardware Lab",
    reorderLevel: "10 Units",
    status: "Low Stock",
  },
  {
    id: "INV-103",
    name: "Ergonomic Mesh Faculty Chairs",
    category: "Furniture",
    stock: "120 Units",
    location: "Staff Rooms A-D",
    reorderLevel: "15 Units",
    status: "In Stock",
  },
  {
    id: "INV-104",
    name: "High-Speed Laser Printers",
    category: "Office Electronics",
    stock: "18 Units",
    location: "Exam Branch & HOD Cabins",
    reorderLevel: "5 Units",
    status: "In Stock",
  },
];

export function InventoryPage() {
  const { hasFlag, role } = useRole();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");

  const canManage = role === "super-admin" || hasFlag("isInventoryManager") || hasFlag("isPurchaseManager");

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
              <Package className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold sm:text-2xl">
                Inventory & Procurement Module
              </h1>
              <p className="text-sm text-muted-foreground">
                Stock counts, asset tracking, vendor management, and purchase requisitions.
              </p>
            </div>
          </div>
          <Badge className="bg-brand-gradient text-white font-mono">
            {canManage ? "Inventory Manager Access" : "Read Only View"}
          </Badge>
        </header>

        {/* WORKFLOW BANNER */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <GitBranch className="size-5 text-emerald-500 shrink-0" />
            <div>
              <h4 className="font-display text-sm font-bold">Purchase Approval Pathway</h4>
              <p className="text-xs text-muted-foreground font-mono">
                Dept. → Inventory → Finance → Principal
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => toast.info("Redirecting to Purchase Approval Workflow...")}
            className="bg-brand-gradient text-xs cursor-pointer"
          >
            Track Active PO Requisitions
          </Button>
        </div>

        {/* KPIS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Stock Assets" value="3,480" icon={Package} />
          <KpiCard label="Active Requisitions" value="12" icon={ShoppingCart} tone="warning" />
          <KpiCard label="Approved POs (FY26)" value="Rs 42.5 L" icon={CheckCircle2} tone="success" />
          <KpiCard label="Registered Vendors" value="34" icon={Building} tone="info" />
        </div>

        <Tabs defaultValue="stock" className="space-y-6">
          <TabsList className="bg-background/50 border border-border p-1">
            <TabsTrigger value="stock">Stock Items Master</TabsTrigger>
            <TabsTrigger value="requisitions">Purchase Requisitions</TabsTrigger>
            <TabsTrigger value="vendors">Vendor Register</TabsTrigger>
          </TabsList>

          <TabsContent value="stock">
            <Panel
              title="Inventory Asset Catalog"
              description="View equipment, lab assets, furniture, and IT infrastructure status across departments."
              action={
                canManage ? (
                  <Button className="bg-brand-gradient shadow-glow gap-1.5 cursor-pointer">
                    <Plus className="size-4" /> Add Asset Item
                  </Button>
                ) : undefined
              }
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search item or asset ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-9"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-border rounded-xl">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs font-semibold">{item.id}</TableCell>
                        <TableCell className="font-semibold text-sm">{item.name}</TableCell>
                        <TableCell className="text-sm">{item.category}</TableCell>
                        <TableCell className="font-bold text-sm">{item.stock}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.location}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.status === "In Stock"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="requisitions">
            <Panel title="Department Procurement Requests" description="Requisitions pending inventory verification & finance sanction.">
              <p className="text-sm text-muted-foreground">
                All purchase approvals route through Inventory → Finance → Principal hierarchy.
              </p>
            </Panel>
          </TabsContent>

          <TabsContent value="vendors">
            <Panel title="Approved Supplier Directory" description="Vendors registered for lab supplies, IT hardware, and campus services.">
              <p className="text-sm text-muted-foreground">
                External Vendors have read access to active RFQs and purchase order status.
              </p>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
