"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useOscarsNominees from "@/hooks/useOscarsNominees"
import type {
  MovieNomination,
  PersonNomination,
  SongNomination,
  NominatedMovie,
  NominatedPerson,
  NominatedSong,
} from "@/lib/types"
import { useAddPrediction } from "./mutations"

type Nomination = MovieNomination | PersonNomination | SongNomination
type Nominee = NominatedMovie | NominatedPerson | NominatedSong

export default function PredictionForm() {
  const router = useRouter()
  const { nominationsPerson, nominationsMovie, nominationsOriginalSong } = useOscarsNominees()
  const [predictions, setPredictions] = useState<Record<string, { predictedWinner: string; favoriteWinner: string }>>(
    {},
  )
  const addPredictionMutation = useAddPrediction()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    for (const [category, { predictedWinner, favoriteWinner }] of Object.entries(predictions)) {
      await addPredictionMutation.mutateAsync({
        category,
        predictedWinner,
        favoriteWinner,
      })
    }
    router.push("/mis-predicciones")
  }

  const handlePredictionChange = (category: string, type: "predictedWinner" | "favoriteWinner", value: string) => {
    setPredictions((prev) => ({
      ...prev,
      [category]: { ...prev[category], [type]: value },
    }))
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
        <div className="space-y-4">
          <Select onValueChange={(value) => handlePredictionChange(category, "predictedWinner", value)}>
            <SelectTrigger className="w-full h-20">
              <SelectValue placeholder="Selecciona el ganador" />
            </SelectTrigger>
            <SelectContent>
              {nominees.map((nominee) => (
                <SelectItem
                  key={`predicted-${getNomineeId(nominee)}`}
                  value={getNomineeId(nominee)}
                  className="cursor-pointer"
                >
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
          <Select onValueChange={(value) => handlePredictionChange(category, "favoriteWinner", value)}>
            <SelectTrigger className="w-full h-20">
              <SelectValue placeholder="Selecciona tu favorito" />
            </SelectTrigger>
            <SelectContent>
              {nominees.map((nominee) => (
                <SelectItem
                  key={`favorite-${getNomineeId(nominee)}`}
                  value={getNomineeId(nominee)}
                  className="cursor-pointer"
                >
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

