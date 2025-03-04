"use client"

import { useRouter } from "next/navigation"
import { Award, Calendar, Pencil, Trash2, ChevronRight, Trophy } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AwardEvent } from "@/types/predictions"
import { PredictionItem } from "./PredictionItem"
import { PredictionsDialog } from "./PredictionDialog"
import useOscarsWinners from "@/hooks/useOscarsWinners"

interface PredictionsCardProps {
  event: AwardEvent
  onDelete: (eventId: string) => void
  own: boolean
}

export function PredictionsCard({ event, onDelete, own = false }: PredictionsCardProps) {
  const router = useRouter()
  const eventId = `${event.name}-${event.year}`
  const winners = useOscarsWinners()

  const correctPredictions = Object.entries(event.categories).reduce((count, [category, prediction]) => {
    const actualWinner = winners[category]
    if (actualWinner && prediction.predictedWinnerName === actualWinner) {
      return count + 1
    }
    return count
  }, 0)

  const categoriesWithWinners = Object.keys(event.categories).filter((category) => winners[category]).length

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0" />
      <CardHeader className="relative">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Award className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
              {event.name} {event.year}
            </CardTitle>
            <CardDescription className="flex flex-col md:flex-row gap-1 md:gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {Object.keys(event.categories).length} categorías predichas
              </div>
              {categoriesWithWinners > 0 && (
                <div className="flex items-center gap-2 text-green-500 md:pl-2 md:border-l">
                  <Trophy className="h-4 w-4" />
                  {correctPredictions} de {categoriesWithWinners} aciertos
                </div>
              )}
            </CardDescription>
          </div>
          {own && (
            <div className="flex flex-wrap gap-2">
              <PredictionsDialog event={event} />
              {/* <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/editar-predicciones/${eventId}`)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Editar</span>
              </Button> */}
              <Button variant="destructive" size="sm" onClick={() => onDelete(eventId)} className="gap-2">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Borrar</span>
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] sm:h-[600px] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(event.categories).map(([category, prediction]) => (
              <div
                key={prediction.id}
                className="group relative bg-card hover:bg-accent transition-colors rounded-lg border shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/0 rounded-t-lg" />
                <div className="relative p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                    {category}
                  </h3>
                  <PredictionItem
                    predictedWinnerName={prediction.predictedWinnerName}
                    predictedWinnerImage={prediction.predictedWinnerImage}
                    favoriteWinnerName={prediction.favoriteWinnerName}
                    favoriteWinnerImage={prediction.favoriteWinnerImage}
                    actualWinner={winners[category] || null}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

