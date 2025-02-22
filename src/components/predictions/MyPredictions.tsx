"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Award, Calendar, Loader2, Pencil, Trash2, Trophy, Heart, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useDeletePredictionsMutation } from "./mutations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { AwardEvent } from "@/types/predictions"

export default function MyPredictions({ userId }: { userId: string }) {
  const router = useRouter()
  const [awardEvents, setAwardEvents] = useState<AwardEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const deletePredictionsMutation = useDeletePredictionsMutation(userId)

  useEffect(() => {
    if (userId) {
      fetchPredictions()
    }
  }, [userId])

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`/api/predictions/${userId}`)
      if (!response.ok) {
        throw new Error("Error al cargar las predicciones")
      }
      const data = await response.json()
      setAwardEvents(data)
    } catch (err) {
      setError("Error al cargar las predicciones")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (eventId: string) => {
    router.push(`/editar-predicciones/${eventId}`)
  }

  const handleDelete = async (eventId: string) => {
    try {
      await deletePredictionsMutation.mutateAsync(eventId)
      setAwardEvents(awardEvents.filter((event) => `${event.name}-${event.year}` !== eventId))
      setEventToDelete(null)
    } catch (error) {
      console.error("Error deleting predictions:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No hay predicciones</CardTitle>
          <CardDescription>Comienza creando tus predicciones para los premios</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/crear-predicciones/Oscars-2025")} className="gap-2">
            <Award className="h-4 w-4" />
            Crear predicciones para los Oscars 2025
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {awardEvents.map((event) => (
        <Card key={`${event.name}-${event.year}`} className="relative overflow-hidden">
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
              <div className="space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(`${event.name}-${event.year}`)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setEventToDelete(`${event.name}-${event.year}`)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Borrar
                </Button>
              </div>
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
                      <div className="space-y-4">
                        <PredictionItem
                          title="Ganador predicho"
                          name={prediction.predictedWinnerName}
                          image={prediction.predictedWinnerImage}
                          icon={<Trophy className="h-4 w-4 text-amber-500" />}
                        />
                        <Separator />
                        <PredictionItem
                          title="Favorito personal"
                          name={prediction.favoriteWinnerName}
                          image={prediction.favoriteWinnerImage}
                          icon={<Heart className="h-4 w-4 text-red-500" />}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
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
            <AlertDialogAction className='bg-destructive' onClick={() => eventToDelete && handleDelete(eventToDelete)}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function PredictionItem({
  title,
  name,
  image,
  icon,
}: {
  title: string
  name: string
  image: string | null
  icon: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        {icon} {title}
      </p>
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0 w-10 h-14 rounded overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <span className="flex-1 min-w-0 font-medium">
          <span className="block truncate">{name}</span>
        </span>
      </div>
    </div>
  )
}

