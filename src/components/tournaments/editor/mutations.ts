import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { useToast } from "@/components/ui/use-toast"
import { TournamentData, TournamentsPage } from "@/lib/types"
import { submitTournament, updateTournament } from "./actions"

export function useSubmitTournamentMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: submitTournament,
    onSuccess: async (newTournament) => {
      const queryKey: QueryKey = ["tournaments"]
      const queryFilter = {
        queryKey,
        predicate(query) {
          return query.queryKey.includes("tournaments")
        },
      } satisfies QueryFilters

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<TournamentsPage, string | null>>(
        { queryKey },
        (oldData) => {
          if (!oldData) return undefined
          const firstPage = oldData.pages[0]

          if (!firstPage) return oldData

          const filteredTournament: TournamentData = {
            id: newTournament.id,
            name: newTournament.name,
            description: newTournament.description,
            participants: newTournament.participants.length,
            startDate: newTournament.startDate,
            endDate: newTournament.endDate || undefined,
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

export function useUpdateTournamentMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateTournament,
    onSuccess: async (updatedTournament) => {
      const simplifiedTournament = {
        ...updatedTournament,
        endDate: updatedTournament.endDate || undefined,
        participants: updatedTournament.participants.length,
        dates: updatedTournament.dates.length,
      }

      const queryKey: QueryKey = ["tournaments"]

      const queryFilter = {
        queryKey,
        predicate(query) {
          return query.queryKey.includes("tournaments")
        },
      } satisfies QueryFilters

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<TournamentsPage>>(
        { queryKey },
        (oldData) => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              tournaments: page.tournaments.map((tournament) =>
                tournament.id === updatedTournament.id
                  ? { ...tournament, ...simplifiedTournament }
                  : tournament,
              ),
            })),
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
        description: "Torneo actualizado.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "Error al actualizar torneo. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}
