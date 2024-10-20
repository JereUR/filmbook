import Image from 'next/image'
import Link from 'next/link'
import { ArrowBigDownDashIcon, ArrowBigUpDashIcon, X } from 'lucide-react'
import { useState } from 'react'

import ProvidersForWatchlist from './ProvidersForWatchlist'
import DeleteWatchlistItemDialog from './DeleteWatchlistItemDialog'

import { WatchlistData } from '@/lib/types'
import { getYear, ratingColor } from '@/lib/utils'
import noImage from '@/assets/no-image-film.jpg'
import TmdbLogo from '@/assets/TMDB.png'
import AppLogo from '@/assets/logo.png'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

interface WatchlistItemProps {
	item: WatchlistData
}

export default function WatchlistItem({ item }: WatchlistItemProps) {
	const [open, setOpen] = useState(false)
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
	const {
		title,
		releaseDate,
		posterPath,
		genres,
		voteAverage,
		overview,
		providers,
		directors,
		runtime
	} = item.movie
	const { voteApp } = item

	return (
		<div className="relative m-1 cursor-pointer items-start gap-3 rounded-2xl border border-primary/40 bg-background p-2 transition-colors duration-300 ease-in-out hover:bg-background/40 md:p-4">
			<div className="absolute right-2 top-2">
				<Button
					onClick={() => setShowDeleteDialog(true)}
					variant="ghost"
					className="cursor-pointer p-1"
				>
					<span className="flex items-center gap-3 font-bold text-destructive">
						<X className="size-5 text-destructive" />
					</span>
				</Button>
				<DeleteWatchlistItemDialog
					item={item}
					open={showDeleteDialog}
					onClose={() => setShowDeleteDialog(false)}
				/>
			</div>
			<Link
				className="flex gap-2 md:gap-4"
				href={`/pelicula/${item.movieId}?title=${title}&date=${getYear(releaseDate ? releaseDate.toString() : '')}`}
			>
				<div className="flex-none">
					<Image
						src={posterPath ? posterPath : noImage}
						alt={`${title} poster`}
						width={100}
						height={120}
						className="rounded"
					/>
				</div>
				<div className="flex grow flex-col justify-center gap-1 md:gap-2">
					<div>
						<h1 className="flex gap-1 text-sm font-semibold md:text-base">
							<span className="line-clamp-2 whitespace-pre-line">{title}</span>{' '}
							({releaseDate ? getYear(releaseDate.toString()) : 'N/A'})
						</h1>
						<div className="flex gap-1 text-sm md:text-base">
							<span className="text-xs font-semibold text-foreground/40">
								{directors.map((director: any) => director.name).join(', ')} -
							</span>
							<p className="text-xs font-semibold text-foreground/40">
								{genres.map((genre: any) => genre.name).join(', ')} - {runtime}{' '}
								mins
							</p>
						</div>
					</div>
					{overview && (
						<p className="mb-2 text-justify text-xs italic text-foreground/40 md:mb-4">
							{overview}
						</p>
					)}

					<div className="flex items-center justify-end gap-2 md:justify-start md:gap-4">
						<div className="flex items-center gap-1 md:gap-2">
							<div className="flex gap-1 font-semibold italic md:text-lg">
								{voteAverage ? (
									<div className="flex gap-1">
										<span
											className={voteAverage ? ratingColor(voteAverage) : ''}
										>
											{voteAverage ? voteAverage.toFixed(1) : 'N/A'}
										</span>
										<span className="text-gray-400">/10</span>{' '}
									</div>
								) : (
									<span className="text-center text-foreground/40 md:text-lg">
										S/P
									</span>
								)}
							</div>
							<Image
								src={TmdbLogo}
								width={25}
								height={25}
								alt="TMDB logo"
								className="rounded"
							/>
						</div>
						<div className="flex items-center gap-1 md:gap-2">
							<div className="flex gap-1 font-semibold italic md:text-lg">
								{voteApp ? (
									<div className="flex gap-1">
										<span className={voteApp ? ratingColor(voteApp) : ''}>
											{voteApp ? voteApp.toFixed(1) : 'N/A'}
										</span>
										<span className="text-gray-400">/7</span>
									</div>
								) : (
									<span className="text-center text-foreground/40 md:text-lg">
										S/P
									</span>
								)}
							</div>
							<Image
								src={AppLogo}
								width={30}
								height={30}
								alt="Filmbook logo"
								className="rounded"
							/>
						</div>
					</div>
				</div>
			</Link>
			<div className="absolute bottom-2 left-2 md:left-auto md:right-2">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger
						asChild
						className="border-1 border-primary/50 bg-background text-sm hover:bg-background/50 md:text-base"
					>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="flex items-center gap-1 text-foreground/40"
						>
							Donde ver
							{open ? (
								<ArrowBigUpDashIcon className="size-4 shrink-0 text-primary opacity-50 md:size-6" />
							) : (
								<ArrowBigDownDashIcon className="size-4 shrink-0 text-primary opacity-50 md:size-6" />
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-full">
						<ProvidersForWatchlist
							providersList={providers}
							onClose={() => setOpen(false)}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	)
}
