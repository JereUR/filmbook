"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import PhotoModal from "@/components/movies/PhotoModal"
import type { ImageInfo } from "@/lib/types"
import NominationsMovies from "./NominationsMovies"
import NominationsPersons from "./NominationsPersons"
import NominationsSong from "./NominationsSong"
import useOscarsNominees from "@/hooks/useOscarsNominees"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export default function NomineesPageOscars() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  const { nominationsPerson, nominationsMovie, nominationsOriginalSong } = useOscarsNominees()

  const handleImageClick = (image: ImageInfo) => {
    setSelectedImage(image)
    setOpenModal(true)
  }

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Nominaciones Oscars 97th Academy Awards</h1>
          {user ? (
            <div className="mt-4 flex justify-center space-x-4">
              <Button className='bg-primary hover:bg-primary/70' onClick={() => router.push(`/usuarios/predicciones/${user.id}?username=${user.username}`)}>Mis Predicciones</Button>
              <Button className='bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700' onClick={() => router.push("/crear-predicciones/Oscars-2025")}>Agregar Predicciones</Button>
            </div>
          ) : <p className="text-sm text-muted-foreground text-center">
            Inicia sesión para poder realizar tus predicciones.
          </p>}

        </div>
        <div className="space-y-1">
          <NominationsMovies handleImageClick={handleImageClick} nominationsMovie={nominationsMovie} />
          <NominationsPersons handleImageClick={handleImageClick} nominationsPerson={nominationsPerson} />
          <NominationsSong handleImageClick={handleImageClick} nominationsOriginalSong={nominationsOriginalSong} />
        </div>
      </div>
      <PhotoModal isOpen={openModal} onClose={() => setOpenModal(false)} image={selectedImage} />
    </main>
  )
}

