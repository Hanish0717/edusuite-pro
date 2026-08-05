import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  fetchCampusNotices,
  INITIAL_NOTICES,
  type CampusNotice,
} from "./CommunicationService";

export function CommunicationModuleView() {
  const [notices, setNotices] = useState<CampusNotice[]>(INITIAL_NOTICES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    const data = await fetchCampusNotices();
    setNotices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase()) ||
      n.audience.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <MessageSquare className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Digital Notice Board & Communication Hub
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Campus Broadcast Portal
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Publish official announcements, emergency SMS alerts, exam circulars, and departmental notices to students & faculty.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Active Circulars</p>
          <p className="text-2xl font-bold font-mono text-primary">{notices.length} Notices</p>
          <p className="text-[0.68rem] text-muted-foreground">Digital Board Feed</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">SMS Broadcasts</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">14,200 Delivered</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">99.4% Reach Rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Target Audience</p>
          <p className="text-2xl font-bold font-mono text-purple-600">All Students & Staff</p>
          <p className="text-[0.68rem] text-muted-foreground">Role-Based Targeting</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Urgent Alerts</p>
          <p className="text-2xl font-bold font-mono text-amber-600">1 Active Alert</p>
          <p className="text-[0.68rem] text-muted-foreground">High Priority Placement Drive</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search notices by title, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((n) => (
            <div key={n.id} className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">{n.noticeNumber}</Badge>
                  <h3 className="font-bold text-sm text-foreground">{n.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={n.priority === "Urgent" ? "bg-red-500/10 text-red-600" : "bg-blue-500/10 text-blue-600"}>{n.priority} Priority</Badge>
                  <span className="text-[0.68rem] font-mono text-muted-foreground">{n.publishDate}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.description}</p>
              <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground pt-1 border-t border-border/40">
                <span>Audience: <strong className="text-foreground">{n.audience}</strong></span>
                <span>Posted by: <strong className="text-foreground">{n.postedBy}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
