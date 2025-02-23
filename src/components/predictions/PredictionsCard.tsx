"use client"

import { useRouter } from "next/navigation"
import { Award, Calendar, Pencil, Trash2, ChevronRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AwardEvent } from "@/types/predictions"
import { PredictionItem } from "./PredictionItem"
import { PredictionsDialog } from "./PredictionDialog"

interface PredictionsCardProps {
  event: AwardEvent
  onDelete: (eventId: string) => void
  own:boolean
}

export function PredictionsCard({ event, onDelete, own=false }: PredictionsCardProps) {
  const router = useRouter()
  const eventId = `${event.name}-${event.year}`

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0" />
      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              {event.name} {event.year}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {Object.keys(event.categories).length} categorías predichas
            </CardDescription>
          </div>
          {own&&<div className="space-x-2">
            <PredictionsDialog event={event} />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/editar-predicciones/${eventId}`)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(eventId)} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Borrar
            </Button>
          </div>}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(event.categories).map(([category, prediction]) => (
              <div
                key={prediction.id}
                className="group relative bg-card hover:bg-accent transition-colors rounded-lg border shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/0 rounded-t-lg" />
                <div className="relative p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                    {category}
                  </h3>
                  <PredictionItem
                    predictedWinnerName={prediction.predictedWinnerName}
                    predictedWinnerImage={prediction.predictedWinnerImage}
                    favoriteWinnerName={prediction.favoriteWinnerName}
                    favoriteWinnerImage={prediction.favoriteWinnerImage}
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

