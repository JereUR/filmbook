import { ChevronLeft, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { toast } from '../ui/use-toast'

import ReviewEditorSection from './ReviewEditorSection'

import noImage from '@/assets/no-image-film.jpg'
import { ReviewInfo, SearchMovie } from '@/lib/types'
import { formatArgDate, getYear } from '@/lib/utils'

import '@/components/movies/rating/styles.css'

interface MovieItemProps {
	movie: SearchMovie | null
	changeState: () => void
	handleOpenChange: (open: boolean) => void
}

export default function DiaryForm({
	movie,
	changeState,
	handleOpenChange
}: MovieItemProps) {
	const [reviewState, setReviewState] = useState<ReviewInfo | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const searchReview = async () => {
		setLoading(true)

		try {
			const response = await fetch(`/api/movie/review/movie/${id}`)
			const data: ReviewInfo = await response.json()

			if (data) {
				setReviewState(data)
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				description: `Error al obtener los datos: ${error}`
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		searchReview()
	}, [])

	if (!movie) return null

	const {
		title,
		release_date: releaseDate,
		poster_path: posterPath,
		id
	} = movie

	return (
		<div className="relative">
			<button
				className="group absolute -top-10 flex items-center gap-1 rounded-2xl border border-muted bg-card p-2 text-xs text-foreground/40 md:text-sm"
				onClick={changeState}
			>
				<ChevronLeft className="size-5 transition-transform duration-500 ease-in-out group-hover:scale-[1.3]" />
				<span className="text-sm md:text-base">Volver</span>
			</button>
			<div className="m-5 md:m-10">
				<div className="flex justify-between">
					<div className="flex flex-col gap-2">
						<h1 className="text-lg font-semibold md:text-xl">
							{title} ({getYear(releaseDate)})
						</h1>
						<span className="text-sm text-foreground/40 md:text-base">
							Día: {formatArgDate(new Date().toISOString())} (USA)
						</span>
					</div>
					<div className="relative h-28 w-16">
						<Image
							src={posterPath ? posterPath : noImage}
							alt={title}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="rounded"
						/>
					</div>
				</div>
				<div>
					{loading ? (
						<span className="flex items-center gap-2 text-center">
							<Loader2 className="animate-spin" />
							<p className="text-foreground/40">
								Buscando si existe review realizada...
							</p>
						</span>
					) : (
						<ReviewEditorSection
							movieId={id.toString()}
							ownRating={reviewState ? reviewState.rating : 0}
							reviewText={reviewState ? reviewState.review : ''}
							liked={reviewState ? reviewState.liked : false}
							handleOpenChange={handleOpenChange}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
