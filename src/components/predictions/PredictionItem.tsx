import Image from "next/image"
import type { ReactNode } from "react"
import { Separator } from "@/components/ui/separator"
import { Trophy, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface PredictionItemProps {
  predictedWinnerName: string
  predictedWinnerImage: string | null
  favoriteWinnerName: string
  favoriteWinnerImage: string | null
  compact?: boolean
}

export function PredictionItem({
  predictedWinnerName,
  predictedWinnerImage,
  favoriteWinnerName,
  favoriteWinnerImage,
  compact = false,
}: PredictionItemProps) {
  const Winner = ({
    title,
    name,
    image,
    icon,
  }: { title: string; name: string; image: string | null; icon: ReactNode }) => (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      <p className={cn("text-muted-foreground flex items-center gap-1.5", compact ? "text-xs" : "text-sm")}>
        {icon} {title}
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

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <Winner
        title="Ganador predicho"
        name={predictedWinnerName}
        image={predictedWinnerImage}
        icon={<Trophy className={cn("text-amber-500", compact ? "h-3 w-3" : "h-4 w-4")} />}
      />
      <Separator className={compact ? "my-1" : undefined} />
      <Winner
        title="Favorito personal"
        name={favoriteWinnerName}
        image={favoriteWinnerImage}
        icon={<Heart className={cn("text-red-500", compact ? "h-3 w-3" : "h-4 w-4")} />}
      />
    </div>
  )
}

