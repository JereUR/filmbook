'use client'

import { Loader2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { usePredictions } from "@/hooks/usePredictions"

export default function PredictionsButton({ userId, username }: { userId: string, username: string }) {
  const { awardEvents, isLoading } = usePredictions(userId)

  if (awardEvents.length === 0) return null

  return (
    <Button variant='ghost' className='ring-2 ring-primary'>
      {isLoading ? <Loader2 className="mx-auto animate-spin" /> : <Link href={`predicciones/${userId}?username=${username}`}>
        Predicciones realizadas
      </Link>}
    </Button>
  )
}