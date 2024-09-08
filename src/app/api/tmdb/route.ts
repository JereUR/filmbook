import { NextRequest } from "next/server";
import { genres } from "@/lib/genres"; // Importa los géneros desde tu archivo
import { TMDBResponse } from "@/lib/types";
import { validateRequest } from "@/auth";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title") || "";
  const apiKey = process.env.MOVIE_API_KEY;
  const accessToken = process.env.MOVIE_ACCESS_TOKEN;

  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  if (!title || typeof title !== "string") {
    return new Response(JSON.stringify({ error: "Parametro sin valor." }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&language=es-ES`,
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

    const moviesWithGenres = data.results.map((movie) => ({
      ...movie,
      genre_names: movie.genre_ids.map(
        (genreId) =>
          genres.find((genre) => genre.id === genreId)?.name || "Desconocido",
      ),
    }));

    return new Response(JSON.stringify(moviesWithGenres), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error Interno del Servidor." }),
      { status: 500 },
    );
  }
}
