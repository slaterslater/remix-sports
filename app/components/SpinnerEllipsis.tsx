import type { LinksFunction } from "@vercel/remix"

import styles from "~/styles/ellipsis.css?url"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

export default function SpinnerEllipsis() {
  return (
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
