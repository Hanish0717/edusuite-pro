import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function writeFinancePage(filename, routePath, pageTitleText, subTitleText, badgeText, kpis, headers, rowsJS, chartType) {
  const code = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Wallet,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Clock,
  Receipt,
  UserCheck,
  CheckCircle2,
  Users,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
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
    meta: [{ title: "${pageTitleText} — Finance Dean" }],
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
            <span className="text-xs text-muted-foreground">• Finance Dean ERP Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">${pageTitleText}</h1>
          <p className="text-sm text-muted-foreground">${subTitleText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export PDF / Excel
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add Financial Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="${kpis[0].label}" value="${kpis[0].val}" icon={Wallet} tone="purple" />
        <KpiCard label="${kpis[1].label}" value="${kpis[1].val}" icon={CreditCard} tone="success" />
        <KpiCard label="${kpis[2].label}" value="${kpis[2].val}" icon={TrendingUp} tone="info" />
        <KpiCard label="${kpis[3].label}" value="${kpis[3].val}" icon={ShieldCheck} tone="warning" />
      </div>

      ${chartType === "GroupedBarChart" ? `
      <Panel title="${pageTitleText} Distribution Chart" description="Quantitative financial ledger across academic departments.">
        <GroupedBarChart
          data={[
            { category: "CSE Dept", amount: 8.5 },
            { category: "ECE Dept", amount: 6.8 },
            { category: "ME Dept", amount: 5.2 },
            { category: "EEE Dept", amount: 4.5 },
            { category: "Civil Dept", amount: 3.8 },
            { category: "MBA Dept", amount: 3.2 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "amount", label: "Financial Value (₹ Cr)" }]}
          height={200}
        />
      </Panel>
      ` : ""}

      {/* MAIN DATA TABLE */}
      <Panel title="${pageTitleText} Master Ledger" description="Official institutional financial ledgers, audit vouchers, and budget allocations.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search financial records, vendors, student fees..."
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
                <SelectItem value="paid">Paid / Approved</SelectItem>
                <SelectItem value="pending">Pending / Due</SelectItem>
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
                        {String(val).toLowerCase().includes("paid") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("cleared") || String(val).toLowerCase().includes("disbursed") || String(val).toLowerCase().includes("verified") || String(val).toLowerCase().includes("active") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("due") || String(val).toLowerCase().includes("under review") ? (
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
  console.log(`Saved Finance subpage: ${filename}`);
}

// ----------------------------------------------------
// GENERATE ALL 30 FINANCE SUBPAGES
// ----------------------------------------------------

// Budget Management
writeFinancePage("staff.finance-dean.annual-budget.tsx", "/staff/finance-dean/annual-budget", "Annual Budget", "Master institutional annual budget allocation, sanctioned funds, and financial year ledgers.", "BUDGET MANAGEMENT", [{ label: "Total Budget", val: "₹48.5 Cr" }, { label: "Sanctioned FY", val: "FY 2025-26" }, { label: "Allocated", val: "₹42.0 Cr" }, { label: "Status", val: "Approved" }], ["Budget ID", "Department / Wing", "Allocated Budget", "Used Budget", "Remaining Balance", "Financial Year", "Status"], `[
  { id: "BGT-2025-01", dept: "Computer Science Engineering", alloc: "₹8.50 Cr", used: "₹7.20 Cr", rem: "₹1.30 Cr", fy: "2025-26", status: "Approved" },
  { id: "BGT-2025-02", dept: "Electronics & Communication", alloc: "₹6.80 Cr", used: "₹5.40 Cr", rem: "₹1.40 Cr", fy: "2025-26", status: "Approved" },
  { id: "BGT-2025-03", dept: "Mechanical Engineering", alloc: "₹5.20 Cr", used: "₹4.10 Cr", rem: "₹1.10 Cr", fy: "2025-26", status: "Approved" },
  { id: "BGT-2025-04", dept: "Electrical & Electronics", alloc: "₹4.50 Cr", used: "₹3.60 Cr", rem: "₹90.0 Lacs", fy: "2025-26", status: "Approved" },
  { id: "BGT-2025-05", dept: "Civil Engineering", alloc: "₹3.80 Cr", used: "₹2.90 Cr", rem: "₹90.0 Lacs", fy: "2025-26", status: "Approved" }
]`, "GroupedBarChart");

writeFinancePage("staff.finance-dean.dept-budgets.tsx", "/staff/finance-dean/dept-budgets", "Department Budgets", "Department-wise budget breakdown, lab allocation, and HOD approval ledgers.", "BUDGET MANAGEMENT", [{ label: "Depts Mapped", val: "8 Departments" }, { label: "Total Allocated", val: "₹36.8 Cr" }, { label: "HOD Approval", val: "100%" }, { label: "Status", val: "Approved" }], ["Dept Code", "Department Name", "Allocated Budget", "Lab Budget", "Research Budget", "Utilization %", "Status"], `[
  { code: "DEPT-CSE", name: "Computer Science Engineering", alloc: "₹8.50 Cr", lab: "₹4.20 Cr", res: "₹1.80 Cr", util: "84.7%", status: "Approved" },
  { code: "DEPT-ECE", name: "Electronics & Communication", alloc: "₹6.80 Cr", lab: "₹3.50 Cr", res: "₹1.40 Cr", util: "79.4%", status: "Approved" }
]`);

writeFinancePage("staff.finance-dean.budget-allocation.tsx", "/staff/finance-dean/budget-allocation", "Budget Allocation", "Quarterly budget release schedules, capital vs operational expenditure allocations.", "BUDGET MANAGEMENT", [{ label: "Capital Exp", val: "₹18.5 Cr" }, { label: "Operational Exp", val: "₹23.5 Cr" }, { label: "Quarterly Disb", val: "Q3 Released" }, { label: "Status", val: "Active" }], ["Allocation Ref", "Category", "Quarter Scope", "Sanctioned Amount", "Released Amount", "Status"], `[
  { ref: "ALC-Q3-01", cat: "Lab Hardware & Software Subscriptions", qtr: "Q3 FY 2025-26", amt: "₹4.50 Cr", rel: "₹4.50 Cr", status: "Approved" }
]`);

writeFinancePage("staff.finance-dean.budget-utilization.tsx", "/staff/finance-dean/budget-utilization", "Budget Utilization", "Real-time budget consumption tracking, variance analysis, and audit warnings.", "BUDGET MANAGEMENT", [{ label: "Overall Consumption", val: "74.6%" }, { label: "Variance Score", val: "Optimal (<5%)" }, { label: "Audit Clearance", val: "Verified" }, { label: "Status", val: "Verified" }], ["Department", "Sanctioned Budget", "Spent Amount", "Committed POs", "Available Balance", "Status"], `[
  { dept: "CSE Dept", sanc: "₹8.50 Cr", spent: "₹7.20 Cr", po: "₹45.0 Lacs", bal: "₹85.0 Lacs", status: "Verified" }
]`);

// Fee Management
writeFinancePage("staff.finance-dean.fee-collection.tsx", "/staff/finance-dean/fee-collection", "Fee Collection", "Student tuition fee, hostel fee, and exam fee collection ledgers.", "FEE MANAGEMENT", [{ label: "Fee Collected Mtd", val: "₹23.1 Cr" }, { label: "Collected Today", val: "₹42.5 Lacs" }, { label: "Collection %", val: "96.2%" }, { label: "Status", val: "Active" }], ["Receipt No", "Student Name", "Roll Number", "Department", "Fee Type", "Paid Amount", "Payment Mode", "Status"], `[
  { rcpt: "RCPT-2026-901", name: "Rahul Sharma", roll: "22CS101", dept: "CSE", type: "Autumn Semester Tuition Fee", amt: "₹75,000", mode: "Online UPI / NetBanking", status: "Paid" },
  { rcpt: "RCPT-2026-902", name: "Priya Reddy", roll: "22CS102", dept: "CSE", type: "Autumn Semester Tuition Fee", amt: "₹75,000", mode: "Challan Bank Transfer", status: "Paid" },
  { rcpt: "RCPT-2026-903", name: "K. Sai Teja", roll: "22EC104", dept: "ECE", type: "Hostel & Mess Fee", amt: "₹45,000", mode: "Credit Card", status: "Paid" }
]`, "GroupedBarChart");

writeFinancePage("staff.finance-dean.pending-fees.tsx", "/staff/finance-dean/pending-fees", "Pending Fees", "Student fee defaulter ledgers, pending fee dues, and installment reminders.", "FEE MANAGEMENT", [{ label: "Pending Fees Total", val: "₹90.0 Lacs" }, { label: "Defaulter Students", val: "120 Students" }, { label: "Due Date", val: "15-Aug-2026" }, { label: "Status", val: "Pending" }], ["Roll Number", "Student Name", "Department", "Fee Type", "Total Due", "Paid Amount", "Pending Balance", "Status"], `[
  { roll: "22CE110", name: "Abhishek Kumar", dept: "Civil", type: "Semester Tuition Fee", total: "₹75,000", paid: "₹35,000", pend: "₹40,000", status: "Pending" }
]`);

writeFinancePage("staff.finance-dean.scholarships-concessions.tsx", "/staff/finance-dean/scholarships-concessions", "Scholarships & Fee Concessions", "Govt Jagananna / Epass scholarship adjustments & merit fee waivers.", "FEE MANAGEMENT", [{ label: "Scholarships Disbursed", val: "₹3.80 Cr" }, { label: "Beneficiaries", val: "1,240 Students" }, { label: "Govt Reimbursed", val: "100%" }, { label: "Status", val: "Approved" }], ["Scholarship ID", "Student Name", "Scheme Name", "Category", "Concession Amount", "Status"], `[
  { id: "SCH-2026-401", student: "Rahul Sharma", scheme: "State Post-Matric Govt Reimbursement", cat: "Government Merit", amt: "₹75,000", status: "Approved" }
]`);

writeFinancePage("staff.finance-dean.refund-management.tsx", "/staff/finance-dean/refund-management", "Refund Management", "Caution deposit refunds, seat cancellation fee refunds, and bank payouts.", "FEE MANAGEMENT", [{ label: "Refund Claims", val: "18 Requests" }, { label: "Total Refunded", val: "₹8.50 Lacs" }, { label: "SLA Clearance", val: "100%" }, { label: "Status", val: "Active" }], ["Refund Ref", "Student Name", "Roll Number", "Refund Reason", "Refund Amount", "Bank Details", "Status"], `[
  { ref: "RFD-2026-09", student: "K. Vikrant", roll: "21ME109", reason: "Graduation Caution Deposit Refund", amt: "₹10,000", bank: "HDFC Bank (IFSC: HDFC000123)", status: "Paid" }
]`);

// Expenditure Management
writeFinancePage("staff.finance-dean.daily-expenses.tsx", "/staff/finance-dean/daily-expenses", "Daily Expenses", "Petty cash expenses, campus maintenance vouchers, and daily disbursements.", "EXPENDITURE MANAGEMENT", [{ label: "Daily Vouchers", val: "₹1.45 Lacs" }, { label: "Monthly Cumulative", val: "₹2.85 Cr" }, { label: "Audit Checked", val: "100%" }, { label: "Status", val: "Verified" }], ["Voucher No", "Expense Description", "Category", "Department", "Amount", "Paid Date", "Status"], `[
  { vno: "VCH-2026-801", desc: "Library Journal Subscriptions & Books Courier", cat: "Operational", dept: "Central Library", amt: "₹18,500", date: "2026-08-04", status: "Paid" },
  { vno: "VCH-2026-802", desc: "Campus Diesel Generator Refuel Supply", cat: "Utilities", dept: "Estate Office", amt: "₹45,000", date: "2026-08-04", status: "Paid" }
]`, "GroupedBarChart");

writeFinancePage("staff.finance-dean.dept-expenses.tsx", "/staff/finance-dean/dept-expenses", "Department Expenses", "Department-wise operational expenditure, consumable invoices, and lab maintenance.", "EXPENDITURE MANAGEMENT", [{ label: "Dept Expenditure", val: "₹8.40 Cr" }, { label: "Lab Maintenance", val: "₹2.10 Cr" }, { label: "Approval Rate", val: "100%" }, { label: "Status", val: "Approved" }], ["Department", "Monthly Expenses", "Consumables", "Lab Repair", "Total Spent", "Status"], `[
  { dept: "Computer Science Engineering", monthly: "₹28.5 Lacs", cons: "₹4.2 Lacs", lab: "₹8.5 Lacs", total: "₹41.2 Lacs", status: "Approved" }
]`);

writeFinancePage("staff.finance-dean.purchase-payments.tsx", "/staff/finance-dean/purchase-payments", "Purchase Payments", "Payments for capital equipment POs, GPU servers, and software licenses.", "EXPENDITURE MANAGEMENT", [{ label: "Purchase Payments", val: "₹4.20 Cr" }, { label: "PO Ledgers Cleared", val: "100%" }, { label: "Vendor SLA", val: "On-Time" }, { label: "Status", val: "Paid" }], ["Payment ID", "PO Number", "Vendor / Manufacturer", "Item Description", "Amount Paid", "Status"], `[
  { id: "PAY-PO-901", po: "PO-2026-801", vendor: "Dell Technologies India", item: "20 Dell OptiPlex 7090 i7 Workstations", amt: "₹15.2 Lacs", status: "Paid" }
]`);

writeFinancePage("staff.finance-dean.vendor-payments.tsx", "/staff/finance-dean/vendor-payments", "Vendor Payments", "Authorized vendor payments, GST invoices, and scheduled bank transfers.", "EXPENDITURE MANAGEMENT", [{ label: "Pending Vendor Payments", val: "₹18.4 Lacs" }, { label: "Cleared Payments", val: "₹1.85 Cr" }, { label: "SLA Pass", val: "99.0%" }, { label: "Status", val: "Active" }], ["Bill No", "Vendor Name", "Supply Category", "GST Invoice No", "Invoice Amount", "Payment Due Date", "Status"], `[
  { bill: "BILL-2026-401", vendor: "Cisco Systems India", cat: "Network Hardware", gst: "36AAACD9012E1Z5", amt: "₹12.5 Lacs", due: "2026-08-15", status: "Pending" }
]`);

// Payroll
writeFinancePage("staff.finance-dean.faculty-payroll.tsx", "/staff/finance-dean/faculty-payroll", "Faculty Payroll", "Monthly faculty salary processing, basic pay, DA, HRA, and net salary disbursements.", "PAYROLL", [{ label: "Faculty Payroll", val: "₹1.85 Cr / Mo" }, { label: "Faculty Members", val: "245 Faculty" }, { label: "Disbursement SLA", val: "1st of Month" }, { label: "Status", val: "Paid" }], ["Emp ID", "Faculty Name", "Department", "Basic Salary", "Allowances (HRA/DA)", "Deductions (PF/TDS)", "Net Salary", "Status"], `[
  { id: "FAC-101", name: "Dr. Ravi Kumar", dept: "CSE", basic: "₹1,20,000", allow: "₹48,000", ded: "₹18,000", net: "₹1,50,000", status: "Paid" },
  { id: "FAC-102", name: "Dr. Priya Sharma", dept: "ECE", basic: "₹1,10,000", allow: "₹44,000", ded: "₹16,500", net: "₹1,37,500", status: "Paid" },
  { id: "FAC-103", name: "Dr. Srinivas Rao", dept: "CSE", basic: "₹1,25,000", allow: "₹50,000", ded: "₹19,000", net: "₹1,56,000", status: "Paid" }
]`, "GroupedBarChart");

writeFinancePage("staff.finance-dean.staff-payroll.tsx", "/staff/finance-dean/staff-payroll", "Staff Payroll", "Administrative & technical staff salary ledgers and monthly bank credits.", "PAYROLL", [{ label: "Staff Payroll", val: "₹1.00 Cr / Mo" }, { label: "Staff Members", val: "180 Staff" }, { label: "Bank Direct Credit", val: "100%" }, { label: "Status", val: "Paid" }], ["Emp ID", "Staff Name", "Role / Designation", "Department", "Basic Salary", "Net Salary", "Status"], `[
  { id: "STF-201", name: "Mr. M. Rajesh", role: "Senior Lab Technician", dept: "CSE", basic: "₹45,000", net: "₹52,000", status: "Paid" }
]`);

writeFinancePage("staff.finance-dean.salary-history.tsx", "/staff/finance-dean/salary-history", "Salary History", "Historical monthly payroll ledgers, Form 16, and annual salary statements.", "PAYROLL", [{ label: "Annual Payroll", val: "₹34.2 Cr" }, { label: "Form 16 Issued", val: "100%" }, { label: "Audit Verification", val: "Clear" }, { label: "Status", val: "Verified" }], ["Financial Year", "Month", "Total Salary Disbursed", "PF Deposited", "TDS Remitted", "Status"], `[
  { fy: "2025-26", month: "July 2026", total: "₹2.85 Cr", pf: "₹34.2 Lacs", tds: "₹28.5 Lacs", status: "Verified" }
]`);

writeFinancePage("staff.finance-dean.allowances-deductions.tsx", "/staff/finance-dean/allowances-deductions", "Allowances & Deductions", "PF contribution ledgers, ESI, TDS tax deductions, and DA revision rules.", "PAYROLL", [{ label: "PF Remitted", val: "₹34.2 Lacs" }, { label: "TDS Tax Remitted", val: "₹28.5 Lacs" }, { label: "ESI Compliance", val: "100%" }, { label: "Status", val: "Verified" }], ["Rule Code", "Category", "Allowance / Deduction Type", "Percentage / Rule", "Status"], `[
  { code: "RULE-PF", cat: "Deduction", type: "Provident Fund (EPFO)", pct: "12% of Basic", status: "Active" }
]`);

// Purchases & Vendors
writeFinancePage("staff.finance-dean.purchase-requests.tsx", "/staff/finance-dean/purchase-requests", "Purchase Requests", "Requisition requests for campus hardware, furniture, and IT equipment.", "PURCHASES & VENDORS", [{ label: "Requisitions", val: "12 Requests" }, { label: "Est Total", val: "₹45.0 Lacs" }, { label: "Budget Clearance", val: "Verified" }, { label: "Status", val: "Approved" }], ["Req Ref", "Department", "Item Requested", "Quantity", "Estimated Cost", "Financial Approval", "Status"], `[
  { ref: "PR-FIN-101", dept: "CSE", item: "Dell OptiPlex 7090 i7 Workstations", qty: "20 Units", cost: "₹15.2 Lacs", app: "Finance Dean Approved", status: "Approved" }
]`, "GroupedBarChart");

writeFinancePage("staff.finance-dean.purchase-orders.tsx", "/staff/finance-dean/purchase-orders", "Purchase Orders", "Official Purchase Orders (PO) issued to authorized vendors.", "PURCHASES & VENDORS", [{ label: "POs Issued", val: "18 Orders" }, { label: "Total PO Value", val: "₹1.85 Cr" }, { label: "Delivery Target", val: "On-Time" }, { label: "Status", val: "Active" }], ["PO Number", "Vendor Name", "Equipment Scope", "Total Amount", "Issue Date", "Status"], `[
  { po: "PO-2026-801", vendor: "Dell Technologies India", scope: "Dell OptiPlex 7090 i7 Workstations", amt: "₹15.2 Lacs", date: "2026-07-20", status: "In Transit" }
]`);

writeFinancePage("staff.finance-dean.vendor-management.tsx", "/staff/finance-dean/vendor-management", "Vendor Management", "Empanelled vendor list, GST details, bank accounts, and ratings.", "PURCHASES & VENDORS", [{ label: "Empanelled Vendors", val: "24 Vendors" }, { label: "Tier-1 Vendors", val: "Dell, HP, Cisco" }, { label: "GST Compliant", val: "100%" }, { label: "Status", val: "Active" }], ["Vendor Code", "Vendor Name", "GST Number", "Supply Domain", "Bank Account / IFSC", "Status"], `[
  { code: "VND-DELL", name: "Dell Technologies India Ltd", gst: "36AAACD9012E1Z5", domain: "IT Hardware & Workstations", bank: "HDFC Bank (IFSC: HDFC000123)", status: "Active" },
  { code: "VND-HP", name: "HP India Sales Pvt Ltd", gst: "36AAACH1092F1Z8", domain: "Printers & Laptops", bank: "ICICI Bank (IFSC: ICIC000456)", status: "Active" },
  { code: "VND-CSCO", name: "Cisco Systems India Pvt Ltd", gst: "36AAACC4412K1Z2", domain: "Network Switches & Routers", bank: "SBI (IFSC: SBIN000901)", status: "Active" }
]`);

writeFinancePage("staff.finance-dean.invoice-management.tsx", "/staff/finance-dean/invoice-management", "Invoice Management", "Vendor invoice processing, 3-way matching with PO & Goods Receipt.", "PURCHASES & VENDORS", [{ label: "Invoices Processed", val: "42 Invoices" }, { label: "3-Way Matched", val: "100%" }, { label: "Cleared Amount", val: "₹1.85 Cr" }, { label: "Status", val: "Verified" }], ["Invoice No", "Vendor Name", "PO Number", "Invoice Date", "Invoice Amount", "Payment Status", "Status"], `[
  { inv: "INV-DELL-901", vendor: "Dell Technologies India", po: "PO-2026-801", date: "2026-07-25", amt: "₹15.2 Lacs", pay: "Paid in Full", status: "Completed" }
]`);

// Financial Audit
writeFinancePage("staff.finance-dean.internal-audit.tsx", "/staff/finance-dean/internal-audit", "Internal Audit", "Quarterly internal audit observations, voucher verifications, and compliance.", "FINANCIAL AUDIT", [{ label: "Audits Completed", val: "Q2 Audited" }, { label: "Vouchers Verified", val: "2,480 Vouchers" }, { label: "Audit Rating", val: "Grade A" }, { label: "Status", val: "Verified" }], ["Audit ID", "Quarter", "Internal Auditor Name", "Scope", "Audit Date", "Observations", "Status"], `[
  { id: "AUD-INT-Q2", qtr: "Q2 FY 2025-26", auditor: "M/s Sharma & Associates CA", scope: "Fee Collections & Daily Vouchers", date: "2026-07-15", obs: "Clean Audit Pass, No Objections", status: "Verified" }
]`, "GroupedBarChart");

writeFinancePage("staff.finance-dean.external-audit.tsx", "/staff/finance-dean/external-audit", "External Audit", "Statutory CAG & Chartered Accountant annual audit reports.", "FINANCIAL AUDIT", [{ label: "Statutory Audit", val: "FY 2024-25 Complete" }, { label: "CAG Clearance", val: "Clean Pass" }, { label: "Compliance Score", val: "100%" }, { label: "Status", val: "Verified" }], ["Audit Ref", "Auditing Firm", "Financial Year", "Statutory Balance Sheet", "Audit Opinion", "Status"], `[
  { ref: "AUD-EXT-2025", firm: "M/s PriceWaterhouse & Co LLP", fy: "2024-25", sheet: "Balance Sheet Approved", op: "Unqualified Clean Opinion", status: "Verified" }
]`);

writeFinancePage("staff.finance-dean.audit-compliance.tsx", "/staff/finance-dean/audit-compliance", "Audit Compliance", "Compliance tracking with IT Act, GST filing, and EPFO regulations.", "FINANCIAL AUDIT", [{ label: "GST Compliance", val: "100% On-Time" }, { label: "IT Returns", val: "Filed" }, { label: "PF Filing", val: "Clear" }, { label: "Status", val: "Compliant" }], ["Regulation", "Authority", "Filing Frequency", "Last Filed Date", "Compliance Status", "Status"], `[
  { reg: "GST Return filing (GSTR-3B & GSTR-1)", auth: "GST Department Govt of India", freq: "Monthly", date: "2026-08-02", comp: "100% Compliant", status: "Active" }
]`);

writeFinancePage("staff.finance-dean.audit-history.tsx", "/staff/finance-dean/audit-history", "Audit History", "Historical audit archives, past balance sheets, and audit clearance certificates.", "FINANCIAL AUDIT", [{ label: "Archives", val: "10 Years" }, { label: "Audit Objections", val: "0 Pending" }, { label: "Statutory Clearance", val: "100%" }, { label: "Status", val: "Verified" }], ["Financial Year", "Audit Type", "Auditor Name", "Clearance Certificate", "Status"], `[
  { fy: "2024-25", type: "Statutory Annual Audit", auditor: "PwC LLP", cert: "Clearance Cert #9012", status: "Verified" }
]`);

// Reports
writeFinancePage("staff.finance-dean.financial-reports.tsx", "/staff/finance-dean/financial-reports", "Financial Reports", "Master financial balance sheet, profit & loss, and liquidity reports.", "REPORTS", [{ label: "Reports Archived", val: "24 Reports" }, { label: "Audit Clearance", val: "100%" }, { label: "Financial Health", val: "Optimal" }, { label: "Status", val: "Verified" }], ["Report Title", "Financial Scope", "Generated Date", "Status"], `[
  { title: "Master Institutional Balance Sheet & Income-Expenditure Report FY 2025-26", scope: "Entire Campus", date: "2026-08-01", status: "Verified" }
]`);

writeFinancePage("staff.finance-dean.budget-reports.tsx", "/staff/finance-dean/budget-reports", "Budget Reports", "Department budget utilization and variance analysis reports.", "REPORTS", [{ label: "Total Budget", val: "₹48.5 Cr" }, { label: "Variance Score", val: "95.2%" }, { label: "SLA Clearance", val: "Verified" }, { label: "Status", val: "Verified" }], ["Report Title", "Sanctioned Budget", "Utilization Rate", "Status"], `[
  { title: "Annual Departmental Budget Allocation & Utilization Variance Report", val: "₹48.5 Cr", util: "74.6% Spent", status: "Verified" }
]`);

writeFinancePage("staff.finance-dean.fee-reports.tsx", "/staff/finance-dean/fee-reports", "Fee Reports", "Fee collection ledgers, pending fee dues, and scholarship reimbursement reports.", "REPORTS", [{ label: "Fee Collected", val: "₹23.1 Cr" }, { label: "Pending Dues", val: "₹90.0 Lacs" }, { label: "Defaulter Ratio", val: "3.75%" }, { label: "Status", val: "Verified" }], ["Report Title", "Fee Collected Total", "Pending Dues Ratio", "Status"], `[
  { title: "Autumn Semester Fee Collection & Defaulters Audit Report", total: "₹23.1 Cr", pend: "3.75% Dues", status: "Verified" }
]`);

writeFinancePage("staff.finance-dean.payroll-reports.tsx", "/staff/finance-dean/payroll-reports", "Payroll Reports", "Faculty & staff salary disbursement ledgers, PF, and TDS tax reports.", "REPORTS", [{ label: "Annual Payroll", val: "₹34.2 Cr" }, { label: "TDS Remitted", val: "100%" }, { label: "PF Remitted", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Payroll Amount", "PF/TDS Compliance", "Status"], `[
  { title: "Annual Institutional Faculty & Staff Payroll & Tax Deduction Report", amt: "₹34.2 Cr", comp: "100% Tax Remitted", status: "Verified" }
]`);

writeFinancePage("staff.finance-dean.audit-reports.tsx", "/staff/finance-dean/audit-reports", "Audit Reports", "Internal & external statutory audit reports and compliance ledgers.", "REPORTS", [{ label: "Audits Cleared", val: "100%" }, { label: "CAG Certificate", val: "Issued" }, { label: "Objection Count", val: "Zero" }, { label: "Status", val: "Verified" }], ["Report Title", "Auditor Name", "Audit Opinion", "Status"], `[
  { title: "Annual Statutory Audit & Balance Sheet Certificate Report", auditor: "PriceWaterhouse & Co", op: "Unqualified Clean Opinion", status: "Verified" }
]`);

console.log("All 30 Finance dedicated pages generated successfully.");
