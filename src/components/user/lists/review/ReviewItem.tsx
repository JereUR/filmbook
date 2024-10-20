import Image from 'next/image'
import { Heart, Popcorn, Text } from 'lucide-react'
import Link from 'next/link'

import { getYear } from '@/lib/utils'
import { ReviewInfo } from '@/lib/types'
import noImage from '@/assets/no-image-film.jpg'

interface ReviewItemProps {
	review: ReviewInfo
}

export default function ReviewItem({ review }: ReviewItemProps) {
	const { posterPath, title, releaseDate } = review.movie
	const { id, rating, review: reviewText, liked, movieId } = review
	const username = review.user ? review.user.username : ''

	const renderPopcorn = (index: number) => {
		if (!rating) {
			return undefined
		} else {
			if (rating >= index + 1) {
				return (
					<Popcorn className="icon-thick size-2 cursor-pointer text-primary md:size-3" />
				)
			} else if (rating >= index + 0.5) {
				return (
					<div className="relative size-2 md:size-3">
						<div className="absolute inset-0 w-1/2 overflow-hidden">
							<Popcorn className="icon-thick size-2 text-primary md:size-3" />
						</div>
						<div className="absolute inset-0 left-1/2 w-1/2 overflow-hidden">
							<Popcorn className="icon-thick size-2 text-transparent md:size-3" />
						</div>
					</div>
				)
			} else {
				return undefined
			}
		}
	}

	return (
		<div className="flex cursor-pointer flex-col items-center justify-center space-y-1">
			<Link
				href={`/pelicula/review/${id}?title=${title}&date=${getYear(releaseDate ? releaseDate.toString() : '')}&username=${username}&movieId=${movieId}`}
				className="relative shrink-0"
			>
				<Image
					className="h-32 w-20 rounded md:h-40 md:w-28"
					src={posterPath ? posterPath : noImage}
					alt={`${title} poster`}
					aria-label={title}
					width={150}
					height={150}
				/>
				<div className="absolute inset-0 mb-1 flex items-end justify-center">
					<div className="flex space-x-2 rounded bg-black/70 p-1">
						<Heart
							className={`size-3 text-foreground/70 md:size-4 ${liked ? 'fill-red-500 dark:fill-red-600' : 'fill-white/50'}`}
						/>
						{reviewText && (
							<Text className="size-3 fill-primary text-foreground/70 md:size-4" />
						)}
					</div>
				</div>
			</Link>
			<div className="flex h-5 w-20 items-center justify-center rounded md:w-28">
				<div className="flex gap-1">
					{[...Array(rating ? Math.floor(rating) + 1 : 7)].map((_, index) => (
						<div key={index}>{renderPopcorn(index)}</div>
					))}
				</div>
			</div>
		</div>
	)
}
