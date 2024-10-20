import {
	QueryFilters,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'

import { submitReview } from './actions'

import { useToast } from '@/components/ui/use-toast'
import { useSession } from '@/app/(main)/SessionProvider'
import { ReviewSinglePage } from '@/lib/types'

export function useSubmitRatingMutation() {
	const { toast } = useToast()
	const queryClient = useQueryClient()
	const { user } = useSession()

	const mutation = useMutation({
		mutationFn: submitReview,
		onSuccess: async updatedReview => {
			const queryFilter = {
				queryKey: ['review-feed'],
				predicate(query) {
					return (
						query.queryKey.includes('movie-reviews') ||
						(query.queryKey.includes('user-reviews') &&
							query.queryKey.includes(user.id))
					)
				}
			} satisfies QueryFilters

			await queryClient.cancelQueries(queryFilter)

			queryClient.setQueriesData<ReviewSinglePage>(queryFilter, oldData => {
				if (oldData) {
					return {
						reviews: oldData.reviews.map(review =>
							review.id === updatedReview.id ? updatedReview : review
						)
					}
				}
				return oldData
			})

			queryClient.invalidateQueries({
				queryKey: queryFilter.queryKey,
				predicate(query) {
					return queryFilter.predicate(query) && !query.state.data
				}
			})

			toast({
				description: 'Review actualizada.'
			})
		},
		onError: error => {
			toast({
				variant: 'destructive',
				description: 'Error al actualizar la review: ' + error.message
			})
		}
	})

	return mutation
}
