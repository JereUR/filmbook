import {
	QueryKey,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query'
import { Heart } from 'lucide-react'

import { useToast } from '../ui/use-toast'

import { cn } from '@/lib/utils'
import { LikeInfo } from '@/lib/types'
import kyInstance from '@/lib/ky'

interface LikeReviewButtonProps {
	reviewId: string
	initialState: LikeInfo
}

export default function LikeReviewButton({
	reviewId,
	initialState
}: LikeReviewButtonProps) {
	const { toast } = useToast()

	const queryClient = useQueryClient()

	const queryKey: QueryKey = ['like-review-info', reviewId]

	const { data } = useQuery({
		queryKey,
		queryFn: () =>
			kyInstance.get(`/api/movie/review/${reviewId}/likes`).json<LikeInfo>(),
		initialData: initialState,
		staleTime: Infinity
	})

	const { mutate } = useMutation({
		mutationFn: () =>
			data.isLikedByUser
				? kyInstance.delete(`/api/movie/review/${reviewId}/likes`)
				: kyInstance.post(`/api/movie/review/${reviewId}/likes`),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey })

			const previousState = queryClient.getQueryData<LikeInfo>(queryKey)

			queryClient.setQueryData<LikeInfo>(queryKey, () => ({
				likes:
					(previousState?.likes || 0) +
					(previousState?.isLikedByUser ? -1 : +1),
				isLikedByUser: !previousState?.isLikedByUser
			}))

			return { previousState }
		},
		onError(error, variables, context) {
			queryClient.setQueryData(queryKey, context?.previousState)
			toast({
				variant: 'destructive',
				description: "Error al intentar dar 'Me gusta' a la review."
			})
		}
	})

	return (
		<button onClick={() => mutate()} className="flex items-center gap-2">
			<Heart
				className={cn(
					'size-5',
					data.isLikedByUser && 'fill-red-600 text-red-600'
				)}
			/>
			<span className="text-sm font-medium tabular-nums">
				{data.likes} <span className="hidden sm:inline">Me gustas</span>
			</span>
		</button>
	)
}
