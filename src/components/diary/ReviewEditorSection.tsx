import { useEffect, useState } from 'react'
import { Heart, Popcorn } from 'lucide-react'

import { useSubmitRatingMutation } from '../movies/rating/mutations'

import LoadingButton from '@/components/LoadingButton'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface ReviewEditorSectionProps {
	movieId: string
	ownRating: number | null
	reviewText: string | null | undefined
	liked: boolean
	handleOpenChange: (open: boolean) => void
}

export default function ReviewEditorSection({
	movieId,
	ownRating,
	reviewText,
	liked,
	handleOpenChange
}: ReviewEditorSectionProps) {
	const [rating, setRating] = useState<number>(ownRating || 0)
	const [review, setReview] = useState(reviewText || '')
	const [likedState, setLikedState] = useState<boolean>(liked || false)
	const [halfRating, setHalfRating] = useState<boolean>(false)

	const { toast } = useToast()
	const mutation = useSubmitRatingMutation()

	useEffect(() => {
		if (ownRating !== null) {
			setRating(ownRating)
			setHalfRating(ownRating % 1 !== 0)
		} else {
			setRating(0)
			setHalfRating(false)
		}
	}, [ownRating])

	useEffect(() => {
		setReview(reviewText || '')
	}, [reviewText])

	useEffect(() => {
		setLikedState(liked || false)
	}, [liked])

	const handleClick = (index: number) => {
		if (rating === index + 1 && !halfRating) {
			setHalfRating(true)
			setRating(index + 0.5)
		} else if (rating === index + 0.5) {
			setHalfRating(false)
			setRating(index)
		} else {
			setHalfRating(false)
			setRating(index + 1)
		}
	}

	const renderPopcorn = (index: number) => {
		const iconIndex = index + 1

		if (rating >= iconIndex) {
			return (
				<Popcorn className="icon-thick size-10 cursor-pointer text-primary" />
			)
		} else if (rating === iconIndex - 0.5 && halfRating) {
			return (
				<div className="relative size-10 cursor-pointer overflow-hidden">
					<Popcorn className="clip-half-left icon-thick absolute inset-0 size-10 text-primary" />
					<Popcorn className="clip-half-right icon-thick absolute inset-0 size-10 text-gray-300" />
				</div>
			)
		} else {
			return (
				<Popcorn className="icon-thick size-10 cursor-pointer text-gray-300" />
			)
		}
	}

	const handleSubmit = () => {
		mutation.mutate(
			{ rating, movieId, review, diary: true, liked: likedState },
			{
				onSuccess: () => {
					handleOpenChange(false)
					toast({
						description: 'Película agregada a bitácora.'
					})
				}
			}
		)
	}

	return (
		<div className="flex flex-col items-center justify-center gap-4 py-4">
			<div className="flex w-full justify-around">
				<div className="flex flex-col items-center gap-2">
					<div className="flex space-x-2">
						{[...Array(7)].map((_, index) => (
							<div
								key={index}
								onClick={() => {
									handleClick(index)
								}}
								className="cursor-pointer"
							>
								{renderPopcorn(index)}
							</div>
						))}
					</div>
					<span className="text-sm font-semibold">Puntuar</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Heart
						className={cn(
							'icon-fine h-10 w-10 cursor-pointer',
							likedState
								? 'fill-red-500 text-red-500 dark:fill-red-600 dark:text-red-600'
								: 'text-muted-foreground'
						)}
						onClick={() => setLikedState(!likedState)}
					/>
					<span className="text-sm font-semibold">Favorita</span>
				</div>
			</div>
			<hr className="my-2 h-px w-full border-none bg-primary/40" />
			<div className="w-full">
				<textarea
					value={review}
					placeholder="Agrega una review..."
					onChange={e => {
						setReview(e.target.value)
					}}
					className="scrollbar-thin h-[30vh] w-full resize-none overflow-y-auto rounded-2xl bg-background px-5 py-3 text-sm text-foreground/40 focus:outline-none"
				/>
			</div>
			<LoadingButton
				loading={mutation.isPending}
				onClick={handleSubmit}
				disabled={mutation.isPending}
				className="w-full"
			>
				Agregar
			</LoadingButton>
		</div>
	)
}
