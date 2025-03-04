import { cn } from "@/lib/utils"
import Image from "next/image"
import type { ReactNode } from "react"
import { Heart, Trophy } from "lucide-react"

interface PredictionItemProps {
  predictedWinnerName: string
  predictedWinnerImage: string | null
  favoriteWinnerName: string
  favoriteWinnerImage: string | null
  compact?: boolean
  actualWinner?: string | null
}

const Winner = ({
  title,
  name,
  image,
  icon,
  compact = false,
  isCorrect = null,
}: {
  title: string
  name: string
  image: string | null
  icon: ReactNode
  compact?: boolean,
  isCorrect?: boolean | null
}) => (
  <div className={cn("", compact ? "space-y-1.5" : "space-y-2")}>
    <p className={cn("text-muted-foreground flex items-center gap-1.5", compact ? "text-xs" : "text-sm")}>
      {icon} {title}
      {isCorrect !== null &&
        (isCorrect ? (
          <span className="ml-auto text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={compact ? "h-3 w-3" : "h-4 w-4"}
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
        ) : (
          <span className="ml-auto text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={compact ? "h-3 w-3" : "h-4 w-4"}
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </span>
        ))}
    </p>
    <div className="flex items-start gap-2">
      <div
        className={cn("relative flex-shrink-0 rounded overflow-hidden bg-muted", compact ? "w-8 h-10" : "w-10 h-14")}
      >
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-pretty break-words", compact ? "text-sm leading-tight" : "text-base font-medium")}>
          {name}
        </p>
      </div>
    </div>
  </div>
)

const Separator = ({ className }: { className?: string }) => <div className={cn("border-t border-muted", className)} />

export function PredictionItem({
  predictedWinnerName,
  predictedWinnerImage,
  favoriteWinnerName,
  favoriteWinnerImage,
  compact = false,
  actualWinner = null,
}: PredictionItemProps) {
  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <Winner
        title="Creo que va a ganar"
        name={predictedWinnerName}
        image={predictedWinnerImage}
        icon={<Trophy className={cn("text-amber-500", compact ? "h-3 w-3" : "h-4 w-4")} />}
        isCorrect={actualWinner ? predictedWinnerName === actualWinner : null}
      />
      <Separator className={compact ? "my-1" : undefined} />
      <Winner
        title="Me gustaría que gane"
        name={favoriteWinnerName}
        image={favoriteWinnerImage}
        icon={<Heart className={cn("text-red-500", compact ? "h-3 w-3" : "h-4 w-4")} />}
        isCorrect={actualWinner ? favoriteWinnerName === actualWinner : null}
      />
    </div>
  )
}

