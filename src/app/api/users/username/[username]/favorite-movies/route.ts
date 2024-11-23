import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { FavoriteMovie } from "@/lib/types"

export async function GET(
  req: Request,
  { params: { username } }: { params: { username: string } },
): Promise<Response> {
  try {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    const userFavorites = await prisma.user.findUnique({
      where: { username },
      select: {
        favoriteMovies: {
          include: {
            movie: {
              select: {
                title: true,
                posterPath: true,
                releaseDate: true,
              },
            },
          },
        },
      },
    })

    if (!userFavorites) {
      return Response.json([], { status: 200 })
    }

    const favoriteMovies: FavoriteMovie[] = userFavorites.favoriteMovies.map(
      (fav) => ({
        id: fav.id,
        movieId: fav.movieId,
        movie: {
          title: fav.movie.title,
          posterPath: fav.movie.posterPath,
          releaseDate: fav.movie.releaseDate,
        },
      }),
    )

    return Response.json(favoriteMovies, { status: 200 })
  } catch (error) {
    console.error("Error al obtener las películas favoritas:", error)

    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
