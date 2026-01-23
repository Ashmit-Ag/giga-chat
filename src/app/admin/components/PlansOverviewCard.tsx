"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// import PlanEditModal from "./PlanEditModal";

export default function PlansOverviewCard() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  const fetchPlans = async () => {
    const res = await fetch("/api/admin/plans");
    const data = await res.json();
    setPlans(data);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <>
      <Card className="bg-[#0f1424] border-white/10 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm uppercase text-white/70">
            Subscription Plans
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className="w-full flex justify-between items-center p-3 rounded-md bg-white/5 hover:bg-white/10 transition"
            >
              <span className="font-medium">{plan.name}</span>
              <span className="text-indigo-400 font-semibold">
                ₹{plan.price}
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      {selectedPlan && (
        <PlanEditModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSaved={fetchPlans}
        />
      )}
    </>
  );
}



function PlanEditModal({
  plan,
  onClose,
  onSaved,
}: {
  plan: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [localPlan, setLocalPlan] = useState(plan);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: any) => {
    setLocalPlan({ ...localPlan, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/plans", {
      method: "PATCH",
      body: JSON.stringify(localPlan),
    });
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="w-full max-w-xl bg-[#0f1424] border border-white/10 rounded-xl p-6 text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Edit {localPlan.name}
          </h3>
          <button onClick={onClose}>
            <X className="text-white/50 hover:text-white" />
          </button>
        </div>

        {/* Pricing */}
        <section className="space-y-2 mb-4">
          <p className="text-[10px] uppercase text-white/40">
            Pricing & Limits
          </p>
          <div className="grid grid-cols-2 gap-2">
            <InputGroup label="Price" value={localPlan.price} onChange={(v:any) => handleChange("price", Number(v))} />
            <InputGroup label="Daily Chats" value={localPlan.maxDailyChats} onChange={(v:any) => handleChange("maxDailyChats", Number(v))} />
            <InputGroup label="Timer (s)" value={localPlan.chatTimer} onChange={(v:any) => handleChange("chatTimer", Number(v))} />
            <InputGroup label="Match Delay" value={localPlan.minMatchTime} onChange={(v:any) => handleChange("minMatchTime", Number(v))} />
          </div>
        </section>

        {/* Permissions */}
        <section className="space-y-2 mb-6">
          <p className="text-[10px] uppercase text-white/40">
            Permissions
          </p>
          <div className="grid grid-cols-2 gap-2">
            <ToggleGroup label="Emojis" active={localPlan.sendEmojis} onClick={() => handleChange("sendEmojis", !localPlan.sendEmojis)} />
            <ToggleGroup label="GIFs" active={localPlan.sendGifs} onClick={() => handleChange("sendGifs", !localPlan.sendGifs)} />
            <ToggleGroup label="Videos" active={localPlan.sendVideos} onClick={() => handleChange("sendVideos", !localPlan.sendVideos)} />
            <ToggleGroup label="Name Edit" active={localPlan.editName} onClick={() => handleChange("editName", !localPlan.editName)} />
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-500"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* === Reused UI atoms === */

function InputGroup({ label, value, onChange }: any) {
  return (
    <div className="bg-[#0b0f1a] p-2 rounded border border-white/5">
      <p className="text-[10px] text-white/40">{label}</p>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none w-full text-sm font-mono"
      />
    </div>
  );
}

function ToggleGroup({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between p-2 rounded border text-xs transition-colors ${
        active
          ? "border-indigo-500/50 bg-indigo-500/10"
          : "border-white/5 bg-[#0b0f1a]"
      }`}
    >
      {label}
      {active ? (
        <Check size={12} className="text-indigo-400" />
      ) : (
        <X size={12} className="text-white/20" />
      )}
    </button>
  );
}
