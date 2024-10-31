import { Dispatch, useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import LoadingButton from '@/components/LoadingButton'
import { Button } from "../ui/button"
import { InputDateTournamentProps } from "@/lib/types"
import SearchMovieForDate from "./SearchMovieForDate"

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
  const { date, movieId } = input

  /* const mutationAdd = useSubmitTournamentMutation() */

  /* function onSubmitAdd() {
    mutationAdd.mutate(
      {
        date,
        tournamentId,
        movieId,
      },
      {
        onSuccess: () => {
          setInput(initialState)
          setOpenDialog(false)
        },
      },
    )
  } */

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="z-[150] max-w-[600px] max-h-[600px] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-center mb-2 md:mb-4">AGREGAR FECHA</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <Input
            type="number"
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput({ ...input, date: parseInt(e.target.value) })
            }
            placeholder="Número fecha"
            className="rounded-l-md border border-muted py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40"
          />
          <SearchMovieForDate setSelectedMovieId={setSelectedMovieId} />
          <div className="flex justify-end items-center gap-2">
            {/* <LoadingButton
              onClick={onEdit ? onSubmitEdit : onSubmitAdd}
              loading={onEdit ? mutationEdit.isPending : mutationAdd.isPending}
              disabled={!name.trim()}
              className={`min-w-20 ${onEdit ? 'bg-sky-500 dark:bg-sky-600 hover:bg-sky-600 dark:hover:bg-sky-700' : 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700'}`}
            >
              {onEdit ? 'Editar' : 'Agregar'}
            </LoadingButton> */}
            <Button variant='outline' onClick={() => setOpenDialog(false)}>Cancelar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
