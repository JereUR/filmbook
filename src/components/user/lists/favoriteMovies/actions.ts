"use server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { getMovieById } from "@/lib/tmdb"
import { FavoriteMovie } from "@/lib/types"

export async function addFavoriteMovie(
  movieId: string,
): Promise<FavoriteMovie> {
  const { user } = await validateRequest()
  if (!user) throw new Error("No autorizado.")

  if (!movieId) {
    throw new Error("ID de película inválido.")
  }

  const existingFavorite = await prisma.favoriteMovie.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId,
      },
    },
  })

  if (existingFavorite) {
    throw new Error("La película ya está en tus favoritos.")
  }

  const movie = await getMovieById(movieId)

  if (!movie) {
    throw new Error("No se pudo obtener la información de la película.")
  }

  const favorite = await prisma.favoriteMovie.create({
    data: {
      userId: user.id,
      movieId,
    },
    include: {
      movie: true,
    },
  })

  return favorite
}

export async function removeFavoriteMovie(
  movieId: string,
): Promise<{ movieId: string }> {
  const { user } = await validateRequest()
  if (!user) throw new Error("No autorizado.")

  if (!movieId) {
    throw new Error("ID de película inválido.")
  }

  const existingFavorite = await prisma.favoriteMovie.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId,
      },
    },
  })

  if (!existingFavorite) {
    throw new Error("La película no está en tus favoritos.")
  }

  await prisma.favoriteMovie.delete({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId,
      },
    },
  })

  return { movieId }
}
