
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import LoadingButton from "../LoadingButton"
import { Button } from "../ui/button"
import { TournamentData } from "@/lib/types"
import { useDeleteTournamentMutation } from "./mutation"

interface DeleteTournamentDialogProps {
  tournament: TournamentData
  open: boolean
  onClose: () => void
}

export default function DeleteTournamentDialog({
  tournament,
  open,
  onClose,
}: DeleteTournamentDialogProps) {
  const mutation = useDeleteTournamentMutation()

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Borrar torneo?</DialogTitle>
          <DialogDescription>
            {`Estas seguro que quieres eliminar el torneo '${tournament.name}'? Esta acción no
            se puede deshacer.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(tournament.id, { onSuccess: onClose })}
            loading={mutation.isPending}
          >
            Borrar
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
