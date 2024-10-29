"use client"

import { useTheme } from "next-themes"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react"

import { useSession } from "@/app/(main)/SessionProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import UserAvatar from "./UserAvatar"
import { logout } from "@/app/(auth)/actions"
import { cn } from "@/lib/utils"

interface UserButtonProps {
  className?: string
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession()

  const { theme, setTheme } = useTheme()

  const queryClient = useQueryClient()

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[100]">
        <DropdownMenuLabel>
          Sesión iniciada como @{user.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/usuarios/${user.username}`}>
          <DropdownMenuItem className="cursor-pointer hover:bg-[hsl(var(--button-hover))] focus:bg-[hsl(var(--button-hover))]">
            <UserIcon className="mr-2 size-4" />
            Mi perfil
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            className={cn(
              "cursor-pointer hover:bg-[hsl(var(--button-hover))]",
              "focus:bg-[hsl(var(--button-hover))] data-[state=open]:bg-[hsl(var(--button-hover))]",
            )}
          >
            <Monitor className="mr-2 size-4" />
            Tema
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="cursor-pointer hover:bg-[hsl(var(--button-hover))] focus:bg-[hsl(var(--button-hover))]"
              >
                <Monitor className="mr-2 size-4" />
                Default{" "}
                {theme === "system" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="cursor-pointer hover:bg-[hsl(var(--button-hover))] focus:bg-[hsl(var(--button-hover))]"
              >
                <Sun className="mr-2 size-4" />
                Claro {theme === "light" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="cursor-pointer hover:bg-[hsl(var(--button-hover))] focus:bg-[hsl(var(--button-hover))]"
              >
                <Moon className="mr-2 size-4" />
                Oscuro {theme === "dark" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            queryClient.clear()
            logout()
          }}
          className="cursor-pointer hover:bg-[hsl(var(--button-hover))] focus:bg-[hsl(var(--button-hover))]"
        >
          <LogOutIcon className="mr-2 size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
