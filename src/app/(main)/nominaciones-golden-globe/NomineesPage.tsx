'use client'

import { useState } from 'react'

import GoldenGlobeNominationsPersons from './GoldenGlobeNominationsPersons'
import PhotoModal from '@/components/movies/PhotoModal'
import { ImageInfo } from '@/lib/types'
import GoldenGlobeNominationsMovies from './GoldenGlobeNominationsMovies'
import GoldenGlobeNominationsSong from './GoldenGlobeNominationsSong'

export default function NomineesPage() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null)

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
        <div>
          <GoldenGlobeNominationsMovies handleImageClick={handleImageClick} />
          <GoldenGlobeNominationsPersons handleImageClick={handleImageClick} />
          <GoldenGlobeNominationsSong handleImageClick={handleImageClick} />
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
