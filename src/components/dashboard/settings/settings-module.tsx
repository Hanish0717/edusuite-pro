import { useState } from "react";
import { Search, X, User, Shield, Bell, Palette, Lock, GraduationCap, Download, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import type { FullFacultySettingsState, FacultySettingsSummaryStats } from "./types";
import { INITIAL_SETTINGS_DATA, INITIAL_SETTINGS_STATS } from "./mock-settings-data";
import { SettingsHeader } from "./settings-header";
import { SummaryCards } from "./summary-cards";
import { ProfileCard } from "./profile-card";
import { SecurityCard } from "./security-card";
import { NotificationPreferences } from "./notification-preferences";
import { AppearanceSettings } from "./appearance-settings";
import { PrivacySettings } from "./privacy-settings";
import { TeachingPreferences } from "./teaching-preferences";
import { DownloadCenter } from "./download-center";
import { DangerZone } from "./danger-zone";
import { SaveBar } from "./save-bar";

export type SettingsSectionTab =
  | "all"
  | "profile"
  | "security"
  | "notifications"
  | "appearance"
  | "privacy"
  | "teaching"
  | "downloads"
  | "danger";

export function SettingsModule() {
  const [settingsData, setSettingsData] = useState<FullFacultySettingsState>(INITIAL_SETTINGS_DATA);
  const [stats, setStats] = useState<FacultySettingsSummaryStats>(INITIAL_SETTINGS_STATS);
  const [activeSection, setActiveSection] = useState<SettingsSectionTab>("all");
  const [search, setSearch] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const sections = [
    { id: "all", label: "All Settings", icon: null },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "teaching", label: "Teaching", icon: GraduationCap },
    { id: "downloads", label: "Downloads", icon: Download },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  const handleUpdate = <K extends keyof FullFacultySettingsState>(
    section: K,
    updatedPartial: Partial<FullFacultySettingsState[K]>
  ) => {
    setSettingsData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updatedPartial,
      },
    }));
    setIsDirty(true);
  };

  const handleSaveChanges = () => {
    setIsDirty(false);
    toast.success("Settings saved successfully!", {
      description: "Your faculty account preferences and parameters have been synchronized.",
    });
  };

  const handleResetSettings = () => {
    setSettingsData(INITIAL_SETTINGS_DATA);
    setIsDirty(false);
    toast.info("Settings reset to default values.");
  };

  // Filter sections based on search query
  const query = search.toLowerCase().trim();
  const showProfile = query === "" || "profile name email photo department cabin employee id office hours".includes(query) || activeSection === "all" || activeSection === "profile";
  const showSecurity = query === "" || "security password mfa auth sessions devices 2fa recovery".includes(query) || activeSection === "all" || activeSection === "security";
  const showNotifications = query === "" || "notification alerts email push assignment attendance exam leave message announcement".includes(query) || activeSection === "all" || activeSection === "notifications";
  const showAppearance = query === "" || "appearance theme light dark font compact size language timezone color".includes(query) || activeSection === "all" || activeSection === "appearance";
  const showPrivacy = query === "" || "privacy visibility hide email phone office hours sharing public private".includes(query) || activeSection === "all" || activeSection === "privacy";
  const showTeaching = query === "" || "teaching preference semester department section attendance timetable lesson plan course".includes(query) || activeSection === "all" || activeSection === "teaching";
  const showDownloads = query === "" || "download export profile log history research activity archive cv pdf csv".includes(query) || activeSection === "all" || activeSection === "downloads";
  const showDanger = query === "" || "danger deactivate delete logout purge warning risk".includes(query) || activeSection === "all" || activeSection === "danger";

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <SettingsHeader
        onSaveChanges={handleSaveChanges}
        onResetSettings={handleResetSettings}
        isDirty={isDirty}
      />

      {/* Summary KPI Cards */}
      <SummaryCards stats={stats} />

      {/* Search & Navigation Bar */}
      <div className="space-y-3">
        <div className="rounded-2xl border border-border/50 bg-card p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search settings (e.g. Password, Theme, Notifications, Privacy)..."
              className="pl-9 h-8 text-xs bg-muted/20 border-border/40"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value) setActiveSection("all");
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id as any);
                    setSearch("");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  {Icon && <Icon className="size-3.5 shrink-0" />}
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Setting Sections */}
      <div className="space-y-6">
        {showProfile && (
          <ProfileCard
            profile={settingsData.profile}
            onUpdateProfile={(updated) => handleUpdate("profile", updated)}
          />
        )}

        {showSecurity && (
          <SecurityCard
            security={settingsData.security}
            onUpdateSecurity={(updated) => handleUpdate("security", updated)}
          />
        )}

        {showNotifications && (
          <NotificationPreferences
            notifications={settingsData.notifications}
            onUpdateNotifications={(updated) => handleUpdate("notifications", updated)}
          />
        )}

        {showAppearance && (
          <AppearanceSettings
            appearance={settingsData.appearance}
            onUpdateAppearance={(updated) => handleUpdate("appearance", updated)}
          />
        )}

        {showPrivacy && (
          <PrivacySettings
            privacy={settingsData.privacy}
            onUpdatePrivacy={(updated) => handleUpdate("privacy", updated)}
          />
        )}

        {showTeaching && (
          <TeachingPreferences
            teaching={settingsData.teaching}
            onUpdateTeaching={(updated) => handleUpdate("teaching", updated)}
          />
        )}

        {showDownloads && <DownloadCenter />}

        {showDanger && <DangerZone />}
      </div>

      {/* Floating Save Bar */}
      <SaveBar
        show={isDirty}
        onSave={handleSaveChanges}
        onReset={handleResetSettings}
      />
    </div>
  );
}
