import { useEffect, useState } from 'react'

import TitleSection from './TitleSection'
import RatingsSection from './rating/RatingsSection'

import { CrewMember, ImageInfo, ReviewInfo } from '@/lib/types'
import { useSession } from '@/app/(main)/SessionProvider'

interface GeneralInfoSectionProps {
	id: string
	title: string
	releaseDate: Date | undefined
	posterPath: string | undefined
	runtime: number
	genres: any[]
	directors: CrewMember[]
	rating: any
	voteAverage?: number
	voteCount?: number
	overview: string
	watchlist: { userId: string; movieId: string }[]
	reviews: ReviewInfo[]
	handleImageClick: (image: ImageInfo) => void
}

export default function GeneralInfoSection({
	id,
	title,
	releaseDate,
	posterPath,
	runtime,
	genres,
	directors,
	rating,
	voteAverage,
	voteCount,
	overview,
	watchlist,
	reviews,
	handleImageClick
}: GeneralInfoSectionProps) {
	const [ratingWasChanged, setRatingWasChanged] = useState<boolean>(false)
	const { user } = useSession()

	const foundUserReview =
		reviews &&
		reviews.find(review => review.movieId === id && review.userId === user.id)
	let watched = foundUserReview?.watched || false
	let liked = foundUserReview?.liked || false
	let reviewId = foundUserReview?.id

	async function fetchNewReview() {
		const movieId = id
		const response = await fetch(`/api/movie/review/movie/${movieId}`)
		const data = await response.json()

		if (data) {
			reviewId = data.id
			watched = data.watched
			liked = data.liked
		}
	}

	useEffect(() => {
		fetchNewReview().then(() => setRatingWasChanged(false))
	}, [ratingWasChanged])

	return (
		<div className="relative z-10 bg-card/50 p-4 text-foreground">
			<div className="flex flex-col gap-3 md:flex-row">
				<div className="flex flex-col items-start gap-2 md:w-3/4 md:flex-row md:items-center md:gap-4">
					<TitleSection
						movieId={id}
						reviewId={reviewId}
						username={user.username}
						title={title}
						releaseDate={releaseDate}
						posterPath={posterPath}
						runtime={runtime}
						genres={genres}
						directors={directors}
						watched={watched}
						liked={liked}
						handleImageClick={handleImageClick}
						ratingWasChanged={ratingWasChanged}
						setRatingWasChanged={setRatingWasChanged}
					/>
				</div>
				<RatingsSection
					movieId={id}
					title={title}
					releaseDate={releaseDate}
					rating={rating}
					voteAverage={voteAverage}
					voteCount={voteCount}
					watchlist={watchlist}
					reviews={reviews}
					ratingWasChanged={ratingWasChanged}
					setRatingWasChanged={setRatingWasChanged}
				/>
			</div>
			<div className="mt-2 px-1 md:mt-3 md:px-4">
				<p className="text-justify text-sm leading-relaxed text-foreground/40 md:text-base">
					{overview}
				</p>
			</div>
		</div>
	)
}
