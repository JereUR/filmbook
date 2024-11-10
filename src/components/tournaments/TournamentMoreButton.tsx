import { useState } from "react"
import { CalendarCog, CalendarPlus, Edit2, MoreHorizontal, Trash2 } from "lucide-react"

import { TournamentData } from "@/lib/types"
import DeleteTournamentDialog from "./DeleteTournamentDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import AddEditTournamentDialog from "./AddEditTournamentDialog"
import { InputTournamentProps } from "./editor/AddTournamentButton"
import AddDateToTournamentDialog from "./dates/AddDateToTournamentDialog"
import EditDateToTournamentDialog from "./dates/EditDateToTournamentDialog"

interface TournamentMoreButtonProps {
  tournament: TournamentData
  className?: string
}

export default function TournamentMoreButton({
  tournament,
  className,
}: TournamentMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [showAddDateDialog, setShowAddDateDialog] = useState<boolean>(false)
  const [showEditDateDialog, setShowEditDateDialog] = useState<boolean>(false)

  const tournamentToEdit: InputTournamentProps = {
    id: tournament.id,
    name: tournament.name,
    description: tournament.description || '',
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setShowAddDateDialog(true)}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-3 font-bold text-foreground">
              <CalendarPlus className="size-4 text-green-500 dark:text-green-600" />
              Agregar fecha
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowEditDateDialog(true)}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-3 font-bold text-foreground">
              <CalendarCog className="size-4 text-orange-500 dark:text-orange-600" />
              Editar fecha
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowEditDialog(true)}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-3 font-bold text-foreground">
              <Edit2 className="size-4 text-sky-500 dark:text-sky-600" />
              Editar torneo
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-3 font-bold text-foreground">
              <Trash2 className="size-4 text-destructive" />
              Borrar
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteTournamentDialog
        tournament={tournament}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
      <AddEditTournamentDialog openDialog={showEditDialog} setOpenDialog={setShowEditDialog} initialData={tournamentToEdit} onEdit={true} />
      <AddDateToTournamentDialog tournamentId={tournament.id} openDialog={showAddDateDialog} setOpenDialog={setShowAddDateDialog} />
      <EditDateToTournamentDialog tournamentId={tournament.id} openDialog={showEditDateDialog} setOpenDialog={setShowEditDateDialog} />
    </div>
  )
}
