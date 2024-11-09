import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { DiariesPage } from "@/lib/types"
import { useSession } from "@/app/(main)/SessionProvider"
import { useToast } from "@/components/ui/use-toast"
import { deleteDiaryItem } from "./actions"

export function useDeleteDiaryItemMutation() {
  const { toast } = useToast()
  const { user } = useSession()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteDiaryItem,
    onSuccess: async (deletedDiaryItem) => {
      const queryFilter: QueryFilters = {
        queryKey: ["diaries", user ? user.id : null],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<DiariesPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              diaries: page.diaries.filter((p) => p.id !== deletedDiaryItem.id),
            })),
          }
        },
      )

      toast({
        description: "Película removida de tu bitácora.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "Error al remover película. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}
