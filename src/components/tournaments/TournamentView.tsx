'use client'

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import StandingsTable from "@/components/tournaments/StandingsTable"
import { useToast } from "@/components/ui/use-toast"
import { Tournament } from "@/lib/types"
import { getTournamentById } from "@/lib/tournaments"

interface TournamentViewProps {
  tournamentId: string
}

export default function TournamentView({ tournamentId }: TournamentViewProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loadingTournament, setLoadingTournament] = useState<boolean>(true)

  const { toast } = useToast()

  useEffect(() => {
    async function getTournament() {
      setLoadingTournament(true)
      if (tournamentId) {
        try {
          const data = await getTournamentById(tournamentId)
          setTournament(data)
        } catch (error) {
          setTournament(null)
          toast({
            variant: "destructive",
            description: "Error al obtener los datos del torneo. Por favor vuelve a intentarlo.",
          })
        } finally {
          setLoadingTournament(false)
        }
      }
    }

    getTournament()
  }, [tournamentId, toast])


  if (loadingTournament) {
    return <Loader2 className="mx-auto my-3 animate-spin" />
  }

  if (!tournament) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">No se encontró el torneo.</p>
      </div>
    )
  }

  return (
    <main className="flex flex-col md:flex-row w-full min-w-0 gap-5">
      <div className="md:flex-grow md:w-3/4">
        <StandingsTable tournamentId={tournamentId} standings={tournament.participants} />
      </div>
      <div className="md:w-1/4">
      </div>
    </main>
  )
}