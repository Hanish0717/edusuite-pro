import React, { useState } from "react";
import { toast } from "sonner";
import { Users, LayoutGrid, List, Download, MessageSquare, CheckCircle2, Clock, UserPlus } from "lucide-react";
import { useRole } from "@/context/role-context";
import { AlumniProfileItem } from "@/types/alumni";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { SearchBar } from "@/components/alumni/shared/SearchBar";
import { FilterPanel } from "@/components/alumni/filters/FilterPanel";
import { ProfileCard } from "@/components/alumni/cards/ProfileCard";
import { DataTable, Column } from "@/components/alumni/tables/DataTable";
import { EmptyState } from "@/components/alumni/shared/EmptyState";
import { ConnectModal } from "@/components/alumni/dialogs/ConnectModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AlumniDirectoryViewProps {
  alumniList: AlumniProfileItem[];
  onOpenRegisterModal: () => void;
  onOpenMessagingCenter?: () => void;
}

export const AlumniDirectoryView: React.FC<AlumniDirectoryViewProps> = ({
  alumniList,
  onOpenRegisterModal,
  onOpenMessagingCenter,
}) => {
  const { role, externalPersona } = useRole();
  const isAlumniUser = role === "external-user" || externalPersona === "alumni";
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [employmentFilter, setEmploymentFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Profile Modal State
  const [selectedProfile, setSelectedProfile] = useState<AlumniProfileItem | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Connect Modal & Connection Tracking State
  const [connectTarget, setConnectTarget] = useState<AlumniProfileItem | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [pendingConnectIds, setPendingConnectIds] = useState<string[]>([]);
  const [connectedIds, setConnectedIds] = useState<string[]>(["ALM-2020-001"]); // Pre-connected sample

  const handleResetFilters = () => {
    setSearchQuery("");
    setBatchFilter("All");
    setDeptFilter("All");
    setEmploymentFilter("All");
    setCountryFilter("All");
  };

  const filteredAlumni = alumniList.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBatch = batchFilter === "All" || a.batch === batchFilter;
    const matchesDept = deptFilter === "All" || a.dept.includes(deptFilter);
    const matchesEmp = employmentFilter === "All" || a.employmentStatus === employmentFilter;
    const matchesCountry = countryFilter === "All" || a.country === countryFilter;

    return matchesSearch && matchesBatch && matchesDept && matchesEmp && matchesCountry;
  });

  const handleExportRoster = () => {
    if (!filteredAlumni || filteredAlumni.length === 0) {
      toast.error("No alumni records available to export.");
      return;
    }

    const headers = [
      "Alumni ID",
      "Full Name",
      "Graduation Batch",
      "Department",
      "Company",
      "Designation",
      "Location",
      "Country",
      "Mentoring Status",
      "Employment Status",
      "Email",
      "Phone",
    ];

    const csvRows = [
      headers.join(","),
      ...filteredAlumni.map((a) =>
        [
          `"${a.id}"`,
          `"${a.name.replace(/"/g, '""')}"`,
          `"${a.batch}"`,
          `"${a.dept.replace(/"/g, '""')}"`,
          `"${a.company.replace(/"/g, '""')}"`,
          `"${a.designation.replace(/"/g, '""')}"`,
          `"${a.location.replace(/"/g, '""')}"`,
          `"${a.country}"`,
          `"${a.mentoringStatus}"`,
          `"${a.employmentStatus}"`,
          `"${a.email}"`,
          `"${a.phone}"`,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `alumni_directory_roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Successfully downloaded CSV roster with ${filteredAlumni.length} alumni records!`, {
      description: "File saved to your browser downloads folder.",
    });
  };

  const handleOpenConnectModal = (alumnus: AlumniProfileItem) => {
    setConnectTarget(alumnus);
    setIsConnectModalOpen(true);
  };

  const handleConfirmConnect = (alumnusId: string, intent: string, note: string) => {
    setPendingConnectIds((prev) => [...prev, alumnusId]);
  };

  const getConnectionStatus = (alumnusId: string): "none" | "pending" | "connected" => {
    if (connectedIds.includes(alumnusId)) return "connected";
    if (pendingConnectIds.includes(alumnusId)) return "pending";
    return "none";
  };

  const columns: Column<AlumniProfileItem>[] = [
    {
      header: "Alumni Name & Batch",
      cell: (a) => (
        <div className="flex items-center gap-3">
          <img src={a.avatar} alt={a.name} className="size-9 rounded-xl object-cover" />
          <div>
            <span className="font-extrabold text-foreground font-sans block">{a.name}</span>
            <span className="text-[0.65rem] text-muted-foreground">{a.batch} • {a.dept}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Company & Role",
      cell: (a) => (
        <div>
          <span className="font-bold text-foreground font-sans block">{a.designation}</span>
          <span className="text-primary font-bold text-[0.68rem]">{a.company}</span>
        </div>
      ),
    },
    {
      header: "Location",
      cell: (a) => <span className="text-muted-foreground">{a.location}</span>,
    },
    {
      header: "Mentoring Status",
      cell: (a) => (
        <Badge variant="outline" className="text-[0.62rem] font-mono bg-blue-500/10 text-blue-600 border-blue-200">
          {a.mentoringStatus}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (a) => {
        const status = getConnectionStatus(a.id);
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedProfile(a);
                setIsProfileModalOpen(true);
              }}
              className="h-7 text-[0.65rem] rounded-lg font-bold"
            >
              View Profile
            </Button>
            <Button
              size="sm"
              onClick={() => handleOpenConnectModal(a)}
              variant={status === "connected" ? "outline" : "default"}
              className={`h-7 text-[0.65rem] font-bold rounded-lg ${
                status === "connected"
                  ? "bg-blue-50 text-[#2563EB] border-[#2563EB]"
                  : status === "pending"
                  ? "bg-amber-50 text-amber-600 border-amber-300"
                  : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              }`}
            >
              {status === "connected" ? "Connected ✓" : status === "pending" ? "Pending..." : "Connect"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alumni Directory"
        subtitle="Search and network with 5,420+ global alumni members across top technology enterprises and research labs."
        badgeText="Verified Alumni Roster"
        icon={Users}
        onOpenMessagingCenter={onOpenMessagingCenter}
        actions={
          <>
            <Button
              onClick={handleExportRoster}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer backdrop-blur-md border border-white/20 gap-1.5"
            >
              <Download className="size-3.5" /> Export Roster (CSV)
            </Button>
            <Button
              onClick={onOpenRegisterModal}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
            >
              {isAlumniUser ? (
                <>
                  <UserPlus className="size-3.5" /> Invite Batchmate
                </>
              ) : (
                "+ Register Alumni"
              )}
            </Button>
          </>
        }
      />

      {/* SEARCH BAR & VIEW TOGGLE */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="flex items-center gap-2">
          <div className="bg-card border border-border p-1 rounded-xl flex items-center gap-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`size-8 rounded-lg cursor-pointer ${viewMode === "grid" ? "bg-[#2563EB] text-white" : ""}`}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={`size-8 rounded-lg cursor-pointer ${viewMode === "list" ? "bg-[#2563EB] text-white" : ""}`}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* FILTER PANEL */}
      <FilterPanel
        batchFilter={batchFilter}
        setBatchFilter={setBatchFilter}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        employmentFilter={employmentFilter}
        setEmploymentFilter={setEmploymentFilter}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        onReset={handleResetFilters}
      />

      {/* ALUMNI CARDS OR LIST */}
      {filteredAlumni.length === 0 ? (
        <EmptyState
          title="No Alumni Profiles Found"
          description="No alumni match your current search query or active filter selections."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAlumni.map((alumnus) => (
            <ProfileCard
              key={alumnus.id}
              alumnus={alumnus}
              connectionStatus={getConnectionStatus(alumnus.id)}
              onViewProfile={(a) => {
                setSelectedProfile(a);
                setIsProfileModalOpen(true);
              }}
              onConnect={handleOpenConnectModal}
            />
          ))}
        </div>
      ) : (
        <DataTable data={filteredAlumni} columns={columns} keyExtractor={(a) => a.id} />
      )}

      {/* CONNECT MODAL DIALOG */}
      <ConnectModal
        alumnus={connectTarget}
        open={isConnectModalOpen}
        onOpenChange={setIsConnectModalOpen}
        onConfirmConnect={handleConfirmConnect}
      />

      {/* DETAILED PROFILE MULTI-TAB MODAL */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-6">
          {selectedProfile && (
            <div className="space-y-4 font-sans">
              <DialogHeader className="pb-3 border-b border-border">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedProfile.avatar}
                    alt={selectedProfile.name}
                    className="size-16 rounded-2xl object-cover border border-border shadow-xs"
                  />
                  <div>
                    <DialogTitle className="font-extrabold text-lg">{selectedProfile.name}</DialogTitle>
                    <DialogDescription className="text-xs font-mono text-primary font-bold">
                      {selectedProfile.designation} @ {selectedProfile.company}
                    </DialogDescription>
                    <span className="text-[0.68rem] text-muted-foreground font-mono">
                      {selectedProfile.batch} • {selectedProfile.dept}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="profile" className="space-y-3">
                <TabsList className="bg-muted/40 border border-border p-1 rounded-xl flex flex-wrap gap-1">
                  <TabsTrigger value="profile" className="text-xs font-bold font-mono">Profile</TabsTrigger>
                  <TabsTrigger value="career" className="text-xs font-bold font-mono">Career</TabsTrigger>
                  <TabsTrigger value="referrals" className="text-xs font-bold font-mono">Referrals ({selectedProfile.referralsSharedCount})</TabsTrigger>
                  <TabsTrigger value="mentorship" className="text-xs font-bold font-mono">Mentorship</TabsTrigger>
                  <TabsTrigger value="achievements" className="text-xs font-bold font-mono">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-muted/40 rounded-xl space-y-1 text-[0.72rem]">
                    <p>📍 Location: <strong>{selectedProfile.location}</strong></p>
                    <p>📧 Email: <strong className="text-blue-600">{selectedProfile.email}</strong></p>
                    <p>📞 Phone: <strong>{selectedProfile.phone}</strong></p>
                    <p>Status: <strong className="text-emerald-600">{selectedProfile.mentoringStatus}</strong></p>
                  </div>
                  <p className="text-muted-foreground font-sans leading-relaxed text-xs">{selectedProfile.bio}</p>
                </TabsContent>

                <TabsContent value="career" className="space-y-3 text-xs font-mono">
                  <div className="space-y-2">
                    <span className="font-bold font-sans text-foreground">Work Experience:</span>
                    {selectedProfile.workExperience.map((w, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                        <div>
                          <p className="font-sans font-bold text-foreground">{w.role}</p>
                          <p className="text-primary text-[0.68rem]">{w.company}</p>
                        </div>
                        <span className="text-[0.65rem] text-muted-foreground">{w.duration}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="referrals" className="space-y-2 text-xs font-mono">
                  <p className="text-muted-foreground">
                    This alumni has submitted <strong>{selectedProfile.referralsSharedCount}</strong> candidate referrals for positions at {selectedProfile.company}.
                  </p>
                </TabsContent>

                <TabsContent value="mentorship" className="space-y-2 text-xs font-mono">
                  <p className="text-emerald-600 font-bold">Status: {selectedProfile.mentoringStatus}</p>
                  <p className="text-muted-foreground">Available for 1-on-1 resume reviews and mock technical interviews.</p>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-2 text-xs font-sans">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {selectedProfile.achievements.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>

              <DialogFooter className="pt-2 border-t border-border">
                <Button variant="outline" onClick={() => setIsProfileModalOpen(false)} className="rounded-xl">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    handleOpenConnectModal(selectedProfile);
                  }}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl gap-1.5"
                >
                  <MessageSquare className="size-4" /> Send Connection Note
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
