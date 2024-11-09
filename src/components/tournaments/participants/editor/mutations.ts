import { useToast } from "@/components/ui/use-toast"
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  deleteTournamentParticipant,
  updateTournamentParticipant,
} from "./actions"
import {
  ParticipantsData,
  ParticipantsPage,
  ParticipantTournament,
} from "@/lib/types"

export function useDeleteTournamentParticipantMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteTournamentParticipant,
    onSuccess: async (deletedParticipant) => {
      const queryFilter: QueryFilters = { queryKey: ["all-participants"] }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueryData<ParticipantsData[]>(
        ["all-participants"],
        (oldData) => {
          if (!oldData) return []

          return oldData.filter(
            (participant) => participant.id !== deletedParticipant.id,
          )
        },
      )

      toast({
        description: "Participante eliminado exitosamente.",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description:
          "Error al eliminar el participante. Por favor intenta nuevamente.",
      })
    },
  })

  return mutation
}

export function useUpdateTournamentParticipantMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateTournamentParticipant,
    onSuccess: async (updatedTournamentParticipant: ParticipantTournament) => {
      const queryFilter: QueryFilters = { queryKey: ["participants"] }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<ParticipantsPage>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return undefined

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              ...page,
              participants: page.participants.map((p) =>
                p.participantId === updatedTournamentParticipant.participantId
                  ? updatedTournamentParticipant
                  : p,
              ),
            })),
          }
        },
      )

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
      })

      toast({
        description: "Usuario actualizado.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "Error al actualizar usuario. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}
