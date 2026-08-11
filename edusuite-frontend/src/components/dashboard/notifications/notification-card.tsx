import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Calendar,
  UserCheck,
  FlaskConical,
  Megaphone,
  Cog,
  FileText,
  DollarSign,
  ExternalLink,
  Check,
  Trash2,
} from "lucide-react";
import type { NotificationItem, NotificationCategory } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkAsReadToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onActionClick: (notification: NotificationItem) => void;
}

export function NotificationCard({
  notification,
  onMarkAsReadToggle,
  onDelete,
  onActionClick,
}: NotificationCardProps) {
  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "Assignments":
        return <BookOpen className="size-4 text-blue-600 dark:text-blue-400" />;
      case "Attendance":
        return <ClipboardCheck className="size-4 text-emerald-600 dark:text-emerald-400" />;
      case "Examinations":
        return <GraduationCap className="size-4 text-indigo-600 dark:text-indigo-400" />;
      case "Timetable":
        return <Calendar className="size-4 text-amber-600 dark:text-amber-400" />;
      case "Leave":
      case "Students":
        return <UserCheck className="size-4 text-purple-600 dark:text-purple-400" />;
      case "Research":
        return <FlaskConical className="size-4 text-teal-600 dark:text-teal-400" />;
      case "Announcements":
        return <Megaphone className="size-4 text-rose-600 dark:text-rose-400" />;
      case "Payroll":
        return <DollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />;
      case "Reports":
        return <FileText className="size-4 text-sky-600 dark:text-sky-400" />;
      default:
        return <Cog className="size-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 font-bold text-[10px] px-2 py-0.5">
            High Priority
          </Badge>
        );
      case "Medium":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 font-bold text-[10px] px-2 py-0.5">
            Medium Priority
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25 font-bold text-[10px] px-2 py-0.5">
            Low Priority
          </Badge>
        );
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 ${
        notification.isRead
          ? "border-border/40 bg-card/60 opacity-90 hover:opacity-100 hover:border-border"
          : "border-blue-500/20 bg-card shadow-sm hover:shadow-md hover:border-blue-500/30"
      }`}
    >
      <div className="space-y-3">
        {/* Header tags & time */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="size-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              {getCategoryIcon(notification.category)}
            </div>
            <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px] font-bold">
              {notification.category}
            </Badge>
            {getPriorityBadge(notification.priority)}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-muted-foreground">{notification.time}</span>
            {!notification.isRead && (
              <span className="size-2.5 rounded-full bg-blue-500 shadow-glow shrink-0" title="Unread" />
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h4 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
            {notification.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {notification.description}
          </p>
        </div>

        {/* Context metadata pill */}
        {(notification.subject || notification.section || notification.studentName) && (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-lg border border-border/30 w-fit flex-wrap font-medium">
            {notification.subject && <span>Subject: <strong className="text-foreground">{notification.subject}</strong></span>}
            {notification.section && <span>Section: <strong className="text-foreground">{notification.section}</strong></span>}
            {notification.studentName && <span>Student: <strong className="text-foreground">{notification.studentName}</strong></span>}
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/30 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          {notification.action && (
            <Button
              size="sm"
              className="h-7 text-xs px-3 gap-1 font-bold bg-brand-gradient text-white shadow-glow"
              onClick={() => onActionClick(notification)}
            >
              <span>{notification.action.label}</span>
              <ExternalLink className="size-3" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs px-2 gap-1 font-semibold text-muted-foreground hover:text-foreground"
            onClick={() => onMarkAsReadToggle(notification.id)}
          >
            <Check className="size-3.5" />
            {notification.isRead ? "Mark Unread" : "Mark Read"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs px-2 font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            onClick={() => onDelete(notification.id)}
            title="Delete notification"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
