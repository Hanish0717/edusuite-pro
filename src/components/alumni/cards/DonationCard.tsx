import React from "react";
import { Heart, Users, Clock, ShieldCheck } from "lucide-react";
import { DonationCampaignItem } from "@/types/alumni";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DonationCardProps {
  campaign: DonationCampaignItem;
  onDonate: (campaign: DonationCampaignItem) => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({ campaign, onDonate }) => {
  const percent = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDonate(campaign);
  };

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col justify-between border border-[#24356B]/30">
      <div className="relative h-36 w-full overflow-hidden">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="size-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B44] via-transparent to-transparent" />
        <Badge className="absolute top-3 left-3 bg-[#2563EB] text-white font-bold font-mono text-[0.65rem]">
          {campaign.category}
        </Badge>
        <Badge className="absolute top-3 right-3 bg-[#1A285D] text-white font-mono text-[0.65rem] flex items-center gap-1 border border-[#24356B]">
          <ShieldCheck className="size-3 text-[#4D78FF]" /> Sec 80G Tax Exempt
        </Badge>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-extrabold text-base text-foreground leading-snug">{campaign.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{campaign.description}</p>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-1 font-mono text-xs">
            <div className="flex items-center justify-between text-[0.72rem]">
              <span className="text-muted-foreground">Raised: <strong className="text-[#2563EB] dark:text-[#4D78FF] font-bold">₹{(campaign.raisedAmount / 100000).toFixed(2)} Lakh</strong></span>
              <span className="font-extrabold text-primary">{percent}%</span>
            </div>
            <div className="h-2 w-full bg-[#1A285D]/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2563EB] to-[#4D78FF] rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground pt-0.5">
              <span className="flex items-center gap-1"><Users className="size-3 text-[#4D78FF]" /> {campaign.donorsCount} Alumni Donors</span>
              <span className="flex items-center gap-1"><Clock className="size-3 text-[#2563EB]" /> {campaign.daysLeft} Days Left</span>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleButtonClick}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 rounded-xl cursor-pointer gap-1.5 shadow-2xs mt-2"
        >
          <Heart className="size-4 fill-white text-white" /> Contribute to Fund
        </Button>
      </div>
    </GlassCard>
  );
};
