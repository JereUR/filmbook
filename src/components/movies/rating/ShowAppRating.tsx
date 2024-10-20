import Image from 'next/image'

import TmdbLogo from '@/assets/TMDB.png'
import AppLogo from '@/assets/logo.png'
import { cn, ratingColor, ratingColorFilmbook } from '@/lib/utils'

interface ShowAppRatingProps {
	ownApp: boolean
	voteAverage: number | undefined
	voteCount: number | undefined
	className?: string
}

export default function ShowAppRating({
	ownApp,
	voteAverage,
	voteCount,
	className
}: ShowAppRatingProps) {
	return (
		<div className={cn('flex items-center gap-4', className)}>
			<div
				className={`relative ${ownApp ? 'size-8 md:size-12' : 'size-10 md:size-14'} shrink-0`}
			>
				<Image
					src={ownApp ? AppLogo : TmdbLogo}
					alt="TMDB logo"
					fill
					sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
					className="rounded"
				/>
			</div>
			<div className="flex w-full flex-col items-center justify-center">
				{voteAverage ? (
					<div className="flex gap-1 text-xl font-semibold italic md:text-2xl">
						<span
							className={
								ownApp
									? ratingColorFilmbook(voteAverage)
									: ratingColor(voteAverage)
							}
						>
							{voteAverage.toFixed(1)}
						</span>
						<span className="text-gray-400">{ownApp ? '/7' : '/10'}</span>
					</div>
				) : (
					<span className="text-center text-xl text-foreground/40 md:text-2xl">
						S/P
					</span>
				)}
				<span className="text-xs text-foreground/40">
					Votos: {voteCount ? voteCount : '-'}
				</span>
			</div>
		</div>
	)
}
