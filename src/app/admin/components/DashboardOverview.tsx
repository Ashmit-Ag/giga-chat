'use client';

import { useEffect, useState } from "react";
import { Gift, Users, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "./StatCard";
import type { AdminAnalytics } from "@/types";
import TopGiftersList from "./TopGifters";
import TopGiftersCard from "./TopMods";
import PlansOverviewCard from "./PlansOverviewCard";

export default function DashboardOverview({ onEditPlans }: { onEditPlans: () => void }) {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white/40">Loading analytics...</div>;
  if (!data) return <div className="text-red-400">Failed to load analytics</div>;

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${data.totalRevenue}`}
          subtitle="Lifetime"
          icon={<Gift className="text-indigo-400" />}
        />

        <StatCard
          title="Total Users"
          value={data.totalUsers}
          subtitle={`${data.premiumUsers} Premium · ${data.basicUsers} Basic`}
          icon={<Users className="text-indigo-400" />}
        />

        <StatCard
          title="Monthly MRR"
          value={`₹${data.totalMRR}`}
          subtitle="Subscriptions"
          icon={<IndianRupee className="text-indigo-400" />}
        />
      </div>

      <Button
        onClick={onEditPlans}
        className="bg-indigo-600 hover:bg-indigo-500 w-full"
      >
        Manage Subscription Plans
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <TopGiftersList/>
        <TopGiftersCard/>
        <PlansOverviewCard/>
      </div>
    </div>
  );
}
