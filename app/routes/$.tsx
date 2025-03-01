import { useEffect, useState } from "react"
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@vercel/remix"
import { json } from "@vercel/remix"
import News from "~/components/News"
import Spinner from "~/components/Spinner"
import { getPlayerNewsPost } from "~/utils/getPlayerNewsPost"

export const loader: LoaderFunction = async ({ request, params }) => {
  const sport = params["*"]
  const url = new URL(request.url)
  const category = url.searchParams.get("category")
  const news = await getPlayerNewsPost({ sport, category })
  return json({ news })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const page = formData.get("page") as string
  const url = new URL(request.url)
  const sport = url.pathname
  const category = url.searchParams.get("category")
  const news = await getPlayerNewsPost({ sport, category, page })
  return json({ news })
}

interface ActionData {
  news: string[]
}

export default function Index() {
  const location = useLocation()
  const { pathname, search } = location
  const key = pathname + search

  const data = useLoaderData<typeof loader>()
  const fetcher = useFetcher<ActionData>({ key })

  const [news, setNews] = useState(data.news)

  const moreNews = fetcher.data?.news
  const isIdle = fetcher.state === "idle"

  useEffect(() => {
    if (!moreNews) return
    setNews((prev: string[]) => [...prev, ...moreNews])
  }, [moreNews])

  const nextPage = news.length / data.news.length + 1

  return (
    <>
      <News news={news} />
      <fetcher.Form
        id="loadmore"
        method="post"
        preventScrollReset={true}
        action={pathname}
      >
        <input type="hidden" value={nextPage} name="page" />
        {isIdle && <button type="submit">load page</button>}
        {!isIdle && <Spinner variant="ellipsis" />}
      </fetcher.Form>
    </>
  )
}
