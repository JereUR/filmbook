
import { WatchlistData } from "@/lib/types";
import { useDeleteWatchlistItemMutation } from "./mutation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";

interface DeleteWatchlistItemDialogProps {
  item: WatchlistData
  open: boolean;
  onClose: () => void;
}

export default function DeleteWatchlistItemDialog({
  item,
  open,
  onClose,
}: DeleteWatchlistItemDialogProps) {
  const mutation = useDeleteWatchlistItemMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover película?</DialogTitle>
          <DialogDescription>
            {`Estas seguro que quieres remover a '${item.movie.title}' de tu watchlist? Esta acción no
            se puede deshacer.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(item.id, { onSuccess: onClose })}
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
