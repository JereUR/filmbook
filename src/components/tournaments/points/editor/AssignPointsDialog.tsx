"use client"

import { Dispatch, useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { InputAssignPointsProps, ParticipantsData } from "@/lib/types"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/LoadingButton"
import { useToast } from "@/components/ui/use-toast"
import ErrorText from "@/components/ErrorText"
import { Button } from "@/components/ui/button"
import ParticipantPopover from "./ParticipantPopover"
import TournamentParticipantPopover from "./TournamentParticipantPopovers"
import { useQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"

interface AssignPointsDialogProps {
  openDialog: boolean
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>
}

const initialState: InputAssignPointsProps = {
  tournamentId: null,
  dateId: null,
  participantId: null,
  points: 0,
  extraPoints: 0,
}

export default function AssignPointsDialog({ openDialog, setOpenDialog }: AssignPointsDialogProps) {
  const [input, setInput] = useState<InputAssignPointsProps>(initialState)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [errorExtraPoints, setErrorExtraPoints] = useState<string | null>(null)

  const { participantId, tournamentId, dateId, points, extraPoints } = input

  const { toast } = useToast()

  const {
    data: participants,
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

  function onCloseDialog() {
    setOpenDialog(false)
    setInput(initialState)
    setErrorExtraPoints(null)
  }

  function validations() {
    let errors = null
    if (extraPoints && extraPoints < 0) errors = "Los puntos extra no pueden ser negativos"
    return errors
  }

  async function onSubmit() {
    const error = validations()
    if (error) {
      setErrorExtraPoints(error)
      return
    }
    setErrorExtraPoints(null)
    setLoadingSubmit(true)
    try {
      const response = await fetch(`/api/tournaments/participants/assign-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantId, tournamentId, dateId, points, extraPoints }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al asignar puntos al participante")
      }
      toast({
        description: "Puntos asignados.",
      })

      setOpenDialog(false)
      setInput(initialState)
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error instanceof Error
            ? error.message
            : "Error al asignar puntos al participante. Por favor vuelve a intentarlo.",
      })
    } finally {
      setLoadingSubmit(false)
    }
  }

  if (status === 'error') {
    toast({
      variant: 'destructive',
      description: 'Error al cargar los participantes'
    })
    return null
  }

  return (
    <Dialog open={openDialog} onOpenChange={onCloseDialog}>
      <DialogContent className="z-[150] min-w-[50vw] max-w-[900px] max-h-[600px] overflow-y-auto scrollbar-thin">
        <DialogHeader className="border-b border-primary/40">
          <DialogTitle className="text-center mb-4 text-xl font-semibold">
            ASIGNAR PUNTOS
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground/40 mb-4">
          Ingresa los puntos y puntos extras que deseas asignar al participante.
        </div>
        <div className="relative space-y-2 md:space-y-5">
          <ParticipantPopover participants={participants} loadingParticipants={isFetching} participantIdSelected={participantId} setInput={setInput} />
          {participantId && <TournamentParticipantPopover participantId={participantId} tournamentIdSelected={tournamentId} dateIdSelected={dateId} setInput={setInput} />}
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <Label htmlFor="pointsInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
                Puntos
              </Label>
              <Input
                id="pointsInput"
                type="number"
                value={points}
                onChange={(e) => setInput({ ...input, points: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300"
              />

            </div>
            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <Label htmlFor="extraPointsInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
                  Puntos extras
                </Label>
                {errorExtraPoints && <ErrorText className="text-xs md:text-sm animate-pulse" errorText={errorExtraPoints} />}
              </div>
              <Input
                id="extraPointsInput"
                type="number"
                value={extraPoints}
                onChange={(e) => setInput({ ...input, extraPoints: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300"
              />

            </div>
          </div>
          <div className="flex justify-end gap-2">
            <LoadingButton
              onClick={onSubmit}
              loading={loadingSubmit}
              disabled={!participantId || !tournamentId || !dateId || points <= 0}
              className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
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
