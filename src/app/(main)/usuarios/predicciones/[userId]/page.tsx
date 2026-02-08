import { Metadata } from "next"
import { notFound } from "next/navigation"

import { validateRequest } from "@/auth"
import PredictionsList from "@/components/predictions/PredictionsList"
import UnauthorizedMessage from "@/components/UnauthorizedMessage"

interface PageProps {
  params: Promise<{ userId: string }>,
  searchParams: Promise<{ username?: string }>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { username } = await searchParams
  const name = username || 'usuario'

  if (!username) {
    return notFound()
  }

  return {
    title: `Predicciones de ${name}`,
  }
}

export default async function UserPredictionPage({ params, searchParams }: PageProps) {
  const { userId } = await params
  const { username } = await searchParams
  const name = username || 'usuario'
  const { user } = await validateRequest()

  if (!user) {
    return <UnauthorizedMessage sectionMessage='Necesitas iniciar sesión para ver predicciones.' trendsSidebar={true} />
  }

  return (
    <main className="flex flex-col md:flex-row w-full min-w-0 gap-5">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{userId === user.id ? "Mis predicciones" : `Predicciones de ${name}`}</h1>
        <PredictionsList userId={userId} own={userId === user.id} />
      </div>
    </main>
  )
}