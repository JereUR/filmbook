"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import PhotoModal from "@/components/movies/PhotoModal"
import type { ImageInfo } from "@/lib/types"
import DynamicNomineeCard from "./DynamicNomineeCard"
import { useToast } from "@/components/ui/use-toast"
import { useAddPredictionsMutation } from "../predictions/mutations"
import LoadingButton from "@/components/LoadingButton"

interface Nominee {
    id: string
    name: string
    photo?: string | null
    movieTitle?: string | null
    movieId?: string | null
    providers?: any
    composers?: string | null
}

interface Category {
    id: string
    name: string
    winnerId?: string | null
    nominees: Nominee[]
}

interface AwardEvent {
    id: string
    name: string
}

interface DynamicAwardNomineesProps {
    event: AwardEvent
    categories: Category[]
    initialPredictions?: any[]
}

export default function DynamicAwardNominees({
    event,
    categories,
    initialPredictions = []
}: DynamicAwardNomineesProps) {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null)
    const { user } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const [predictions, setPredictions] = useState<Record<string, { nomineeId?: string; favoriteNomineeId?: string }>>(
        initialPredictions.reduce((acc, pred) => ({
            ...acc,
            [pred.categoryId]: {
                nomineeId: pred.nomineeId,
                favoriteNomineeId: pred.favoriteNomineeId
            }
        }), {})
    )

    const { mutate: savePredictions, isPending } = useAddPredictionsMutation()

    const handleImageClick = (image: ImageInfo) => {
        setSelectedImage(image)
        setOpenModal(true)
    }

    const handleSelectPrediction = (categoryId: string, nomineeId: string) => {
        setPredictions(prev => ({
            ...prev,
            [categoryId]: {
                ...prev[categoryId],
                nomineeId: prev[categoryId]?.nomineeId === nomineeId ? undefined : nomineeId
            }
        }))
    }

    const handleSelectFavorite = (categoryId: string, nomineeId: string) => {
        setPredictions(prev => ({
            ...prev,
            [categoryId]: {
                ...prev[categoryId],
                favoriteNomineeId: prev[categoryId]?.favoriteNomineeId === nomineeId ? undefined : nomineeId
            }
        }))
    }

    const handleSave = () => {
        if (!user) return

        const predictionData = Object.entries(predictions)
            .filter(([_, data]) => data.nomineeId || data.favoriteNomineeId)
            .map(([categoryId, data]) => {
                const category = categories.find(c => c.id === categoryId)
                const nominee = category?.nominees.find(n => n.id === data.nomineeId)
                const favoriteNominee = category?.nominees.find(n => n.id === data.favoriteNomineeId)

                return {
                    userId: user.id,
                    eventId: event.id,
                    categoryId,
                    category: category?.name || "",
                    nomineeId: data.nomineeId,
                    predictedWinnerName: nominee?.name || "",
                    predictedWinnerImage: nominee?.photo,
                    favoriteNomineeId: data.favoriteNomineeId,
                    favoriteWinnerName: favoriteNominee?.name || "",
                    favoriteWinnerImage: favoriteNominee?.photo,
                }
            })

        if (predictionData.length === 0) {
            toast({
                variant: "destructive",
                title: "No hay predicciones",
                description: "Por favor, selecciona al menos una predicción para guardar.",
            })
            return
        }

        savePredictions(predictionData as any, {
            onSuccess: () => {
                toast({
                    title: "Predicciones guardadas",
                    description: "Tus predicciones han sido guardadas correctamente.",
                })
            }
        })
    }

    return (
        <main className="flex w-full min-w-0 flex-col gap-5">
            <div className="rounded-2xl bg-card p-5 shadow-sm">
                <h1 className="text-center text-2xl font-bold">{event.name}</h1>
                {user ? (
                    <div className="mt-4 flex flex-col items-center gap-4">
                        <div className="flex justify-center space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/usuarios/predicciones/${user.id}?username=${user.username}`)}
                            >
                                Mis Predicciones
                            </Button>
                            <LoadingButton
                                loading={isPending}
                                onClick={handleSave}
                            >
                                Guardar Predicciones
                            </LoadingButton>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center mt-4">
                        Inicia sesión para poder realizar y ver tus predicciones.
                    </p>
                )}
            </div>

            <div className="space-y-10 pb-20">
                {categories.map((category) => (
                    <div key={category.id} className="container mx-auto px-2 sm:px-4">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary">{category.name}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {category.nominees.map((nominee) => (
                                <DynamicNomineeCard
                                    key={nominee.id}
                                    nominee={nominee}
                                    isWinner={category.winnerId === nominee.id}
                                    isPredicted={predictions[category.id]?.nomineeId === nominee.id}
                                    isFavorite={predictions[category.id]?.favoriteNomineeId === nominee.id}
                                    onSelectPrediction={user ? (id) => handleSelectPrediction(category.id, id) : undefined}
                                    onSelectFavorite={user ? (id) => handleSelectFavorite(category.id, id) : undefined}
                                    onImageClick={handleImageClick}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <PhotoModal isOpen={openModal} onClose={() => setOpenModal(false)} image={selectedImage} />

            {user && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-50 flex justify-center lg:hidden">
                    <LoadingButton
                        className="w-full max-w-md"
                        loading={isPending}
                        onClick={handleSave}
                    >
                        Guardar Predicciones
                    </LoadingButton>
                </div>
            )}
        </main>
    )
}
