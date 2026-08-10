import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function writeImaPage(filename, routePath, pageTitleText, subTitleText, badgeText, kpis, headers, rowsJS, chartType) {
  const code = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  FlaskConical,
  Cpu,
  Wrench,
  Box,
  ShoppingCart,
  ShieldAlert,
  CheckCircle2,
  Users,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Send,
  Inbox,
  Bell,
  Save,
  Lock,
  Globe,
  Shield,
  User,
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
${chartType ? `import { ${chartType} } from "@/components/dashboard/charts";` : ""}

export const Route = createFileRoute("${routePath}")({
  head: () => ({
    meta: [{ title: "${pageTitleText} — IMA Dean" }],
  }),
  component: SubPageComponent,
});

function SubPageComponent() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const rawData = useMemo(() => {
    return ${rowsJS};
  }, []);

  const filteredData = useMemo(() => {
    return rawData.filter((item: Record<string, any>) => {
      const matchSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      const matchFilter = filter === "all" || (item.status && String(item.status).toLowerCase().includes(filter.toLowerCase()));
      return matchSearch && matchFilter;
    });
  }, [rawData, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              ${badgeText}
            </Badge>
            <span className="text-xs text-muted-foreground">• IMA Infrastructure ERP</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">${pageTitleText}</h1>
          <p className="text-sm text-muted-foreground">${subTitleText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export PDF / Excel
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add New Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="${kpis[0].label}" value="${kpis[0].val}" icon={FlaskConical} tone="purple" />
        <KpiCard label="${kpis[1].label}" value="${kpis[1].val}" icon={Cpu} tone="success" />
        <KpiCard label="${kpis[2].label}" value="${kpis[2].val}" icon={Wrench} tone="info" />
        <KpiCard label="${kpis[3].label}" value="${kpis[3].val}" icon={CheckCircle2} tone="warning" />
      </div>

      ${chartType === "GroupedBarChart" ? `
      <Panel title="${pageTitleText} Distribution Chart" description="Quantitative inventory and equipment breakdown.">
        <GroupedBarChart
          data={[
            { category: "CSE Dept", count: 480 },
            { category: "ECE Dept", count: 320 },
            { category: "ME Dept", count: 210 },
            { category: "EEE Dept", count: 150 },
            { category: "Civil Dept", count: 80 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "count", label: "Inventory Units" }]}
          height={200}
        />
      </Panel>
      ` : ""}

      {/* MAIN DATA TABLE */}
      <Panel title="${pageTitleText} Master Ledger" description="Official institutional equipment, laboratory, and asset inventory records.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search inventory, lab, equipment..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={filter} onValueChange={(val) => { setFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[150px] text-xs">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active / Working</SelectItem>
                <SelectItem value="maintenance">Under Repair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  ${headers.map((h) => `<th className="p-3">${h}</th>`).join("")}
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedData.map((item: Record<string, any>, idx: number) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    {Object.values(item).map((val: any, cIdx: number) => (
                      <td key={cIdx} className="p-3 font-mono text-foreground">
                        {String(val).toLowerCase().includes("working") || String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("allocated") || String(val).toLowerCase().includes("completed") || String(val).toLowerCase().includes("operational") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("maintenance") || String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("in progress") ? (
                          <Badge className="bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : (
                          String(val)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </span>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft className="size-3.5" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button key={i} variant={currentPage === i + 1 ? "default" : "outline"} size="sm" className="h-7 w-7 p-0 text-xs font-mono cursor-pointer" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(routesDir, filename), code, "utf8");
  console.log(`Saved IMA subpage: ${filename}`);
}

// ----------------------------------------------------
// GENERATE ALL 25 IMA SUBPAGES
// ----------------------------------------------------

// Laboratory Management
writeImaPage("staff.ima.laboratories.tsx", "/staff/ima/laboratories", "Laboratories", "Master list of campus labs, seating capacity, systems, and incharge faculty.", "LABORATORY MANAGEMENT", [{ label: "Total Labs", val: "18 Labs" }, { label: "Total Systems", val: "720 PCs" }, { label: "Avg Capacity", val: "40 Seats" }, { label: "Status", val: "Operational" }], ["Lab Code", "Lab Name", "Department", "Faculty Incharge", "Capacity", "Systems", "Location", "Status"], `[
  { code: "LAB-CSE-01", name: "C Programming Lab", dept: "CSE", incharge: "Dr. Ravi Kumar", cap: "60 Seats", systems: "60 Systems", loc: "Block A - Room 101", status: "Operational" },
  { code: "LAB-CSE-02", name: "Java Programming Lab", dept: "CSE", incharge: "Prof. Priya Sharma", cap: "60 Seats", systems: "60 Systems", loc: "Block A - Room 102", status: "Operational" },
  { code: "LAB-CSE-03", name: "Python Lab", dept: "CSE", incharge: "Dr. Mahesh Gupta", cap: "60 Seats", systems: "60 Systems", loc: "Block A - Room 103", status: "Operational" },
  { code: "LAB-CSE-04", name: "AI & ML Lab", dept: "CSE", incharge: "Prof. Anil Reddy", cap: "40 Seats", systems: "40 Systems", loc: "Block A - Room 302", status: "Operational" },
  { code: "LAB-CSE-05", name: "Networking Lab", dept: "CSE", incharge: "Dr. Sneha Rao", cap: "40 Seats", systems: "40 Systems", loc: "Block A - Room 304", status: "Operational" },
  { code: "LAB-ECE-01", name: "IoT & Embedded Systems Lab", dept: "ECE", incharge: "Dr. R. S. Rathore", cap: "40 Seats", systems: "40 Systems", loc: "Block B - Room 201", status: "Operational" },
  { code: "LAB-ECE-02", name: "Electronics & VLSI Lab", dept: "ECE", incharge: "Prof. Sujatha Reddy", cap: "40 Seats", systems: "40 Systems", loc: "Block B - Room 204", status: "Operational" },
  { code: "LAB-ME-01", name: "CAD & CAM Lab", dept: "ME", incharge: "Dr. M. N. Swamy", cap: "30 Seats", systems: "30 Workstations", loc: "Mechanical Block", status: "Operational" }
]`, "GroupedBarChart");

writeImaPage("staff.ima.lab-details.tsx", "/staff/ima/lab-details", "Lab Details", "Detailed infrastructure, AC, CCTV, projector, and equipment specifications.", "LABORATORY MANAGEMENT", [{ label: "Smart Labs", val: "14 Labs" }, { label: "Projectors", val: "18 Units" }, { label: "AC Units", val: "36 ACs" }, { label: "Status", val: "Verified" }], ["Lab Name", "Faculty Incharge", "Equipment Count", "Seating", "Internet", "AC Status", "CCTV", "Status"], `[
  { name: "AI & ML Lab (Room 302)", incharge: "Prof. Anil Reddy", eq: "40 Dell OptiPlex 7090", seat: "40 Seats", net: "1 Gbps Fiber", ac: "Dual 2-Ton AC", cctv: "Active HD", status: "Operational" },
  { name: "Networking Lab (Room 304)", incharge: "Dr. Sneha Rao", eq: "30 Cisco Switches", seat: "40 Seats", net: "1 Gbps Fiber", ac: "Dual 2-Ton AC", cctv: "Active HD", status: "Operational" }
]`);

writeImaPage("staff.ima.lab-timetable.tsx", "/staff/ima/lab-timetable", "Lab Timetable", "Weekly laboratory schedules, occupied slots, and free lab sessions.", "LABORATORY MANAGEMENT", [{ label: "Weekly Sessions", val: "140 Hours" }, { label: "Occupancy Rate", val: "84.2%" }, { label: "Free Slots", val: "22 Slots" }, { label: "Status", val: "Active" }], ["Day", "Period", "Laboratory", "Department", "Subject / Batch", "Faculty Incharge", "Status"], `[
  { day: "Monday", period: "09:00 - 11:00 AM", lab: "AI & ML Lab", dept: "CSE", subject: "CS505 AI Lab (Batch A)", incharge: "Prof. Anil Reddy", status: "Occupied" },
  { day: "Monday", period: "11:15 - 01:15 PM", lab: "Networking Lab", dept: "CSE", subject: "CS506 Cisco Lab (Batch B)", incharge: "Dr. Sneha Rao", status: "Occupied" },
  { day: "Tuesday", period: "02:00 - 04:00 PM", lab: "IoT Lab", dept: "ECE", subject: "EC601 IoT Lab (Batch C)", incharge: "Dr. R. S. Rathore", status: "Occupied" }
]`);

writeImaPage("staff.ima.lab-booking.tsx", "/staff/ima/lab-booking", "Lab Booking", "Faculty lab reservation requests, workshops, and exam booking calendar.", "LABORATORY MANAGEMENT", [{ label: "Pending Reqs", val: "4 Requests" }, { label: "Approved", val: "28 Bookings" }, { label: "Next Event", val: "Hackathon 2026" }, { label: "Status", val: "Active" }], ["Booking Ref", "Faculty Name", "Laboratory", "Event / Reason", "Date & Time", "Approval Status", "Status"], `[
  { ref: "BK-2026-901", faculty: "Dr. Ravi Kumar", lab: "AI & ML Lab", event: "National Hackathon Preparation", date: "2026-08-12 (02:00 - 06:00 PM)", approval: "Approved", status: "Active" }
]`);

// Equipment Management
writeImaPage("staff.ima.equipment-inventory.tsx", "/staff/ima/equipment-inventory", "Equipment Inventory", "Master hardware inventory: brand, model, serial number, and status.", "EQUIPMENT MANAGEMENT", [{ label: "Total Assets", val: "1,240 Assets" }, { label: "Dell PC Count", val: "450 PCs" }, { label: "Cisco Hardware", val: "120 Units" }, { label: "Status", val: "Working" }], ["Equipment ID", "Equipment Name", "Brand & Model", "Serial Number", "Department", "Lab Room", "Purchase Date", "Status"], `[
  { id: "EQ-CSE-101", name: "Dell OptiPlex 7090 i7 16GB", brand: "Dell OptiPlex 7090", sn: "SN-DELL-90124", dept: "CSE", lab: "AI & ML Lab", date: "2024-06-15", status: "Working" },
  { id: "EQ-CSE-102", name: "Dell OptiPlex 7090 i7 16GB", brand: "Dell OptiPlex 7090", sn: "SN-DELL-90125", dept: "CSE", lab: "AI & ML Lab", date: "2024-06-15", status: "Working" },
  { id: "EQ-CSE-201", name: "Cisco Router 2911 Gigabit", brand: "Cisco 2911", sn: "SN-CSCO-44120", dept: "CSE", lab: "Networking Lab", date: "2023-11-10", status: "Working" },
  { id: "EQ-CSE-202", name: "Cisco Switch 2960 24-Port", brand: "Cisco 2960", sn: "SN-CSCO-88124", dept: "CSE", lab: "Networking Lab", date: "2023-11-10", status: "Working" },
  { id: "EQ-ECE-101", name: "Agilent Digital Oscilloscope", brand: "Agilent DSOX2002A", sn: "SN-AGLT-10928", dept: "ECE", lab: "Electronics Lab", date: "2024-01-20", status: "Working" },
  { id: "EQ-ME-101", name: "Ender 3D Printer Pro", brand: "Creality Ender 3", sn: "SN-CRLT-55102", dept: "ME", lab: "CAD & CAM Lab", date: "2025-02-14", status: "Working" }
]`, "GroupedBarChart");

writeImaPage("staff.ima.equipment-history.tsx", "/staff/ima/equipment-history", "Equipment History", "Complete service timeline, upgrades, transfers, and maintenance logs.", "EQUIPMENT MANAGEMENT", [{ label: "History Logs", val: "2,480 Logs" }, { label: "RAM Upgrades", val: "180 PCs" }, { label: "Serviced", val: "100%" }, { label: "Status", val: "Verified" }], ["Equipment ID", "Equipment Name", "Lifecycle Event", "Action Taken", "Performed Date", "Handled By", "Status"], `[
  { id: "EQ-CSE-101", name: "Dell OptiPlex 7090", event: "RAM & SSD Upgrade", action: "Upgraded from 8GB to 16GB RAM + 512GB NVMe", date: "2025-11-10", by: "Dell Certified Tech", status: "Verified" },
  { id: "EQ-CSE-101", name: "Dell OptiPlex 7090", event: "Lab Relocation", action: "Shifted from C Lab to AI & ML Lab Room 302", date: "2024-08-01", by: "CSE Lab Admin", status: "Verified" }
]`);

writeImaPage("staff.ima.equipment-allocation.tsx", "/staff/ima/equipment-allocation", "Equipment Allocation", "Asset assignment to laboratories, departments, and faculty incharge.", "EQUIPMENT MANAGEMENT", [{ label: "Allocated", val: "1,180 Assets" }, { label: "Unallocated", val: "60 Spares" }, { label: "Utilization", val: "95.1%" }, { label: "Status", val: "Active" }], ["Asset Tag", "Equipment Name", "Allocated Department", "Assigned Laboratory", "Faculty Incharge", "Allocation Date", "Status"], `[
  { tag: "TAG-901", name: "Dell OptiPlex 7090 Workstation", dept: "CSE", lab: "AI & ML Lab", incharge: "Prof. Anil Reddy", date: "2024-06-15", status: "Allocated" }
]`);

writeImaPage("staff.ima.equipment-requests.tsx", "/staff/ima/equipment-requests", "Equipment Requests", "Faculty requests for new lab hardware, Oscilloscopes, and PCs.", "EQUIPMENT MANAGEMENT", [{ label: "Pending Reqs", val: "6 Requests" }, { label: "Approved", val: "14 Orders" }, { label: "Est Cost", val: "₹18.4 Lacs" }, { label: "Status", val: "Active" }], ["Req ID", "Requested By", "Department", "Equipment Required", "Quantity", "Estimated Cost", "Approval Status", "Status"], `[
  { id: "REQ-2026-401", by: "Dr. R. S. Rathore", dept: "ECE", eq: "Raspberry Pi 4 Model B Kits", qty: "20 Kits", cost: "₹1.4 Lacs", approval: "Approved", status: "Active" }
]`);

// Maintenance
writeImaPage("staff.ima.maintenance-requests.tsx", "/staff/ima/maintenance-requests", "Maintenance Requests", "Hardware failure reports, repair tickets, and assigned engineers.", "MAINTENANCE", [{ label: "Open Tickets", val: "12 Tickets" }, { label: "Resolved / Mtd", val: "84 Tickets" }, { label: "Avg SLA", val: "24 Hours" }, { label: "Status", val: "Active" }], ["Ticket ID", "Equipment Name", "Issue Description", "Department / Lab", "Assigned Tech", "Priority", "Status"], `[
  { id: "TKT-901", name: "Epson Projector EB-E01", desc: "Lamp Replacement Required", lab: "Auditorium Hall 1", tech: "Epson Service India", priority: "High", status: "In Progress" },
  { id: "TKT-902", name: "APC Smart-UPS 5kVA", desc: "Battery Bank Replacement", lab: "Server Room", tech: "APC Authorized Engineer", priority: "Urgent", status: "In Progress" }
]`);

writeImaPage("staff.ima.maintenance-schedule.tsx", "/staff/ima/maintenance-schedule", "Maintenance Schedule", "Preventive maintenance calendar, quarterly lab servicing & inspection.", "MAINTENANCE", [{ label: "Scheduled Visits", val: "6 Visits" }, { label: "Quarterly Audit", val: "Q3 2026" }, { label: "SLA Pass Rate", val: "99.0%" }, { label: "Status", val: "Active" }], ["Schedule Ref", "Maintenance Type", "Laboratory Scope", "Vendor / Tech", "Scheduled Date", "Status"], `[
  { ref: "SCH-Q3-01", type: "Quarterly PC Servicing & Dust Removal", scope: "CSE Labs 1-5 (300 PCs)", vendor: "Dell Maintenance Team", date: "2026-08-20", status: "Scheduled" }
]`);

writeImaPage("staff.ima.amc-warranty.tsx", "/staff/ima/amc-warranty", "AMC & Warranty", "Annual Maintenance Contracts (AMC), warranty expiration, and providers.", "MAINTENANCE", [{ label: "Under Warranty", val: "840 Assets" }, { label: "Under AMC", val: "360 Assets" }, { label: "Expiring Soon", val: "14 Assets" }, { label: "Status", val: "Active" }], ["Equipment ID", "Equipment Name", "Warranty Start", "Warranty End", "AMC Provider", "Renewal Status", "Status"], `[
  { id: "EQ-CSE-101", name: "Dell OptiPlex 7090", start: "2024-06-15", end: "2027-06-14", provider: "Dell India Pvt Ltd", renewal: "Active Warranty", status: "Active" },
  { id: "EQ-CSE-201", name: "Cisco Router 2911", start: "2023-11-10", end: "2026-11-09", provider: "Cisco SMARTnet", renewal: "Renewal Pending", status: "Active" }
]`);

writeImaPage("staff.ima.vendors.tsx", "/staff/ima/vendors", "Vendors", "Authorized equipment manufacturers, AMC providers, and contact details.", "MAINTENANCE", [{ label: "Active Vendors", val: "12 Partners" }, { label: "Tier-1 Brands", val: "Dell, HP, Cisco" }, { label: "Rating Avg", val: "4.85 / 5" }, { label: "Status", val: "Active" }], ["Vendor ID", "Vendor Name", "Brand / Category", "Contract Scope", "Contact Person", "Phone / Email", "Status"], `[
  { id: "VEND-01", name: "Dell Technologies India", brand: "Dell Systems & Servers", scope: "Hardware Supply & AMC", person: "Mr. Rajesh Malhotra", phone: "+91 98450 12345", status: "Active" },
  { id: "VEND-02", name: "Cisco Systems India", brand: "Network Switches & Routers", scope: "SMARTnet & Hardware Support", person: "Ms. Anita Desai", phone: "+91 98110 67890", status: "Active" }
]`);

// Asset Management
writeImaPage("staff.ima.asset-register.tsx", "/staff/ima/asset-register", "Asset Register", "Master capital asset register, asset tags, valuation, and purchase ledgers.", "ASSET MANAGEMENT", [{ label: "Capital Valuation", val: "₹4.82 Cr" }, { label: "Total Assets", val: "1,240 Assets" }, { label: "Audit Clearance", val: "100%" }, { label: "Status", val: "Verified" }], ["Asset Tag", "Asset Name", "Category", "Department", "Purchase Cost", "Current Valuation", "Status"], `[
  { tag: "AST-2024-001", name: "High-Performance AI Server Workstation Cluster", cat: "Supercomputing", dept: "CSE", cost: "₹45.0 Lacs", val: "₹38.5 Lacs", status: "Active" }
]`);

writeImaPage("staff.ima.department-assets.tsx", "/staff/ima/department-assets", "Department Assets", "Department-wise asset allocation breakdown and valuation ledgers.", "ASSET MANAGEMENT", [{ label: "CSE Assets", val: "₹1.85 Cr" }, { label: "ECE Assets", val: "₹1.40 Cr" }, { label: "ME Assets", val: "₹95.0 Lacs" }, { label: "Status", val: "Active" }], ["Department", "Lab Count", "Equipment Count", "Asset Valuation", "Department HOD", "Status"], `[
  { dept: "Computer Science Engineering", labs: "6 Labs", eq: "480 Assets", val: "₹1.85 Cr", hod: "Dr. Anand Kumar", status: "Active" }
]`);

writeImaPage("staff.ima.asset-transfer.tsx", "/staff/ima/asset-transfer", "Asset Transfer", "Inter-departmental and inter-laboratory hardware transfer logs.", "ASSET MANAGEMENT", [{ label: "Transfers Year", val: "18 Items" }, { label: "Approved", val: "100%" }, { label: "Location Audit", val: "Verified" }, { label: "Status", val: "Verified" }], ["Transfer Ref", "Equipment Name", "Source Lab", "Destination Lab", "Transfer Date", "Approved By", "Status"], `[
  { ref: "TR-2026-09", name: "Epson High-Lumen Laser Projector", source: "Seminar Room 1", dest: "AI & ML Lab Room 302", date: "2026-07-18", by: "IMA Dean", status: "Completed" }
]`);

writeImaPage("staff.ima.asset-disposal.tsx", "/staff/ima/asset-disposal", "Asset Disposal", "E-waste disposal, scrapped equipment ledger, and auction records.", "ASSET MANAGEMENT", [{ label: "Disposed Assets", val: "8 Units" }, { label: "E-Waste Cleared", val: "Certified" }, { label: "Auction Value", val: "₹1.2 Lacs" }, { label: "Status", val: "Verified" }], ["Disposal Ref", "Equipment Name", "Disposal Reason", "Scrap Value", "Disposal Date", "E-Waste Certificate", "Status"], `[
  { ref: "DISP-2026-01", name: "Legacy CRT Monitors & Core2Duo Systems", reason: "Obsolete / Beyond Repair", val: "₹45,000", date: "2026-06-30", cert: "E-Waste Cert #9012", status: "Disposed" }
]`);

// Purchases
writeImaPage("staff.ima.purchase-requests.tsx", "/staff/ima/purchase-requests", "Purchase Requests", "Requisition requests for new hardware, lab equipment, and consumables.", "PURCHASES", [{ label: "Requisitions", val: "8 Requests" }, { label: "Est Total", val: "₹24.5 Lacs" }, { label: "Under Scrutiny", val: "2 Requests" }, { label: "Status", val: "Active" }], ["Req Ref", "Requested By", "Department", "Equipment Item", "Qty", "Est Cost", "Status"], `[
  { ref: "PR-2026-101", by: "Dr. Ravi Kumar", dept: "CSE", item: "NVIDIA RTX 4090 GPU Workstations", qty: "4 Units", cost: "₹10.5 Lacs", status: "Approved" }
]`);

writeImaPage("staff.ima.purchase-orders.tsx", "/staff/ima/purchase-orders", "Purchase Orders", "Issued purchase orders (PO), vendor details, and delivery SLAs.", "PURCHASES", [{ label: "Active POs", val: "6 Orders" }, { label: "Total PO Value", val: "₹18.2 Lacs" }, { label: "Delivery Pending", val: "2 Orders" }, { label: "Status", val: "Active" }], ["PO Number", "Vendor Name", "Equipment Description", "Quantity", "Total Amount", "Delivery Due Date", "Status"], `[
  { po: "PO-2026-801", vendor: "Dell Technologies", desc: "Dell OptiPlex 7090 i7 Workstations", qty: "20 Units", amt: "₹15.2 Lacs", due: "2026-08-25", status: "In Transit" }
]`);

writeImaPage("staff.ima.approved-purchases.tsx", "/staff/ima/approved-purchases", "Approved Purchases", "Procurement ledger of approved lab hardware purchases.", "PURCHASES", [{ label: "Approved POs", val: "14 Orders" }, { label: "Cleared Amount", val: "₹42.8 Lacs" }, { label: "Asset Tagged", val: "100%" }, { label: "Status", val: "Completed" }], ["PO Number", "Equipment Item", "Vendor", "Final Amount", "Approval Date", "Asset Tagging", "Status"], `[
  { po: "PO-2026-702", item: "Cisco Catalyst Switches", vendor: "Cisco India", amt: "₹12.5 Lacs", date: "2026-07-10", tag: "Tagged & Installed", status: "Completed" }
]`);

writeImaPage("staff.ima.purchase-vendors.tsx", "/staff/ima/purchase-vendors", "Purchase Vendors", "Registered hardware vendors, GST numbers, and procurement records.", "PURCHASES", [{ label: "Registered Vendors", val: "16 Vendors" }, { label: "GST Compliant", val: "100%" }, { label: "Tier-1 OEM", val: "Certified" }, { label: "Status", val: "Active" }], ["Vendor Code", "Company Name", "GST Number", "Supply Category", "Contact Email", "Status"], `[
  { code: "VND-DELL", name: "Dell Technologies India Ltd", gst: "36AAACD9012E1Z5", cat: "IT & Workstations", email: "gov_sales@dell.com", status: "Active" }
]`);

// Reports
writeImaPage("staff.ima.laboratory-reports.tsx", "/staff/ima/laboratory-reports", "Laboratory Reports", "Lab utilization reports, seating capacity, and inspection audits.", "REPORTS", [{ label: "Reports Generated", val: "18 Reports" }, { label: "Lab Utilization", val: "84.2%" }, { label: "Audit Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Scope", "Generated Date", "Status"], `[
  { title: "Annual Laboratory Infrastructure & Utilization Audit Report", scope: "All 18 Campus Labs", date: "2026-08-01", status: "Verified" }
]`);

writeImaPage("staff.ima.equipment-reports.tsx", "/staff/ima/equipment-reports", "Equipment Reports", "Hardware inventory health, working vs damaged ratios, and SLA reports.", "REPORTS", [{ label: "Equipment SLA", val: "95.1% Operational" }, { label: "Total Assets", val: "1,240 Assets" }, { label: "Audit Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Asset Count", "Working Rate", "Status"], `[
  { title: "Master Equipment Inventory Health & SLA Audit Report", count: "1,240 Assets", rate: "95.1% Operational", status: "Verified" }
]`);

writeImaPage("staff.ima.inventory-reports.tsx", "/staff/ima/inventory-reports", "Inventory Reports", "Department-wise inventory audit logs and stock registers.", "REPORTS", [{ label: "Stock Ledger", val: "₹4.82 Cr" }, { label: "Depts Mapped", val: "5 Departments" }, { label: "Audit Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Department Scope", "Valuation", "Status"], `[
  { title: "Institutional Department Stock & Inventory Valuation Report", scope: "All Departments", val: "₹4.82 Cr", status: "Verified" }
]`);

writeImaPage("staff.ima.maintenance-reports.tsx", "/staff/ima/maintenance-reports", "Maintenance Reports", "Maintenance tickets resolution history, AMC status, and downtime logs.", "REPORTS", [{ label: "Tickets Resolved", val: "84 Tickets" }, { label: "Avg Resolution", val: "24 Hrs" }, { label: "SLA Pass", val: "98.5%" }, { label: "Status", val: "Verified" }], ["Report Title", "Tickets Logged", "Resolution SLA", "Status"], `[
  { title: "Annual Hardware Maintenance & AMC SLA Performance Report", count: "96 Tickets", sla: "98.5% On-Time", status: "Verified" }
]`);

writeImaPage("staff.ima.purchase-reports.tsx", "/staff/ima/purchase-reports", "Purchase Reports", "Capital procurement reports, PO ledgers, and vendor performance.", "REPORTS", [{ label: "POs Issued", val: "14 Orders" }, { label: "Capital Spent", val: "₹42.8 Lacs" }, { label: "Delivery SLA", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Total PO Value", "Vendor Performance", "Status"], `[
  { title: "Annual Capital Equipment Procurement & PO Ledger Report", val: "₹42.8 Lacs", perf: "100% Delivered On-Time", status: "Verified" }
]`);

console.log("All 25 IMA dedicated pages generated successfully.");
