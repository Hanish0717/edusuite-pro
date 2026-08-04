import React, { useState } from "react";
import { toast } from "sonner";
import { Heart, ShieldCheck, Download, Award, Users, DollarSign, GraduationCap } from "lucide-react";
import { DonationCampaignItem, TopContributorItem } from "@/types/alumni";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { DonationCard } from "@/components/alumni/cards/DonationCard";
import { StatCard } from "@/components/alumni/cards/StatCard";
import { LeaderboardWidget } from "@/components/alumni/widgets/LeaderboardWidget";
import { DonationTrendLineChart } from "@/components/alumni/charts/AlumniCharts";
import { DonationForm } from "@/components/alumni/forms/DonationForm";
import { Button } from "@/components/ui/button";

interface AlumniDonationsViewProps {
  campaignsList: DonationCampaignItem[];
  contributorsList: TopContributorItem[];
  onOpenMessagingCenter?: (() => void) | undefined;
}

export const AlumniDonationsView: React.FC<AlumniDonationsViewProps> = ({
  campaignsList,
  contributorsList,
  onOpenMessagingCenter,
}) => {
  // DYNAMIC STATE FOR CAMPAIGNS, TOTAL ENDOWMENT, AND CONTRIBUTORS
  const [campaigns, setCampaigns] = useState<DonationCampaignItem[]>(campaignsList);
  const [totalEndowmentAmount, setTotalEndowmentAmount] = useState<number>(42000000); // ₹4.20 Crore initial
  const [totalDonorsCount, setTotalDonorsCount] = useState<number>(316);
  const [contributors, setContributors] = useState<TopContributorItem[]>(contributorsList);

  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaignItem | null>(
    campaigns[0] || null
  );
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const handleDonationSuccess = (amount: number) => {
    const targetCampaignId = selectedCampaign?.id || campaigns[0]?.id;

    // 1. DYNAMICALLY INCREASE CAMPAIGN RAISED AMOUNT & DONOR COUNT
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === targetCampaignId) {
          const newRaised = c.raisedAmount + amount;
          return {
            ...c,
            raisedAmount: newRaised,
            donorsCount: c.donorsCount + 1,
          };
        }
        return c;
      })
    );

    // 2. DYNAMICALLY INCREASE OVERALL ENDOWMENT FUND & DONOR COUNT
    setTotalEndowmentAmount((prev) => prev + amount);
    setTotalDonorsCount((prev) => prev + 1);

    // 3. DYNAMICALLY UPDATE HONOR ROLL LEADERBOARD
    setContributors((prev) => {
      const donorName = "Sarah Jenkins (You)";
      const existing = prev.find((x) => x.name.includes("Sarah Jenkins"));

      if (existing) {
        return prev.map((x) =>
          x.name.includes("Sarah Jenkins")
            ? { ...x, totalDonated: x.totalDonated + amount }
            : x
        );
      } else {
        const newRecord: TopContributorItem = {
          id: `CONTR-${Date.now()}`,
          name: donorName,
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
          batch: "Batch of 2020",
          company: "Google Cloud",
          totalDonated: amount,
          tier: "Silver Ambassador",
          campaignName: selectedCampaign?.title || "Scholarship Fund",
        };
        return [newRecord, ...prev];
      }
    });

    toast.success(`Donation of ₹${amount.toLocaleString()} processed successfully!`, {
      description: `Fund raised amount updated to ₹${((selectedCampaign?.raisedAmount || 0) + amount) / 100000} Lakh. Section 80G PDF receipt sent to email.`,
    });
  };

  const handleDownloadReceipt = () => {
    toast.success("Downloading Section 80G Tax Exemption Receipt (PDF)...", {
      description: "Issued under Section 80G of the Indian Income Tax Act.",
    });
  };

  const handleOpenDonateModal = (campaign?: DonationCampaignItem) => {
    if (campaign) {
      setSelectedCampaign(campaign);
    } else if (campaigns.length > 0) {
      setSelectedCampaign(campaigns[0]!);
    }
    setIsDonateModalOpen(true);
  };

  const formattedCrore = (totalEndowmentAmount / 10000000).toFixed(2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Endowment & Giving Portal"
        subtitle="Support campus development, merit scholarships for deserving undergrads, and next-gen AI research infrastructure."
        badgeText="100% Tax Exempted (Section 80G)"
        icon={Heart}
        onOpenMessagingCenter={onOpenMessagingCenter}
        actions={
          <>
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer backdrop-blur-md border border-white/20 gap-1.5"
            >
              <Download className="size-3.5" /> Tax Receipts (Sec 80G)
            </Button>
            <Button
              onClick={() => handleOpenDonateModal()}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
            >
              <Heart className="size-3.5 fill-white" /> Make Contribution
            </Button>
          </>
        }
      />

      {/* DYNAMICALLY UPDATING BLUE KPI CARDS */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Endowment Fund" value={`₹${formattedCrore} Crore`} change="+18% YoY Alumni Growth" icon={DollarSign} />
        <StatCard title="Scholarships Sponsored" value="120 Students" change="100% Tuition & Stipend" icon={GraduationCap} />
        <StatCard title="Total Donors" value={`${totalDonorsCount} Alumni`} change="Across 14 Global Chapters" icon={Users} />
        <StatCard title="Tax Exemption" value="100% Sec 80G" change="Instant PDF Receipt" icon={ShieldCheck} />
      </div>

      {/* ACTIVE CAMPAIGNS & LEADERBOARD */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-base text-foreground font-sans flex items-center gap-2">
            <Heart className="size-5 text-[#2563EB] fill-[#2563EB]" /> Active Endowment Campaigns
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {campaigns.map((campaign) => (
              <DonationCard
                key={campaign.id}
                campaign={campaign}
                onDonate={(c) => handleOpenDonateModal(c)}
              />
            ))}
          </div>
        </div>

        {/* TOP CONTRIBUTORS LEADERBOARD */}
        <div className="space-y-4">
          <LeaderboardWidget contributors={contributors} />
        </div>
      </div>

      {/* DONATION TREND CHART */}
      <div className="pt-2">
        <DonationTrendLineChart />
      </div>

      {/* DONATION FORM MODAL */}
      <DonationForm
        campaign={selectedCampaign}
        open={isDonateModalOpen}
        onOpenChange={setIsDonateModalOpen}
        onDonationSuccess={handleDonationSuccess}
      />
    </div>
  );
};
