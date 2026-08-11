import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface AddAchievementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (achievement: any) => void;
}

export function AddAchievementModal({ open, onOpenChange, onAdd }: AddAchievementModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<any>("Hackathons");
  const [issuedBy, setIssuedBy] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onAdd({
        id: `ACH-${Math.floor(100 + Math.random() * 900)}`,
        title: title || "New Student Achievement",
        category,
        issuedBy: issuedBy || "External Organization",
        date: date || "Feb 2025",
        description: description || "Verified technical achievement.",
        badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      });
      setIsSubmitting(false);
      onOpenChange(false);
      toast.success("New achievement added to student portfolio!");
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" /> Add Achievement / Certification
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Log awards, hackathons, research publications, or certifications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Title of Achievement</Label>
            <Input
              placeholder="e.g. 1st Place - Smart India Hackathon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hackathons">Hackathons</SelectItem>
                  <SelectItem value="Certifications">Certifications</SelectItem>
                  <SelectItem value="Awards">Awards</SelectItem>
                  <SelectItem value="Research Papers">Research Papers</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Placement Offers">Placement Offers</SelectItem>
                  <SelectItem value="Internships">Internships</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Issued Date</Label>
              <Input
                placeholder="e.g. Jan 2025"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Issuing Organization / Authority</Label>
            <Input
              placeholder="e.g. Microsoft / IEEE / AICTE"
              value={issuedBy}
              onChange={(e) => setIssuedBy(e.target.value)}
              className="rounded-xl text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Description / Highlights</Label>
            <Textarea
              placeholder="Brief description of the accomplishment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl text-xs min-h-[70px]"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs gap-1.5">
              {isSubmitting ? "Adding..." : <><Plus className="h-3.5 w-3.5" /> Save Achievement</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
