import React, { useState } from "react";
import { toast } from "sonner";
import { AlumniProfileItem } from "@/types/alumni";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegisterAlumniFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAlumni: (alumnus: AlumniProfileItem) => void;
}

export const RegisterAlumniForm: React.FC<RegisterAlumniFormProps> = ({
  open,
  onOpenChange,
  onAddAlumni,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    batch: "Batch of 2023",
    dept: "Computer Science (CSE)",
    company: "",
    designation: "",
    location: "Bengaluru, KA",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company) {
      toast.error("Please fill in Name and Company");
      return;
    }

    const newRecord: AlumniProfileItem = {
      id: `ALM-2023-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      batch: formData.batch,
      dept: formData.dept,
      company: formData.company,
      designation: formData.designation || "Senior Software Engineer",
      location: formData.location,
      country: "India",
      experienceYears: 3,
      skills: ["System Design", "Cloud Infrastructure"],
      mentoringStatus: "Active Mentor",
      employmentStatus: "Employed",
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, ".")}@alumni.edu`,
      phone: "+91 98000 00000",
      bio: "Experienced enterprise professional enthusiastic about mentoring university graduates.",
      achievements: ["Verified Alumni Supporter"],
      educationTimeline: [
        { degree: "B.Tech", institution: "EduSuite Pro University", year: "2019 – 2023" },
      ],
      workExperience: [
        { role: formData.designation || "Software Engineer", company: formData.company, duration: "2023 – Present" },
      ],
      referralsSharedCount: 1,
      contributionsTotal: "₹50,000",
      connectionsCount: 120,
    };

    onAddAlumni(newRecord);
    toast.success(`Successfully registered alumni profile for ${newRecord.name}!`);
    onOpenChange(false);
    setFormData({
      name: "",
      batch: "Batch of 2023",
      dept: "Computer Science (CSE)",
      company: "",
      designation: "",
      location: "Bengaluru, KA",
      email: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-base">Register New Alumni Record</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <div>
              <label className="font-bold text-muted-foreground block mb-1">Full Name</label>
              <Input
                placeholder="E.g., Priya Sundaram"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-muted-foreground block mb-1">Graduation Batch</label>
                <select
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 font-mono text-xs"
                >
                  <option value="Batch of 2023">Batch of 2023</option>
                  <option value="Batch of 2022">Batch of 2022</option>
                  <option value="Batch of 2021">Batch of 2021</option>
                  <option value="Batch of 2020">Batch of 2020</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-muted-foreground block mb-1">Department</label>
                <select
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 font-mono text-xs"
                >
                  <option value="Computer Science (CSE)">CSE</option>
                  <option value="Electronics & Comm (ECE)">ECE</option>
                  <option value="Mechanical (ME)">ME</option>
                  <option value="Information Tech (IT)">IT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-muted-foreground block mb-1">Company & Designation</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="h-9 font-mono"
                />
                <Input
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="h-9 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-muted-foreground block mb-1">Location & Email</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-9 font-mono"
                />
                <Input
                  placeholder="Alumni Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-9 font-mono"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl">
              Save Alumni Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
