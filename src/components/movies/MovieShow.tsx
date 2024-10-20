'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { useToast } from '../ui/use-toast'

import MovieDetails from './MovieDetails'

import { getMovieById } from '@/lib/tmdb'
import { Movie } from '@/lib/types'

interface MovieShowProps {
	id: string
}

export default function MovieShow({ id }: MovieShowProps) {
	const [movie, setMovie] = useState<Movie | null>(null)
	const [loadingMovie, setLoadingMovie] = useState<boolean>(true)

	const { toast } = useToast()

	useEffect(() => {
		async function getMovie() {
			setLoadingMovie(true)
			if (id) {
				try {
					const data = await getMovieById(id)
					setMovie(data)
				} catch {
					setMovie(null)
					toast({
						variant: 'destructive',
						description:
							'Error al obtener los datos de la película. Por favor vuelve a intentarlo.'
					})
				} finally {
					setLoadingMovie(false)
				}
			}
		}

		getMovie()
	}, [id, toast])

	if (loadingMovie) {
		return <Loader2 className="mx-auto my-3 animate-spin" />
	}

	return (
		<div className="space-y-3 rounded-2xl bg-card pb-1 shadow-sm md:p-5">
			{movie ? (
				<MovieDetails movie={movie} />
			) : (
				<div>
					<p>Pelicula no encontrada.</p>
				</div>
			)}
		</div>
	)
}
