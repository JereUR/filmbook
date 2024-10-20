'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import kyInstance from '@/lib/ky'
import { ReviewResumeInfoPage } from '@/lib/types'
import { dateFormat } from '@/lib/utils'
import CircularImage from '@/components/movies/CircularImage'

interface OtherReviewsProps {
	movieId: string
	reviewId: string
}
export default function OtherReviews({ movieId, reviewId }: OtherReviewsProps) {
	const { data, hasNextPage, isFetching, status, refetch, isRefetching } =
		useInfiniteQuery({
			queryKey: ['other-reviews', movieId],
			queryFn: ({ pageParam }) =>
				kyInstance
					.get(
						`/api/movie/review/others/${movieId}/${reviewId}`,
						pageParam ? { searchParams: { cursor: pageParam } } : {}
					)
					.json<ReviewResumeInfoPage>(),
			initialPageParam: null as string | null,
			getNextPageParam: lastPage => lastPage.nextCursor
		})

	useEffect(() => {
		refetch()
	}, [reviewId, refetch])

	const reviews = data?.pages.flatMap(page => page.reviews) || []

	return (
		<div className="flex flex-col gap-2 rounded-2xl bg-card p-5">
			<div className="text-xl font-bold">Otras reviews</div>
			{status === 'pending' || isFetching || isRefetching ? (
				<Loader2 className="mx-auto animate-spin" />
			) : status === 'success' && !reviews.length && !hasNextPage ? (
				<p className="text-center text-xs italic text-foreground/40 md:text-sm">
					Nadie ha realizado una review de esta película aún...
				</p>
			) : status === 'error' ? (
				<p className="text-center text-xs italic text-destructive md:text-sm">
					Ocurrió un error al cargar las reviews.
				</p>
			) : (
				reviews.map(review => (
					<Link
						key={review.id}
						href={`/pelicula/review/${review.id}?title=${review.movie?.title}&date=${review.movie?.releaseDate}&username=${review.user?.username}&movieId=${review.movieId}`}
						className="rounded-2xl bg-card-child p-2 transition duration-300 ease-in-out hover:bg-card-child/70 md:p-4"
					>
						<div className="flex items-center gap-2 md:gap-4">
							<CircularImage
								src={review.user?.avatarUrl}
								alt={`${review.user?.username} photo`}
								className="relative"
								transform={false}
							/>
							<div className="flex flex-col">
								<span className="text-sm font-medium md:text-base">
									{review.user?.username}
								</span>
								<span className="text-xs font-light text-foreground/40 md:text-sm">
									{dateFormat(review.createdAt.toISOString())}
								</span>
							</div>
						</div>
					</Link>
				))
			)}
		</div>
	)
}
