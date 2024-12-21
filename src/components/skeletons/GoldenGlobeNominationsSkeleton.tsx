import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GoldenGlobeNominationsSkeleton() {
  const categories = Array(4).fill(null)

  return (
    <div className="container mx-auto px-2 sm:px-4">
      {categories.map((_, categoryIndex) => (
        <div key={categoryIndex} className="mb-8 sm:mb-12">
          <Skeleton className="h-8 w-3/4 mb-4 sm:mb-6" />
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {Array(4).fill(null).map((_, nomineeIndex) => (
              <Card key={nomineeIndex} className="overflow-hidden">
                <div className="relative aspect-[3/4] w-full">
                  <Skeleton className="absolute inset-0" />
                </div>
                <CardContent className="p-2 sm:p-4 space-y-1 sm:space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

