"use client"

import { useState } from "react"
import type { Category, AwardEvent, Nominee } from "@prisma/client"
import { createCategory, deleteCategory, updateCategory } from "@/app/(main)/gestion-premios/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Plus, Trophy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExtendedCategory extends Category {
    events: AwardEvent[]
    nominees: Nominee[]
}

interface Props {
    initialData: ExtendedCategory[]
    ceremonies: AwardEvent[]
}

export default function CategoryManagement({ initialData, ceremonies }: Props) {
    const [name, setName] = useState("")
    const [selectedCeremonyIds, setSelectedCeremonyIds] = useState<string[]>([])
    const { toast } = useToast()

    const handleCreate = async () => {
        try {
            if (!name || selectedCeremonyIds.length === 0) {
                toast({ title: "Nombre y al menos una entrega son requeridos", variant: "destructive" })
                return
            }
            await createCategory({ name, eventIds: selectedCeremonyIds })
            setName("")
            setSelectedCeremonyIds([])
            toast({ title: "Categoría creada exitosamente" })
        } catch (error) {
            toast({ title: "Error al crear la categoría", variant: "destructive" })
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta categoría?")) {
            try {
                await deleteCategory(id)
                toast({ title: "Categoría eliminada" })
            } catch (error) {
                toast({ title: "Error al eliminar", variant: "destructive" })
            }
        }
    }

    const toggleCeremony = (id: string) => {
        setSelectedCeremonyIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Nueva Categoría</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre (ej: Mejor Película)</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mejor Película..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Asociar a Entregas:</label>
                            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                                {ceremonies.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => toggleCeremony(c.id)}
                                        className={`px-3 py-1 rounded-full text-xs transition-colors ${selectedCeremonyIds.includes(c.id)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-secondary-foreground'
                                            }`}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                                {ceremonies.length === 0 && <p className="text-xs italic">Crea una entrega primero</p>}
                            </div>
                        </div>
                        <Button onClick={handleCreate} className="w-full md:w-auto self-end"><Plus className="w-4 h-4 mr-2" /> Crear</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialData.map((category) => (
                    <Card key={category.id}>
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{category.name}</CardTitle>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(category.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex flex-wrap gap-1 mb-3">
                                {category.events.map(c => (
                                    <span key={c.id} className="bg-muted text-[10px] px-1.5 py-0.5 rounded italic">
                                        {c.name}
                                    </span>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium flex items-center gap-1">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    Ganador: {category.nominees.find(n => n.id === category.winnerId)?.name || 'Pendiente'}
                                </p>

                                {category.nominees.length > 0 && (
                                    <Select
                                        value={category.winnerId || "none"}
                                        onValueChange={(val) => updateCategory(category.id, { winnerId: val === "none" ? null : val })}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="Marcar ganador" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Ninguno</SelectItem>
                                            {category.nominees.map(n => (
                                                <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {initialData.length === 0 && (
                    <p className="col-span-full text-center py-10 text-muted-foreground italic">No hay categorías creadas aún.</p>
                )}
            </div>
        </div>
    )
}
