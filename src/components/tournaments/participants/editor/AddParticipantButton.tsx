import { UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function AddParticipantButton() {
  return (
    <div>
      <Button className='flex items-center gap-2 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700' >
        <UserPlus /> Agregar participante
      </Button>
    </div>
  )
}
