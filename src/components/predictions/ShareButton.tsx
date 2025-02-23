"use client"

import { useState } from "react"
import { Share2, Download, Copy, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "../ui/use-toast"

interface ShareButtonProps {
  onShare: () => Promise<string>
}

export function ShareButton({ onShare }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const handleShare = async (action: "download" | "copy" | "twitter" | "instagram") => {
    try {
      setIsSharing(true)
      const imageUrl = await onShare()

      switch (action) {
        case "download":
          const link = document.createElement("a")
          link.download = "predicciones.png"
          link.href = imageUrl
          link.click()
          toast({ title: "Imagen descargada" })
          break

        case "copy":
          const blob = await fetch(imageUrl).then((r) => r.blob())
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ])
          toast({ title: "Imagen copiada al portapapeles" })
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
          Descargar imagen (Recomendado en versión escritorio)
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

