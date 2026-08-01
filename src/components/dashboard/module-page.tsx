import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface TableItem {
  id: string;
  name: string;
  category: string;
  date: string;
  status: "Active" | "Pending" | "Completed" | "Approved" | "Rejected";
  details: string;
  metric: string;
}

interface ModulePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tabs: string[];
  highlights: { label: string; value: string }[];
  onActionClick?: () => void;
  actionText?: string;
  initialItems?: TableItem[];
}

const DEFAULT_MOCK_ITEMS: TableItem[] = [
  { id: "REC-2026-01", name: "Google Cloud Campus Hiring", category: "Full-Time FTE", date: "Aug 10, 2026", status: "Active", details: "Software Engineer I | 32.0 LPA CTC", metric: "520 Applicants" },
  { id: "REC-2026-02", name: "Microsoft Cloud & AI Drive", category: "Super Dream", date: "Aug 04, 2026", status: "Approved", details: "SDE-1 | 28.5 LPA CTC", metric: "610 Applicants" },
  { id: "REC-2026-03", name: "Qualcomm Hardware Systems", category: "Core Hardware", date: "Aug 18, 2026", status: "Pending", details: "Hardware Systems Eng | 22.0 LPA CTC", metric: "430 Applicants" },
  { id: "REC-2026-04", name: "Amazon AWS Cloud Operations", category: "Dream", date: "Aug 12, 2026", status: "Active", details: "Cloud Operations Specialist | 26.0 LPA CTC", metric: "480 Applicants" },
  { id: "REC-2026-05", name: "Tesla Motors Autonomous Drives", category: "Core Automotive", date: "Aug 22, 2026", status: "Completed", details: "Embedded Systems Eng | 24.0 LPA CTC", metric: "390 Applicants" },
  { id: "REC-2026-06", name: "Infosys Power Programmer Drive", category: "Mass & Specialty", date: "Jul 28, 2026", status: "Completed", details: "Specialist Programmer | 9.5 LPA CTC", metric: "820 Applicants" },
];

