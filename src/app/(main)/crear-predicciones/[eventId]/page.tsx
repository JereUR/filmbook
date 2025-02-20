import type { Metadata } from "next"

import { validateRequest } from "@/auth"
import PredictionForm from "@/components/predictions/PredictionForm"

export const metadata: Metadata = {
  title: "Crear predicciones para los Oscars",
}

export default async function PredictionsPage({ params }: { params: { eventId: string } }) {
  const { user } = await validateRequest()

  if (!user) {
    return {
      redirect: {
        destination: "/iniciar-sesion",
        permanent: false,
      },
    }

  }
  return (
    <div className="container mx-auto px-4 py-8">
      <PredictionForm userId={user.id} eventId={params.eventId} />
    </div>
  )
}

