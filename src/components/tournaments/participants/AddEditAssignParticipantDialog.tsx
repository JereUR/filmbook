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
import { useToast } from "@/components/ui/use-toast"
import AssignEditParticipantForm from "./editor/AssignEditParticipantForm"

interface AddEditParticipantDialogProps {
  openDialog: boolean
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>
}

export default function AddEditAssignParticipantDialog({ openDialog, setOpenDialog }: AddEditParticipantDialogProps) {
  const [tournaments, setTournaments] = useState<TournamentData[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { toast } = useToast()

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/tournaments/all")
        const data = await response.json()
        setTournaments(data)
      } catch (error) {
        toast({
          variant: 'destructive',
          description: "Error al cargar los torneos"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchTournaments()
  }, [])

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="z-[150] min-w-[50vw] max-w-[900px] max-h-[600px] overflow-y-auto scrollbar-thin" aria-labelledby="add-participant-title"
        aria-describedby="add-participant-description">
        <DialogHeader className='border-b border-primary/40 border-rounded'>
          <DialogTitle id="add-participant-title" className="text-center mb-4 text-xl font-semibold">AGREGAR/EDITAR PARTICIPANTE</DialogTitle>
        </DialogHeader>
        {!loading ? <div>
          <AddPartcipantForm tournaments={tournaments} />
          <hr className='mx-2 md:mx-5 my-2 md:my-4 border-[1px] border-primary/40 rounded' />
          <AssignEditParticipantForm tournaments={tournaments} />
        </div> :
          <div className="flex items-center gap-2"><Loader2 className="animate-spin" />Cargando torneos...</div>}
      </DialogContent>
    </Dialog>
  )
}
