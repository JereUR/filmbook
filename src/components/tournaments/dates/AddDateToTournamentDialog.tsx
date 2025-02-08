import { Dispatch, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import './styles.css'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { InputDateTournamentProps } from "@/lib/types"
import SearchMovieForDate from "./SearchMovieForDate"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/LoadingButton"
import { useToast } from "@/components/ui/use-toast"
import ErrorText from "@/components/ErrorText"
import { Textarea } from "@/components/ui/textarea"

interface AddDateToTournamentDialogProps {
  tournamentId: string
  openDialog: boolean
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>
}

export const initialState: InputDateTournamentProps = {
  dateId: null,
  date: 0,
  name: undefined,
  movieId: '',
  visible: false,
  extraPoints: false,
  extraPointsSolution: null
}

export default function AddDateToTournamentDialog({ tournamentId, openDialog, setOpenDialog }: AddDateToTournamentDialogProps) {
  const [input, setInput] = useState<InputDateTournamentProps>(initialState)
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [errorDate, setErrorDate] = useState<string | null>(null)
  const { date, name, visible, extraPoints, extraPointsSolution } = input

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
      const response = await fetch(`/api/tournaments/dates/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, name, tournamentId, movieId: selectedMovieId, visible, extraPoints, extraPointsSolution }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al agregar la fecha")
      }
      toast({
        description: "Fecha agregada al torneo.",
      })

      await queryClient.invalidateQueries({ queryKey: ["tournaments"] })
      await queryClient.invalidateQueries({ queryKey: ["dates", tournamentId] })

      setOpenDialog(false)
      setInput(initialState)
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error instanceof Error
            ? error.message
            : "Error al agregar la fecha al torneo. Por favor vuelve a intentarlo.",
      })
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
        <div className="relative space-y-3 md:space-y-5">
          <div className='flex gap-8 items-center'>
            <div>
              <div className="flex gap-2 items-center">
                <Label htmlFor="dateInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
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
              <div className="flex gap-2 items-center">
                <Label htmlFor="nameInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
                  Nombre especial
                </Label>
                {errorDate && <ErrorText errorText={errorDate} className="text-xs md:text-sm animate-pulse" />}
              </div>
              <Input
                id="nameInput"
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput({ ...input, name: e.target.value })
                }
                placeholder="Nombre especial"
                className="w-[50vw] md:w-[20vw] rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40 no-spinner"
              />
            </div>
          </div>
          <div className="flex gap-4 md:gap-8 items-start md:items-center w-full">
            <div className='w'>
              <div className="flex gap-2 items-center">
                <Label htmlFor="visibleInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
                  Visible?
                </Label>
                {errorDate && <ErrorText errorText={errorDate} className="text-xs md:text-sm animate-pulse" />}
              </div>
              <label className="switch-visible">
                <input
                  id="visibleInput"
                  type="checkbox"
                  checked={visible}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInput({ ...input, visible: e.target.checked })
                  }
                  className="input-visible"
                />
                <span className="slider-visible"></span>
              </label>
            </div>
            <div>
              <div className="flex gap-2 items-center">
                <Label htmlFor="extraPointsInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
                  Puntos extras?
                </Label>
              </div>
              <label className="switch-visible">
                <input
                  id="extraPointsInput"
                  type="checkbox"
                  checked={extraPoints}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInput({ ...input, extraPoints: e.target.checked })
                  }
                  className="input-visible"
                />
                <span className="slider-visible"></span>
              </label>
            </div>

          </div>
          <div className="w-3/5 md:w-4/5">
            <Label htmlFor="extraPointsSolutionInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
              Solución puntos extras (si corresponde)
            </Label>
            <Textarea
              id="extraPointsSolutionInput"
              rows={3}
              className="resize-none placeholder:text-muted-foreground/40"
              value={extraPointsSolution ? extraPointsSolution : ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setInput({ ...input, extraPointsSolution: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="movieInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
              Película
            </Label>
            <SearchMovieForDate selectedMovieId={selectedMovieId} setSelectedMovieId={setSelectedMovieId} />
          </div>
          <div className="absolute top-48 right-0 md:top-32 md:right-10">
            <div className="flex flex-col justify-center items-end gap-2 w-full">
              <LoadingButton
                onClick={onSubmit}
                loading={loading}
                disabled={!date || !selectedMovieId}
                className="bg-green-500 text-white hover:bg-green-600 w-full"
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
