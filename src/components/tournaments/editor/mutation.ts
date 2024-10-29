import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { useToast } from "@/components/ui/use-toast"
import { TournamentData, TournamentsPage } from "@/lib/types"
import { useSession } from "@/app/(main)/SessionProvider"
import { submitTournament } from "./action"

export function useSubmitTournamenttMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user } = useSession()

  const mutation = useMutation({
    mutationFn: submitTournament,
    onSuccess: async (newTournament) => {
      const queryFilter = {
        queryKey: ["tournaments"],
        predicate(query) {
          return query.queryKey.includes("tournaments")
        },
      } satisfies QueryFilters

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<TournamentsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return undefined
          const firstPage = oldData.pages[0]

          if (!firstPage) return oldData

          const filteredTournament: TournamentData = {
            id: newTournament.id,
            name: newTournament.name,
            description: newTournament.description,
            participants: newTournament.participants.length,
            dates: newTournament.dates.length,
            createdAt: newTournament.createdAt,
            updatedAt: newTournament.updatedAt,
          }

          return {
            ...oldData,
            pages: [
              {
                ...firstPage,
                tournaments: [filteredTournament, ...firstPage.tournaments],
              },
              ...oldData.pages.slice(1),
            ],
          }
        },
      )

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data
        },
      })

      toast({
        description: "Torneo agregado.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Error al crear torneo. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}
