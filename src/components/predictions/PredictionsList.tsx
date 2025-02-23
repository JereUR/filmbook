"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeletePredictionsMutation } from "./mutations"
import { usePredictions } from "@/hooks/usePredictions"
import { EmptyPredictions } from "./EmptyPredictions"
import { PredictionsCard } from "./PredictionsCard"
import { PredictionsListSkeleton } from "../skeletons/PredictionsListSkeleton"

export default function PredictionsList({ userId, own = false }: { userId: string, own: boolean }) {
  const { awardEvents, isLoading, error, updatePredictions } = usePredictions(userId)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const deletePredictionsMutation = useDeletePredictionsMutation(userId)

  const handleDelete = async (eventId: string) => {
    try {
      await deletePredictionsMutation.mutateAsync(eventId)
      updatePredictions(awardEvents.filter((event) => `${event.name}-${event.year}` !== eventId))
      setEventToDelete(null)
    } catch (error) {
      console.error("Error deleting predictions:", error)
    }
  }

  if (isLoading) {
    return <PredictionsListSkeleton />
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader className="text-center text-destructive">
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (awardEvents.length === 0) {
    return <EmptyPredictions />
  }

  return (
    <div className="space-y-5">
      {awardEvents.map((event) => (
        <PredictionsCard
          key={`${event.name}-${event.year}`}
          event={event}
          onDelete={own ? (eventId) => setEventToDelete(eventId) : () => { }}
          own={own}
        />
      ))}
      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todas tus predicciones para este evento. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={() => eventToDelete && handleDelete(eventToDelete)}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

