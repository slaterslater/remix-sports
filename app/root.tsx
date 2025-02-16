import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { SiteNav } from "./components/SiteNav"
import type { LinksFunction, MetaFunction } from "@vercel/remix"
import globalStyles from "~/styles/global.css?url"
import spinnerStyles from "~/styles/spinner.css?url"

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Sports" },
    { name: "description", content: "Sports Headlines" },
  ]
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStyles },
    { rel: "stylesheet", href: spinnerStyles },
  ]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          <SiteNav />
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
