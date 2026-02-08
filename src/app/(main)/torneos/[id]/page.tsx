import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

import TournamentView from "@/components/tournaments/TournamentView"

interface TournamentPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ name: string }>
}

export async function generateMetadata({ searchParams, params }: TournamentPageProps): Promise<Metadata> {
  const { name } = await searchParams
  if (!name) {
    return notFound()
  }
  return { title: name }
}

export default async function TournamentPage({ params }: TournamentPageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
      <TournamentView tournamentId={id} />
    </Suspense>
  )
}