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
import { InputProps } from "./editor/AddTournamentButton"
import { useSubmitTournamenttMutation } from "./editor/mutation"
import { Button } from "../ui/button"

interface AddEditTournamentDialogProps {
  openDialog: boolean
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>
  initialData?: InputProps
  onEdit?: boolean
}

const initialState: InputProps = {
  name: '',
  description: '',
  onEdit: false,
  id: ''
}

export default function AddEditTournamentDialog({ openDialog, setOpenDialog, initialData, onEdit = false }: AddEditTournamentDialogProps) {

  const [input, setInput] = useState<InputProps>(initialData || initialState)
  const { name, description, id } = input

  const mutation = useSubmitTournamenttMutation()

  useEffect(() => {
    if (initialData) {
      setInput(initialData)
    } else {
      setInput(initialState)
    }
  }, [initialData])

  function onSubmit() {
    mutation.mutate(
      {
        name,
        description,
        onEdit: input.onEdit,
        id,
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
          <DialogTitle className="text-center mb-2 md:mb-4">{onEdit?'EDITAR TORNEO':'AGREGAR TORNEO'}</DialogTitle>
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
              onClick={onSubmit}
              loading={mutation.isPending}
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
