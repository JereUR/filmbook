'use client'

import { Dispatch, useEffect, useState } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { InputAssignPointsProps, TournamentDateData, TournamentParticipantData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import noImage from '@/assets/no-image-film.jpg'
import Image from "next/image"

interface TournamentParticipantPopoverProps {
  participantId: string
  tournamentIdSelected: string | null
  dateIdSelected: string | null
  setInput: Dispatch<React.SetStateAction<InputAssignPointsProps>>
}

export default function TournamentParticipantPopover({
  participantId,
  tournamentIdSelected,
  dateIdSelected,
  setInput
}: TournamentParticipantPopoverProps) {
  const [tournaments, setTournaments] = useState<TournamentParticipantData[]>([])
  const [loadingParticipantData, setLoadingParticipantData] = useState<boolean>(false)
  const [selectedTournament, setSelectedTournament] = useState<TournamentDateData[]>([])
  const [openTournamentPopover, setOpenTournamentPopover] = useState<boolean>(false)
  const [openDatePopover, setOpenDatePopover] = useState<boolean>(false)

  const { toast } = useToast()

  useEffect(() => {
    if (!participantId) return

    const fetchParticipantData = async () => {
      setInput((prevInput) => ({ ...prevInput, tournamentId: null, dateId: null, points: 0, extraPoints: 0 }))
      setLoadingParticipantData(true)
      try {
        const response = await fetch(`/api/tournaments/participants/${participantId}/tournaments`)
        if (!response.ok) {
          throw new Error("Error al obtener los torneos del participante")
        }
        const data = await response.json()
        if (data.tournaments) {
          setTournaments(data.tournaments);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Error al obtener los torneos del participante. Por favor vuelve a intentarlo.",
        })
      } finally {
        setLoadingParticipantData(false)
      }
    }

    fetchParticipantData()
  }, [participantId])

  const handleTournamentClick = (tournamentId: string) => {
    setInput((prevInput) => ({ ...prevInput, tournamentId }))
    setSelectedTournament(tournaments.find((tournament) => tournament.tournamentId === tournamentId)?.dates || [])
    setOpenTournamentPopover(false)
  }


  console.log(tournaments)

  const handleDateClick = (dateId: string, points: number, extraPoints: number) => {
    console.log(points, extraPoints)
    setInput((prevInput) => ({
      ...prevInput,
      dateId,
      points,
      extraPoints
    }))
    setOpenDatePopover(false)
  }

  if (loadingParticipantData) {
    return (
      <p className='flex items-center gap-2'><Loader2 className='text-center animate-spin' /> Buscando torneos en los que participa</p>
    )
  }

  const noTournamentsAvailable = tournaments.length === 0

  return (
    <div className="flex flex-col gap-4">
      {noTournamentsAvailable && (
        <p className="text-center text-primary">Sin torneos asignados</p>
      )}
      <div className='flex gap-4'>
        <Popover open={openTournamentPopover} onOpenChange={setOpenTournamentPopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openTournamentPopover}
              className="flex-1 justify-between"
              disabled={noTournamentsAvailable}
            >
              {tournamentIdSelected
                ? tournaments.find(tournament => tournament.tournamentId === tournamentIdSelected)?.tournamentName
                : "Seleccione un torneo"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-2 z-[200] border border-primary/40">
            <Command className="max-h-[300px]">
              <CommandInput placeholder="Buscar torneo..." />
              <CommandList className="scrollbar-thin max-h-[300px] overflow-y-auto">
                <CommandEmpty>Sin resultados.</CommandEmpty>
                <CommandGroup heading="Torneos">
                  {Array.isArray(tournaments) && tournaments.length > 0 ? (
                    tournaments.map((tournament) => (
                      <CommandItem
                        key={tournament.tournamentId}
                        onSelect={() => handleTournamentClick(tournament.tournamentId)}
                        className={`cursor-pointer data-[selected='true']:bg-transparent`}
                      >
                        <div className="flex items-center gap-2">
                          {tournament.tournamentName}
                          {tournamentIdSelected === tournament.tournamentId && (
                            <Check className="ml-auto h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </CommandItem>
                    ))
                  ) : (
                    <CommandEmpty>Sin resultados.</CommandEmpty>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Popover open={openDatePopover} onOpenChange={setOpenDatePopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openDatePopover}
              className="flex-1 justify-between"
              disabled={!tournamentIdSelected || noTournamentsAvailable}
            >
              {dateIdSelected
                ? `Fecha ${selectedTournament.find((date) => date.dateId === dateIdSelected)?.date}`
                : "Seleccione una fecha"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-2 z-[200] border border-primary/40">
            <Command className="max-h-[300px]">
              <CommandInput placeholder="Buscar fecha..." />
              <CommandList className="scrollbar-thin max-h-[300px] overflow-y-auto">
                <CommandEmpty>Sin resultados.</CommandEmpty>
                <CommandGroup heading="Fechas">
                  {selectedTournament.length ? (
                    selectedTournament.map((date) => (
                      <CommandItem
                        key={date.dateId}
                        onSelect={() => handleDateClick(date.dateId, date.points, date.extraPoints)}
                        className={`cursor-pointer data-[selected='true']:bg-transparent`}
                      >
                        <div className="flex items-center gap-2">
                          {date.movie.posterPath && (
                            <Image
                              src={date.movie.posterPath || noImage}
                              alt={date.movie.title}
                              width={48}
                              height={72}
                              className="rounded"
                            />
                          )}
                          <span>
                            {date.movie.title} - Fecha {date.date}
                          </span>
                          {dateIdSelected === date.dateId && (
                            <Check className="ml-auto h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </CommandItem>
                    ))
                  ) : (
                    <CommandEmpty>Sin resultados.</CommandEmpty>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
