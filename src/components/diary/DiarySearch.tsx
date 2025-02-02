'use client'

import { Dispatch, SetStateAction, useState } from "react"
import { SearchMovie, SearchMoviesResponse } from "@/lib/types"
import { Loader2 } from "lucide-react"

import SearchForm from "../movies/search/SearchForm"
import { useToast } from "../ui/use-toast"
import DiarySearchMovieItem from "./DiarySearchMovieItem"

interface DiarySearchProps {
  changeState: () => void
  movies: SearchMovie[]
  setMovies: Dispatch<SetStateAction<SearchMovie[]>>
  setMovieToAdd: Dispatch<SetStateAction<SearchMovie | null>>
}

export default function DiarySearch({ changeState, movies, setMovies, setMovieToAdd }: DiarySearchProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(false)

  const { toast } = useToast()

  const searchMovies = async (pageNumber: number = 1) => {
    if (!searchTerm) return
    setLoading(true)

    try {
      const response = await fetch(
        `/api/tmdb/search-movies?title=${encodeURIComponent(searchTerm)}&page=${pageNumber}`,
      )
      const data: SearchMoviesResponse = await response.json()

      if (data.error) {
        setError(data.error)
        toast({
          variant: "destructive",
          description: error,
        })
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.movies])
        setHasMore(data.nextPage !== null)
        setError(null)
      }
    } catch (error) {
      setError(`Error al obtener los datos: ${error}.`)
      toast({
        variant: "destructive",
        description: `Error al obtener los datos: ${error}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    searchMovies(nextPage)
  }


  return (
    <div>
      <SearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchMovies={() => {
          setMovies([])
          setPage(1)
          searchMovies(1)
        }}
        loading={loading}
      />
      {error && <p className="text-center text-red-500">{error}</p>}
      {movies.length > 0 && (
        <div className="grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-2">
          {movies.map((movie) => (
            <DiarySearchMovieItem key={movie.id} movie={movie} changeState={changeState} setMovieToAdd={setMovieToAdd} />
          ))}
        </div>
      )}
      {loading && <Loader2 className="mx-auto animate-spin" />}
      {hasMore && !loading && (
        <div className="mt-4 text-center">
          <button
            onClick={handleLoadMore}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Cargar más
          </button>
        </div>
      )}
    </div>)
}