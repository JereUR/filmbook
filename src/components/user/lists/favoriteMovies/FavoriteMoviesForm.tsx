'use client'

import { useState } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import Image from "next/image"
import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from "@tanstack/react-query"

import { FavoriteMovie, SearchMovie } from "@/lib/types"
import { useAddFavoriteMovieMutation, useRemoveFavoriteMovieMutation } from "./mutations"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import noImagePath from '@/assets/no-image-film.jpg'
import DiarySearch from '@/components/diary/DiarySearch'
import LoadingButton from '@/components/LoadingButton'
import { useToast } from '@/components/ui/use-toast'
import { getMovieById } from '@/lib/tmdb'
import kyInstance from '@/lib/ky'
import SearchMovieForDate from '@/components/tournaments/dates/SearchMovieForDate'

interface FavoriteMoviesFormProps {
  initialData: FavoriteMovie[]
  username: string
}
export default function FavoriteMoviesForm({ initialData, username }: FavoriteMoviesFormProps) {
  const { mutate: addMutate, isError: isAddError, error: addError } = useAddFavoriteMovieMutation()
  const { mutate: deleteMutate } = useRemoveFavoriteMovieMutation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [searchMovies, setSearchMovies] = useState<SearchMovie[]>([])
  const [movieToAdd, setMovieToAdd] = useState<string | null>(null)
  const [isLoadingMovie, setIsLoadingMovie] = useState<boolean>(false)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: favoriteMovies, isLoading, isError, error } = useQuery({
    queryKey: ['favorite-movies', username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}/favorite-movies`).json<FavoriteMovie[]>(),
    initialData,
  })

  const handleSlotClick = (index: number) => {
    const favoriteMovie = favoriteMovies.find(m => m.position === index)
    if (favoriteMovie) {
      deleteMutate(favoriteMovie.movieId)
    } else {
      setSelectedSlot(index)
      setIsDialogOpen(true)
    }
  }

  const handleAddMovie = async () => {
    if (movieToAdd && selectedSlot !== null) {
      setIsLoadingMovie(true)
      if (movieToAdd) {
        try {
          const data = await getMovieById(movieToAdd)

          if (data) {
            addMutate({ movieId: data.id, position: selectedSlot }, {
              onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ['favorite-movies', username] })

                setMovieToAdd(null)
                setIsDialogOpen(false)
                setSelectedSlot(null)

                toast({
                  description: "Película añadida correctamente a tus favoritos.",
                })
              },
              onError: (error) => {
                toast({
                  variant: "destructive",
                  description: "Error al añadir la película a tus favoritos. Por favor vuelve a intentarlo.",
                })
              },
            })
          }
        } catch (error) {

          toast({
            variant: "destructive",
            description: "Error al obtener los datos de la película. Por favor vuelve a intentarlo.",
          })
        } finally {
          setIsLoadingMovie(false)
        }
      }
    }
  }

  return (
    <div className="py-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Mi Filmoteca</h2>
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="aspect-[2/3] relative bg-muted-foreground/40 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleSlotClick(index)}
          >
            {favoriteMovies.find(m => m.position === index) ? (
              <>
                <Image
                  src={favoriteMovies.find(m => m.position === index)?.movie.posterPath || noImagePath}
                  alt={favoriteMovies.find(m => m.position === index)?.movie.title || 'Vacio'}
                  layout="fill"
                  objectFit="cover"
                />
                <button
                  className="absolute top-1 right-1 p-1 bg-red-600 dark:bg-red-700 rounded-2xl hover:bg-red-700 dark:hover:bg-red-800"
                  disabled={isLoadingMovie}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLoadingMovie(true)
                    deleteMutate(favoriteMovies.find(m => m.position === index)?.movieId || '')
                    setIsLoadingMovie(false)
                  }}
                >
                  {isLoadingMovie ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Plus className="h-8 w-8 text-muted-foreground/70" />
              </div>
            )}
          </div>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="z-[150] max-w-[1200px] max-h-[600px] overflow-y-auto scrollbar-thin flex justify-between gap-8">
          <SearchMovieForDate selectedMovieId={movieToAdd} setSelectedMovieId={setMovieToAdd} />
          <LoadingButton loading={isLoadingMovie} disabled={!movieToAdd} onClick={handleAddMovie}>Agregar a favorita</LoadingButton>
        </DialogContent>
      </Dialog>
      {isAddError && (
        <p className="text-red-500 mt-2">
          {addError instanceof Error ? addError.message : "Error al añadir la película a favoritos."}
        </p>
      )}
    </div>
  )
}

