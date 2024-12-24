import useSWR from "swr"

import { Movie } from "@/lib/types"

export function usePopularMovies() {
  const { data, error } = useSWR<Movie[]>(
    "/api/tmdb/popular-movies",
    async (url: string) => {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error("Failed to fetch popular movies")
      }
      return res.json()
    },
  )

  return {
    movies: data,
    isLoading: !error && !data,
    isError: error,
  }
}
