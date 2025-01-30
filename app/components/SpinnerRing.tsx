import type { LinksFunction } from "@vercel/remix"

import styles from "~/styles/ring.css?url"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

export default function SpinnerRing() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
