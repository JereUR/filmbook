"use server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { FavoriteMovie } from "@/lib/types"

export async function addFavoriteMovie(
  movieId: string,
  position: number,
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

  const favorite = await prisma.favoriteMovie.create({
    data: {
      userId: user.id,
      movieId,
      position, // Guardar la posición
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
