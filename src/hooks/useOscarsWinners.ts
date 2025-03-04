import { useMemo } from "react"
import useOscarsNominees from "./useOscarsNominees"

export type CategoryWinner = {
  category: string
  winnerName: string
}

export default function useOscarsWinners() {
  const { nominationsPerson, nominationsMovie, nominationsOriginalSong } =
    useOscarsNominees()

  const winners = useMemo<Record<string, string>>(() => {
    const result: Record<string, string> = {}

    // Extraer ganadores de todas las categorías
    const allNominations = [
      ...nominationsPerson,
      ...nominationsMovie,
      ...nominationsOriginalSong,
    ]

    allNominations.forEach((nomination) => {
      if (nomination.winner) {
        result[nomination.category] = nomination.winner
      }
    })

    return result
  }, [nominationsPerson, nominationsMovie, nominationsOriginalSong])

  return winners
}
