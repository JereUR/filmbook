"use client";

import { useState } from "react";
import Image from "next/image";

import { Movie } from "@/lib/types";

export default function SearchMovie() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchMovies = async () => {
    try {
      const response = await fetch(
        `/api/tmdb?title=${encodeURIComponent(searchTerm)}`,
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMovies(data.results);
        setError(null);
      }
    } catch (error) {
      setError("Error al obtener datos.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8 text-center text-3xl font-bold">Buscar Películas</h1>
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ingresa el título de la película"
          className="w-full max-w-md rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchMovies}
          className="rounded-r-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {movies.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="overflow-hidden rounded-lg bg-card shadow-md"
            >
              {movie.poster_path && (
                <div className="relative h-80">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} Poster`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{movie.title}</h2>
                <p className="text-sm text-gray-700">{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
