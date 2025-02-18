"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useOscarsNominees from "@/hooks/useOscarsNominees"
import { useAddPredictionMutation, useUpdatePredictionMutation } from "./mutations"
import LoadingButton from "@/components/LoadingButton"

type Nominee = {
  name: string
  image: string | null | undefined
}

type PredictionFormProps = {
  userId: string
  eventId: string
  initialPredictions?: Record<string, { predictedWinner: Nominee; favoriteWinner: Nominee }>
}

export default function PredictionForm({ userId, eventId, initialPredictions }: PredictionFormProps) {
  const router = useRouter()
  const { nominationsPerson, nominationsMovie, nominationsOriginalSong } = useOscarsNominees()
  const [predictions, setPredictions] = useState<Record<string, { predictedWinner: Nominee; favoriteWinner: Nominee }>>(
    initialPredictions || {},
  )
  const { mutate: addPredictionMutation, isPending: isPendingAdd } = useAddPredictionMutation()
  const { mutate: updatePredictionMutation, isPending: isPendingUpdate } = useUpdatePredictionMutation()

  const isEditMode = !!initialPredictions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const mutationFn = isEditMode ? updatePredictionMutation : addPredictionMutation

    for (const [category, { predictedWinner, favoriteWinner }] of Object.entries(predictions)) {
      mutationFn({
        userId,
        eventId,
        category,
        predictedWinnerName: predictedWinner.name,
        predictedWinnerImage: predictedWinner.image ?? null,
        favoriteWinnerName: favoriteWinner.name,
        favoriteWinnerImage: favoriteWinner.image ?? null,
      })
    }

    router.push("/mis-predicciones")
  }

  const handlePredictionChange = (category: string, type: "predictedWinner" | "favoriteWinner", nominee: Nominee) => {
    setPredictions((prev) => ({
      ...prev,
      [category]: { ...prev[category], [type]: nominee },
    }))
  }

  const renderNominations = (nominations: any[]) => {
    return nominations.map(({ category, nominees }) => {
      const formattedNominees: Nominee[] = nominees.map((nominee: any) => ({
        name: nominee.name || nominee.title,
        image: nominee.photo || nominee.posterPath || null,
      }))

      return (
        <div key={category} className="mb-6 bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-primary">{category}</h3>
          <div className="space-y-4">
            <Select
              onValueChange={(value) => handlePredictionChange(category, "predictedWinner", JSON.parse(value))}
              defaultValue={JSON.stringify(predictions[category]?.predictedWinner)}
            >
              <SelectTrigger className="w-full h-20">
                <SelectValue placeholder="Selecciona el ganador" />
              </SelectTrigger>
              <SelectContent>
                {formattedNominees.map((nominee) => (
                  <SelectItem key={`predicted-${nominee.name}`} value={JSON.stringify(nominee)}>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-15">
                        <Image
                          src={nominee.image || "/placeholder.svg"}
                          alt={nominee.name}
                          width={40}
                          height={60}
                          className="object-cover rounded w-full h-full"
                        />
                      </div>
                      <span className="flex-grow truncate">{nominee.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => handlePredictionChange(category, "favoriteWinner", JSON.parse(value))}
              defaultValue={JSON.stringify(predictions[category]?.favoriteWinner)}
            >
              <SelectTrigger className="w-full h-20">
                <SelectValue placeholder="Selecciona tu favorito" />
              </SelectTrigger>
              <SelectContent>
                {formattedNominees.map((nominee) => (
                  <SelectItem key={`favorite-${nominee.name}`} value={JSON.stringify(nominee)}>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-15">
                        <Image
                          src={nominee.image || "/placeholder.svg"}
                          alt={nominee.name}
                          width={40}
                          height={60}
                          className="object-cover rounded w-full h-full"
                        />
                      </div>
                      <span className="flex-grow truncate">{nominee.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? "Editar Predicciones" : "Mis Predicciones para los Oscars"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderNominations(nominationsMovie)}
        {renderNominations(nominationsPerson)}
        {renderNominations(nominationsOriginalSong)}
      </div>
      <LoadingButton loading={isEditMode ? isPendingUpdate : isPendingAdd} type="submit" className="w-full mt-6">
        {isEditMode ? "Actualizar Predicciones" : "Guardar Predicciones"}
      </LoadingButton>
    </form>
  )
}

