

import { DiaryInfo } from "@/lib/types";
import { useDeleteDiaryItemMutation } from "./mutation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";

interface DeleteDiaryItemDialogProps {
  diaryItem: DiaryInfo;
  open: boolean;
  onClose: () => void;
}

export default function DeleteDiaryItemDialog({
  diaryItem,
  open,
  onClose,
}: DeleteDiaryItemDialogProps) {
  const mutation = useDeleteDiaryItemMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover película de bitácora?</DialogTitle>
          <DialogDescription>
            {`Estas seguro que quieres remover la película '${diaryItem.movie.title}' de tu bitácora? Esta acción no
            se puede deshacer.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(diaryItem.id, { onSuccess: onClose })}
            loading={mutation.isPending}
          >
            Borrar
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
