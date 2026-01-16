'use client'

import { usePlan } from "@/contexts/PlanContext"
import { LucideProps, LucideUsers2, Mars, Star, Users2, UsersIcon, Venus, VenusAndMarsIcon } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

type Gender = "male" | "female" | "both"

const GenderSelector = () => {
  const { state } = usePlan()

  const isFree = state?.planName === "Free"

  const selectedGender: Gender = isFree ? "both" : "male"

  const options: { key: Gender; label: string; emoji: RefAttributes<SVGSVGElement> }[] = [
    { key: "male", label: "Male", emoji: <Mars /> },
    { key: "both", label: "Random", emoji: <UsersIcon /> },
    { key: "female", label: "Female", emoji: <Venus /> },
  ]

  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <div className="flex items-center gap-3 self-start pb-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <VenusAndMarsIcon className="w-5 h-5 text-purple-400" />
        </div>
        <span className="font-medium">Gender Filter</span>
      </div>
      <div className="flex gap-3 items-center justify-center">
        {options.map(option => {
          const isSelected = selectedGender === option.key
          const isLocked = isFree && option.key !== "both"

          return (
            <div
              key={option.key}
              className={`
              relative rounded-lg
              ${isSelected
                  ? "bg-linear-to-r from-indigo-500 to-pink-500 p-0.5"
                  : ""}
            `}
            >

              <button
                disabled={isLocked}
                className={`
                w-24 h-20 rounded-[10px]
                flex flex-col items-center justify-center gap-1
                transition-all
                ${isSelected
                    ? "bg-[#0e1326]"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"}
                ${isLocked ? "cursor-not-allowed opacity-80" : ""}
              `}
              >
                <span className="text-xl">{option.emoji}</span>
                <span className="text-sm font-medium text-white">
                  {option.label}
                </span>
              </button>

              {isLocked && (
                <div className="absolute -top-2 -right-2 bg-linear-to-r from-orange-500 via-rose-500 to-amber-500 rounded-full p-1 shadow-lg">
                  <Star className="w-3 h-3 text-white" fill="white" strokeWidth={3} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GenderSelector
