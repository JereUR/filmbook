import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useToast } from "../ui/use-toast"

import { deleteComment, submitComment } from "./action"
import { CommentsPage } from "@/lib/types"

export function useSubmitCommentMutation(postId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId]

      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0]

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [...firstPage.comments, newComment],
                },
                ...oldData.pages.slice(1),
              ],
            }
          }
        },
      )

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data
        },
      })

      toast({
        description: "Comentario enviado.",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description:
          "Error al enviar comentario. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}

export function useDeleteCommentMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", deletedComment.postId]

      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter((c) => c.id !== deletedComment.id),
            })),
          }
        },
      )

      toast({
        description: "Comentario eliminado.",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description:
          "Error al borrar el comentario. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}