export function ModulePage({
  title,
  description,
  icon: Icon,
  tabs,
  highlights,
  onActionClick,
  actionText = "New Record",
  initialItems = DEFAULT_MOCK_ITEMS,
}: ModulePageProps) {
  const [items, setItems] = useState<TableItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState(tabs[0] || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "name">("newest");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<TableItem | null>(null);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    name: "",
    category: "Specialty",
    date: new Date().toISOString().split("T")[0],
    status: "Active" as TableItem["status"],
    details: "",
    metric: "0 Applicants",
  });

  // Filter & Search Logic
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === "name") return a.name.localeCompare(b.name);
    return b.id.localeCompare(a.id);
  });

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage) || 1;
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(paginatedItems.map((i) => i.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a record name");
      return;
    }
    const newItem: TableItem = {
      id: `REC-2026-${String(items.length + 1).padStart(2, "0")}`,
      name: formData.name,
      category: formData.category,
      date: formData.date || new Date().toLocaleDateString(),
      status: formData.status,
      details: formData.details || "Custom record details",
      metric: formData.metric,
    };
    setItems([newItem, ...items]);
    setIsCreateModalOpen(false);
    setFormData({ name: "", category: "Specialty", date: new Date().toISOString().split("T")[0] || "", status: "Active", details: "", metric: "0 Applicants" });
    toast.success(`Successfully created "${newItem.name}"`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === activeItem.id
          ? { ...i, ...formData, date: formData.date || i.date }
          : i
      )
    );
    setIsEditModalOpen(false);
    toast.success(`Updated record "${formData.name}"`);
  };

  const handleDeleteConfirm = () => {
    if (!activeItem) return;
    setItems((prev) => prev.filter((i) => i.id !== activeItem.id));
    setIsDeleteModalOpen(false);
    toast.success(`Deleted record "${activeItem.name}"`);
  };

  const handleExportData = () => {
    if (!sortedItems.length) {
      toast.error("No records available to export");
      return;
    }

    // CSV Headers and Content Generation
    const headers = ["ID", "Name", "Category", "Date", "Status", "Details", "Metrics"];
    const csvRows = sortedItems.map((item) => [
      `"${item.id.replace(/"/g, '""')}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`,
      `"${item.date.replace(/"/g, '""')}"`,
      `"${item.status.replace(/"/g, '""')}"`,
      `"${item.details.replace(/"/g, '""')}"`,
      `"${item.metric.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");

    // Trigger browser file download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `${title.toLowerCase().replace(/\s+/g, "_")}_export_${new Date().toISOString().split("T")[0] || "2026-08-01"}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded ${sortedItems.length} records as ${filename}`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* BREADCRUMB NAVIGATION */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/placement/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Placement</span>
        <span>/</span>
        <span className="text-primary font-bold">{title}</span>
      </nav>

      {/* HEADER SECTION */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between border-b border-border pb-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
            <Icon className="size-6" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-extrabold sm:text-2xl">{title}</h1>
            <p className="truncate text-xs sm:text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportData}
            className="text-xs gap-1.5 h-10 rounded-xl cursor-pointer"
          >
            <Download className="size-4" /> Export CSV
          </Button>
          <Button
            onClick={() => {
              if (onActionClick) onActionClick();
              else setIsCreateModalOpen(true);
            }}
            className="bg-brand-gradient shadow-glow text-xs font-bold gap-1.5 h-10 rounded-xl cursor-pointer"
          >
            <Plus className="size-4" /> {actionText}
          </Button>
        </div>
      </header>

      {/* HIGHLIGHT KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="animate-fade-up rounded-2xl border border-border/70 bg-card p-5 shadow-card hover:border-primary/40 transition-colors"
          >
            <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-extrabold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {/* MAIN DATA TABLE & TABS CONTAINER */}
      <Tabs defaultValue={tabs[0] ?? "All"} onValueChange={(val) => setActiveTab(val)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="flex-wrap h-auto p-1 bg-muted/50 rounded-xl">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-xs rounded-lg px-3 py-1.5 font-semibold">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* SEARCH & FILTERS BAR */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="h-9 border-input bg-card pl-9 text-xs rounded-xl focus-visible:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* STATUS FILTER DROPDOWN */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-xl border border-input bg-card px-3 pr-8 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* SORT ORDER */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder((prev) => (prev === "newest" ? "name" : "newest"))}
              className="h-9 text-xs gap-1 rounded-xl cursor-pointer"
            >
              <ArrowUpDown className="size-3.5" />
              {sortOrder === "newest" ? "Newest" : "Name A-Z"}
            </Button>
          </div>
        </div>

        {/* TAB CONTENT WITH DATA TABLE */}
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-4">
            <Panel
              title={`${tab} Records Overview`}
              description={`Manage and track ${tab.toLowerCase()} entries with live status updates.`}
              action={
                <Badge variant="outline" className="font-mono text-xs">
                  {filteredItems.length} Total
                </Badge>
              }
            >
              {paginatedItems.length === 0 ? (
                /* EMPTY STATE UI */
                <div className="py-12 text-center space-y-3">
                  <div className="size-12 rounded-full bg-muted grid place-items-center mx-auto text-muted-foreground">
                    <AlertCircle className="size-6" />
                  </div>
                  <h4 className="font-bold text-sm">No records found</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    No records match your search criteria or active filters. Try resetting filters or adding a new record.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("All");
                    }}
                    className="text-xs rounded-xl cursor-pointer"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                /* DATA TABLE */
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-xl border border-border/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/40 text-muted-foreground font-mono text-[0.68rem] uppercase border-b border-border/60">
                        <tr>
                          <th className="p-3 w-10">
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                paginatedItems.length > 0 &&
                                paginatedItems.every((i) => selectedRowIds.includes(i.id))
                              }
                              className="rounded cursor-pointer"
                            />
                          </th>
                          <th className="p-3">ID & Title</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Metrics</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {paginatedItems.map((item) => {
                          const isSelected = selectedRowIds.includes(item.id);
                          return (
                            <tr
                              key={item.id}
                              className={`hover:bg-muted/30 transition-colors ${
                                isSelected ? "bg-primary/5" : ""
                              }`}
                            >
                              <td className="p-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectRow(item.id)}
                                  className="rounded cursor-pointer"
                                />
                              </td>
                              <td className="p-3">
                                <div>
                                  <p className="font-bold text-foreground text-sm">{item.name}</p>
                                  <p className="text-[0.68rem] text-muted-foreground font-mono">
                                    {item.id} • {item.details}
                                  </p>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge variant="outline" className="font-mono text-[0.65rem]">
                                  {item.category}
                                </Badge>
                              </td>
                              <td className="p-3 font-mono text-muted-foreground">{item.date}</td>
                              <td className="p-3 font-bold text-foreground">{item.metric}</td>
                              <td className="p-3">
                                <Badge
                                  className={
                                    item.status === "Active" || item.status === "Approved"
                                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                      : item.status === "Pending"
                                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  }
                                >
                                  {item.status}
                                </Badge>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setActiveItem(item);
                                      setIsViewModalOpen(true);
                                    }}
                                    className="size-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                                    title="View Details"
                                  >
                                    <Eye className="size-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setActiveItem(item);
                                      setFormData({
                                        name: item.name,
                                        category: item.category,
                                        date: item.date,
                                        status: item.status,
                                        details: item.details,
                                        metric: item.metric,
                                      });
                                      setIsEditModalOpen(true);
                                    }}
                                    className="size-8 rounded-lg text-muted-foreground hover:text-primary cursor-pointer"
                                    title="Edit Record"
                                  >
                                    <Edit2 className="size-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setActiveItem(item);
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="size-8 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION FOOTER */}
                  <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>
                      Showing {paginatedItems.length} of {filteredItems.length} records
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="h-8 text-xs rounded-xl cursor-pointer"
                      >
                        <ChevronLeft className="size-3.5 mr-1" /> Previous
                      </Button>
                      <span className="font-mono px-2">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="h-8 text-xs rounded-xl cursor-pointer"
                      >
                        Next <ChevronRight className="size-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Panel>
          </TabsContent>
        ))}
      </Tabs>

      {/* ==================================================================== */}
      {/* INTERACTIVE MODALS & DIALOGS                                         */}
      {/* ==================================================================== */}

      {/* CREATE MODAL */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {actionText.includes("Company")
                ? "Register Corporate Partner (Company)"
                : actionText.includes("Recruiter")
                ? "Invite Corporate HR Recruiter"
                : `Create New ${title} Entry`}
            </DialogTitle>
            <DialogDescription>
              Enter details below to publish to the Placement Officer database.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                {actionText.includes("Company")
                  ? "Company Legal Name"
                  : actionText.includes("Recruiter")
                  ? "Recruiter Full Name"
                  : "Title / Name"}
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={
                  actionText.includes("Company")
                    ? "e.g. Tesla Motors India"
                    : actionText.includes("Recruiter")
                    ? "e.g. Ananya Sharma"
                    : "e.g. Drive Title"
                }
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">
                  {actionText.includes("Company")
                    ? "Industry Sector"
                    : actionText.includes("Recruiter")
                    ? "Associated Company"
                    : "Category"}
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder={
                    actionText.includes("Company")
                      ? "IT / Software, Core"
                      : actionText.includes("Recruiter")
                      ? "Google Cloud, Microsoft"
                      : "Specialty"
                  }
                  className="h-10 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TableItem["status"] })}
                  className="w-full h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                {actionText.includes("Company")
                  ? "Website / Location"
                  : actionText.includes("Recruiter")
                  ? "Official Work Email & Phone"
                  : "Description / Details"}
              </label>
              <Input
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder={
                  actionText.includes("Company")
                    ? "https://www.tesla.com"
                    : actionText.includes("Recruiter")
                    ? "ananya.sharma@company.com"
                    : "Role & Package details"
                }
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow rounded-xl cursor-pointer font-bold">
                {actionText.includes("Company")
                  ? "Register Company"
                  : actionText.includes("Recruiter")
                  ? "Invite Recruiter"
                  : "Save Record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIEW DETAILS MODAL */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="size-4 text-primary" /> {activeItem?.name}
            </DialogTitle>
            <DialogDescription>ID: {activeItem?.id}</DialogDescription>
          </DialogHeader>
          {activeItem && (
            <div className="space-y-3 text-xs pt-2">
              <div className="p-3 bg-muted/40 rounded-xl space-y-1.5">
                <p><span className="font-semibold text-muted-foreground">Category:</span> {activeItem.category}</p>
                <p><span className="font-semibold text-muted-foreground">Date:</span> {activeItem.date}</p>
                <p><span className="font-semibold text-muted-foreground">Details:</span> {activeItem.details}</p>
                <p><span className="font-semibold text-muted-foreground">Metric:</span> {activeItem.metric}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge>{activeItem.status}</Badge>
              </div>
            </div>
          )}
          <DialogFooter className="pt-2">
            <Button onClick={() => setIsViewModalOpen(false)} className="rounded-xl cursor-pointer">
              Close Window
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Record: {activeItem?.id}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Title / Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Details</label>
              <Input
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow rounded-xl font-bold cursor-pointer">
                Update Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="size-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{activeItem?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="rounded-xl cursor-pointer">
              Delete Forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
