import React, { useState } from "react";
import { StudentProfileData } from "../types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Save, CheckCircle2, User, Phone, Mail, MapPin, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface EditProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfileData;
  onSave: (updated: StudentProfileData) => void;
}

export function EditProfileDrawer({ open, onOpenChange, student, onSave }: EditProfileDrawerProps) {
  const [formData, setFormData] = useState<StudentProfileData>(student);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      onOpenChange(false);
      toast.success("Student profile updated successfully in ERP database!");
    }, 800);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-6">
        <SheetHeader className="text-left space-y-1 pb-4 border-b border-slate-200 dark:border-slate-800">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" /> Edit Student ERP Record
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-500">
            Update personal, contact, and emergency records for Admission Number (Adm No): <strong className="text-slate-700 dark:text-slate-300 font-mono">{student.rollNumber}</strong>
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="py-4 space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <TabsTrigger value="personal" className="text-xs rounded-lg">Personal</TabsTrigger>
              <TabsTrigger value="parent" className="text-xs rounded-lg">Parent / Contact</TabsTrigger>
              <TabsTrigger value="address" className="text-xs rounded-lg">Address</TabsTrigger>
            </TabsList>

            {/* PERSONAL TAB */}
            <TabsContent value="personal" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gender</Label>
                  <Input
                    value={formData.personal.gender}
                    onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, gender: e.target.value } })}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number</Label>
                  <Input
                    value={formData.personal.phone}
                    onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, phone: e.target.value } })}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
                  <Input
                    value={formData.personal.email}
                    onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, email: e.target.value } })}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Blood Group</Label>
                  <Input
                    value={formData.personal.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, bloodGroup: e.target.value } })}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Emergency Phone</Label>
                  <Input
                    value={formData.personal.emergencyContact.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal: {
                        ...formData.personal,
                        emergencyContact: { ...formData.personal.emergencyContact, phone: e.target.value }
                      }
                    })}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
            </TabsContent>

            {/* PARENT TAB */}
            <TabsContent value="parent" className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Father's Name</Label>
                <Input
                  value={formData.parent.father.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    parent: { ...formData.parent, father: { ...formData.parent.father, name: e.target.value } }
                  })}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Father's Occupation</Label>
                  <Input
                    value={formData.parent.father.occupation}
                    onChange={(e) => setFormData({
                      ...formData,
                      parent: { ...formData.parent, father: { ...formData.parent.father, occupation: e.target.value } }
                    })}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Father's Phone</Label>
                  <Input
                    value={formData.parent.father.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      parent: { ...formData.parent, father: { ...formData.parent.father, phone: e.target.value } }
                    })}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mother's Name</Label>
                <Input
                  value={formData.parent.mother.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    parent: { ...formData.parent, mother: { ...formData.parent.mother, name: e.target.value } }
                  })}
                  className="rounded-xl text-xs"
                />
              </div>
            </TabsContent>

            {/* ADDRESS TAB */}
            <TabsContent value="address" className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Permanent Street Address</Label>
                <Input
                  value={formData.address.permanent.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      permanent: { ...formData.address.permanent, street: e.target.value }
                    }
                  })}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">City</Label>
                  <Input
                    value={formData.address.permanent.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        permanent: { ...formData.address.permanent, city: e.target.value }
                      }
                    })}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">State</Label>
                  <Input
                    value={formData.address.permanent.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        permanent: { ...formData.address.permanent, state: e.target.value }
                      }
                    })}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pincode</Label>
                  <Input
                    value={formData.address.permanent.pincode}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        permanent: { ...formData.address.permanent, pincode: e.target.value }
                      }
                    })}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>Note: Academic fields (Admission Number, Department, CGPA) are locked and require Admin authorization to alter.</span>
          </div>

          <SheetFooter className="pt-4 border-t border-slate-200 dark:border-slate-800 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm shadow-blue-500/20"
            >
              {isSubmitting ? (
                <>Updating ERP...</>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
