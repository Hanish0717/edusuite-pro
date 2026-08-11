import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FacultyProfileData } from "@/data/faculty-mock-data";

interface EditProfileModalProps {
  profileData: FacultyProfileData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedData: Partial<FacultyProfileData>) => void;
}

export function EditProfileModal({
  profileData,
  open,
  onOpenChange,
  onSave,
}: EditProfileModalProps) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileData) {
      setPhone(profileData.personalInfo.phone);
      setEmail(profileData.personalInfo.email);
      setAddress(profileData.personalInfo.address);
      setEmergencyContact(profileData.personalInfo.emergencyContact);
    }
  }, [profileData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !email || !address || !emergencyContact) {
      toast.error("Please fill in all contact details.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSave({
        personalInfo: {
          ...profileData.personalInfo,
          phone,
          email,
          address,
          emergencyContact,
        },
      });
      toast.success("Profile contact details updated successfully!");
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="size-5 text-primary" /> Edit Contact Details
          </DialogTitle>
          <DialogDescription>
            Modify your personal contact details. These changes are for your profile card representation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs">Mobile Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Work Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@college.edu"
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emergency" className="text-xs">Emergency Contact Details</Label>
            <Input
              id="emergency"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Name (Relationship) - +91 XXXXX XXXXX"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-xs">Home Address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your residential address"
              rows={3}
              className="rounded-xl"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl cursor-pointer text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
