import { Dispatch, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from "../../ui/button"
import { InputDateTournamentProps } from "@/lib/types"
import SearchMovieForDate from "./SearchMovieForDate"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/LoadingButton"
import { useToast } from "@/components/ui/use-toast"
import ErrorText from "@/components/ErrorText"
import { useQueryClient } from "@tanstack/react-query"

interface AddDateToTournamentDialogProps {
  tournamentId: string
  openDialog: boolean
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>
}

const initialState: InputDateTournamentProps = {
  date: 1,
  movieId: '',
}

export default function AddDateToTournamentDialog({ tournamentId, openDialog, setOpenDialog }: AddDateToTournamentDialogProps) {
  const [input, setInput] = useState<InputDateTournamentProps>(initialState)
  const [selectedMovieId, setSelectedMovieId] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [errorDate, setErrorDate] = useState<string | null>(null)
  const { date } = input

  const { toast } = useToast()
  const queryClient = useQueryClient()

  function validations() {
    let error = null
    if (date <= 0) {
      error = "La fecha debe ser mayor a 0"
    }
    return error
  }

  async function onSubmit() {
    const error = validations()
    if (error) {
      setErrorDate(error)
      return
    }
    setErrorDate(null)

    setLoading(true)
    try {
      const response = await fetch(`/api/tournament/date/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, tournamentId, movieId: selectedMovieId }),
      })
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al agregar la fecha");
      }
      toast({
        description: "Fecha agregada al torneo.",
      })

      await queryClient.invalidateQueries({ queryKey: ["tournaments"] })

      setOpenDialog(false)
      setInput(initialState)
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error instanceof Error
            ? error.message
            : "Error al agregar la fecha al torneo. Por favor vuelve a intentarlo.",
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="z-[150] min-w-[50vw] max-w-[900px] max-h-[600px] overflow-y-auto scrollbar-thin">
        <DialogHeader className='border-b border-primary/40 border-rounded'>
          <DialogTitle className="text-center mb-4 text-xl font-semibold">AGREGAR FECHA</DialogTitle>
        </DialogHeader>
        <div className="relative space-y-2 md:space-y-5">
          <div>
            <div className="flex gap-2 items-center">
              <Label htmlFor="dateInput" className="block text-md font-medium text-gray-700 mb-1">
                Número de Fecha
              </Label>
              {errorDate && <ErrorText errorText={errorDate} className="text-xs md:text-sm animate-pulse" />}
            </div>
            <Input
              id="dateInput"
              type="number"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInput({ ...input, date: parseInt(e.target.value) })
              }
              placeholder="Número de fecha"
              className="w-[20vw] rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40 no-spinner"
            />
          </div>
          <div>
            <Label htmlFor="movieInput" className="block text-md font-medium text-gray-700 mb-1">
              Película
            </Label>
            <SearchMovieForDate selectedMovieId={selectedMovieId} setSelectedMovieId={setSelectedMovieId} />
          </div>
          <div className="absolute top-5 right-10">
            <div className="flex justify-end items-center gap-2">
              <LoadingButton
                onClick={onSubmit}
                loading={loading}
                disabled={!date || !selectedMovieId}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Agregar
              </LoadingButton>
              <Button variant='outline' onClick={() => setOpenDialog(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
