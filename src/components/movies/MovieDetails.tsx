'use client'

import Image from 'next/image'
import { useState } from 'react'

import ProvidersInfo from './ProvidersInfo'
import CrewCastSection from './CrewCastSection'
import GeneralInfoSection from './GeneralInfoSection'
import DetailsSection from './DetailsSection'
import PhotoModal from './PhotoModal'

import type { ImageInfo, Movie } from '@/lib/types'

interface MovieDetailsProps {
	movie: Movie
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
	const [openModal, setOpenModal] = useState<boolean>(false)
	const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null)

	const handleImageClick = (image: ImageInfo) => {
		setSelectedImage(image)
		setOpenModal(true)
	}

	const {
		id,
		overview,
		runtime,
		title,
		directors,
		releaseDate,
		backdropPath,
		productionCompanies,
		productionCountries,
		cast,
		crew,
		genres,
		providers,
		posterPath,
		spokenLanguages,
		voteAverage,
		voteCount,
		rating,
		reviews,
		watchlist
	} = movie
	return (
		<div className="relative w-full">
			{backdropPath && (
				<div className="relative h-[30vh] w-full overflow-hidden rounded-t-md md:h-[40vh] lg:h-[50vh]">
					<Image
						src={backdropPath}
						alt="Backdrop"
						fill
						className="absolute inset-0 size-full cursor-pointer object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						quality={100}
						priority
					/>
					<div className="absolute -inset-10 bg-gradient-to-t from-primary/30 to-transparent dark:from-card md:inset-0" />
				</div>
			)}
			<GeneralInfoSection
				id={id}
				title={title}
				releaseDate={releaseDate}
				posterPath={posterPath}
				runtime={runtime}
				genres={genres}
				directors={directors}
				rating={rating}
				voteAverage={voteAverage}
				voteCount={voteCount}
				overview={overview}
				reviews={reviews}
				watchlist={watchlist}
				handleImageClick={handleImageClick}
			/>
			<ProvidersInfo providersList={providers} />
			<hr className="mx-5 mb-2 mt-5 h-px border-none bg-primary/40 md:mx-12 md:mb-5 md:mt-8" />
			<CrewCastSection
				cast={cast}
				crew={crew}
				handleImageClick={handleImageClick}
			/>
			<hr className="mx-5 my-2 h-px border-none bg-primary/40 md:mx-12 md:my-5" />
			<DetailsSection
				productionCompanies={productionCompanies}
				productionCountries={productionCountries}
				spokenLanguages={spokenLanguages}
			/>
			<PhotoModal
				isOpen={openModal}
				onClose={() => setOpenModal(false)}
				image={selectedImage}
			/>
		</div>
	)
}
