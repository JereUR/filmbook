'use client'

import { Dispatch, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TournamentData } from "@/lib/types"
import AddPartcipantForm from "./editor/AddParticipantForm"
import AssignEditParticipantForm from "./editor/AssignEditParticipantForm"
import { useQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"

interface AddEditParticipantDialogProps {
  openDialog: boolean
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>
}

export default function AddEditAssignParticipantDialog({ openDialog, setOpenDialog }: AddEditParticipantDialogProps) {
  const [tournaments, setTournaments] = useState<TournamentData[]>([])

  const {
    data,
    isFetching,
    status,
  } = useQuery({
    queryKey: ["all-tournaments"],
    queryFn: () =>
      kyInstance
        .get(
          `/api/tournaments/all`,
        )
        .json<TournamentData[]>(),
    initialData: [],
  })

  useEffect(() => {
    if (data && data.length > 0) {
      setTournaments(data)
    }
  }, [data])

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="z-[150] min-w-[50vw] max-w-[900px] max-h-[600px] overflow-y-auto scrollbar-thin" aria-labelledby="add-participant-title"
        aria-describedby="add-participant-description">
        <DialogHeader className='border-b border-primary/40 border-rounded'>
          <DialogTitle id="add-participant-title" className="text-center mb-4 text-xl font-semibold">AGREGAR/EDITAR PARTICIPANTE</DialogTitle>
        </DialogHeader>
        {!isFetching ? <div>
          <AddPartcipantForm tournaments={tournaments} />
          <hr className='mx-2 md:mx-5 my-2 md:my-4 border-[1px] border-primary/40 rounded' />
          <AssignEditParticipantForm tournaments={tournaments} />
        </div> :
          <div className="flex items-center gap-2"><Loader2 className="animate-spin" />Cargando torneos...</div>}
        {status === 'error' ? <div className="flex items-center gap-2">
          Error al cargar los torneos
        </div> : null}
      </DialogContent>
    </Dialog>
  )
}
