import LoadingButton from "@/components/LoadingButton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReviewInfo } from "@/lib/types";
import { useDeleteReviewMutation } from "./mutation";
import { Button } from "@/components/ui/button";

interface DeleteReviewDialogProps {
  review: ReviewInfo;
  open: boolean;
  onClose: () => void;
}

export default function DeleteReviewDialog({
  review,
  open,
  onClose,
}: DeleteReviewDialogProps) {
  const mutation = useDeleteReviewMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Borrar review?</DialogTitle>
          <DialogDescription>
            Estas seguro que quieres eliminar esta review? Esta acción no
            se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(review.id, { onSuccess: onClose })}
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
  );
}
