'use client'

import { ClipboardPenLine } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import AssignPointsDialog from './AssignPointsDialog'

export default function AssignPointsButton() {
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  return (
    <div className="w-[80vw] md:w-auto">
      <Button className='flex items-center w-full md:w-auto gap-2 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700' onClick={() => setOpenDialog(true)}>
        <ClipboardPenLine /> Asignar puntos
      </Button>
      <AssignPointsDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </div>
  )
}
