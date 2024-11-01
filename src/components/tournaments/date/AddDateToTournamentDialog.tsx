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
  const { date } = input

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="z-[150] max-w-[600px] max-h-[600px] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-center mb-4 text-xl font-semibold">AGREGAR FECHA</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <Label htmlFor="dateInput" className="block text-md font-medium text-gray-700 mb-1">
              Número de Fecha
            </Label>
            <Input
              id="dateInput"
              type="number"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInput({ ...input, date: parseInt(e.target.value) })
              }
              placeholder="Número de fecha"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40 no-spinner"
            />
          </div>
          <div>
            <SearchMovieForDate selectedMovieId={selectedMovieId} setSelectedMovieId={setSelectedMovieId} />
          </div>
          <div className="flex justify-end items-center gap-2">
            <Button variant='outline' onClick={() => setOpenDialog(false)}>Cancelar</Button>
            {/* <LoadingButton
              onClick={onSubmitAdd} // Reemplaza con tu función de submit
              loading={loading}
              disabled={!date || !selectedMovieId}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Agregar
            </LoadingButton> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
