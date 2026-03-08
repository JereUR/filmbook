"use client"

import { useState } from "react"
import { Share2, Download, Copy, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "../ui/use-toast"

interface ShareButtonProps {
  onShare: () => Promise<string | string[]>
}

export function ShareButton({ onShare }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const handleShare = async (action: "download" | "copy" | "twitter" | "instagram") => {
    try {
      setIsSharing(true)
      const result = await onShare()
      const images = Array.isArray(result) ? result : [result]

      switch (action) {
        case "download":
          images.forEach((imageUrl, index) => {
            const link = document.createElement("a")
            link.download = images.length > 1 ? `predicciones_${index + 1}.png` : "predicciones.png"
            link.href = imageUrl
            link.click()
          })
          toast({ title: images.length > 1 ? `${images.length} imágenes descargadas` : "Imagen descargada" })
          break

        case "copy":
          const firstImageUrl = images[0]
          const blob = await fetch(firstImageUrl).then((r) => r.blob())
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ])
          toast({
            title: images.length > 1
              ? "Primera imagen copiada al portapapeles"
              : "Imagen copiada al portapapeles"
          })
          break

        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=Mis predicciones de los Oscars 2025 en Filmbook&url=${encodeURIComponent(window.location.href)}`,
            "_blank",
          )
          break
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        variant: "destructive",
        title: "Error al compartir la imagen"
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 mr-6" disabled={isSharing}>
          <Share2 className="h-4 w-4" />
          {isSharing ? "Compartiendo..." : "Compartir"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[201]">
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleShare("download")}>
          <Download className="h-4 w-4 mr-2" />
          Descargar imagen (Recomendado en versión escritorio) <strong className="text-teal-500 dark:text-teal-400 ml-2">*Descarga una imagen por cada 4 predicciones</strong>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleShare("copy")}>
          <Copy className="h-4 w-4 mr-2" />
          Copiar al portapapeles (Recomendado en versión escritorio)
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleShare("twitter")}>
          <Twitter className="h-4 w-4 mr-2" />
          Compartir en Twitter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

