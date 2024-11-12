import { Dispatch, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"

import './styles.css'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from "../../ui/button"
import { DateForTournamentData, InputDateTournamentProps } from "@/lib/types"
import SearchMovieForDate from "./SearchMovieForDate"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/LoadingButton"
import { useToast } from "@/components/ui/use-toast"
import ErrorText from "@/components/ErrorText"
import { initialState } from "./AddDateToTournamentDialog"
import kyInstance from "@/lib/ky"
import DatesPopover from "./DatesPopover"
import noImage from '@/assets/no-image-film.jpg'
import { Textarea } from "@/components/ui/textarea"
import DeleteDateDialog from "./DeleteDateDialog"

interface EditDateToTournamentDialogProps {
  tournamentId: string
  openDialog: boolean
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>
}

export interface ShowMovie {
  id: string
  title: string
  posterPath: string | null
}

export default function EditDateToTournamentDialog({ tournamentId, openDialog, setOpenDialog }: EditDateToTournamentDialogProps) {
  const [input, setInput] = useState<InputDateTournamentProps>(initialState)
  const [originalMovie, setOriginalMovie] = useState<ShowMovie | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [errorDate, setErrorDate] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const { dateId, date, visible, extraPoints, extraPointsSolution } = input

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    data: dates,
    isFetching,
    status,
  } = useQuery({
    queryKey: ["dates", tournamentId],
    queryFn: () =>
      kyInstance
        .get(
          `/api/tournaments/${tournamentId}/dates`,
        )
        .json<DateForTournamentData[]>(),
    initialData: [],
  })

  function validations() {
    let error = null
    if (date <= 0) {
      error = "La fecha debe ser mayor a 0"
    }
    return error
  }

  const clearData = () => {
    setInput(initialState)
    setOriginalMovie(null)
    setSelectedMovieId(null)
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
      const response = await fetch(`/api/tournaments/dates/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateId, date, tournamentId, movieId: selectedMovieId ? selectedMovieId : originalMovie?.id, visible, extraPoints, extraPointsSolution }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al editar la fecha")
      }
      toast({
        description: "Fecha del torneo editada.",
      })

      await queryClient.invalidateQueries({ queryKey: ["dates", tournamentId] })

      setOpenDialog(false)
      clearData()
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error instanceof Error
            ? error.message
            : "Error al editar la fecha al torneo. Por favor vuelve a intentarlo.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="z-[150] min-w-[50vw] max-w-[900px] max-h-[600px] overflow-y-auto scrollbar-thin">
        <DialogHeader className='border-b border-primary/40 border-rounded'>
          <DialogTitle className="text-center mb-4 text-xl font-semibold">EDITAR FECHA</DialogTitle>
        </DialogHeader>
        <div className="relative space-y-2 md:space-y-5">
          {dates && dates.length > 0 && <DatesPopover dates={dates} loading={isFetching} input={input} setInput={setInput} setOriginalMovie={setOriginalMovie} status={status} />}
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
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center w-full">
            <div className="w-full md:w-1/5">
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
            <div className="w-full md:w-4/5">
              <Label htmlFor="extraPointsSolutionInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
                Solución puntos extras (si corresponde)
              </Label>
              <Textarea
                id="extraPointsSolutionInput"
                rows={3}
                className="w-4/5 resize-none placeholder:text-muted-foreground/40"
                value={extraPointsSolution ? extraPointsSolution : ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setInput({ ...input, extraPointsSolution: e.target.value })
                }
              />
            </div>
          </div>
          {originalMovie &&
            <div className='w-fit'>
              <h2 className="block text-md font-medium text-muted-foreground/40 mb-1">Película actual</h2>
              <div className="p-2 border rounded-2xl flex gap-4">
                <div className="my-auto flex-none">
                  <Image
                    src={originalMovie.posterPath ? originalMovie.posterPath : noImage}
                    alt={`${originalMovie.title} poster`}
                    width={50}
                    height={75}
                    className="rounded"
                  />
                </div>
                <h1 className="text-sm font-semibold">
                  <span className="line-clamp-2 whitespace-pre-line">{originalMovie.title}</span>
                </h1>
              </div>
            </div>}
          <div>
            <Label htmlFor="movieInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
              Película
            </Label>
            <SearchMovieForDate selectedMovieId={selectedMovieId} setSelectedMovieId={setSelectedMovieId} />
          </div>
          <div className="absolute top-5 right-10">
            <div className="flex justify-end items-center gap-2">
              <LoadingButton
                onClick={onSubmit}
                loading={loading}
                disabled={!dateId || !date}
                className="bg-sky-500 text-foreground hover:bg-sky-600"
              >
                Editar
              </LoadingButton>
              {dateId && (
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700"
                >
                  Eliminar fecha
                </Button>
              )}
            </div>
            <DeleteDateDialog id={dateId} tournamentId={tournamentId} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} clearData={clearData} />
          </div>
        </div>
      </DialogContent>
    </Dialog >
  )
}
