import { useState } from "react";
import { Edit2, Key, Download, CheckCircle, Mail, Phone, MapPin, Calendar, Briefcase, FileCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "./edit-profile-modal";
import { ChangePasswordModal } from "./change-password-modal";
import type { FacultyProfileData } from "@/data/faculty-mock-data";

interface ProfileHeaderProps {
  profileData: FacultyProfileData;
  onSaveProfile: (updatedData: Partial<FacultyProfileData>) => void;
}

export function ProfileHeader({ profileData, onSaveProfile }: ProfileHeaderProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter((n) => n.includes(".") === false) // exclude title like Dr.
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "FC";
  };

  const handleDownloadPDF = () => {
    toast.success("Generating profile PDF...", {
      description: "Document structure compiled. Downloading shortly.",
    });
    
    // Simulate compilation delay
    setTimeout(() => {
      window.print();
    }, 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card">
      <div className="absolute right-0 top-0 h-24 w-24 bg-primary/5 blur-2xl" />
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Profile Card Main Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar Area */}
          <div className="relative shrink-0 group">
            {profileData.profilePhoto ? (
              <img
                src={profileData.profilePhoto}
                alt={profileData.name}
                className="size-24 rounded-2xl object-cover border-2 border-primary/20 shadow-sm"
              />
            ) : (
              <div className="size-24 rounded-2xl bg-gradient-to-tr from-primary/10 to-indigo-500/10 text-primary font-bold font-display text-3xl border border-primary/20 shadow-sm grid place-items-center">
                {getInitials(profileData.name)}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-card shadow-sm">
              <CheckCircle className="size-3" />
            </span>
          </div>

          {/* Texts Info */}
          <div className="text-center sm:text-left space-y-2.5">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="font-display text-2xl font-black tracking-tight">{profileData.name}</h2>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-0.5 px-2 rounded-xl text-[0.65rem] font-bold">
                  {profileData.status}
                </Badge>
              </div>
              <p className="text-sm font-semibold text-primary mt-0.5">{profileData.designation}</p>
              <p className="text-xs text-muted-foreground font-medium">{profileData.department}</p>
            </div>

            {/* Quick Contact & Join info */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Briefcase className="size-3.5" /> ID: {profileData.employeeId}</span>
              <span className="flex items-center gap-1"><FileCheck className="size-3.5" /> {profileData.employmentType}</span>
              <span className="flex items-center gap-1"><Calendar className="size-3.5" /> Joined {profileData.joiningDate}</span>
            </div>
          </div>
        </div>

        {/* Action Button Group */}
        <div className="flex flex-row md:flex-col flex-wrap gap-2.5 shrink-0 justify-center w-full md:w-auto">
          <Button
            onClick={() => setIsEditOpen(true)}
            variant="outline"
            className="flex-1 md:flex-none justify-center rounded-xl cursor-pointer hover:bg-muted text-xs h-9"
          >
            <Edit2 className="size-3.5 mr-2" /> Edit Profile
          </Button>
          <Button
            onClick={() => setIsPasswordOpen(true)}
            variant="outline"
            className="flex-1 md:flex-none justify-center rounded-xl cursor-pointer hover:bg-muted text-xs h-9"
          >
            <Key className="size-3.5 mr-2" /> Change Password
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 md:flex-none justify-center rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-9"
          >
            <Download className="size-3.5 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      {/* MODALS */}
      <EditProfileModal
        profileData={profileData}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={onSaveProfile}
      />
      <ChangePasswordModal
        open={isPasswordOpen}
        onOpenChange={setIsPasswordOpen}
      />
    </div>
  );
}
