"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAddPredictionMutation, useUpdatePredictionMutation } from "./mutations"
import LoadingButton from "@/components/LoadingButton"
import type { CategoryPredictions } from "@/types/nominations"
import useOscarsNominees from "@/hooks/useOscarsNominees"
import type { UnifiedNomination } from "@/types/nominations"
import { predictionInputSchema } from "@/lib/validation"
import CategoryPrediction from "./CategoryPrediction"

type PredictionFormProps = {
  userId: string
  eventId: string
  initialPredictions?: CategoryPredictions
}

export default function PredictionForm({ userId, eventId, initialPredictions }: PredictionFormProps) {
  const { unifiedNominations } = useOscarsNominees()
  const router = useRouter()
  const [predictions, setPredictions] = useState<CategoryPredictions>(initialPredictions || {})

  console.log(predictions)

  const { mutate: addPredictionMutation, isPending: isPendingAdd } = useAddPredictionMutation()
  const { mutate: updatePredictionMutation, isPending: isPendingUpdate } = useUpdatePredictionMutation()

  const isEditMode = !!initialPredictions

  const groupedNominations = unifiedNominations.reduce(
    (acc, nomination) => {
      if (!acc[nomination.type]) {
        acc[nomination.type] = []
      }
      acc[nomination.type].push(nomination)
      return acc
    },
    {} as Record<string, UnifiedNomination[]>,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = {
      userId,
      eventId,
      predictions,
    }

    try {
      predictionInputSchema.parse(formData)

      const mutationFn = isEditMode ? updatePredictionMutation : addPredictionMutation

      Object.entries(predictions).forEach(([category, prediction]) => {
        mutationFn({
          userId,
          eventId,
          category,
          predictedWinnerName: prediction.predictedWinner.name,
          predictedWinnerImage: prediction.predictedWinner.image,
          favoriteWinnerName: prediction.favoriteWinner.name,
          favoriteWinnerImage: prediction.favoriteWinner.image,
        })
      })

      router.push("/mis-predicciones")
    } catch (error) {
      console.error("Error de validación:", error)
    }
  }

  const renderSection = (title: string, nominations: UnifiedNomination[]) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary border-b pb-2">{title}</h2>
      <div className="grid gap-6">
        {nominations.map((nomination) => (
          <CategoryPrediction
            key={nomination.category}
            nomination={nomination}
            onPredictionChange={(category, type, nominee) => {
              setPredictions((prev) => ({
                ...prev,
                [category]: { ...prev[category], [type]: nominee },
              }))
            }}
            currentPrediction={predictions[nomination.category]}
          />
        ))}
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="container mx-auto px-4 py-6">
      <div className="rounded-2xl bg-card p-5 shadow-sm mb-8">
        <h1 className="text-center text-2xl font-bold">
          {isEditMode ? "Editar Predicciones" : "Mis Predicciones para los Oscars"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Selecciona tus predicciones para cada categoría. Puedes elegir quién crees que ganará y también tu favorito
          personal.
        </p>
      </div>

      <div className="space-y-12">
        {groupedNominations.movie && renderSection("Películas", groupedNominations.movie)}
        {groupedNominations.person && renderSection("Personas", groupedNominations.person)}
        {groupedNominations.song && renderSection("Canciones", groupedNominations.song)}
      </div>

      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 mt-8 -mx-4 border-t">
        <div className="container max-w-lg mx-auto">
          <LoadingButton loading={isEditMode ? isPendingUpdate : isPendingAdd} type="submit" className="w-full">
            {isEditMode ? "Actualizar Predicciones" : "Guardar Predicciones"}
          </LoadingButton>
        </div>
      </div>
    </form>
  )
}

