import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Loader2 } from "lucide-react"
import { Suspense } from 'react'

import MovieShow from '@/components/movies/MovieShow'
import Recommendations from '@/components/movies/Recommendations'

interface PageProps {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ title?: string, date?: string }>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { title: searchTitle, date: searchDate } = await searchParams
  const title = searchTitle || 'Sin título'
  const date = searchDate || undefined

  if (!title) {
    return notFound()
  }

  if (!date) {
    return {
      title
    }
  }

  return {
    title: `${title} (${date})`,
  }
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params

  return (
    <main className="flex flex-col md:flex-row w-full min-w-0 gap-5">
      <div className="md:flex-grow md:w-3/4">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <MovieShow id={id} />
        </Suspense>
      </div>
      <div className="md:w-1/4">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <RecommendationsContainer id={id} />
        </Suspense>
      </div>
    </main>
  )
}

function RecommendationsContainer({ id }: { id: string }) {
  return (
    <div className="h-fit w-full px-2 flex-none space-y-5 md:block">
      <Recommendations id={id} />
    </div>
  )
}