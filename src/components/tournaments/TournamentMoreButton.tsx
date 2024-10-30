import { useState } from "react"
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react"

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
            onClick={() => setShowEditDialog(true)}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-3 font-bold text-foreground">
              <Edit2 className="size-4 text-sky-500 dark:text-sky-600" />
              Editar
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
      <AddEditTournamentDialog openDialog={showEditDialog} setOpenDialog={setShowEditDialog} initialData={{ name: tournament.name, description: tournament.description || '', onEdit: true, id: '' }} onEdit={true}/>
    </div>
  )
}
