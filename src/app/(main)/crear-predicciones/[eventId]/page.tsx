import type { Metadata } from "next"

import { validateRequest } from "@/auth"
import PredictionForm from "@/components/predictions/PredictionForm"
import UnauthorizedMessage from "@/components/UnauthorizedMessage"
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Crear predicciones para los Oscars",
}

export default async function PredictionsPage({ params }: { params: { eventId: string } }) {
  const { user } = await validateRequest()

  return notFound()

  /* if (!user) {
    return <UnauthorizedMessage sectionMessage='Necesitas iniciar sesión para realizar predicciones.' trendsSidebar={false} />
  }
  return (
    <div className="container mx-auto px-1 py-2 lg:p-5">
      <PredictionForm userId={user.id} eventId={params.eventId} />
    </div>
  ) */
}

