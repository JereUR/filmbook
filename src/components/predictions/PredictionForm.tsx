"use client"

import { useState } from "react"

import { useAddPredictionsMutation, useUpdatePredictionsMutation } from "./mutations"
import LoadingButton from "@/components/LoadingButton"
import useOscarsNominees from "@/hooks/useOscarsNominees"
import type { UnifiedNomination } from "@/types/nominations"
import type { PredictionInput } from "@/lib/validation"
import CategoryPrediction from "./CategoryPrediction"
import { useToast } from "@/components/ui/use-toast"
import { CategoryPredictionType } from "@/types/predictions"

type PredictionFormProps = {
  userId: string
  eventId: string
  initialPredictions?: CategoryPredictionType[]
}

export default function PredictionForm({ userId, eventId, initialPredictions }: PredictionFormProps) {
  const { unifiedNominations } = useOscarsNominees()

  const { toast } = useToast()
  const [predictions, setPredictions] = useState<Record<string, CategoryPredictionType>>(
    initialPredictions?.reduce(
      (acc, pred) => ({
        ...acc,
        [pred.category]: pred,
      }),
      {},
    ) || {},
  )

  const { mutate: addPredictionsMutation, isPending: isPendingAdd } = useAddPredictionsMutation()
  const { mutate: updatePredictionsMutation, isPending: isPendingUpdate } = useUpdatePredictionsMutation()

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

  console.log({ groupedNominations })

  const handlePredictionChange = (
    category: string,
    type: "predictedWinner" | "favoriteWinner",
    nominee: UnifiedNomination["nominees"][0] | null,
  ) => {

    console.log({ nominee })
    setPredictions((prev) => {
      if (!nominee) {
        const currentPrediction = prev[category]
        if (!currentPrediction) return prev

        const updatedPrediction: CategoryPredictionType = {
          category,
          ...(type === "predictedWinner"
            ? {
              favoriteWinnerName: currentPrediction.favoriteWinnerName,
              favoriteWinnerImage: currentPrediction.favoriteWinnerImage,
            }
            : {
              predictedWinnerName: currentPrediction.predictedWinnerName,
              predictedWinnerImage: currentPrediction.predictedWinnerImage,
            }),
        }

        if (!updatedPrediction.predictedWinnerName && !updatedPrediction.favoriteWinnerName) {
          const { [category]: _, ...rest } = prev
          return rest
        }

        return {
          ...prev,
          [category]: updatedPrediction,
        }
      }

      return {
        ...prev,
        [category]: {
          ...prev[category],
          category,
          [`${type}Name`]: nominee.name,
          [`${type}Image`]: nominee.image,
        } as CategoryPredictionType,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validPredictions = Object.values(predictions).filter(
      (prediction) => prediction.predictedWinnerName || prediction.favoriteWinnerName,
    )

    if (validPredictions.length === 0) {
      toast({
        variant: "destructive",
        title: "No hay predicciones",
        description: "Por favor, selecciona al menos una predicción o favorito para continuar.",
      })
      return
    }

    const predictionData = validPredictions.map(
      (prediction) =>
        ({
          userId,
          eventId,
          category: prediction.category,
          predictedWinnerName: prediction.predictedWinnerName || "",
          predictedWinnerImage: prediction.predictedWinnerImage,
          favoriteWinnerName: prediction.favoriteWinnerName || "",
          favoriteWinnerImage: prediction.favoriteWinnerImage,
        }) as PredictionInput,
    )

    const mutationFn = isEditMode ? updatePredictionsMutation : addPredictionsMutation

    try {
      await mutationFn(predictionData)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al guardar las predicciones",
      })
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
            onPredictionChange={handlePredictionChange}
            currentPrediction={predictions[nomination.category]}
          />
        ))}
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="container mx-auto px-4 py-6">
      <div className="rounded-2xl bg-card p-4 sm:p-5 shadow-sm mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          {isEditMode ? "Editar Predicciones" : "Mis Predicciones para los Oscars"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground text-center mt-2">
          Selecciona tus predicciones para cada categoría. Puedes elegir quién crees que ganará y/o tu favorito
          personal. No es necesario completar todas las categorías.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-12">
        {groupedNominations.movie && renderSection("Películas", groupedNominations.movie)}
        {groupedNominations.person && renderSection("Personas", groupedNominations.person)}
        {groupedNominations.song && renderSection("Canciones", groupedNominations.song)}
      </div>

      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 mt-8 border-t">
        <div className="container w-full mx-auto">
          <LoadingButton loading={isEditMode ? isPendingUpdate : isPendingAdd} type="submit" className="w-full">
            {isEditMode ? "Actualizar Predicciones" : "Guardar Predicciones"}
          </LoadingButton>
        </div>
      </div>
    </form>
  )
}

