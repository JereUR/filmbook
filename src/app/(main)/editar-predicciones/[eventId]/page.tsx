import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"

import { validateRequest } from "@/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { getPredictions } from "@/components/predictions/actions"
import PredictionForm from "@/components/predictions/PredictionForm"
import { CategoryPredictions } from "@/types/nominations"
import { CategoryPredictionType } from "@/types/predictions"

export const metadata: Metadata = {
  title: "Editar predicciones para los Oscars",
}

type Nominee = {
  name: string
  image: string | null | undefined
}

async function PredictionFormWrapper({ userId, eventId }: { userId: string; eventId: string }) {
  const predictions = await getPredictions(userId)
  const eventPredictions = predictions.filter((event) => `${event.name}-${event.year}` === eventId)

  if (!eventPredictions) {
    notFound()
  }

  if (!eventPredictions) {
    notFound()
  }

  return <PredictionForm userId={userId} eventId={eventId} initialPredictions={[]} />
}

export default async function EditPredictionsPage({ params }: { params: { eventId: string } }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Predicciones</h1>
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <PredictionFormWrapper userId={user.id} eventId={params.eventId} />
      </Suspense>
    </div>
  )
}

