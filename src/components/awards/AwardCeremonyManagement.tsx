"use client"

import { useState } from "react"
import type { AwardEvent } from "@prisma/client"
import { createAwardEvent, deleteAwardEvent, updateAwardEvent } from "@/app/(main)/gestion-premios/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Plus, Power, PowerOff } from "lucide-react"

interface Props {
    initialData: AwardEvent[]
}

export default function AwardCeremonyManagement({ initialData }: Props) {
    const [name, setName] = useState("")
    const [active, setActive] = useState(true)
    const { toast } = useToast()

    const handleCreate = async () => {
        try {
            if (!name) return
            await createAwardEvent({ name, active })
            setName("")
            toast({ title: "Entrega creada exitosamente" })
        } catch (error) {
            toast({ title: "Error al crear la entrega", variant: "destructive" })
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta entrega?")) {
            try {
                await deleteAwardEvent(id)
                toast({ title: "Entrega eliminada" })
            } catch (error) {
                toast({ title: "Error al eliminar", variant: "destructive" })
            }
        }
    }

    const handleToggleActive = async (event: AwardEvent) => {
        try {
            await updateAwardEvent(event.id, { active: !event.active })
            toast({ title: "Estado actualizado" })
        } catch (error) {
            toast({ title: "Error al actualizar estado", variant: "destructive" })
        }
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Nueva Entrega de Premios</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-center md:items-end">
                    <div className="space-y-2 flex-grow w-full">
                        <label className="text-sm font-medium">Nombre (ej: Oscars 2026)</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del evento" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            id="active"
                            className="w-4 h-4"
                        />
                        <label htmlFor="active" className="text-sm font-medium whitespace-nowrap">Vigente (Activa)</label>
                    </div>
                    <Button onClick={handleCreate} className="w-full md:w-auto mb-0.5"><Plus className="w-4 h-4 mr-2" /> Crear</Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialData.map((ceremony) => (
                    <Card key={ceremony.id}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold">{ceremony.name}</p>
                                <div className="flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${ceremony.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <p className="text-xs text-muted-foreground">{ceremony.active ? "Activa" : "Inactiva"}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleToggleActive(ceremony)}
                                    title={ceremony.active ? "Desactivar" : "Activar"}
                                >
                                    {ceremony.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(ceremony.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {initialData.length === 0 && (
                    <p className="col-span-full text-center py-10 text-muted-foreground italic">No hay entregas creadas aún.</p>
                )}
            </div>
        </div>
    )
}
