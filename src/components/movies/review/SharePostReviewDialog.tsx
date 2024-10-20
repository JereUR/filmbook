import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import PostEditor from '@/components/posts/editor/PostEditor'
import { generateReviewShareText } from '@/lib/utils'
import { useSession } from '@/app/(main)/SessionProvider'

interface SharePostReviewDialogProps {
	open: boolean
	onClose: () => void
	username: string
	displayName: string
	reviewId: string
	rating: number | null
	movie: {
		movieId: string | undefined
		title: string
		year: string
	}
}

export default function SharePostReviewDialog({
	open,
	onClose,
	reviewId,
	rating,
	username,
	displayName,
	movie
}: SharePostReviewDialogProps) {
	const { user } = useSession()
	const own = username === user.username

	const text = generateReviewShareText(
		reviewId,
		username,
		displayName,
		rating,
		own,
		movie
	)

	function handleOpenChange(open: boolean) {
		if (!open) {
			onClose()
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="w-full max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Postear review</DialogTitle>
				</DialogHeader>
				<PostEditor initialContent={text} />
			</DialogContent>
		</Dialog>
	)
}
