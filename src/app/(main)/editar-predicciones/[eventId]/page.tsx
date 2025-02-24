import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"

import { validateRequest } from "@/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { getPredictions } from "@/components/predictions/actions"
import PredictionForm from "@/components/predictions/PredictionForm"
import type { CategoryPredictionType } from "@/types/predictions"
import PredictionFormSkeleton from "@/components/skeletons/PredictionFormSkeleton"

export const metadata: Metadata = {
  title: "Editar predicciones para los Oscars",
}

async function PredictionFormWrapper({ userId, eventId }: { userId: string; eventId: string }) {
  const predictions = await getPredictions(userId, eventId)

  if (!predictions || predictions.length === 0) {
    notFound()
  }

  return (
    <PredictionForm userId={userId} eventId={eventId} initialPredictions={predictions as CategoryPredictionType[]} />
  )
}

export default async function EditPredictionsPage({ params }: { params: { eventId: string } }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Predicciones</h1>
      <Suspense fallback={<PredictionFormSkeleton />}>
        <PredictionFormWrapper userId={user.id} eventId={params.eventId} />
      </Suspense>
    </div>
  )
}

