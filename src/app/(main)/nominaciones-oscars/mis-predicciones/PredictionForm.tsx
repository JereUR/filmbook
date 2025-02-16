"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import useOscarsNominees from "@/hooks/useOscarsNominees"
import type {
  MovieNomination,
  PersonNomination,
  SongNomination,
  NominatedMovie,
  NominatedPerson,
  NominatedSong,
} from "@/lib/types"

type Nomination = MovieNomination | PersonNomination | SongNomination
type Nominee = NominatedMovie | NominatedPerson | NominatedSong

export default function PredictionForm() {
  const router = useRouter()
  const { nominationsPerson, nominationsMovie, nominationsOriginalSong } = useOscarsNominees()
  const [predictions, setPredictions] = useState<Record<string, string>>({})

  const addPredictionMutation = useMutation({
    mutationFn: async (prediction: { nominationId: string; predictedWinner: string }) => {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prediction),
      })
      if (!response.ok) {
        throw new Error("Failed to add prediction")
      }
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Predicción guardada",
        description: "Tu predicción ha sido guardada exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Hubo un problema al guardar tu predicción. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    for (const [nominationId, predictedWinner] of Object.entries(predictions)) {
      await addPredictionMutation.mutateAsync({ nominationId, predictedWinner })
    }
    router.push("/mis-predicciones")
  }

  const handlePredictionChange = (category: string, predictedWinner: string) => {
    setPredictions((prev) => ({ ...prev, [category]: predictedWinner }))
  }

  const getNomineeId = (nominee: Nominee): string => {
    if ("id" in nominee && nominee.id) return nominee.id
    if ("name" in nominee) return nominee.name
    return nominee.title
  }

  const getNomineeName = (nominee: Nominee): string => {
    if ("name" in nominee) return nominee.name
    return nominee.title
  }

  const getNomineeImage = (nominee: Nominee): string | null => {
    if ("posterPath" in nominee) return nominee.posterPath
    if ("photo" in nominee) return nominee.photo
    return null
  }

  const renderNominations = (nominations: Nomination[]) => {
    return nominations.map(({ category, nominees }) => (
      <div key={category} className="mb-6 bg-card p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-primary">{category}</h3>
        <Select onValueChange={(value) => handlePredictionChange(category, value)}>
          <SelectTrigger className="w-full h-20">
            <SelectValue placeholder="Selecciona un ganador" />
          </SelectTrigger>
          <SelectContent>
            {nominees.map((nominee) => (
              <SelectItem key={getNomineeId(nominee)} value={getNomineeId(nominee)} className='cursor-pointer'>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-15">
                    <Image
                      src={getNomineeImage(nominee) || "/placeholder.svg"}
                      alt={getNomineeName(nominee)}
                      width={40}
                      height={60}
                      className="object-cover rounded w-full h-full"
                    />
                  </div>
                  <span className="flex-grow truncate">{getNomineeName(nominee)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Mis Predicciones para los Oscars</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderNominations(nominationsMovie)}
        {renderNominations(nominationsPerson)}
        {renderNominations(nominationsOriginalSong)}
      </div>
      <Button type="submit" className="w-full mt-6">
        Guardar Predicciones
      </Button>
    </form>
  )
}

