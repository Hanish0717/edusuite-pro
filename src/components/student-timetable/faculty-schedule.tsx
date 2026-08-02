import React, { useState } from "react";
import { FacultyMember } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Clock, Calendar, ExternalLink, X, BookOpen, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface FacultyScheduleProps {
  facultyList: FacultyMember[];
  onViewFacultyDetails?: (email: string) => void;
}

export function FacultySchedule({ facultyList, onViewFacultyDetails }: FacultyScheduleProps) {
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  const handleEmailFaculty = (email: string, name: string) => {
    window.location.href = `mailto:${email}?subject=Student%20Query%20-%20EduSuite%20ERP`;
    toast.success(`Opening email client to contact ${name} (${email})`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <User className="h-4 w-4 text-purple-600" /> Faculty Office Hours & Consultation Directory ({facultyList.length})
        </h3>
        <span className="text-xs font-mono text-slate-500">Department of Computer Science & Engg</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facultyList.map((fac) => (
          <div
            key={fac.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-4 group overflow-hidden"
          >
            {/* TOP INFO */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={fac.avatar}
                  alt={fac.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-mono font-bold text-purple-600 border-purple-200">
                      {fac.designation}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors pt-0.5 leading-snug truncate">
                    {fac.name}
                  </h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">{fac.subject}</p>
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-rose-500 shrink-0" /> Cabin:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{fac.cabin}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500 shrink-0" /> Consultation:
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px] truncate">{fac.consultationHours}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-500 shrink-0" /> Office Hours:
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 text-[11px] truncate">{fac.officeHours}</span>
                </div>
              </div>

              {/* CONTACT ROW */}
              <div className="flex flex-col gap-1 text-[11px] text-slate-500 font-mono pt-1">
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {fac.email}
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {fac.phone}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full min-w-0 overflow-hidden">
              <Button
                onClick={() => setSelectedFaculty(fac)}
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1 w-full min-w-0 overflow-hidden font-semibold cursor-pointer"
              >
                <User className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span className="truncate">View Faculty</span>
              </Button>

              <Button
                onClick={() => handleEmailFaculty(fac.email, fac.name)}
                size="sm"
                className="h-8 text-xs rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1 w-full min-w-0 overflow-hidden cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Email Faculty</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* FACULTY PROFILE MODAL */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedFaculty.avatar}
                  alt={selectedFaculty.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
                />
                <div>
                  <Badge variant="outline" className="text-[10px] font-bold text-purple-600 border-purple-300">
                    {selectedFaculty.designation}
                  </Badge>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedFaculty.name}
                  </h3>
                  <p className="text-xs text-purple-600 font-medium">{selectedFaculty.subject}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFaculty(null)}
                className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-bold text-slate-900 dark:text-white">Computer Science & Engg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cabin Location:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedFaculty.cabin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consultation:</span>
                <span className="font-bold text-amber-600">{selectedFaculty.consultationHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Office Hours:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{selectedFaculty.officeHours}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">Contact Information</span>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-600 shrink-0" />
                  <a href={`mailto:${selectedFaculty.email}`} className="hover:underline text-purple-600 font-bold truncate">
                    {selectedFaculty.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>{selectedFaculty.phone}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                handleEmailFaculty(selectedFaculty.email, selectedFaculty.name);
                setSelectedFaculty(null);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl"
            >
              <Mail className="h-4 w-4 mr-1.5" /> Send Direct Email
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
