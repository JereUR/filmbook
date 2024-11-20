import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useSession } from "@/app/(main)/SessionProvider"
import { useToast } from "@/components/ui/use-toast"
import { addFavoriteMovie, removeFavoriteMovie } from "./actions"
import { FavoriteMoviesPage, Movie } from "@/lib/types"

export function useAddFavoriteMovieMutation() {
  const { toast } = useToast()
  const { user } = useSession()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addFavoriteMovie,
    onSuccess: async (favoriteMovie: Movie) => {
      const queryFilter: QueryFilters = {
        queryKey: ["favoriteMovies", user ? user.id : null],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<FavoriteMoviesPage, string | null>
      >(queryFilter, (oldData) => {
        if (!oldData) return

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            favoriteMovies: [...page.favoriteMovies, favoriteMovie],
          })),
        }
      })

      toast({
        description: "Película añadida a tus favoritos.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        description:
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
    mutationFn: removeFavoriteMovie, // El tipo ahora es { movieId: string }
    onSuccess: async (data: { movieId: string }) => {
      const queryFilter: QueryFilters = {
        queryKey: ["favoriteMovies", user ? user.id : null],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<FavoriteMoviesPage, string | null>
      >(queryFilter, (oldData) => {
        if (!oldData) return

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            favoriteMovies: page.favoriteMovies.filter(
              (movie: Movie) => movie.id !== data.movieId,
            ),
          })),
        }
      })

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
