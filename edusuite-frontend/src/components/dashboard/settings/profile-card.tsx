import { useState } from "react";
import { User, Mail, Phone, Building2, Award, IdCard, Clock, MapPin, Edit3, Camera } from "lucide-react";
import type { FacultyProfileSettings } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ProfileCardProps {
  profile: FacultyProfileSettings;
  onUpdateProfile: (updated: Partial<FacultyProfileSettings>) => void;
}

export function ProfileCard({ profile, onUpdateProfile }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FacultyProfileSettings>(profile);

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
    toast.success("Profile information updated successfully.");
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-primary">
            <User className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground">Profile Settings</h3>
            <p className="text-xs text-muted-foreground">Manage your personal details, academic credentials, and office contact information.</p>
          </div>
        </div>

        <Button
          size="sm"
          variant={isEditing ? "default" : "outline"}
          className="h-8 gap-1.5 text-xs font-bold"
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
        >
          <Edit3 className="size-3.5" />
          {isEditing ? "Save Profile" : "Edit Profile"}
        </Button>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Photo Avatar */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/20 border border-border/40 text-center space-y-3">
          <div className="relative group">
            <img
              src={formData.photoUrl}
              alt={formData.name}
              className="size-24 rounded-full object-cover border-4 border-background shadow-md"
            />
            {isEditing && (
              <button className="absolute inset-0 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="size-6" />
              </button>
            )}
          </div>
          <div>
            <h4 className="font-extrabold text-base text-foreground">{formData.name}</h4>
            <p className="text-xs font-semibold text-primary mt-0.5">{formData.designation}</p>
            <p className="text-[11px] text-muted-foreground font-mono mt-1">{formData.employeeId}</p>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <User className="size-3.5 text-muted-foreground/75" /> Faculty Name
            </label>
            {isEditing ? (
              <Input
                className="h-8 text-xs font-semibold bg-muted/20 border-border/40"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <p className="text-sm font-extrabold text-foreground">{formData.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <IdCard className="size-3.5 text-muted-foreground/75" /> Employee ID
            </label>
            <p className="text-sm font-semibold font-mono text-foreground">{formData.employeeId}</p>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Building2 className="size-3.5 text-muted-foreground/75" /> Department
            </label>
            <p className="text-sm font-bold text-foreground">{formData.department}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Award className="size-3.5 text-muted-foreground/75" /> Designation
            </label>
            {isEditing ? (
              <Input
                className="h-8 text-xs font-semibold bg-muted/20 border-border/40"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            ) : (
              <p className="text-sm font-semibold text-foreground">{formData.designation}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Mail className="size-3.5 text-muted-foreground/75" /> Email Address
            </label>
            {isEditing ? (
              <Input
                className="h-8 text-xs font-semibold bg-muted/20 border-border/40"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            ) : (
              <p className="text-sm font-semibold text-foreground truncate">{formData.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Phone className="size-3.5 text-muted-foreground/75" /> Phone Number
            </label>
            {isEditing ? (
              <Input
                className="h-8 text-xs font-semibold bg-muted/20 border-border/40"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            ) : (
              <p className="text-sm font-semibold text-foreground">{formData.phone}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="size-3.5 text-muted-foreground/75" /> Cabin / Office Room
            </label>
            {isEditing ? (
              <Input
                className="h-8 text-xs font-semibold bg-muted/20 border-border/40"
                value={formData.cabinNumber}
                onChange={(e) => setFormData({ ...formData, cabinNumber: e.target.value })}
              />
            ) : (
              <p className="text-sm font-semibold text-foreground">{formData.cabinNumber}</p>
            )}
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="size-3.5 text-muted-foreground/75" /> Office Hours / Counseling
            </label>
            {isEditing ? (
              <Input
                className="h-8 text-xs font-semibold bg-muted/20 border-border/40"
                value={formData.officeHours}
                onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
              />
            ) : (
              <p className="text-sm font-semibold text-foreground">{formData.officeHours}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
