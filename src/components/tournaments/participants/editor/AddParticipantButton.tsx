'use client'

import { UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import AddEditParticipantDialog from '../AddEditParticipantDialog'
import { useState } from 'react'

export default function AddParticipantButton() {
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  return (
    <div className="w-[80vw] md:w-auto">
      <Button className='flex items-center w-full md:w-auto gap-2 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700' onClick={() => setOpenDialog(true)}>
        <UserPlus /> Agregar participante
      </Button>
      <AddEditParticipantDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </div>
  )
}
