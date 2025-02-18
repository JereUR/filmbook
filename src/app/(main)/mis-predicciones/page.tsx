import { validateRequest } from "@/auth"
import type { Metadata } from "next"
import MyPredictions from "./MyPredictions"

export const metadata: Metadata = {
  title: "Mis predicciones",
}

export default async function MyPredictionsPage() {
  const { user } = await validateRequest()

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Predicciones</h1>
      <MyPredictions userId={user.id} />
    </div>
  )
}

