import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDeleteTournamentParticipantMutation } from "./mutations"

interface DeleteParticipantDialogProps {
  participantId: string | null
  open: boolean
  onClose: () => void
  clearData: () => void
}

export default function DeleteParticipantDialog({
  participantId,
  open,
  onClose,
  clearData
}: DeleteParticipantDialogProps) {
  const mutation = useDeleteTournamentParticipantMutation()

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose()
    }
  }

  if (!participantId) { return null }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='z-[250]'>
        <DialogHeader>
          <DialogTitle>Borrar participante?</DialogTitle>
          <DialogDescription>
            {`Estas seguro que quieres eliminar al participante? Esta acción no
            se puede deshacer.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(participantId, {
              onSuccess: () => {
                onClose()
                clearData()
              }
            })}
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
