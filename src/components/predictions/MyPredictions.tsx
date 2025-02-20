"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useDeletePredictionsMutation } from "./mutations"
import { getPredictions } from "./actions"

type Prediction = {
  id: string
  predictedWinnerName: string
  predictedWinnerImage: string | null
  favoriteWinnerName: string
  favoriteWinnerImage: string | null
}

type AwardEvent = {
  name: string
  year: number
  categories: Record<string, Prediction>
}

export default function MyPredictions({ userId }: { userId: string }) {
  const router = useRouter()
  const [awardEvents, setAwardEvents] = useState<AwardEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const deletePredictionsMutation = useDeletePredictionsMutation(userId)

  useEffect(() => {
    if (userId) {
      fetchPredictions(userId)
    }
  }, [userId])

  const fetchPredictions = async (userId: string) => {
    try {
      const data = await getPredictions(userId)
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
    if (confirm("¿Estás seguro de que quieres borrar todas las predicciones para este evento?")) {
      try {
        await deletePredictionsMutation.mutateAsync(eventId)
        setAwardEvents(awardEvents.filter((event) => `${event.name}-${event.year}` !== eventId))
      } catch (error) {
        console.error("Error deleting predictions:", error)
      }
    }
  }

  if (isLoading) return <div>Cargando predicciones...</div>
  if (error) return <div>{error}</div>

  if (awardEvents.length === 0) return <div>No se encontraron predicciones.</div>

  return (
    <div className="space-y-8">
      {awardEvents.map((event) => (
        <div key={`${event.name}-${event.year}`} className="bg-card shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {event.name} {event.year}
            </h2>
            <div className="space-x-2">
              <Button onClick={() => handleEdit(`${event.name}-${event.year}`)}>Editar</Button>
              <Button variant="destructive" onClick={() => handleDelete(`${event.name}-${event.year}`)}>
                Borrar
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(event.categories).map(([category, prediction]) => (
              <div key={prediction.id} className="bg-background rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                <div className="space-y-2">
                  <PredictionItem
                    title="Ganador predicho"
                    name={prediction.predictedWinnerName}
                    image={prediction.predictedWinnerImage}
                  />
                  <PredictionItem
                    title="Favorito personal"
                    name={prediction.favoriteWinnerName}
                    image={prediction.favoriteWinnerImage}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PredictionItem({ title, name, image }: { title: string; name: string; image: string | null }) {
  return (
    <div>
      <p className="text-sm text-gray-600">{title}:</p>
      <div className="flex items-center space-x-2">
        {image && (
          <Image src={image || "/placeholder.svg"} alt={name} width={40} height={60} className="object-cover rounded" />
        )}
        <span>{name}</span>
      </div>
    </div>
  )
}

