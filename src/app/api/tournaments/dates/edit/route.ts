import { validateAdmin } from "@/auth"
import prisma from "@/lib/prisma"
import { fetchMovieFromTMDB } from "@/lib/tmdb"
import { Movie } from "@/lib/types"

interface UpdateRequestBody {
  dateId: string
  date: number
  tournamentId: string
  movieId: string
  visible: boolean
  extraPoints: boolean
  extraPointsSolution: string | null
}

const BASE_IMG_TMDB = "https://image.tmdb.org/t/p/original"

export async function PUT(req: Request) {
  try {
    const { user, admin } = await validateAdmin()

    if (!admin || !user) {
      return new Response(JSON.stringify({ error: "No autorizado." }), {
        status: 401,
      })
    }

    const {
      dateId,
      date,
      tournamentId,
      movieId,
      visible,
      extraPoints,
      extraPointsSolution,
    } = (await req.json()) as UpdateRequestBody

    const existingTournamentDate = await prisma.tournamentDate.findFirst({
      where: { date, tournamentId },
    })

    if (existingTournamentDate && existingTournamentDate.id !== dateId) {
      return new Response(JSON.stringify({ error: "La fecha ya existe." }), {
        status: 404,
      })
    }

    let existedMovie = await prisma.movie.findFirst({
      where: { id: movieId },
    })

    if (!existedMovie) {
      try {
        const movieData = await fetchMovieFromTMDB(movieId)

        const {
          title,
          backdrop_path,
          poster_path,
          release_date,
          overview,
          runtime,
          vote_average,
          vote_count,
          production_companies,
          spoken_languages,
          production_countries,
          genres,
          directors,
          crew,
          cast,
          providers,
        } = movieData

        const newMovie: Movie = {
          id: movieId,
          title: title,
          backdropPath: backdrop_path,
          posterPath: poster_path,
          releaseDate: new Date(release_date),
          overview: overview,
          runtime: runtime,
          voteAverage: vote_average,
          voteCount: vote_count,
          productionCompanies: production_companies,
          spokenLanguages: spoken_languages,
          productionCountries: production_countries,
          genres: genres,
          directors: directors?.map((director: any) => ({
            id: director.id,
            name: director.name,
            profilePath: director.profile_path
              ? `${BASE_IMG_TMDB}${director.profile_path}`
              : null,
            job: director.job,
          })),
          crew: crew,
          cast: cast,
          providers: providers,
        }

        existedMovie = await prisma.movie.create({
          data: newMovie,
        })
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Error al obtener la película" }),
          { status: 500 },
        )
      }
    }

    const updatedTournamentDate = await prisma.tournamentDate.update({
      where: { id: dateId },
      data: {
        date,
        tournamentId,
        movieId,
        visible,
        extraPoints,
        extraPointsSolution,
      },
    })

    return new Response(
      JSON.stringify({ success: true, updatedTournamentDate }),
      {
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error Interno del Servidor." }),
      { status: 500 },
    )
  }
}
