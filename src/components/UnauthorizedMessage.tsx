import Link from "next/link"
import { LogIn } from "lucide-react"

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import TrendsSidebar from "./TrendsSidebar"

interface UnauthorizedMessageProps {
  sectionMessage: string
  trendsSidebar: boolean
}

export default function UnauthorizedMessage({ sectionMessage, trendsSidebar }: UnauthorizedMessageProps) {
  return <main className="flex w-full min-w-0 gap-5 items-start">
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Acceso Restringido</CardTitle>
        <CardDescription>{sectionMessage}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Inicia sesión para acceder a todas las funciones de Filmbook, incluyendo:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Realizar publicaciones y reviews de películas</li>
          <li>Guardar tus películas y series favoritas</li>
          <li>Organizar tu watchlist personal</li>
          <li>Sincronizar tus marcadores en todos tus dispositivos</li>
          <li>Y más...</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/iniciar-sesion" className='flex items-center gap-2'>
            <LogIn className="h-4 w-4" /> Iniciar Sesión
          </Link>
        </Button>
      </CardFooter>
    </Card>
    {trendsSidebar && <TrendsSidebar />}
  </main>
}