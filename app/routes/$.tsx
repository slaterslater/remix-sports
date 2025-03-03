import { useEffect, useState } from "react"
import { useFetcher, useLoaderData } from "@remix-run/react"
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

interface ActionData {
  news: string[]
}

export default function Index() {
  const { news, sport, category } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<ActionData>({ key: sport + category })

  const [moreNews, setMoreNews] = useState<string[]>([])

  useEffect(() => {
    const more = fetcher.data?.news ?? []
    if (!more) return
    setMoreNews((prev: string[]) => [...prev, ...more])
  }, [fetcher.data])

  useEffect(() => {
    setMoreNews([])
  }, [sport, category])

  const isIdle = fetcher.state === "idle"
  const list = [...news, ...moreNews]
  const nextPage = list.length / news.length + 1

  return (
    <>
      <News news={list} />
      <fetcher.Form
        id="loadmore"
        method="post"
        preventScrollReset={true}
        action={sport}
      >
        <input type="hidden" value={nextPage} name="page" />
        <input type="hidden" value={sport} name="sport" />
        <input type="hidden" value={category} name="category" />
        {isIdle && <button type="submit">load page</button>}
        {!isIdle && <Spinner variant="ellipsis" />}
      </fetcher.Form>
    </>
  )
}
