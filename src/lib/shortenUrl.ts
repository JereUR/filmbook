"use server"

export async function shortenUrl(longUrl: string): Promise<string> {
  const apiKey = process.env.REBRANDLY_API_KEY

  if (!apiKey) {
    throw new Error("API Key de Rebrandly no está configurada.")
  }

  const response = await fetch("https://api.rebrandly.com/v1/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
    },
    body: JSON.stringify({
      destination: longUrl,
      domain: { fullName: "rebrand.ly" },
    }),
  })

  if (!response.ok) {
    throw new Error("Error al acortar la URL")
  }

  const data = await response.json()
  return data.shortUrl
}
