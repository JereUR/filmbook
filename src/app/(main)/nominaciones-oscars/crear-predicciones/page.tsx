import type { Metadata } from "next"

import PredictionForm from "./PredictionForm"

export const metadata: Metadata = {
  title: "Crear predicciones para los Oscars",
}

export default function PredictionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PredictionForm />
    </div>
  )
}

