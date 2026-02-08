"use client"

import { useState } from "react"
import type { Nominee, Category } from "@prisma/client"
import { createNominee, deleteNominee } from "@/app/(main)/gestion-premios/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Plus, Film, User, Music, ImageIcon, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  initialData: (Nominee & { category: Category })[]
  categories: Category[]
}

export default function NomineeManagement({ initialData, categories }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    movieId: "",
    movieTitle: "",
    photo: "",
    composers: "",
  })
  
  const { toast } = useToast()

  const handleCreate = async () => {
    try {
      if (!formData.name || !formData.categoryId) {
        toast({ title: "Nombre y Categoría son requeridos", variant: "destructive" })
        return
      }
      await createNominee({
        ...formData,
        providers: {} // Default empty JSON for now
      })
      setFormData({
        name: "",
        categoryId: "",
        movieId: "",
        movieTitle: "",
        photo: "",
        composers: "",
      })
      toast({ title: "Nominado creado exitosamente" })
    } catch (error) {
      toast({ title: "Error al crear nominado", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este nominado?")) {
      try {
        await deleteNominee(id)
        toast({ title: "Nominado eliminado" })
      } catch (error) {
        toast({ title: "Error al eliminar", variant: "destructive" })
      }
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Nominado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nombre Completo / Persona / Canción</label>
                <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="Ej: Robert Downey Jr. / I'm Just Ken" 
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
                <Select 
                    value={formData.categoryId} 
                    onValueChange={(val) => setFormData({...formData, categoryId: val})}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Pelicula Relacionada (Título)</label>
                <Input 
                    value={formData.movieTitle} 
                    onChange={(e) => setFormData({...formData, movieTitle: e.target.value})} 
                    placeholder="Ej: Oppenheimer" 
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Movie ID (TMDB/Interno opcional)</label>
                <Input 
                    value={formData.movieId} 
                    onChange={(e) => setFormData({...formData, movieId: e.target.value})} 
                    placeholder="ID de la película" 
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">URL Foto / Poster</label>
                <Input 
                    value={formData.photo} 
                    onChange={(e) => setFormData({...formData, photo: e.target.value})} 
                    placeholder="https://..." 
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Compositores / Adicional</label>
                <Input 
                    value={formData.composers} 
                    onChange={(e) => setFormData({...formData, composers: e.target.value})} 
                    placeholder="Mark Ronson, Andrew Wyatt..." 
                />
            </div>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto"><Plus className="w-4 h-4 mr-2" /> Crear Nominado</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialData.map((nominee) => (
          <Card key={nominee.id}>
            <CardContent className="p-4 flex gap-4">
              {nominee.photo ? (
                  <img src={nominee.photo} alt={nominee.name} className="w-16 h-24 object-cover rounded bg-muted flex-none" />
              ) : (
                  <div className="w-16 h-24 bg-muted rounded flex items-center justify-center flex-none">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
              )}
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                    <p className="font-bold truncate">{nominee.name}</p>
                    <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => handleDelete(nominee.id)}>
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{nominee.category.name}</p>
                {nominee.movieTitle && (
                    <p className="text-xs flex items-center gap-1 mt-1 truncate">
                        <Film className="w-3 h-3" /> {nominee.movieTitle}
                    </p>
                )}
                {nominee.composers && (
                    <p className="text-[10px] italic mt-1 truncate">
                        {nominee.composers}
                    </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {initialData.length === 0 && (
            <p className="col-span-full text-center py-10 text-muted-foreground italic">No hay nominados creados aún.</p>
        )}
      </div>
    </div>
  )
}
