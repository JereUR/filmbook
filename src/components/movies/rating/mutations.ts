import {
  Query,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { useToast } from "@/components/ui/use-toast"
import { useSession } from "@/app/(main)/SessionProvider"
import { ReviewSinglePage } from "@/lib/types"
import { submitReview } from "./actions"

export function useSubmitRatingMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user } = useSession()

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: async (updatedReview) => {
      const queryFilter: QueryFilters<ReviewSinglePage> = {
        queryKey: ["review-feed"],
        predicate: (query) => {
          const typedQuery = query as Query<
            ReviewSinglePage,
            Error,
            ReviewSinglePage,
            readonly unknown[]
          >
          return (
            typedQuery.queryKey.includes("movie-reviews") ||
            (typedQuery.queryKey.includes("user-reviews") &&
              typedQuery.queryKey.includes(user?.id ?? ""))
          )
        },
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<ReviewSinglePage>(queryFilter, (oldData) => {
        if (oldData) {
          return {
            reviews: oldData.reviews.map((review) =>
              review.id === updatedReview.id ? updatedReview : review,
            ),
          }
        }
        return oldData
      })

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate: (query) => {
          const typedQuery = query as Query<
            ReviewSinglePage,
            Error,
            ReviewSinglePage,
            readonly unknown[]
          >
          return queryFilter.predicate
            ? queryFilter.predicate(typedQuery) && !typedQuery.state.data
            : false
        },
      })

      toast({
        description: "Review actualizada.",
      })
    },
    onError: (error) => {
      console.error("Error detalles:", error)
      toast({
        variant: "destructive",
        description: "Error al actualizar la review: " + error.message,
      })
    },
  })

  return mutation
}
