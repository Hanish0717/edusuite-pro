import React, { useState, useMemo } from "react";
import {
  Sparkles,
  TrendingUp,
  Bug,
  Wrench,
  ShieldCheck,
  Megaphone,
  FileCode,
  Search,
  RefreshCw,
  Filter,
  CheckCircle2,
  Calendar,
  Download,
  Paperclip,
  X,
  ExternalLink,
  ChevronRight,
  Pin,
  Tag,
  Clock,
  Layers,
  ArrowUpRight,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockErpUpdates, CURRENT_ERP_VERSION, RELEASE_VERSION, upcomingFeaturesList } from "./mock-data";
import { ErpUpdateItem, UpdateCategory } from "./types";

export const ErpUpdatesModule: React.FC = () => {
  const [updates, setUpdates] = useState<ErpUpdateItem[]>(mockErpUpdates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<ErpUpdateItem | null>(null);

  // Category Badge Renderer
  const renderCategoryBadge = (category: UpdateCategory) => {
    switch (category) {
      case "New Feature":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> New Feature
          </span>
        );
      case "Enhancement":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Enhancement
          </span>
        );
      case "Bug Fix":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
            <Bug className="h-3 w-3" /> Bug Fix
          </span>
        );
      case "Maintenance":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 flex items-center gap-1">
            <Wrench className="h-3 w-3" /> Maintenance
          </span>
        );
      case "Security":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Security
          </span>
        );
      case "Announcement":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <Megaphone className="h-3 w-3" /> Announcement
          </span>
        );
      case "Release Notes":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
            <FileCode className="h-3 w-3" /> Release Notes
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
            {category}
          </span>
        );
    }
  };

  // Category Icon Renderer
  const renderCategoryIcon = (category: UpdateCategory) => {
    switch (category) {
      case "New Feature":
        return <Sparkles className="h-4 w-4 text-blue-500" />;
      case "Enhancement":
        return <TrendingUp className="h-4 w-4 text-amber-500" />;
      case "Bug Fix":
        return <Bug className="h-4 w-4 text-rose-500" />;
      case "Maintenance":
        return <Wrench className="h-4 w-4 text-slate-500" />;
      case "Security":
        return <ShieldCheck className="h-4 w-4 text-purple-500" />;
      case "Announcement":
        return <Megaphone className="h-4 w-4 text-indigo-500" />;
      case "Release Notes":
        return <FileCode className="h-4 w-4 text-cyan-500" />;
      default:
        return <Zap className="h-4 w-4 text-primary" />;
    }
  };

  // Status Badge Renderer
  const renderStatusBadge = (status: string) => {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" /> {status}
      </span>
    );
  };

  // Filtering
  const filteredUpdates = useMemo(() => {
    return updates.filter((item) => {
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.shortDescription.toLowerCase().includes(q);
        const matchesVer = item.version.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesVer) return false;
      }
      return true;
    });
  }, [updates, selectedCategory, searchQuery]);

  const pinnedUpdates = useMemo(() => {
    return updates.filter((u) => u.isPinned);
  }, [updates]);

  const recentUpdates = useMemo(() => {
    return updates.slice(0, 4);
  }, [updates]);

  const handleOpenUpdateModal = (item: ErpUpdateItem) => {
    // Mark as read
    if (!item.isRead) {
      setUpdates((prev) =>
        prev.map((u) => (u.id === item.id ? { ...u, isRead: true } : u))
      );
    }
    setSelectedUpdate({ ...item, isRead: true });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
        <span>Home</span>
        <span>&gt;</span>
        <span>Student</span>
        <span>&gt;</span>
        <span className="text-foreground font-semibold">Updates</span>
      </div>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> Updates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay informed with the latest ERP improvements, platform enhancements, new features, maintenance announcements and release notes.
          </p>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh Updates
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory(selectedCategory === "ALL" ? "New Feature" : "ALL")}
            className="text-xs gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
        </div>
      </div>

      {/* LARGE SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search updates..."
          className="w-full pl-12 pr-4 py-3 text-base rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {["ALL", "New Feature", "Enhancement", "Bug Fix", "Maintenance", "Security", "Announcement", "Release Notes"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT GRID (Timeline + Right Panel Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TIMELINE VIEW (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Platform Release Timeline
            </h3>
            <span className="text-xs text-muted-foreground">
              Showing {filteredUpdates.length} updates
            </span>
          </div>

          {filteredUpdates.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-xl bg-card">
              <p className="text-sm text-muted-foreground">No updates matching your filter or search query.</p>
              <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("ALL"); }} className="text-xs mt-2">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="relative pl-6 border-l-2 border-primary/20 space-y-6">
              {filteredUpdates.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot Icon */}
                  <div className="absolute -left-[35px] top-1.5 w-8 h-8 rounded-full bg-card border-2 border-primary shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                    {renderCategoryIcon(item.category)}
                  </div>

                  {/* Update Card */}
                  <div
                    onClick={() => handleOpenUpdateModal(item)}
                    className="p-5 rounded-xl border border-border bg-card shadow-xs hover:shadow-md hover:border-primary/40 transition-all cursor-pointer space-y-3"
                  >
                    {/* Top Row: Category + Badges + Date */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {renderCategoryBadge(item.category)}
                        {renderStatusBadge(item.status)}
                        {!item.isRead && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                            New
                          </span>
                        )}
                        <span className="text-[11px] font-mono font-semibold text-muted-foreground px-2 py-0.5 rounded bg-muted">
                          {item.version}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <Calendar className="h-3.5 w-3.5" /> {item.publishedDate}
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <div>
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {item.title}
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {item.shortDescription}
                      </p>
                    </div>

                    {/* Attachment preview if available */}
                    {item.attachmentName && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                        <Paperclip className="h-3.5 w-3.5" /> {item.attachmentName}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL SIDEBAR */}
        <div className="space-y-6">
          {/* Release Version Info Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Version Details
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/60">
                <span className="text-muted-foreground font-medium">Release Version</span>
                <span className="font-bold text-primary font-mono">{RELEASE_VERSION}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/60">
                <span className="text-muted-foreground font-medium">Current ERP Version</span>
                <span className="font-bold text-foreground font-mono">{CURRENT_ERP_VERSION}</span>
              </div>
            </div>
          </div>

          {/* Pinned Updates */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Pin className="h-4 w-4 text-amber-500" /> Pinned Updates
            </h4>
            <div className="space-y-2.5">
              {pinnedUpdates.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenUpdateModal(item)}
                  className="p-3 rounded-lg border border-border/70 hover:border-primary/40 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary">{item.version}</span>
                    <span className="text-[10px] text-muted-foreground">{item.publishedDate}</span>
                  </div>
                  <h5 className="text-xs font-bold text-foreground line-clamp-1">{item.title}</h5>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Recent Updates
            </h4>
            <div className="space-y-2">
              {recentUpdates.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenUpdateModal(item)}
                  className="p-2.5 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-foreground line-clamp-1 flex-1 pr-2">{item.title}</span>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">{item.version}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Features Teaser */}
          <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Upcoming Features
            </h4>
            <div className="space-y-2 text-xs">
              {upcomingFeaturesList.map((uf, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                  <span className="font-semibold text-foreground">{uf.name}</span>
                  <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                    {uf.targetDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* UPDATE DETAILS MODAL */}
      {selectedUpdate && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {renderCategoryBadge(selectedUpdate.category)}
                  {renderStatusBadge(selectedUpdate.status)}
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {selectedUpdate.version}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground leading-tight">
                  {selectedUpdate.title}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Published on {selectedUpdate.publishedDate}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedUpdate(null)}
                className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-1">
                  Overview & Description
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedUpdate.fullDescription}
                </p>
              </div>

              {/* Features Added */}
              {selectedUpdate.featuresAdded && selectedUpdate.featuresAdded.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                    Features & Enhancements Included
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {selectedUpdate.featuresAdded.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-foreground font-medium">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Visual Preview Screenshot Container */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border text-center space-y-2">
                <div className="p-3 bg-card border border-border rounded-lg max-w-sm mx-auto shadow-xs">
                  <div className="h-24 bg-gradient-to-br from-primary/10 to-primary/30 rounded flex items-center justify-center text-primary font-bold text-xs">
                    [ Official ERP Release Interface Preview ]
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">Verified & Tested on EduSuite Pro Production Servers</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              {selectedUpdate.attachmentName ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Downloading Release Notes: ${selectedUpdate.attachmentName}`)}
                  className="text-xs gap-1.5"
                >
                  <Download className="h-3.5 w-3.5 text-primary" /> Download Release Notes
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground font-mono">No external PDF attachment required</span>
              )}

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedUpdate(null)} className="text-xs">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErpUpdatesModule;
