'use client'

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import ErrorText from "@/components/ErrorText";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { InputTournamentParticipantProps, ParticipantsData, TournamentData } from "@/lib/types";
import ParticipantEditPopover from "./ParticipantEditPopover";
import kyInstance from "@/lib/ky";
import DeleteParticipantDialog from "./DeleteParticipantDialog";

interface AssignEditParticipantFormProps {
  tournaments: TournamentData[]
}

const initialState: InputTournamentParticipantProps = {
  name: "",
  username: "",
  tournamentsId: [],
}

interface ErrorsForm {
  name: string | null
  username: string | null
  tournamentsId: string | null
}

const initialErrors: ErrorsForm = {
  name: null,
  username: null,
  tournamentsId: null,
}

export default function AssignEditParticipantForm({ tournaments }: AssignEditParticipantFormProps) {
  const [participants, setParticipants] = useState<ParticipantsData[]>([])
  const [participantIdSelected, setParticipantIdSelected] = useState<string | null>(null)
  const [input, setInput] = useState<InputTournamentParticipantProps>(initialState)
  const [tournamentsIdSelected, setTournamentsIdSelected] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingParticipants, setLoadingParticipants] = useState<boolean>(false)
  const [loadingParticipantTournaments, setLoadingParticipantTournaments] = useState<boolean>(false)
  const [errorsForm, setErrorsForm] = useState<ErrorsForm>(initialErrors)
  const [open, setOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const { name, username } = input

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    data,
    isFetching,
    status,
  } = useQuery({
    queryKey: ["all-participants"],
    queryFn: () =>
      kyInstance
        .get(
          "/api/tournaments/participants",
        )
        .json<ParticipantsData[]>(),
    initialData: [],
  })

  useEffect(() => {
    if (data) {
      setParticipants(data)
    }
  }, [data])

  useEffect(() => {
    const fetchTournamentsForParticipants = async () => {
      if (!participantIdSelected) return

      setLoadingParticipantTournaments(true)
      try {
        const response = await fetch(`/api/tournaments/participants/${participantIdSelected}/only-tournaments`)
        const data = await response.json()
        setTournamentsIdSelected(data)
      } catch (error) {
        toast({
          variant: 'destructive',
          description: "Error al cargar los torneos del participante seleccionado"
        })
      } finally {
        setLoadingParticipantTournaments(false)
      }
    }

    fetchTournamentsForParticipants()

  }, [participantIdSelected])

  function validations() {
    let error: ErrorsForm = initialErrors
    if (!name) {
      error.name = "Nombre es obligatorio"
    }

    if (name.length > 30) {
      error.name = "El nombre no puede tener más de 30 caracteres"
    }

    if (username && username.length > 30) {
      error.username = "El nombre de usuario no puede tener más de 30 caracteres"
    }

    if (!tournamentsIdSelected.length) {
      error.tournamentsId = "Debe seleccionar al menos un torneo"
    }

    return error
  }

  const clearData = () => {
    setInput(initialState)
    setParticipantIdSelected(null)
    setTournamentsIdSelected([])
  }

  const handleTournamentClick = (tournamentId: string) => {
    setTournamentsIdSelected(prevSelected =>
      prevSelected.includes(tournamentId)
        ? prevSelected.filter(id => id !== tournamentId)
        : [...prevSelected, tournamentId]
    );
  };

  const getSelectedTournamentsNames = () => {
    return tournaments
      .filter(tournament => tournamentsIdSelected.includes(tournament.id))
      .map(tournament => tournament.name)
      .join(', ');
  };


  async function onSubmitEdit() {
    const error = validations()
    if (error !== initialErrors) {
      setErrorsForm(error)
      return
    }
    setErrorsForm(initialErrors)

    setLoading(true)
    try {
      const response = await fetch(`/api/tournaments/participants/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: participantIdSelected, name, username, tournamentsId: tournamentsIdSelected }),
      })
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al editar participante");
      }
      toast({
        description: "Participante editado.",
      })

      await queryClient.invalidateQueries({ queryKey: ["tournaments"] })
      await queryClient.invalidateQueries({ queryKey: ["all-participants"] })

      clearData()
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error instanceof Error
            ? error.message
            : "Error al editar participante. Por favor vuelve a intentarlo.",
      });
    } finally {
      setLoading(false)
    }
  }

  if (status === 'error') {
    toast({
      variant: 'destructive',
      description: "Error al cargar los participantes"
    })
    return null
  }

  if (isFetching) {
    return (
      <p className='flex text-xs md:text-sm text-muted-foreground/40 items-center gap-2'><Loader2 className='animate-spin' /> Cargando participantes...</p>
    )
  }

  if (loadingParticipantTournaments) {
    return (
      <p className='flex text-xs md:text-sm text-muted-foreground/40 items-center gap-2'><Loader2 className='animate-spin' /> Buscando torneos en los que participa</p>
    )
  }

  return (
    <div className="space-y-2 md:space-y-5">
      <h2 className="text-lg font-light">Editar participante</h2>
      {participants.length > 0 && <div className="flex flex-col w-full gap-4">
        <ParticipantEditPopover participants={participants} loadingParticipants={loadingParticipants} participantIdSelected={participantIdSelected} setParticipantIdSelected={setParticipantIdSelected} setInput={setInput} />
        <div className="flex w-full gap-4">
          <div className="flex-1">
            <div className="flex gap-2 items-center">
              <Label htmlFor="nameInput" className="block text-md font-medium text-gray-700 mb-1">
                Nombre (Usuario Instagram)
              </Label>
              {errorsForm.name && <ErrorText errorText={errorsForm.name} className="text-xs md:text-sm animate-pulse" />}
            </div>
            <Input
              id="nameInput"
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInput({ ...input, name: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40 no-spinner"
            />
          </div>
          <div className="flex-1">
            <div className="flex gap-2 items-center">
              <Label htmlFor="usernameInput" className="block text-md font-medium text-gray-700 mb-1">
                Username (Si está registrado en Filmbook)
              </Label>
            </div>
            <Input
              id="usernameInput"
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInput({ ...input, username: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40 no-spinner"
            />
          </div>
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <Label htmlFor="tournamentsInput" className="block text-md font-medium text-gray-700 mb-1">
              Torneos en los que participa
            </Label>
            {tournamentsIdSelected.length > 0 && (
              <div className="mb-2 text-xs md:text-sm text-primary border border-primary/40 rounded-2xl p-2">
                Seleccionados: {getSelectedTournamentsNames()}
              </div>
            )}
            {errorsForm.tournamentsId && <ErrorText errorText={errorsForm.tournamentsId} className="text-xs md:text-sm animate-pulse" />}
          </div>
          {!loadingParticipantTournaments ? <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              asChild
              className="border border-primary/40 bg-background text-xs hover:bg-background/50 md:text-sm z-[200]"
            >
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="min-w-[250px] justify-between"
              >
                Seleccionar torneos <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-2 z-[200] border border-primary/40">
              <Command className="max-h-[300px]">
                <CommandInput placeholder="Buscar torneo..." />
                <CommandList className="scrollbar-thin overflow-auto">
                  <CommandEmpty>Sin resultados.</CommandEmpty>
                  <CommandGroup heading="Torneos">
                    {Array.isArray(tournaments) && tournaments.length > 0 ? (
                      tournaments.map((tournament) => (
                        <CommandItem key={tournament.id} className={`data-[selected='true']:bg-transparent`}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left"
                            onClick={() => handleTournamentClick(tournament.id)}
                          >
                            <div className="flex items-center gap-2">
                              {tournament.name}
                              {tournamentsIdSelected.includes(tournament.id) && (
                                <Check className="ml-auto h-4 w-4 text-green-600" />
                              )}
                            </div>
                          </Button>
                        </CommandItem>
                      ))
                    ) : (
                      <CommandEmpty>Sin resultados.</CommandEmpty>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover> : <div className="flex items-center gap-2"><Loader2 className="animate-spin" />Cargando torneos en los que participa...</div>}
        </div>
      </div>}
      <div className="flex justify-end items-center gap-2">
        <LoadingButton
          onClick={onSubmitEdit}
          loading={loading}
          disabled={!name || tournamentsIdSelected.length === 0}
          className="bg-sky-500 text-white hover:bg-sky-600"
        >
          Editar
        </LoadingButton>
        {participantIdSelected && (
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700"
          >
            Eliminar participante
          </Button>
        )}
      </div>
      <DeleteParticipantDialog participantId={participantIdSelected} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} clearData={clearData} />
    </div>
  )
}