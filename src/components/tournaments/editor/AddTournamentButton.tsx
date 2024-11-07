'use client'

import { BadgePlusIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import AddEditTournamentDialog from '../AddEditTournamentDialog'

export interface InputTournamentProps {
  id?: string
  name: string
  description?: string
}

export default function AddTournamentButton() {
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  return (
    <div className="w-[80vw] md:w-auto">
      <Button className='flex items-center w-full md:w-auto gap-2 md:gap-4 ' onClick={() => setOpenDialog(true)}>
        <BadgePlusIcon /> Agregar torneo
      </Button>
      <AddEditTournamentDialog openDialog={openDialog} setOpenDialog={setOpenDialog} onEdit={false} />
    </div>
  )
}
