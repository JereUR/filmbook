"use client"

import Image from "next/image"
import { Trophy, Heart } from "lucide-react"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { UnifiedNomination } from "@/types/nominations"

type CategoryPredictionProps = {
  nomination: UnifiedNomination
  onPredictionChange: (
    category: string,
    type: "predictedWinner" | "favoriteWinner",
    nominee: UnifiedNomination["nominees"][0],
  ) => void
  currentPrediction?: {
    predictedWinnerName?: string
    favoriteWinnerName?: string
  }
}

export default function CategoryPrediction({
  nomination,
  onPredictionChange,
  currentPrediction,
}: CategoryPredictionProps) {

  const renderNomineeDetails = (nominee: UnifiedNomination["nominees"][0]) => {
    if (!nominee.details) return null

    switch (nomination.type) {
      case "person":
        return nominee.details.movie && <span className="text-sm text-muted-foreground">{nominee.details.movie}</span>
      case "song":
        return (
          nominee.details.artists && (
            <span className="text-sm text-muted-foreground">{nominee.details.artists.join(", ")}</span>
          )
        )
      case "movie":
        return (
          nominee.details.director && (
            <span className="text-sm text-muted-foreground">Dir: {nominee.details.director}</span>
          )
        )
      default:
        return null
    }
  }

  return (
    <Card className="overflow-hidden dark:bg-slate-950">
      <div className="border-b bg-muted/50 px-4 sm:px-6 py-3 sm:py-4 dark:bg-slate-900">
        <h3 className="text-lg sm:text-xl font-bold text-primary">{nomination.category}</h3>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="p-4 sm:p-6 border-b md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <h4 className="font-medium">Predicción Ganador</h4>
          </div>
          <NomineeRadioGroup
            nominees={nomination.nominees}
            selectedValue={currentPrediction?.predictedWinnerName}
            onChange={(nominee) => onPredictionChange(nomination.category, "predictedWinner", nominee)}
            renderDetails={renderNomineeDetails}
            name={`${nomination.category}-predicted`}
          />
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-red-500" />
            <h4 className="font-medium">Tu Favorito</h4>
          </div>
          <NomineeRadioGroup
            nominees={nomination.nominees}
            selectedValue={currentPrediction?.favoriteWinnerName}
            onChange={(nominee) => onPredictionChange(nomination.category, "favoriteWinner", nominee)}
            renderDetails={renderNomineeDetails}
            name={`${nomination.category}-favorite`}
          />
        </div>
      </div>
    </Card>
  )
}

type NomineeRadioGroupProps = {
  nominees: UnifiedNomination["nominees"]
  onChange: (nominee: UnifiedNomination["nominees"][0]) => void
  selectedValue?: string
  renderDetails: (nominee: UnifiedNomination["nominees"][0]) => React.ReactNode
  name: string
}

function NomineeRadioGroup({ nominees, onChange, selectedValue, renderDetails, name }: NomineeRadioGroupProps) {
  return (
    <RadioGroup
      value={selectedValue || ""}
      onValueChange={(val) => {
        const nominee = nominees.find((n) => n.name === val)
        if (nominee) onChange(nominee)
      }}
      className="spce-y-1 lg:space-y-3"
    >
      {nominees.map((nominee) => (
        <div key={nominee.name} className="relative w-full items-center max-w-[85vw] sm:max-w-[400px] lg:max-w-[470px]">
          <RadioGroupItem
            value={nominee.name}
            id={`${name}-${nominee.name}`}
            className="peer sr-only"
            checked={nominee.name === selectedValue}
          />
          <label htmlFor={`${name}-${nominee.name}`} className="block cursor-pointer">
            <div
              className={cn(
                "relative flex items-start gap-2 sm:gap-3 rounded-lg border p-2 sm:p-3",
                "dark:border-slate-800",
                "hover:bg-accent hover:text-accent-foreground dark:hover:bg-slate-800",
                "peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary",
                nominee.name === selectedValue ? "border-primary bg-primary/5 dark:bg-primary/10" : "",
              )}
            >
              <div className="relative flex-shrink-0 w-10 sm:w-12 h-14 sm:h-16">
                <Image src={nominee.image || "/placeholder.svg"} alt="" fill className="object-cover rounded" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="pr-8 space-y-1">
                  <p className="text-sm sm:text-base font-medium leading-none truncate">{nominee.name}</p>
                  <div className="text-xs sm:text-sm truncate">{renderDetails(nominee)}</div>
                </div>
              </div>
              <div
                className={cn(
                  "absolute right-2 sm:right-3 top-1/2 -translate-y-1/2",
                  "h-4 w-4 rounded-full border border-primary",
                  "flex items-center justify-center",
                  nominee.name === selectedValue ? "bg-primary" : "",
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full bg-white transition-transform",
                    nominee.name === selectedValue ? "scale-100" : "scale-0",
                  )}
                />
              </div>
            </div>
          </label>
        </div>
      ))}
    </RadioGroup>
  )
}

