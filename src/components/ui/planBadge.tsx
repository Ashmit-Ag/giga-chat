import { Badge, Group } from "@mantine/core";
import { Crown, Sparkles } from "lucide-react";

type PlanName = "Free" | "Basic" | "Premium";

const PlanBadge = ({ planName }: { planName?: PlanName }) => {
    if (!planName) return null;

    if (planName === "Premium") {
        return (
            <Badge
                size="md"
                radius="xl"
                variant="filled"
                className="!bg-[#332040] px-4 py-1 shadow-[inset_0_0_0_1px_rgba(255,215,128,0.08)]"
                >
                <Group gap={6}>
                    <Sparkles
                    className="w-4 h-4 text-amber-400"
                    strokeWidth={2}
                    />
                    <span className="text-amber-400 font-semibold tracking-wide">
                    PREMIUM
                    </span>
                </Group>
            </Badge>


        );
    }

    if (planName === "Basic") {
        return (
            <Badge
                size="md"
                radius="xl"
                variant="filled"
                className="!bg-[#2a1838] px-4 shadow-[inset_0_0_0_1px_rgba(255,215,128,0.08)]"
                >
                <Group gap={6}>
                    <span className="text-white font-semibold tracking-wide">
                    Basic
                    </span>
                </Group>
            </Badge>


        );
    }

    if (planName === "Free") {
        return (
            <Badge
                size="md"
                radius="xl"
                variant="filled"
                className="!bg-[#404040] px-4"
                >
                <Group gap={6}>
                    <span className="text-white font-semibold tracking-wide">
                    Free
                    </span>
                </Group>
            </Badge>


        );
    }
};

export default PlanBadge;
