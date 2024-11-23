import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/app/(main)/SessionProvider"
import { useToast } from "@/components/ui/use-toast"
import { addFavoriteMovie, removeFavoriteMovie } from "./actions"
import { FavoriteMovie } from "@/lib/types"

export function useAddFavoriteMovieMutation() {
  const { toast } = useToast()
  const { user } = useSession()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addFavoriteMovie,
    onSuccess: (newFavoriteMovie) => {
      queryClient.setQueryData<FavoriteMovie[]>(
        ["favorite-movies", user?.username],
        (oldFavorites = []) => [...oldFavorites, newFavoriteMovie],
      )

      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: ["favorite-movies", user.username],
        })
      }

      toast({
        description: "Película añadida a tus favoritos.",
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description:
          error.message ||
          "Error al añadir la película a tus favoritos. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}

export function useRemoveFavoriteMovieMutation() {
  const { toast } = useToast()
  const { user } = useSession()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: removeFavoriteMovie,
    onSuccess: ({ movieId }) => {
      queryClient.setQueryData<FavoriteMovie[]>(
        ["favorite-movies", user?.username],
        (oldFavorites = []) =>
          oldFavorites.filter((favorite) => favorite.movieId !== movieId),
      )
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ["favorite-movies", user.username],
        })
      }
      toast({
        description: "Película eliminada de tus favoritos.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "Error al eliminar la película de tus favoritos. Por favor vuelve a intentarlo.",
      })
    },
  })

  return mutation
}
