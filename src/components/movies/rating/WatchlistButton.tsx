import {
	QueryKey,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query'
import { BookmarkPlus, Loader2 } from 'lucide-react'

import { WatchlistInfo } from '@/lib/types'
import kyInstance from '@/lib/ky'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface WatchlistButtonProps {
	movieId: string
	initialState: WatchlistInfo
}

export default function WatchlistButton({
	movieId,
	initialState
}: WatchlistButtonProps) {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const queryKey: QueryKey = ['watchlist-info', movieId]

	const { data: watchlistData, isLoading } = useQuery({
		queryKey,
		queryFn: () =>
			kyInstance.get(`/api/movie/watchlist/${movieId}`).json<WatchlistInfo>(),
		initialData: initialState,
		staleTime: Infinity
	})

	const { mutate } = useMutation({
		mutationFn: () =>
			watchlistData?.isAddToWatchlistByUser
				? kyInstance.delete(`/api/movie/watchlist/${movieId}`)
				: kyInstance.post(`/api/movie/watchlist/${movieId}`),
		onMutate: async () => {
			toast({
				description: `Película ${
					watchlistData?.isAddToWatchlistByUser
						? 'eliminada de tu watchlist'
						: 'agregada a tu watchlist'
				}`
			})

			await queryClient.cancelQueries({ queryKey })

			const previousState = queryClient.getQueryData<WatchlistInfo>(queryKey)

			queryClient.setQueryData<WatchlistInfo>(queryKey, () => ({
				isAddToWatchlistByUser: !previousState?.isAddToWatchlistByUser
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
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey })
		}
	})

	return (
		<div className="flex flex-col items-center">
			<BookmarkPlus
				className={cn(
					'icon-fine h-10 w-10 cursor-pointer',
					watchlistData?.isAddToWatchlistByUser
						? 'fill-primary text-background'
						: 'text-muted-foreground'
				)}
				onClick={() => mutate()}
			/>
			{isLoading ? (
				<Loader2 className="size-4 animate-spin text-primary" />
			) : (
				<span className="mt-1 text-sm font-semibold">
					{watchlistData?.isAddToWatchlistByUser ? 'En watchlist' : 'Watchlist'}
				</span>
			)}
		</div>
	)
}
