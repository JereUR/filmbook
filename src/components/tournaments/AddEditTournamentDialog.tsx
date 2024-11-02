import { Dispatch, useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import LoadingButton from '@/components/LoadingButton'
import { InputTournamentProps } from "./editor/AddTournamentButton"
import { Button } from "../ui/button"
import { useSubmitTournamentMutation, useUpdateTournamentMutation } from "./editor/mutations"

interface AddEditTournamentDialogProps {
  openDialog: boolean
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>
  initialData?: InputTournamentProps
  onEdit: boolean
}

const initialState: InputTournamentProps = {
  name: '',
  description: '',
}

export default function AddEditTournamentDialog({ openDialog, setOpenDialog, initialData, onEdit }: AddEditTournamentDialogProps) {

  const [input, setInput] = useState<InputTournamentProps>(initialData || initialState)
  const { name, description, id } = input

  const mutationAdd = useSubmitTournamentMutation()
  const mutationEdit = useUpdateTournamentMutation()

  useEffect(() => {
    if (initialData) {
      setInput(initialData)
    } else {
      setInput(initialState)
    }
  }, [initialData])

  function onSubmitAdd() {
    mutationAdd.mutate(
      {
        name,
        description,
      },
      {
        onSuccess: () => {
          setInput(initialState)
          setOpenDialog(false)
        },
      },
    )
  }

  function onSubmitEdit() {
    mutationEdit.mutate(
      {
        id,
        name,
        description,
      },
      {
        onSuccess: () => {
          setInput(initialState)
          setOpenDialog(false)
        },
      },
    )
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="z-[150] max-w-[600px] max-h-[600px] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-center mb-2 md:mb-4">{onEdit ? 'EDITAR TORNEO' : 'AGREGAR TORNEO'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <Input
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput({ ...input, name: e.target.value })
            }
            placeholder="Nombre del torneo"
            className="rounded-l-md border border-muted py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40"
          />
          <Textarea
            placeholder="Descripción (opcional)"
            rows={6}
            className="resize-none placeholder:text-muted-foreground/40"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInput({ ...input, description: e.target.value })
            }
          />
          <div className="flex justify-end items-center gap-2">
            <LoadingButton
              onClick={onEdit ? onSubmitEdit : onSubmitAdd}
              loading={onEdit ? mutationEdit.isPending : mutationAdd.isPending}
              disabled={!name.trim()}
              className={`min-w-20 ${onEdit ? 'bg-sky-500 dark:bg-sky-600 hover:bg-sky-600 dark:hover:bg-sky-700' : 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700'}`}
            >
              {onEdit ? 'Editar' : 'Agregar'}
            </LoadingButton>
            <Button variant='outline' onClick={() => setOpenDialog(false)}>Cancelar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
