import { NextRequest } from "next/server";
import { genres } from "@/lib/genres";
import { TMDBResponse, SearchMovie } from "@/lib/types";
import { validateRequest } from "@/auth";

// Define el tipo para la respuesta de la API
interface SearchMoviesResponse {
  movies: SearchMovie[];
  nextPage: number | null;
  error?: string;
}

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title") || "";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const apiKey = process.env.MOVIE_API_KEY;
  const accessToken = process.env.MOVIE_ACCESS_TOKEN;

  const { user } = await validateRequest();

  if (!user) {
    return new Response(JSON.stringify({ error: "No autorizado." }), {
      status: 401,
    });
  }

  if (!title || typeof title !== "string") {
    return new Response(JSON.stringify({ error: "Parámetro sin valor." }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&language=es-ES&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error al buscar películas: ${response.statusText}`);
    }

    const data: TMDBResponse = await response.json();

    const moviesData: SearchMovie[] = data.results.map((movie) => {
      const genreNames =
        movie.genre_ids.length > 0
          ? movie.genre_ids.map(
              (genreId) =>
                genres.find((genre) => genre.id === genreId)?.name ||
                "Desconocido",
            )
          : ["Desconocido"];

      return {
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        genre_names: genreNames,
      };
    });

    return new Response(
      JSON.stringify({
        movies: moviesData,
        nextPage: data.page < data.total_pages ? data.page + 1 : null,
      } as SearchMoviesResponse),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error Interno del Servidor." }),
      { status: 500 },
    );
  }
}