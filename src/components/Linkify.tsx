import Link from "next/link"
import { LinkIt, LinkItUrl } from "react-linkify-it"

import UserLinkWithTooltip from "./UserLinkWithTooltip"

interface LinkifyProps {
  children: React.ReactNode
}

export default function Linkify({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  )
}

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  )
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <UserLinkWithTooltip key={key} username={match.slice(1)}>
          {match}
        </UserLinkWithTooltip>
      )}
    >
      {children}
    </LinkIt>
  )
}

function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  )
}

function LinkifyRebrandly({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(rebrand\.ly\/[^\s]+)/}
      component={(match: string, key: number) => (
        <Link key={key} href={`https://${match}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  )
}
