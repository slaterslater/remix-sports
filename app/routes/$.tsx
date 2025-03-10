import { useEffect, useMemo } from "react"
import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@vercel/remix"
import { json } from "@vercel/remix"
import NewsList from "~/components/NewsList"
import { getPlayerNewsPost } from "~/utils/getPlayerNewsPost"
import { useNewsContext } from "~/components/NewsOutlet"
import MoreButton from "~/components/MoreButton"

export const loader: LoaderFunction = async ({ request, params }) => {
  const sport = params["*"]
  const url = new URL(request.url)
  const category = url.searchParams.get("category")
  const news = await getPlayerNewsPost({ sport, category })
  return json({ news, sport, category })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const props = {
    sport: formData.get("sport") as string,
    category: formData.get("category") as string,
    page: formData.get("page") as string,
  }
  const news = await getPlayerNewsPost(props)
  return json({ news })
}

export type NewsData = {
  news: string[]
  sport?: string
  category?: string
}

export default function Index() {
  const { setNews } = useNewsContext()
  const { news } = useLoaderData<typeof loader>()

  const latest = useMemo(() => JSON.stringify(news), [news])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    setNews(news)
  }, [latest])

  return (
    <>
      <NewsList />
      <MoreButton />
    </>
  )
}
