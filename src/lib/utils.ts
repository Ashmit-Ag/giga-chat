import { RandomUserProfile } from "@/hooks/useModChatSocket";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeEmojis = (text: string) => {
  return text.replace(
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
    ""
  );
};

// 👤 Gender-based names
const MALE_NAMES = ["Aarav", "Liam", "Noah", "Ethan", "Arjun"];
const FEMALE_NAMES = ["Sophia", "Olivia", "Emma", "Mia", "Aanya"];

const CITIES = ["New York", "London", "Mumbai", "Berlin", "Toronto", "Paris"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type GenderMatch = "male" | "female" | "random";

export function generateRandomUser(
  genderMatch: GenderMatch
): RandomUserProfile {

  // 🎯 Resolve actual gender
  const resolvedGender: "male" | "female" =
    genderMatch === "random"
      ? Math.random() < 0.5
        ? "male"
        : "female"
      : genderMatch;

  const name =
    resolvedGender === "male"
      ? getRandomItem(MALE_NAMES)
      : getRandomItem(FEMALE_NAMES);

  const age = Math.floor(Math.random() * (40 - 18 + 1)) + 18;

  return {
    name,
    username: `${name.toLowerCase()}_${Math.floor(Math.random() * 10000)}`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}_${Math.random()}`,
    age,
    city: getRandomItem(CITIES),
  };
}
