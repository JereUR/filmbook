"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PredictionsListSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2].map((i) => (
        <Card key={i} className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0" />
          <CardHeader className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="h-8 w-64 bg-muted animate-pulse rounded" />
                <div className="h-4 w-40 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                <div className="h-9 w-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] sm:h-[600px] pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <PredictionCardSkeleton key={j} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function PredictionCardSkeleton() {
  return (
    <div className="relative bg-card rounded-lg border shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/0 rounded-t-lg" />
      <div className="relative p-3 sm:p-4 space-y-4">
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        <div className="space-y-4">
          <WinnerSkeleton />
          <div className="h-px bg-muted" />
          <WinnerSkeleton />
        </div>
      </div>
    </div>
  )
}

function WinnerSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-28 bg-muted animate-pulse rounded" />
      <div className="flex items-start gap-2">
        <div className="relative flex-shrink-0 w-10 h-14 bg-muted animate-pulse rounded" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  )
}

