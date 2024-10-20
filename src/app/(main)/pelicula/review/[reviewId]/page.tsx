import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

import UserReview from './UserReview'
import OtherReviews from './OtherReviews'

interface PageProps {
	params: { reviewId: string }
	searchParams: {
		username?: string
		title?: string
		date?: string
		movieId: string
	}
}

export async function generateMetadata({
	searchParams
}: PageProps): Promise<Metadata> {
	const title = searchParams.title || 'Sin título'
	const date = searchParams.date || ''
	const username = searchParams.username || ''

	if (!title) {
		return notFound()
	}

	return {
		title: `${username} | ${title} (${date})`
	}
}

export default function ReviewPage({ params, searchParams }: PageProps) {
	const movieId = searchParams.movieId

	return (
		<main className="flex w-full min-w-0 flex-col gap-5 md:flex-row">
			<div className="md:w-3/4 md:grow">
				<Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
					<UserReview reviewId={params.reviewId} />
				</Suspense>
			</div>
			<div className="md:w-1/4">
				<Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
					<OtherReviewsContainer movieId={movieId} reviewId={params.reviewId} />
				</Suspense>
			</div>
		</main>
	)
}

const OtherReviewsContainer = ({
	movieId,
	reviewId
}: {
	movieId: string
	reviewId: string
}) => {
	return (
		<div className="h-fit w-full flex-none space-y-5 px-2 md:block">
			<OtherReviews movieId={movieId} reviewId={reviewId} />
		</div>
	)
}
