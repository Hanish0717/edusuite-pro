import React from "react";
import { TimetableSlot } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Award, 
  Video,
  Building,
  Mail
} from "lucide-react";
import { toast } from "sonner";

interface ClassDetailsModalProps {
  slot: TimetableSlot | null;
  onClose: () => void;
  onNavigateToLms?: () => void;
  onNavigateToAttendance?: () => void;
  onViewFaculty?: (facultyEmail: string) => void;
}

export function ClassDetailsModal({
  slot,
  onClose,
  onNavigateToLms,
  onNavigateToAttendance,
  onViewFaculty,
}: ClassDetailsModalProps) {
  if (!slot) return null;

  const getClassTypeColor = (type: string) => {
    switch (type) {
      case "Lecture": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Lab": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Tutorial": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Seminar": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Online": return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <Dialog open={!!slot} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-xl rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4">
        {/* HEADER */}
        <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono font-bold text-purple-600 border-purple-200 text-xs">
              {slot.subjectCode}
            </Badge>
            <Badge className={`text-[10px] px-2 py-0.5 font-mono ${getClassTypeColor(slot.classType)}`}>
              {slot.classType}
            </Badge>
            <Badge
              className={`text-[10px] px-2 py-0.5 font-mono ${
                slot.status === "Live Now"
                  ? "bg-emerald-600 text-white animate-pulse"
                  : slot.status === "Completed"
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  : "bg-blue-500/10 text-blue-600 border-blue-500/20"
              }`}
            >
              {slot.status}
            </Badge>
          </div>

          <DialogTitle className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
            {slot.subjectName}
          </DialogTitle>

          <DialogDescription className="text-xs text-slate-500 font-mono flex items-center gap-3 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-purple-600 shrink-0" /> {slot.startTime} – {slot.endTime} ({slot.duration})
            </span>
            <span className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" /> {slot.credits} Academic Credits
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* CONTENT BODY */}
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
          {/* FACULTY & ROOM INFO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            {/* FACULTY */}
            <div className="flex items-center gap-2.5">
              <img
                src={slot.facultyAvatar}
                alt={slot.facultyName}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-mono block">Faculty Instructor</span>
                <h5 className="font-bold text-slate-900 dark:text-white truncate">{slot.facultyName}</h5>
                <p className="text-[10px] text-slate-500 truncate">{slot.facultyEmail}</p>
              </div>
            </div>

            {/* LOCATION / ROOM */}
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 shrink-0">
                <Building className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-mono block">Classroom Venue</span>
                <h5 className="font-bold text-slate-900 dark:text-white truncate">
                  Room {slot.roomNumber} ({slot.building})
                </h5>
                <p className="text-[10px] text-slate-500 truncate">{slot.floor} • {slot.department}</p>
              </div>
            </div>
          </div>

          {/* PROGRESS BARS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* SYLLABUS COVERAGE */}
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-500 font-medium">Syllabus Coverage</span>
                <strong className="text-purple-600">{slot.syllabusCoverage}%</strong>
              </div>
              <Progress value={slot.syllabusCoverage} className="h-2 bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* ATTENDANCE STATUS */}
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-500 font-medium">Attendance Status</span>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold bg-emerald-50 text-emerald-600 border-emerald-300">
                  {slot.attendanceStatus}
                </Badge>
              </div>
              <Progress value={slot.attendanceStatus === "Present" ? 100 : 85} className="h-2 bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>

          {/* UPCOMING TOPICS */}
          <div className="space-y-1.5">
            <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <BookOpen className="h-3.5 w-3.5 text-purple-600" /> Upcoming Topics & Modules
            </h5>
            <ul className="space-y-1 pl-4 text-[11px] text-slate-600 dark:text-slate-400 list-disc font-medium">
              {slot.upcomingTopics.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
          </div>

          {/* ASSIGNMENTS & MATERIAL */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-600" /> Assigned Tasks:
              </span>
              <span className="font-mono text-[11px] text-blue-600 font-semibold">{slot.assignments[0] || "None pending"}</span>
            </div>

            {slot.isOnline && slot.onlineJoinUrl && (
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between">
                <span className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300 font-bold flex items-center gap-1">
                  <Video className="h-4 w-4 text-indigo-600 animate-pulse" /> EduSuite Live Room Ready
                </span>
                <a href={slot.onlineJoinUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" className="h-7 text-[11px] rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1">
                    Join Session <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER BUTTONS */}
        <DialogFooter className="gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            onClick={() => {
              if (onViewFaculty) onViewFaculty(slot.facultyEmail);
              else toast.info(`Viewing details for ${slot.facultyName}`);
              onClose();
            }}
            variant="outline"
            className="rounded-xl text-xs gap-1 border-slate-200 dark:border-slate-700"
          >
            <User className="h-3.5 w-3.5 text-slate-600" /> View Faculty
          </Button>

          <Button
            onClick={() => {
              if (onNavigateToAttendance) onNavigateToAttendance();
              else toast.info("Redirecting to Attendance Module...");
              onClose();
            }}
            variant="outline"
            className="rounded-xl text-xs gap-1 border-slate-200 dark:border-slate-700"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Open Attendance
          </Button>

          <Button
            onClick={() => {
              if (onNavigateToLms) onNavigateToLms();
              else toast.info("Opening LMS Course Hub...");
              onClose();
            }}
            className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1 font-semibold"
          >
            Open LMS <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
