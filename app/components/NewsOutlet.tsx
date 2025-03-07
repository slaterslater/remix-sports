import { Outlet, useOutletContext } from "@remix-run/react"
import { useState } from "react"

export default function NewsOutlet() {
  const [news, setNews] = useState<string[]>([])
  return <Outlet context={{ news, setNews }} />
}

type OutletContextType = {
  news: string[]
  setNews: React.Dispatch<React.SetStateAction<string[]>>
}

export function useNewsContext() {
  return useOutletContext<OutletContextType>()
}
