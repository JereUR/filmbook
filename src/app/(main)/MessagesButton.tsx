"use client"

import { useQuery } from "@tanstack/react-query"
import { Mail } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import kyInstance from "@/lib/ky"
import { MessageCountInfo } from "@/lib/types"

interface MessagesButtonProps {
  initialState: MessageCountInfo
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  })

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Mensajes"
      asChild
    >
      <Link href="/mensajes">
        <div className="relative">
          <Mail />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>{" "}
        <span className="hidden lg:inline">Mensajes</span>
      </Link>
    </Button>
  )
}
