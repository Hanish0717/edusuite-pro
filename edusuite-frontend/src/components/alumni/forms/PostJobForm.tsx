import React, { useState } from "react";
import { toast } from "sonner";
import { AlumniJobItem } from "@/types/alumni";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PostJobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddJob: (job: AlumniJobItem) => void;
}

export const PostJobForm: React.FC<PostJobFormProps> = ({ open, onOpenChange, onAddJob }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "Google Cloud India",
    location: "Bengaluru, KA",
    ctcRange: "₹30 - ₹40 LPA",
    expRequired: "2 - 5 Years",
    jobType: "Hybrid" as const,
    skillsStr: "Go, Kubernetes, Cloud",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) {
      toast.error("Please provide Job Title and Company");
      return;
    }

    const newJob: AlumniJobItem = {
      id: `JOB-ALM-${Math.floor(10 + Math.random() * 90)}`,
      title: formData.title,
      company: formData.company,
      location: formData.location,
      jobType: formData.jobType,
      ctcRange: formData.ctcRange,
      expRequired: formData.expRequired,
      postedBy: "Alumni Ambassador",
      postedByBatch: "Batch of 2020",
      skills: formData.skillsStr.split(",").map((s) => s.trim()),
      postedDate: new Date().toISOString().split("T")[0] || "",
      department: "Computer Science (CSE)",
      applicationsCount: 0,
      description: formData.description || "Direct referral opening shared by alumni mentor.",
    };

    onAddJob(newJob);
    toast.success(`Published job referral opening for ${newJob.title}!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-base">Share Job Referral Opening</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <div>
              <label className="font-bold text-muted-foreground block mb-1">Job Title</label>
              <Input
                placeholder="E.g., Senior Systems Architect"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-9 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-muted-foreground block mb-1">Company</label>
                <Input
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="h-9 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-muted-foreground block mb-1">Job Type</label>
                <select
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value as any })}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 font-mono text-xs"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-muted-foreground block mb-1">CTC Range</label>
                <Input
                  placeholder="E.g., ₹25 - ₹35 LPA"
                  value={formData.ctcRange}
                  onChange={(e) => setFormData({ ...formData, ctcRange: e.target.value })}
                  className="h-9 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-muted-foreground block mb-1">Experience Required</label>
                <Input
                  placeholder="E.g., 2 - 4 Years"
                  value={formData.expRequired}
                  onChange={(e) => setFormData({ ...formData, expRequired: e.target.value })}
                  className="h-9 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-muted-foreground block mb-1">Required Skills (Comma-separated)</label>
              <Input
                placeholder="React, Python, AWS"
                value={formData.skillsStr}
                onChange={(e) => setFormData({ ...formData, skillsStr: e.target.value })}
                className="h-9 font-mono"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
              Publish Referral
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
