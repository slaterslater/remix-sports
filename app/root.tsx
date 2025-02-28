import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "@remix-run/react"
import Nav from "./components/Nav"
import type { LinksFunction, MetaFunction } from "@vercel/remix"
import globalStyles from "~/styles/global.css?url"
import spinnerStyles from "~/styles/spinner.css?url"
import { useEffect } from "react"
import { CATEGORY, SPORT } from "./localStorageKeys"

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
  const navigate = useNavigate()

  // navigate to route user saw last
  useEffect(() => {
    const sport = localStorage.getItem(SPORT) ?? "fantasy/football"
    const category = localStorage.getItem(CATEGORY) ?? "headlines"
    let url = `${sport}?category=${category}`
    navigate(url)
  }, [])

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
          <Nav />
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
