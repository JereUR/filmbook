"use client"

import { Loader2 } from "lucide-react"
import { Chat as StreamChat } from "stream-chat-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import useInitializeChatClient from "./useInitializeChatClient"
import ChatSidebar from "./ChatSidebar"
import ChatChannel from "./ChatChannel"

export default function Chat() {
  const [isClient, setIsClient] = useState<boolean>(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const chatClient = useInitializeChatClient()
  const { resolvedTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  if (!isClient) return null

  if (!chatClient) return <Loader2 className="mx-auto my-3 animate-spin" />

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  )
}
