'use client'

import { Dispatch, useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { InputAssignPointsProps, ParticipantsData, TournamentParticipantData } from "@/lib/types"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/LoadingButton"
import { useToast } from "@/components/ui/use-toast"
import ErrorText from "@/components/ErrorText"
import { Button } from "@/components/ui/button"
import ParticipantPopover from "./ParticipantPopover"

interface AssignPointsDialogProps {
  openDialog: boolean
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>
}

const initialState: InputAssignPointsProps = {
  tournamentId: "",
  dateId: '',
  participantId: "",
  points: 0,
  extraPoints: 0,
}

interface ErrorsForm {
  points: string | null
  extraPoints: string | null
}

const initialErrors: ErrorsForm = {
  points: null,
  extraPoints: null
}

export default function AssignPointsDialog({ openDialog, setOpenDialog }: AssignPointsDialogProps) {
  const [input, setInput] = useState<InputAssignPointsProps>(initialState)
  const [participants, setParticipants] = useState<ParticipantsData[]>([])
  const [tournamentsParticipant, setTournamentsParticipant] = useState<TournamentParticipantData[]>([])
  const [loadingParticipants, setLoadingParticipants] = useState<boolean>(false)
  const [loadingParticipantData, setLoadingParticipantData] = useState<boolean>(false)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [errorsForm, setErrorsForm] = useState<ErrorsForm>(initialErrors)
  const [openTournament, setOpenTournament] = useState<boolean>(false)
  const [openDate, setOpenDate] = useState<boolean>(false)

  const { participantId, tournamentId, dateId, points, extraPoints } = input

  const { toast } = useToast()

  console.log({ participants })
  console.log({ tournamentsParticipant })

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoadingParticipants(true)
      try {
        const response = await fetch("/api/tournaments/participants")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Error al obtener participantes")
        }
        const data = await response.json()
        setParticipants(data)
      } catch (error) {
        toast({
          variant: "destructive",
          description:
            error instanceof Error
              ? error.message
              : "Error al obtener participantes. Por favor vuelve a intentarlo.",
        })
      } finally {
        setLoadingParticipants(false)
      }

    }
    fetchParticipants()
  }, [])

  useEffect(() => {
    const fetchParticipantData = async () => {
      setLoadingParticipantData(true)
      try {
        const response = await fetch(`/api/tournaments/participants/${participantId}/tournaments`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Error al obtener los torneos del participante")

        }
        const data = await response.json()
        setTournamentsParticipant(data)
      } catch (error) {
        toast({
          variant: "destructive",
          description:
            error instanceof Error
              ? error.message
              : "Error al obtener los torneos del participante. Por favor vuelve a intentarlo.",
        })
      } finally {
        setLoadingParticipantData(false)
      }
    }

    if (participantId) {
      fetchParticipantData()
    }
  }, [participantId, toast])

  function validations() {
    let error: ErrorsForm = initialErrors

    if (points < 0) {
      error.points = "Los puntos no pueden ser negativos"
    }
    if (extraPoints && extraPoints < 0) {
      error.extraPoints = "Los puntos extra no pueden ser negativos"
    }

    return error
  }

  async function onSubmit() {
    const error = validations()
    if (error !== initialErrors) {
      setErrorsForm(error)
      return
    }
    setErrorsForm(initialErrors)

    setLoadingSubmit(true)
    /* try {
      const response = await fetch(`/api/tournaments/participants/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, tournamentsId: tournamentsIdSelected }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al agregar participante")
      }
      toast({
        description: "Participante agregado.",
      })

      await queryClient.invalidateQueries({ queryKey: ["tournaments"] })

      setOpenDialog(false)
      setInput(initialState)
      setTournamentsIdSelected([])
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error instanceof Error
            ? error.message
            : "Error al agregar participante. Por favor vuelve a intentarlo.",
      })
    } finally {
      setLoadingSubmit(false)
    } */
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent
        className="z-[150] min-w-[50vw] max-w-[900px] max-h-[600px] overflow-y-auto scrollbar-thin"
        aria-labelledby="assign-points-title"
        aria-describedby="assign-points-description"
      >
        <DialogHeader className="border-b border-primary/40 border-rounded">
          <DialogTitle id="assign-points-title" className="text-center mb-4 text-xl font-semibold">
            ASIGNAR PUNTOS
          </DialogTitle>
        </DialogHeader>
        <div id="assign-points-description" className="text-sm text-gray-500 mb-4">
          Ingresa los puntos y puntos extras que deseas asignar al participante.
        </div>
        <div className="space-y-2 md:space-y-5">
          <ParticipantPopover participants={participants} loadingParticipants={loadingParticipants} participantIdSelected={participantId} setInput={setInput} />
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <Label htmlFor="pointsInput" className="block text-md font-medium text-gray-700 mb-1">
                  Puntos
                </Label>
                {errorsForm.points && (
                  <ErrorText errorText={errorsForm.points} className="text-xs md:text-sm animate-pulse" />
                )}
              </div>
              <Input
                id="pointsInput"
                type="number"
                value={points}
                onChange={(e) => setInput({ ...input, points: parseInt(e.target.value) })}
                className="w-[20vw] rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40 no-spinner"
              />
            </div>
            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <Label htmlFor="extraPointsInput" className="block text-md font-medium text-gray-700 mb-1">
                  Puntos extras
                </Label>
              </div>
              <Input
                id="extraPointsInput"
                type="number"
                value={extraPoints}
                onChange={(e) => setInput({ ...input, extraPoints: parseInt(e.target.value) })}
                className="w-[20vw] rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40 no-spinner"
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-2">
            <LoadingButton
              onClick={onSubmit}
              loading={loadingSubmit}
              disabled={!participantId || !tournamentId || !dateId || points === 0}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Asignar
            </LoadingButton>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
