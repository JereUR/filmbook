"use client"

import { Dispatch, useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { InputAssignPointsProps, ParticipantsData, TournamentParticipantData } from "@/lib/types"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/LoadingButton"
import { useToast } from "@/components/ui/use-toast"
import ErrorText from "@/components/ErrorText"
import { Button } from "@/components/ui/button"
import ParticipantPopover from "./ParticipantPopover"
import TournamentParticipantPopover from "./TournamentParticipantPopovers"
import { ArrowUp } from "lucide-react"

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

interface ErrorsForm {
  points: string | null
  extraPoints: string | null
}

const initialErrors: ErrorsForm = {
  points: null,
  extraPoints: null,
}

export default function AssignPointsDialog({ openDialog, setOpenDialog }: AssignPointsDialogProps) {
  const [input, setInput] = useState<InputAssignPointsProps>(initialState)
  const [participants, setParticipants] = useState<ParticipantsData[]>([])
  const [loadingParticipants, setLoadingParticipants] = useState<boolean>(false)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [errorsForm, setErrorsForm] = useState<ErrorsForm>(initialErrors)

  const { participantId, tournamentId, dateId, points, extraPoints } = input

  const { toast } = useToast()

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoadingParticipants(true)
      try {
        const response = await fetch("/api/tournaments/participants")
        if (!response.ok) {
          throw new Error("Error al obtener participantes")
        }
        const data = await response.json()
        setParticipants(data)
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Error al obtener participantes. Por favor vuelve a intentarlo.",
        })
      } finally {
        setLoadingParticipants(false)
      }
    }
    fetchParticipants()
  }, [toast])

  function validations() {
    const errors: ErrorsForm = initialErrors
    if (points < 0) errors.points = "Los puntos no pueden ser negativos"
    if (extraPoints && extraPoints < 0) errors.extraPoints = "Los puntos extra no pueden ser negativos"
    return errors
  }

  async function onSubmit() {
    const error = validations()
    if (error !== initialErrors) {
      setErrorsForm(error)
      return
    }
    setErrorsForm(initialErrors)
    setLoadingSubmit(true)

    setLoadingSubmit(false)
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="z-[150] min-w-[50vw] max-w-[900px] max-h-[600px] overflow-y-auto scrollbar-thin">
        <DialogHeader className="border-b border-primary/40">
          <DialogTitle className="text-center mb-4 text-xl font-semibold">
            ASIGNAR PUNTOS
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-500 mb-4">
          Ingresa los puntos y puntos extras que deseas asignar al participante.
        </div>
        <div className="space-y-2 md:space-y-5">
          <ParticipantPopover participants={participants} loadingParticipants={loadingParticipants} participantIdSelected={participantId} setInput={setInput} />
          {participantId ? <TournamentParticipantPopover participantId={participantId} tournamentIdSelected={tournamentId} dateIdSelected={dateId} setInput={setInput} /> : <span className="flex items-center gap-2">Seleccione un participante <ArrowUp /></span>}
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <Label htmlFor="pointsInput" className="block text-md font-medium text-gray-700">
                Puntos
              </Label>
              <Input
                id="pointsInput"
                type="number"
                value={points}
                onChange={(e) => setInput({ ...input, points: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300"
              />
              {errorsForm.points && <ErrorText errorText={errorsForm.points} />}
            </div>
            <div className="flex-1">
              <Label htmlFor="extraPointsInput" className="block text-md font-medium text-gray-700">
                Puntos extras
              </Label>
              <Input
                id="extraPointsInput"
                type="number"
                value={extraPoints}
                onChange={(e) => setInput({ ...input, extraPoints: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300"
              />
              {errorsForm.extraPoints && <ErrorText errorText={errorsForm.extraPoints} />}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <LoadingButton
              onClick={onSubmit}
              loading={loadingSubmit}
              disabled={!participantId || !tournamentId || !dateId || points === 0}
              className="bg-green-500 text-white"
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
