'use client'

import { CalendarPlus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SearchMovie from '@/components/movies/search/SearchMovie';

export default function AddToDiaryButton() {
  const [open, setOpen] = useState<boolean>(false)

  function handleOpenChange(open: boolean) {
    if (!open) {
      setOpen(false)
    }
  }

  return <div>
    <Button
      className="flex rounded-b-2xl rounded-t-none border-t-0 justify-center gap-2 items-center bg-green-500 dark:bg-green-600 hover:bg-green-600 hover:dark:bg-green-700 w-full"
      onClick={() => setOpen(true)}
    >
      <CalendarPlus className="size-5" /> Agregar a diario
    </Button>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[80vw] h-[80vh] max-w-[1200px] max-h-[600px] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Agregar a diario</DialogTitle>
        </DialogHeader>
        <SearchMovie toDiary={true} />
      </DialogContent>
    </Dialog>
  </div>
}
