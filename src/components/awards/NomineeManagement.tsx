"use client"

import { useState } from "react"
import type { Nominee, Category } from "@prisma/client"
import { createNominee, deleteNominee, updateNominee } from "@/app/(main)/gestion-premios/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Plus, Film, User, Music, ImageIcon, Info, Pencil } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useRef } from "react"
import useDebounce from "@/hooks/useDebounce"
import { Loader2, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

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

  // Edit State
  const [editingNominee, setEditingNominee] = useState<(Nominee & { category: Category }) | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    categoryId: "",
    movieId: "",
    movieTitle: "",
    photo: "",
    composers: "",
  })

  const [movieSearch, setMovieSearch] = useState("")
  const [editMovieSearch, setEditMovieSearch] = useState("")
  const [movieResults, setMovieResults] = useState<{ id: string, title: string, posterPath?: string, releaseDate?: string }[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showEditResults, setShowEditResults] = useState(false)

  const debouncedSearch = useDebounce(movieSearch, 300)
  const debouncedEditSearch = useDebounce(editMovieSearch, 300)

  const searchRef = useRef<HTMLDivElement>(null)
  const editSearchRef = useRef<HTMLDivElement>(null)

  // Search for Create Form
  useEffect(() => {
    async function searchMovies() {
      if (debouncedSearch.length < 2) {
        setMovieResults([])
        return
      }
      setIsSearching(true)
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(debouncedSearch)}`)
        const data = await res.json()
        setMovieResults(data)
        setShowResults(true)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }
    searchMovies()
  }, [debouncedSearch])

  // Search for Edit Form
  useEffect(() => {
    async function searchMovies() {
      if (debouncedEditSearch.length < 2) {
        setMovieResults([])
        return
      }
      setIsSearching(true)
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(debouncedEditSearch)}`)
        const data = await res.json()
        setMovieResults(data)
        setShowEditResults(true)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }
    searchMovies()
  }, [debouncedEditSearch])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
      if (editSearchRef.current && !editSearchRef.current.contains(event.target as Node)) {
        setShowEditResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectMovie = (movie: { id: string, title: string, posterPath?: string }, isEdit: boolean = false) => {
    if (isEdit) {
      setEditFormData({
        ...editFormData,
        movieId: movie.id,
      })
      setEditMovieSearch(movie.id)
      setShowEditResults(false)
    } else {
      setFormData({
        ...formData,
        movieId: movie.id,
      })
      setMovieSearch(movie.id)
      setShowResults(false)
    }
  }

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
      setMovieSearch("")
      toast({ title: "Nominado creado exitosamente" })
    } catch (error) {
      toast({ title: "Error al crear nominado", variant: "destructive" })
    }
  }

  const handleUpdate = async () => {
    if (!editingNominee || !editFormData.name || !editFormData.categoryId) return
    try {
      await updateNominee(editingNominee.id, editFormData)
      setEditingNominee(null)
      toast({ title: "Nominado actualizado" })
    } catch (error) {
      toast({ title: "Error al actualizar", variant: "destructive" })
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Robert Downey Jr. / I'm Just Ken"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select
                value={formData.categoryId}
                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
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
            <div className="space-y-2 relative" ref={searchRef}>
              <label className="text-sm font-medium">Movie ID (Busca por título o ingresa ID)</label>
              <div className="relative">
                <Input
                  value={formData.movieId}
                  onChange={(e) => {
                    const val = e.target.value
                    setFormData({ ...formData, movieId: val })
                    setMovieSearch(val) // Use the same value to trigger search
                  }}
                  placeholder="Busca por título para obtener el ID..."
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </div>
              </div>
              {showResults && movieResults.length > 0 && (
                <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto shadow-xl">
                  <ul className="p-1">
                    {movieResults.map(movie => (
                      <li
                        key={movie.id}
                        className="px-3 py-2 hover:bg-muted cursor-pointer rounded-sm flex items-center gap-3 transition-colors"
                        onClick={() => handleSelectMovie(movie)}
                      >
                        {movie.posterPath && (
                          <img src={movie.posterPath} alt="" className="w-8 h-12 object-cover rounded shadow-sm" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{movie.title}</span>
                          <span className="text-[10px] text-muted-foreground">ID: {movie.id}</span>
                          {movie.releaseDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(movie.releaseDate).getFullYear()}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pelicula Relacionada (Título)</label>
              <Input
                value={formData.movieTitle}
                onChange={(e) => setFormData({ ...formData, movieTitle: e.target.value })}
                placeholder="Ej: Oppenheimer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Foto / Poster</label>
              <Input
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Compositores / Adicional</label>
              <Input
                value={formData.composers}
                onChange={(e) => setFormData({ ...formData, composers: e.target.value })}
                placeholder="Mark Ronson, Andrew Wyatt..."
              />
            </div>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto"><Plus className="w-4 h-4 mr-2" /> Crear Nominado</Button>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {Object.entries(
          [...initialData].reduce((acc, nominee) => {
            const catName = nominee.category.name;
            if (!acc[catName]) acc[catName] = [];
            acc[catName].push(nominee);
            return acc;
          }, {} as Record<string, (Nominee & { category: Category })[]>)
        )
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([categoryName, categoryNominees]) => (
            <div key={categoryName} className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold bg-primary/10 px-3 py-1 rounded-md text-primary">
                  {categoryName}
                </h3>
                <div className="h-px bg-border flex-grow" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryNominees.map((nominee) => (
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
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                setEditingNominee(nominee)
                                setEditFormData({
                                  name: nominee.name,
                                  categoryId: nominee.categoryId,
                                  movieId: nominee.movieId || "",
                                  movieTitle: nominee.movieTitle || "",
                                  photo: nominee.photo || "",
                                  composers: nominee.composers || "",
                                })
                                setEditMovieSearch(nominee.movieId || "")
                              }}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => handleDelete(nominee.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
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
              </div>
            </div>
          ))}
        {initialData.length === 0 && (
          <p className="text-center py-10 text-muted-foreground italic">No hay nominados creados aún.</p>
        )}
      </div>

      <Dialog open={!!editingNominee} onOpenChange={() => setEditingNominee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Nominado</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select
                value={editFormData.categoryId}
                onValueChange={(val) => setEditFormData({ ...editFormData, categoryId: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 relative" ref={editSearchRef}>
              <label className="text-sm font-medium">Movie ID</label>
              <div className="relative">
                <Input
                  value={editFormData.movieId}
                  onChange={(e) => {
                    const val = e.target.value
                    setEditFormData({ ...editFormData, movieId: val })
                    setEditMovieSearch(val)
                  }}
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </div>
              </div>
              {showEditResults && movieResults.length > 0 && (
                <Card className="absolute z-[100] w-full mt-1 max-h-40 overflow-y-auto shadow-xl">
                  <ul className="p-1">
                    {movieResults.map(movie => (
                      <li
                        key={movie.id}
                        className="px-3 py-2 hover:bg-muted cursor-pointer rounded-sm flex items-center gap-3 transition-colors"
                        onClick={() => handleSelectMovie(movie, true)}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{movie.title}</span>
                          <span className="text-[10px] text-muted-foreground">ID: {movie.id}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pelicula Relacionada</label>
              <Input
                value={editFormData.movieTitle}
                onChange={(e) => setEditFormData({ ...editFormData, movieTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Foto</label>
              <Input
                value={editFormData.photo}
                onChange={(e) => setEditFormData({ ...editFormData, photo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Compositores</label>
              <Input
                value={editFormData.composers}
                onChange={(e) => setEditFormData({ ...editFormData, composers: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNominee(null)}>Cancelar</Button>
            <Button onClick={handleUpdate}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
