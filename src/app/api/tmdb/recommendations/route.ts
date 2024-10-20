import { NextRequest, NextResponse } from 'next/server'
import { subWeeks, isAfter } from 'date-fns'

import prisma from '@/lib/prisma'
import { fetchMovieRecommendations } from '@/lib/tmdb'

export async function GET(req: NextRequest) {
	const movieId = req.nextUrl.searchParams.get('id') || ''

	if (!movieId) {
		return NextResponse.json(
			{ error: 'ID de película no proporcionado' },
			{ status: 400 }
		)
	}

	let movie = await prisma.movie.findUnique({
		where: { id: movieId },
		select: {
			id: true,
			recommendations: true,
			updatedAt: true
		}
	})

	if (movie && movie.recommendations !== null) {
		const oneWeekAgo = subWeeks(new Date(), 1)

		if (isAfter(oneWeekAgo, movie.updatedAt)) {
			const recommendations = await fetchMovieRecommendations(movieId)
			const recommendationsData = recommendations.results

			movie = await prisma.movie.update({
				where: { id: movieId },
				data: {
					recommendations: recommendationsData
				}
			})
		}

		return NextResponse.json(movie.recommendations)
	}

	try {
		const recommendations = await fetchMovieRecommendations(movieId)
		const recommendationsData = recommendations.results

		const updatedMovie = await prisma.movie.update({
			where: { id: movieId },
			data: {
				recommendations: recommendationsData
			}
		})

		return NextResponse.json(updatedMovie.recommendations)
	} catch (error) {
		console.error('Error al obtener las recomendaciones desde TMDB', error)
		return NextResponse.json(
			{ error: 'Error al obtener las recomendaciones' },
			{ status: 500 }
		)
	}
}
