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

  const captureContent = async (): Promise<string> => {
    if (!contentRef.current) throw new Error("Content not found")

    const content = contentRef.current
    const originalStyle = content.style.cssText
    content.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 1920px;
      height: auto;
      transform: none;
      overflow: visible;
      z-index: -1;
    `

    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#030711",
      logging: false,
      width: 1920,
      height: content.scrollHeight,
    })

    content.style.cssText = originalStyle

    return canvas.toDataURL("image/png")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Award className="h-4 w-4" />
          <span className="hidden sm:inline">Ver todas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] sm:h-[98vh] w-[95vw] max-w-[95vw] z-[200]">
        <DialogHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <DialogTitle className="text-base sm:text-lg">
            {event.name} {event.year} - Todas las predicciones
          </DialogTitle>
          <ShareButton onShare={captureContent} />
        </DialogHeader>
        <ScrollArea className="pr-4">
          <div className="bg-background p-4 sm:p-8 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
              Predicciones {event.name} {event.year}
            </h2>
            <div
              ref={contentRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
            >
              {Object.entries(event.categories).map(([category, prediction]) => (
                <div
                  key={prediction.id}
                  className="bg-card rounded-lg border p-3 shadow-sm space-y-2 flex flex-col"
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

