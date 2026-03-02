import { NextRequest, NextResponse } from "next/server"
import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest()
    if (!user || !user.admin) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const q = req.nextUrl.searchParams.get("q") || ""
    if (q.length < 2) {
      return NextResponse.json([])
    }

    const apiKey = process.env.MOVIE_API_KEY
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(q)}&language=es-ES`,
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`TMDB error: ${response.statusText}`)
    }

    const data = await response.json()
    const BASE_IMG_TMDB = "https://image.tmdb.org/t/p/w500"

    const movies = data.results.map((movie: any) => ({
      id: movie.id.toString(),
      title: movie.title,
      posterPath: movie.poster_path
        ? `${BASE_IMG_TMDB}${movie.poster_path}`
        : null,
      releaseDate: movie.release_date,
    }))

    return NextResponse.json(movies)
  } catch (error) {
    console.error("Error searching movies:", error)
    return NextResponse.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
