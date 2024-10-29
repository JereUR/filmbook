import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { deleteReview } from "./actions"
import { useToast } from "@/components/ui/use-toast"

export function useDeleteReviewMutation() {
  const { toast } = useToast()

  const router = useRouter()

  const mutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: async () => {
      toast({
        description: "Review eliminada.",
      })

      router.push(`/`)
    },
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "Error al borrar la review. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}
