import { Metadata } from "next"
import Link from "next/link"
import { LogIn } from "lucide-react"

import Bookmarks from "./Bookmarks"
import TrendsSidebar from "@/components/TrendsSidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { validateRequest } from "@/auth"
import Watchlist from "./Watchlist"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Marcadores",
}

export default async function BookmarksPage() {
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return (
      <main className="flex w-full min-w-0 gap-5 items-start">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>Necesitas iniciar sesión para ver tus marcadores y watchlist.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Inicia sesión para acceder a todas las funciones de marcadores y watchlist, incluyendo:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Guardar tus películas y series favoritas</li>
              <li>Organizar tu watchlist personal</li>
              <li>Sincronizar tus marcadores en todos tus dispositivos</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/iniciar-sesion">
                <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <TrendsSidebar />
      </main>
    )
  }

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Tabs defaultValue="bookmarks" className='w-full'>
          <TabsList className="rounded-md bg-card-child p-1 text-muted-foreground shadow-sm">
            <TabsTrigger value="bookmarks" className="text-xs sm:text-sm">Marcadores</TabsTrigger>
            <TabsTrigger value="watchlist" className="text-xs sm:text-sm">Watchlist</TabsTrigger>
          </TabsList>
          <TabsContent value="bookmarks">
            <Bookmarks />
          </TabsContent>
          <TabsContent value="watchlist">
            <Watchlist userId={loggedInUser.id} />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  )
}
