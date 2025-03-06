import { useLoaderData } from "@remix-run/react"

export default function MoreButton() {
  const { news, sport, category } = useLoaderData()
  return null
}
