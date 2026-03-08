"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import oscarsImg from "@/assets/Oscars.jpg"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import PhotoModal from "@/components/movies/PhotoModal"
import type { ImageInfo } from "@/lib/types"
import DynamicNomineeCard from "./DynamicNomineeCard"
import { useToast } from "@/components/ui/use-toast"
import { useAddPredictionsMutation } from "../predictions/mutations"
import LoadingButton from "@/components/LoadingButton"
import { Trophy, Sparkles, Check } from "lucide-react"
import { cn } from "@/lib/utils"

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

    const [basePredictions, setBasePredictions] = useState(predictions)
    const [showSticky, setShowSticky] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowSticky(window.scrollY > 400)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const isDirty = useMemo(() => {
        return JSON.stringify(predictions) !== JSON.stringify(basePredictions)
    }, [predictions, basePredictions])

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
                setBasePredictions(predictions)
                toast({
                    title: "Predicciones guardadas",
                    description: "Tus predicciones han sido guardadas correctamente.",
                })
            }
        })
    }

    return (
        <main className="flex w-full min-w-0 flex-col gap-5">
            {/* Sticky Edit Mode Banner */}
            {isDirty && showSticky && (
                <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top duration-300">
                    <div className="bg-primary/95 backdrop-blur-md text-primary-foreground px-4 py-3 shadow-lg flex items-center justify-between container mx-auto rounded-b-xl border-x border-b border-primary/20">
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-white/20">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-tight">Modo Edición</p>
                                <p className="text-[10px] opacity-90 hidden sm:block">Tienes cambios sin guardar en tus predicciones</p>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white text-primary hover:bg-white/90 font-bold gap-2 shadow-sm"
                            onClick={handleSave}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    Guardando...
                                </span>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            <div className="relative overflow-hidden rounded-2xl bg-black shadow-xl h-60 sm:h-80 flex items-center justify-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={oscarsImg}
                        alt="Oscars Background"
                        fill
                        className="object-cover opacity-60 brightness-75 transition-transform duration-700 hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Header Content */}
                <div className="relative z-10 w-full px-6 text-center text-white">
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tighter drop-shadow-2xl uppercase italic">
                        {event.name}
                    </h1>

                    {user ? (
                        <div className="mt-6 flex flex-col items-center gap-4">
                            {isDirty && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 animate-pulse">
                                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground">
                                        Modo Edición
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-wrap justify-center gap-3">
                                <Button
                                    variant="secondary"
                                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                                    onClick={() => router.push(`/usuarios/predicciones/${user.id}?username=${user.username}`)}
                                >
                                    Mis Predicciones
                                </Button>
                                <LoadingButton
                                    loading={isPending}
                                    onClick={handleSave}
                                    className={cn(
                                        "transition-all duration-300",
                                        isDirty
                                            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/40 ring-2 ring-primary ring-offset-2 ring-offset-black animate-pulse-slow"
                                            : "bg-primary/80 hover:bg-primary/90 text-primary-foreground"
                                    )}
                                >
                                    Guardar Predicciones
                                </LoadingButton>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-sm font-medium text-gray-300 drop-shadow-md">
                            Inicia sesión para realizar y ver tus predicciones.
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-16 pb-20 mt-8">
                {categories.map((category) => (
                    <div key={category.id} className="container mx-auto px-2 sm:px-4">
                        {/* Enhanced Category Header */}
                        <div className="relative mb-8 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-transparent blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/10 via-background to-transparent border-l-4 border-primary shadow-sm overflow-hidden animate-in fade-in slide-in-from-left duration-700">
                                <div className="p-2 rounded-lg bg-primary/20 text-primary animate-pulse-slow">
                                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-2">
                                        {category.name}
                                    </h2>
                                    <div className="h-0.5 w-24 bg-gradient-to-r from-primary to-transparent mt-1" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 ml-2 sm:ml-4">
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
                        className={cn(
                            "w-full max-w-md transition-all duration-300",
                            isDirty
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/40 ring-2 ring-primary ring-offset-2 animate-pulse-slow"
                                : ""
                        )}
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
