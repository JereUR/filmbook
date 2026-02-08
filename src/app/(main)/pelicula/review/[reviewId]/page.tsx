import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Loader2 } from "lucide-react"
import { Suspense } from 'react'

import UserReview from './UserReview'
import OtherReviews from './OtherReviews'
import { validateRequest } from '@/auth'
import UnauthorizedMessage from '@/components/UnauthorizedMessage'

interface PageProps {
  params: Promise<{ reviewId: string }>,
  searchParams: Promise<{ username?: string, title?: string, date?: string, movieId: string }>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { title: searchTitle, date: searchDate, username: searchUsername } = await searchParams
  const title = searchTitle || 'Sin título'
  const date = searchDate || ''
  const username = searchUsername || ''

  if (!title) {
    return notFound()
  }

  return {
    title: `${username} | ${title} (${date})`,
  }
}

export default async function ReviewPage({ params, searchParams }: PageProps) {
  const { reviewId } = await params
  const { movieId } = await searchParams
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return <UnauthorizedMessage sectionMessage='Necesitas iniciar sesión para ver reviews de usuarios.' trendsSidebar={false} />
  }

  return (
    <main className="flex flex-col md:flex-row w-full min-w-0 gap-5">
      <div className="md:flex-grow md:w-3/4">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserReview reviewId={reviewId} />
        </Suspense>
      </div>
      <div className="md:w-1/4">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <OtherReviewsContainer movieId={movieId} reviewId={reviewId} />
        </Suspense>
      </div>
    </main>
  )
}

function OtherReviewsContainer({ movieId, reviewId }: { movieId: string, reviewId: string }) {
  return (
    <div className="h-fit w-full px-2 flex-none space-y-5 md:block">
      <OtherReviews movieId={movieId} reviewId={reviewId} />
    </div>
  )
}
