import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

interface DeleteDateDialogProps {
  id: string | null
  tournamentId: string
  open: boolean
  onClose: () => void
  clearData: () => void
}

export default function DeleteDateDialog({
  id,
  tournamentId,
  open,
  onClose,
  clearData
}: DeleteDateDialogProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose()
    }
  }

  async function onSubmit() {
    if (!id) {
      toast({
        variant: "destructive",
        description: "No se ha seleccionado una fecha válida para eliminar.",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/tournaments/dates/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar la fecha.")
      }

      toast({
        description: "Fecha del torneo eliminada con éxito.",
      })

      await queryClient.invalidateQueries({ queryKey: ["tournaments"] })
      await queryClient.invalidateQueries({ queryKey: ["dates", tournamentId] })

      clearData()
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Error al eliminar la fecha.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='z-[250]'>
        <DialogHeader>
          <DialogTitle>Eliminar Fecha</DialogTitle>
          <DialogDescription>
            Estas seguro que quieres eliminar la fecha? Esta acción no
            se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <LoadingButton
            onClick={onSubmit}
            loading={loading}
            className="bg-red-500 text-foreground hover:bg-red-600"
          >
            Eliminar
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
