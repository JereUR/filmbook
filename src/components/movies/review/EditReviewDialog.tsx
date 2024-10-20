import ReviewEditor from '../rating/ReviewEditor'
import WatchedButton from '../rating/WatchedButton'
import LikeButton from '../rating/LikeButton'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { ReviewData } from '@/lib/types'
import '../rating/styles.css'

interface EditReviewDialogProps {
	reviewState: ReviewData
	movieId: string
	activateRefresh: () => void
	open: boolean
	onClose: () => void
}

export default function EditReviewDialog({
	reviewState,
	movieId,
	activateRefresh,
	open,
	onClose
}: EditReviewDialogProps) {
	function handleOpenChange(open: boolean) {
		if (!open) {
			onClose()
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar review</DialogTitle>
				</DialogHeader>
				<div className="flex justify-around">
					<WatchedButton
						movieId={movieId}
						initialState={{
							isWatchedByUser: reviewState.watched
						}}
						activateRefresh={activateRefresh}
					/>
					<LikeButton
						movieId={movieId}
						initialState={{
							isLikedByUser: reviewState.liked
						}}
						activateRefresh={activateRefresh}
					/>
				</div>
				<hr className="-my-1 h-px border-none bg-primary/40" />
				<ReviewEditor
					movieId={movieId}
					ownRating={reviewState.rating}
					reviewText={reviewState.review}
					activateRefresh={activateRefresh}
					edit={true}
				/>
			</DialogContent>
		</Dialog>
	)
}
