/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.guim.co.uk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "goldenglobes.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lastfm.freetls.fastly.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "spitfireaudio.imgix.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "deadline.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media-cldnry.s-nbcnews.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.themoviedb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "torontofashionweek.to",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lolcrawley.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.afcinema.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "resizing.flixster.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.taufilmfest.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scriptmag.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "audioboom.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.alfred.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.hoy.es",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.gettyimages.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.mubicdn.net",
        pathname: "/**",
      },
    ],
  },
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/buscar?q=%23:tag",
      },
    ]
  },
}

export default nextConfig
