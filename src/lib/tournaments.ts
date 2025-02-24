import { Tournament } from "@/lib/types"

export async function getTournamentById(
  tournamentId: string,
): Promise<Tournament | null> {
  try {
    const response = await fetch(`/api/tournaments/${tournamentId}`)

    if (!response.ok) {
      throw new Error("Error al obtener los datos de la película")
    }

    const data: Tournament = await response.json()

    return data
  } catch (error) {
    return null
  }
}
