import { useEffect, useState } from "react"
import { StreamChat } from "stream-chat"

import { useSession } from "../SessionProvider"
import kyInstance from "@/lib/ky"

export default function useInitializeChatClient() {
  const { user } = useSession()
  const [chatClient, setChatClient] = useState<StreamChat | null>(null)

  useEffect(() => {
    if (!user) return

    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!)

    client
      .connectUser(
        {
          id: user.id,
          username: user.username,
          name: user.displayName,
          image: user.avatarUrl,
        },
        async () =>
          kyInstance
            .get(`/api/get-token`)
            .json<{ token: string }>()
            .then((data) => data.token),
      )
      .catch((error) => console.error("Error al conectar usuario", error))
      .then(() => setChatClient(client))

    return () => {
      setChatClient(null)
      client
        .disconnectUser()
        .catch((error) => console.error("Error al desconectar usuario", error))
        .then(() => console.log("Conexión cerrada"))
    }
  }, [user])

  return chatClient
}
