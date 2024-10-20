import { ClipboardPenLine } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function AsignPointsButton() {
  return (
    <div>
      <Button className='flex items-center gap-2 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700' >
        <ClipboardPenLine /> Asignar puntos
      </Button>
    </div>
  )
}
