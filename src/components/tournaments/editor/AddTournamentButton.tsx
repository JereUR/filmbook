import { BadgePlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function AddTournamentButton() {
  return (
    <div>
      <Button className='flex items-center gap-2 '>
        <BadgePlusIcon /> Agregar torneo
      </Button>
    </div>
  )
}
