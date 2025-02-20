import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { useToast } from "@/components/ui/use-toast"
import { submitPost } from "./actions"
import { PostsPage } from "@/lib/types"
import { useSession } from "@/app/(main)/SessionProvider"

export function useSubmitPostMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user } = useSession()

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryKey = ["post-feed"] as const

      await queryClient.cancelQueries({
        predicate: (query) =>
          query.queryKey.includes("for-you") ||
          (query.queryKey.includes("user-posts") &&
            query.queryKey.includes(user?.id ?? "")),
      })

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        { queryKey, exact: false },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: [
              {
                posts: [newPost, ...oldData.pages[0].posts],
                nextCursor: oldData.pages[0].nextCursor,
              },
              ...oldData.pages.slice(1),
            ],
          }
        },
      )

      queryClient.invalidateQueries({
        predicate: (query) =>
          (query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user?.id ?? ""))) &&
          !query.state.data,
      })

      toast({
        description: "Publicación enviada.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "Error al crear la publicación. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}
