import Link from "next/link"
import Image from "next/image"
import { LogIn, UserRoundPlus } from "lucide-react"

import SearchField from "@/components/SearchField"
import UserButton from "@/components/UserButton"
import logoImg from '@/assets/logo.png'
import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function Navbar() {
  const { user } = await validateRequest()

  return (
    <header className="sticky top-0 z-[90] bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-primary">
          <div className="flex flex-col items-center">
            <Image src={logoImg} alt="App logo" width={60} height={60} />
            <span className="text-2xl font-bold">Filmbook</span>
          </div>
        </Link>
        <SearchField />
        {user ? <UserButton className="sm:ms-auto" /> :
          <div className='flex flex-col gap-2 md:flex-row sm:ms-auto'><Button>
            <Link href="/iniciar-sesion" className='flex items-center gap-2'>
              <LogIn className="h-5 w-5" /> Iniciar Sesión
            </Link>
          </Button>
            <Button className='bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700'>
              <Link href="/registrarse" className='flex items-center gap-2'>
                <UserRoundPlus className="h-5 w-5" /> Regístrate
              </Link>
            </Button>
          </div>
        }
      </div>
    </header>
  )
}