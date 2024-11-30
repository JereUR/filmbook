'use client'

import { useEffect, useState } from "react"
import { Loader2, Info, Calendar, Users, X } from 'lucide-react'

import StandingsTable from "@/components/tournaments/StandingsTable"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tournament } from "@/lib/types"
import { getTournamentById } from "@/lib/tournaments"
import DateItem from "./DateItem"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import Linkify from "../Linkify"

interface TournamentViewProps {
  tournamentId: string
}

export default function TournamentView({ tournamentId }: TournamentViewProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loadingTournament, setLoadingTournament] = useState<boolean>(true)
  const [showDates, setShowDates] = useState<boolean>(false)

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

  useEffect(() => {
    if (showDates) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showDates])

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
    <main className="flex flex-col mx-auto md:flex-row w-full min-w-0 gap-5 relative">
      <div className="md:flex-grow md:w-3/4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-5">
            <Card className="w-full border-none">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">{tournament.name}</CardTitle>
                {tournament.description && (
                  <CardDescription className="m-2 text-lg italic text-muted-foreground/40">
                    <Linkify>
                      {tournament.description}
                    </Linkify>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {tournament.participants.length} participantes
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {tournament.dates.filter(d => d.visible).length} fechas disputadas
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <StandingsTable tournamentId={tournamentId} standings={tournament.participants} />
        </div>
      </div>
      <div className="hidden md:block md:w-1/4 h-fit bg-card p-4 rounded-lg shadow-md">
        <DatesContent tournament={tournament} />
      </div>
      <Button
        className="md:hidden fixed bottom-20 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-[203]"
        onClick={() => setShowDates(!showDates)}
      >
        {showDates ? <X className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
      </Button>
      <div
        className={`fixed inset-y-0 h-screen right-0 w-full sm:w-80 bg-background shadow-lg z-[201] overflow-y-auto transition-transform duration-300 ease-in-out transform ${showDates ? 'translate-x-0' : 'translate-x-full'
          } md:hidden`}
      >
        <div className="p-4">
          <DatesContent tournament={tournament} />
        </div>
      </div>
    </main>
  )
}

function DatesContent({ tournament }: { tournament: Tournament }) {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Fechas disputadas</h2>
        <div className="flex items-center text-sm text-muted-foreground/40">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="mr-2 h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p className='flex gap-2'>Las fechas con <div className="mt-[6px] w-2 h-2 rounded-full bg-primary" /> tienen puntos extras disponibles.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          Fechas con puntos extras
        </div>
      </div>
      <div className="space-y-3">
        {tournament.dates.map((d) => (
          <DateItem key={d.id} dateData={d} />
        ))}
      </div>
    </>
  )
}