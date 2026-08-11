import React, { useState } from "react";
import { toast } from "sonner";
import { Heart, ShieldCheck, Download } from "lucide-react";
import { DonationCampaignItem } from "@/types/alumni";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DonationFormProps {
  campaign: DonationCampaignItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDonationSuccess: (amount: number) => void;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  campaign,
  open,
  onOpenChange,
  onDonationSuccess,
}) => {
  const [amount, setAmount] = useState("50000");
  const [panNumber, setPanNumber] = useState("ABCDE1234F");

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmt = parseFloat(amount);
    if (isNaN(numericAmt) || numericAmt <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    onDonationSuccess(numericAmt);
    toast.success(
      `Thank you! Endowment contribution of ₹${numericAmt.toLocaleString()} received. Section 80G tax receipt generated!`,
      { duration: 5000 }
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <form onSubmit={handleDonateSubmit} className="space-y-4 text-xs font-sans">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-base flex items-center gap-2">
              <Heart className="size-5 text-[#2563EB] fill-[#2563EB]" /> Endowment Contribution
            </DialogTitle>
            <p className="text-xs text-[#2563EB] font-mono font-bold pt-1">
              {campaign ? campaign.title : "Alumni Merit & Need-Based Student Scholarship Fund"}
            </p>
          </DialogHeader>

          <div className="space-y-3 font-mono">
            <div>
              <label className="font-bold text-foreground font-sans block text-[0.72rem] mb-1">
                Contribution Amount (₹ INR):
              </label>
              <div className="flex gap-2 mb-2">
                {["10000", "25000", "50000", "100000"].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`flex-1 p-2 rounded-xl border text-xs font-bold transition-all ${
                      amount === preset
                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                        : "bg-background border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    ₹{parseInt(preset) / 1000}k
                  </button>
                ))}
              </div>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10 text-sm font-extrabold font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-foreground font-sans block text-[0.72rem] mb-1 flex items-center justify-between">
                <span>PAN Card Number (For Sec 80G Tax Exemption):</span>
                <span className="text-[0.65rem] text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="size-3" /> 100% Tax Exempt
                </span>
              </label>
              <Input
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                className="h-9 font-mono uppercase"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl gap-1.5">
              <Heart className="size-4 fill-white text-white" /> Process Contribution
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
