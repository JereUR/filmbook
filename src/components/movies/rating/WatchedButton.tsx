import {
	QueryKey,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query'
import { Eye, Loader2 } from 'lucide-react'

import { WatchedInfo } from '@/lib/types'
import kyInstance from '@/lib/ky'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface WatchedButtonProps {
	movieId: string
	initialState: WatchedInfo
	activateRefresh: () => void
}

export default function WatchedButton({
	movieId,
	initialState,
	activateRefresh
}: WatchedButtonProps) {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const queryKey: QueryKey = ['watched-info', movieId]

	const { data: watchedData, isLoading } = useQuery({
		queryKey,
		queryFn: () =>
			kyInstance.get(`/api/movie/watched/${movieId}`).json<WatchedInfo>(),
		staleTime: Infinity,
		initialData: initialState
	})

	const { mutate } = useMutation({
		mutationFn: () =>
			watchedData?.isWatchedByUser
				? kyInstance.delete(`/api/movie/watched/${movieId}`)
				: kyInstance.post(`/api/movie/watched/${movieId}`),
		onMutate: async () => {
			toast({
				description: `Película ${
					watchedData?.isWatchedByUser
						? 'desmarcada como vista'
						: 'marcada como vista'
				}`
			})

			await queryClient.cancelQueries({ queryKey })

			const previousState = queryClient.getQueryData<WatchedInfo>(queryKey)

			queryClient.setQueryData<WatchedInfo>(queryKey, () => ({
				isWatchedByUser: !previousState?.isWatchedByUser
			}))

			return { previousState }
		},
		onError: (error, variables, context) => {
			queryClient.setQueryData(queryKey, context?.previousState)
			toast({
				variant: 'destructive',
				description: 'Error al intentar actualizar tu watchlist.'
			})
		},
		onSuccess: () => {
			activateRefresh()
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey })
		}
	})

	return (
		<div className="flex flex-col items-center">
			<Eye
				className={cn(
					'icon-fine h-10 w-10 cursor-pointer',
					watchedData?.isWatchedByUser
						? 'fill-primary text-background'
						: 'text-muted-foreground'
				)}
				onClick={() => mutate()}
			/>
			{isLoading ? (
				<Loader2 className="size-4 animate-spin text-primary" />
			) : (
				<span className="mt-1 text-sm font-semibold">
					{watchedData?.isWatchedByUser ? 'Vista' : 'No vista'}
				</span>
			)}
		</div>
	)
}
