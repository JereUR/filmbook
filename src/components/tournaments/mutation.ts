import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { TournamentsPage } from "@/lib/types"
import { useToast } from "../ui/use-toast"
import { deleteTournament } from "./actions"

export function useDeleteTournamentMutation() {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteTournament,
    onSuccess: async (deletedTournament) => {
      const queryKey: QueryKey = ["tournaments"]
      const queryFilter: QueryFilters = { queryKey }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<TournamentsPage, string | null>>(
        { queryKey },
        (oldData) => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              tournaments: page.tournaments.filter(
                (t) => t.id !== deletedTournament.id,
              ),
            })),
          }
        },
      )

      toast({
        description: "Torneo eliminado.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "Error al borrar el torneo. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}
