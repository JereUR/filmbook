'use server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'

export async function deleteReview(id: string) {
	const { user } = await validateRequest()

	if (!user) throw new Error('No autorizado.')

	const review = await prisma.review.findUnique({
		where: { id }
	})

	if (!review) throw new Error('Review no encontrada.')
	if (review.userId !== user.id)
		throw new Error('No tienes permisos para eliminar esta review.')

	const movieRating = await prisma.movieRating.findUnique({
		where: { movieId: review.movieId }
	})

	if (!movieRating) throw new Error('No se encontró el puntaje de la película.')

	const newNumberOfRatings = movieRating.numberOfRatings - 1

	let newAverageRating: number | null = null

	if (newNumberOfRatings > 0) {
		newAverageRating =
			(movieRating.averageRating * movieRating.numberOfRatings -
				(review.rating || 0)) /
			newNumberOfRatings
	}

	await prisma.$transaction([
		prisma.review.delete({ where: { id } }),
		newNumberOfRatings > 0
			? prisma.movieRating.update({
					where: { movieId: review.movieId },
					data: {
						averageRating: newAverageRating || 0,
						numberOfRatings: newNumberOfRatings
					}
				})
			: prisma.movieRating.delete({ where: { movieId: review.movieId } })
	])

	return review
}
