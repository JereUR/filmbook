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
          Ver todas
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[98vh] max-w-[95%] z-[200]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {event.name} {event.year} - Todas las predicciones
          </DialogTitle>
          <ShareButton onShare={captureContent} />
        </DialogHeader>
        <ScrollArea className="pr-4">
          <div className="bg-background p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Predicciones {event.name} {event.year}
            </h2>
            <div ref={contentRef} className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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

