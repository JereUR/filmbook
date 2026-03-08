"use client"

import { useRef } from "react"
import { Award } from "lucide-react"
import html2canvas from "html2canvas"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { AwardEvent } from "@/types/predictions"
import { PredictionItem } from "./PredictionItem"
import { ShareButton } from "./ShareButton"

interface PredictionsDialogProps {
  event: AwardEvent
}

export function PredictionsDialog({ event }: PredictionsDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const captureContent = async (): Promise<string[]> => {
    if (!contentRef.current) throw new Error("Content not found")

    // Use the actual rendered cards from the DOM
    const cards = Array.from(contentRef.current.querySelectorAll(".prediction-card"))
    const chunkSize = 4
    const images: string[] = []

    // Temporary container for capturing
    const container = document.createElement("div")
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: -9999px;
      width: 800px;
      background: #030711;
      padding: 40px;
    `
    document.body.appendChild(container)

    try {
      for (let i = 0; i < cards.length; i += chunkSize) {
        const chunk = cards.slice(i, i + chunkSize)
        const partIndex = Math.floor(i / chunkSize) + 1
        const totalParts = Math.ceil(cards.length / chunkSize)

        container.innerHTML = `
          <div style="text-align: center; margin-bottom: 30px; color: white;">
            <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 8px; font-family: sans-serif;">
              Predicciones ${event.name} ${event.year}
            </h2>
            <p style="color: #94a3b8; font-size: 14px; font-family: sans-serif;">Parte ${partIndex} de ${totalParts}</p>
          </div>
          <div id="capture-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;"></div>
          <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 12px; font-family: sans-serif;">
            Filmbook - Tus predicciones de cine
          </div>
        `

        const grid = container.querySelector("#capture-grid")!
        chunk.forEach(card => {
          const clone = card.cloneNode(true) as HTMLElement
          clone.style.width = "100%"
          clone.style.minWidth = "0"
          clone.style.display = "flex"
          grid.appendChild(clone)
        })

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#030711",
          logging: false,
        })

        images.push(canvas.toDataURL("image/png"))
      }
    } finally {
      document.body.removeChild(container)
    }

    return images
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Award className="h-4 w-4" />
          <span className="hidden sm:inline">Ver todas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] sm:h-[98vh] w-[95vw] max-w-[95vw] z-[200] items-start overflow-y-auto scrollbar-thin">
        <DialogHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <DialogTitle className="text-base sm:text-lg">
            {event.name} {event.year} - Todas las predicciones
          </DialogTitle>
          <ShareButton onShare={captureContent} />
        </DialogHeader>
        <ScrollArea className="pr-4">
          <div ref={contentRef} className="bg-background p-2 sm:p-8 rounded-lg items-start">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
              Predicciones {event.name} {event.year}
            </h2>
            <div

              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4"
            >
              {Object.entries(event.categories).map(([category, prediction]) => (
                <div
                  key={prediction.id}
                  className="prediction-card bg-card rounded-lg border p-3 shadow-sm space-y-2 flex flex-col"
                  style={{ minWidth: "200px" }}
                >
                  <h4 className="font-semibold text-sm">{category}</h4>
                  <PredictionItem
                    predictedWinnerName={prediction.predictedWinnerName}
                    predictedWinnerImage={prediction.predictedWinnerImage}
                    favoriteWinnerName={prediction.favoriteWinnerName}
                    favoriteWinnerImage={prediction.favoriteWinnerImage}
                    compact
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

