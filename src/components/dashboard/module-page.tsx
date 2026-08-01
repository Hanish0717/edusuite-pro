import { useState } from "react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import { Search, Download, Plus, CheckCircle2, ArrowUpRight, Filter, FileText } from "lucide-react";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ModulePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tabs: string[];
  highlights: { label: string; value: string }[];
  onActionClick?: () => void;
  actionText?: string;
  activeTab?: string | undefined;
}

export function ModulePage({
  title,
  description,
  icon: Icon,
  tabs,
  highlights,
  onActionClick,
  actionText = "New Record",
  activeTab: externalActiveTab,
}: ModulePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [internalTab, setInternalTab] = useState<string>(tabs[0] ?? "overview");

  const currentTab =
    externalActiveTab && tabs.includes(externalActiveTab) ? externalActiveTab : internalTab;

  // Local state storage for dynamic record creation across tabs
  const [records, setRecords] = useState<Record<string, Array<{ id: string; name: string; details: string; status: string }>>>(() => {
    const initialMap: Record<string, Array<{ id: string; name: string; details: string; status: string }>> = {};
    tabs.forEach((tab) => {
      initialMap[tab] = [
        { id: `${title.slice(0, 3).toUpperCase()}-101`, name: `${tab} Record #101`, details: `Active status • Last updated today`, status: "Active" },
        { id: `${title.slice(0, 3).toUpperCase()}-102`, name: `${tab} Processing Entry #102`, details: `Approved • Verified by Admin`, status: "Approved" },
        { id: `${title.slice(0, 3).toUpperCase()}-103`, name: `${tab} Audit Task #103`, details: `Pending review • High priority`, status: "Pending Review" },
      ];
    });
    return initialMap;
  });

  // Modal dialog state for New Record
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecordName, setNewRecordName] = useState("");
  const [newRecordCategory, setNewRecordCategory] = useState(tabs[0] ?? "General");
  const [newRecordDetails, setNewRecordDetails] = useState("");
  const [newRecordStatus, setNewRecordStatus] = useState("Active");

  const handleOpenModal = () => {
    if (onActionClick) {
      onActionClick();
    } else {
      setNewRecordCategory(currentTab);
      setIsModalOpen(true);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordName) {
      toast.error("Please enter a record name.");
      return;
    }

    const cat = newRecordCategory || currentTab || tabs[0] || "General";
    const currentList = records[cat] || [];
    const nextNum = 101 + currentList.length;
    const prefix = title.slice(0, 3).toUpperCase();
    const newEntry = {
      id: `${prefix}-${nextNum}`,
      name: newRecordName,
      details: newRecordDetails || "Active status • Verified by Admin",
      status: newRecordStatus,
    };

    setRecords((prev) => ({
      ...prev,
      [cat]: [newEntry, ...(prev[cat] || [])],
    }));

    setIsModalOpen(false);
    setNewRecordName("");
    setNewRecordDetails("");
    toast.success(`Created new ${cat} record "${newEntry.name}" (${newEntry.id})!`);
  };

  const handleProcessItem = (itemName: string) => {
    toast.success(`Processed: ${itemName}`);
  };

  const handleExportTab = (tabName: string) => {
    const list = records[tabName] || [];
    const headers = ["Record ID", "Name", "Details", "Status"];
    const rows = list.map((item) => [item.id, `"${item.name}"`, `"${item.details}"`, item.status]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${title}_${tabName}_Export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${list.length} ${tabName} records to CSV!`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between border-b border-border pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-glow">
            <Icon className="size-6" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-extrabold sm:text-2xl">{title}</h1>
            <p className="truncate text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button
          onClick={handleOpenModal}
          className="shrink-0 bg-brand-gradient shadow-glow cursor-pointer text-xs font-bold gap-1.5 text-white"
        >
          <Plus className="size-4" /> {actionText}
        </Button>
      </header>

      {/* HIGHLIGHT KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="animate-fade-up rounded-2xl border border-border/70 bg-card p-5 shadow-card hover:border-primary/40 transition-colors"
          >
            <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-extrabold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {/* INTERACTIVE TABS CONTAINER */}
      <Tabs
        value={currentTab}
        onValueChange={(v) => setInternalTab(v)}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <TabsList className="bg-background/50 border border-border p-1 flex-wrap h-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-xs cursor-pointer">
                {tab} ({(records[tab] || []).length})
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${title.toLowerCase()} records...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-xs"
            />
          </div>
        </div>

        {tabs.map((tab) => {
          const tabItems = (records[tab] || []).filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.details.toLowerCase().includes(searchQuery.toLowerCase()),
          );

          return (
            <TabsContent key={tab} value={tab} className="mt-4">
              <Panel
                title={`${tab} Directory & Operations`}
                description={`Active ${tab.toLowerCase()} management and real-time ledger entries.`}
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExportTab(tab)}
                    className="h-8 text-xs cursor-pointer gap-1.5"
                  >
                    <Download className="size-3.5" /> Export {tab}
                  </Button>
                }
              >
                <div className="space-y-3">
                  {tabItems.length > 0 ? (
                    tabItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-border/70 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-primary">{item.id}</span>
                            <h4 className="font-display text-xs font-bold">{item.name}</h4>
                          </div>
                          <p className="text-[0.72rem] text-muted-foreground">{item.details}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-[0.65rem]">
                            {item.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleProcessItem(item.name)}
                            className="h-7 text-[0.7rem] cursor-pointer px-2.5 gap-1"
                          >
                            Action <ArrowUpRight className="size-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      No records match the current query.
                    </div>
                  )}
                </div>
              </Panel>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* DIALOG: CREATE NEW RECORD */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Create New {title} Record
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new operational entry to the {title} module ledger.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Record Title / Name *</Label>
              <Input
                required
                placeholder={`e.g. ${title} Priority Task #104`}
                value={newRecordName}
                onChange={(e) => setNewRecordName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Category / Tab</Label>
                <Select
                  value={newRecordCategory}
                  onValueChange={setNewRecordCategory}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select tab" />
                  </SelectTrigger>
                  <SelectContent>
                    {tabs.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Status</Label>
                <Select
                  value={newRecordStatus}
                  onValueChange={setNewRecordStatus}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active" className="text-xs">
                      Active
                    </SelectItem>
                    <SelectItem value="Approved" className="text-xs">
                      Approved
                    </SelectItem>
                    <SelectItem value="Pending Review" className="text-xs">
                      Pending Review
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Details / Description</Label>
              <Input
                placeholder="e.g. Active status • Verified by Admin"
                value={newRecordDetails}
                onChange={(e) => setNewRecordDetails(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold cursor-pointer">
                Create Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
