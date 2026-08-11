import React from "react";
import { CalendarX, BookmarkX, Award, VideoOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "no-webinars" | "no-registrations" | "no-certificates" | "no-recordings";
  onResetFilter?: () => void;
}

export function WebinarEmptyState({ type, onResetFilter }: EmptyStateProps) {
  const configs = {
    "no-webinars": {
      icon: CalendarX,
      title: "No Webinars Found",
      description: "We couldn't find any live or upcoming webinars matching your current search query or active filter settings.",
      actionText: "Reset Search & Filters",
    },
    "no-registrations": {
      icon: BookmarkX,
      title: "No Registered Webinars Yet",
      description: "You haven't reserved a seat for any upcoming live events. Browse available sessions and register to secure your spot!",
      actionText: "Explore Upcoming Webinars",
    },
    "no-certificates": {
      icon: Award,
      title: "No Certificates Earned Yet",
      description: "Certificates are automatically awarded after attending live webinars for at least 85% of the session duration.",
      actionText: "Join Next Live Session",
    },
    "no-recordings": {
      icon: VideoOff,
      title: "No Video Recordings Available",
      description: "There are currently no saved video recordings matching your filter. Check back shortly after live sessions conclude.",
      actionText: "View All Sessions",
    },
  };

  const current = configs[type];
  const IconComponent = current.icon;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-[24px] bg-card/60 border border-border/60 backdrop-blur-xl shadow-xs my-8 space-y-4">
      <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20">
        <IconComponent className="size-10" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-lg font-extrabold text-foreground">{current.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {current.description}
        </p>
      </div>

      {onResetFilter && (
        <Button
          onClick={onResetFilter}
          variant="outline"
          className="mt-2 h-10 rounded-xl bg-background border-border text-xs font-semibold px-5"
        >
          <RotateCcw className="size-3.5 mr-2" />
          {current.actionText}
        </Button>
      )}
    </div>
  );
}
