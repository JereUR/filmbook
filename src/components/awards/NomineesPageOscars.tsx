'use client'

import { useState } from 'react'

import PhotoModal from '@/components/movies/PhotoModal'
import { ImageInfo } from '@/lib/types'
import NominationsMovies from './NominationsMovies'
import NominationsPersons from './NominationsPersons'
import NominationsSong from './NominationsSong'
import useOscarsNominees from '@/hooks/useOscarsNominees'

export default function NomineesPageOscars() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null)

  const { nominationsPerson, nominationsMovie, nominationsOriginalSong } = useOscarsNominees()

  const handleImageClick = (image: ImageInfo) => {
    setSelectedImage(image)
    setOpenModal(true)
  }
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Nominaciones</h1>
        </div>
        <div className='space-y-1'>
          <NominationsMovies handleImageClick={handleImageClick} nominationsMovie={nominationsMovie} />
          <NominationsPersons handleImageClick={handleImageClick} nominationsPerson={nominationsPerson} />
          <NominationsSong handleImageClick={handleImageClick} nominationsOriginalSong={nominationsOriginalSong} />
        </div>
      </div>
      <PhotoModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        image={selectedImage}
      />
    </main>
  )
}
