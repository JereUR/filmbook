"use client";

import { useState } from "react";
import SearchForm from "./SearchForm";
import MovieItem from "./MovieItem";
import type { SearchMovie } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface SearchMoviesResponse {
  movies: SearchMovie[];
  nextPage: number | null;
  error?: string;
}

export default function SearchMovie() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movies, setMovies] = useState<SearchMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const searchMovies = async (pageNumber: number = 1) => {
    if (!searchTerm) return;
    setLoading(true);

    try {
      const response = await fetch(
        `/api/tmdb/search-movies?title=${encodeURIComponent(searchTerm)}&page=${pageNumber}`,
      );
      const data: SearchMoviesResponse = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.movies]);
        setHasMore(data.nextPage !== null);
        setError(null);
      }
    } catch (error) {
      setError("Error al obtener datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchMovies(nextPage);
  };

  return (
    <div className="container mx-auto p-4">
      <SearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchMovies={() => {
          setMovies([]);
          setPage(1);
          searchMovies(1);
        }}
        loading={loading}
      />
      {error && <p className="text-center text-red-500">{error}</p>}
      {movies.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {movies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} />
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
    </div>
  );
}
