import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

import TournamentView from "@/components/tournaments/TournamentView"

interface TournamentPageProps {
  params: { id: string }
  searchParams: { name: string }
}

export async function generateMetadata({ searchParams, params }: TournamentPageProps): Promise<Metadata> {
  const name = searchParams.name
  if (!name) {
    return notFound()
  }
  return { title: name }
}

export default function TournamentPage({ params }: TournamentPageProps) {
  return (
    <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
      <TournamentView tournamentId={params.id} />
    </Suspense>
  )
}