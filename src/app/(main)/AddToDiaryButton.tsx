'use client'

import { CalendarPlus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DiarySearch from "@/components/diary/DiarySearch"
import DiaryForm from "@/components/diary/DiaryForm"
import { SearchMovie } from "@/lib/types"

export default function AddToDiaryButton() {
  const [open, setOpen] = useState<boolean>(false)
  const [onForm, setOnForm] = useState<boolean>(false)
  const [movies, setMovies] = useState<SearchMovie[]>([])
  const [movieToAdd, setMovieToAdd] = useState<SearchMovie | null>(null)

  function handleOpenChange(open: boolean) {
    if (!open) {
      setOpen(false)
      setMovies([])
      setOnForm(false)
      setMovieToAdd(null)
    }
  }

  return <div>
    <Button
      className="flex rounded-b-2xl rounded-t-none border-t-0 justify-center gap-2 items-center bg-green-500 dark:bg-green-600 hover:bg-green-600 hover:dark:bg-green-700 w-full"
      onClick={() => setOpen(true)}
    >
      <CalendarPlus className="size-5" /> Agregar a bitácora
    </Button>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="z-[150] max-w-[400px] md:max-w-[1200px] max-h-[600px] overflow-y-auto scrollbar-thin rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm md:text-base text-center">AGREGAR A BITÁCORA</DialogTitle>
        </DialogHeader>
        {!onForm ?
          <DiarySearch changeState={() => setOnForm(true)} setMovieToAdd={setMovieToAdd} movies={movies} setMovies={setMovies} />
          :
          <DiaryForm movie={movieToAdd} changeState={() => setOnForm(false)} handleOpenChange={handleOpenChange} />
        }
      </DialogContent>
    </Dialog>
  </div>
}
