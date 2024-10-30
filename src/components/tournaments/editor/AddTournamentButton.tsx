'use client'

import { BadgePlusIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import AddEditTournamentDialog from '../AddEditTournamentDialog'

export interface InputProps {
  name: string
  description?: string
  onEdit: boolean
  id: string
}

export default function AddTournamentButton() {
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  return (
    <div>
      <Button className='flex items-center gap-2 md:gap-4 ' onClick={() => setOpenDialog(true)}>
        <BadgePlusIcon /> Agregar torneo
      </Button>
      <AddEditTournamentDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </div>
  )
}
