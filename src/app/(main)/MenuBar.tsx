import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Mail, Popcorn } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Inicio"
        asChild
      >
        <Link href="/">
          <Home /> <span className="hidden lg:inline">Inicio</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Explorar películas"
        asChild
      >
        <Link href="/explorar-peliculas">
          <Popcorn />{" "}
          <span className="hidden lg:inline">Explorar películas</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Notificaciones"
        asChild
      >
        <Link href="/notificaciones">
          <Bell /> <span className="hidden lg:inline">Notificaciones</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Mensajes"
        asChild
      >
        <Link href="/mensajes">
          <Mail /> <span className="hidden lg:inline">Mensajes</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Marcadores"
        asChild
      >
        <Link href="/marcadores">
          <Bookmark /> <span className="hidden lg:inline">Marcadores</span>
        </Link>
      </Button>
    </div>
  );
}
