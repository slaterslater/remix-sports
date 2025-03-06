import { useEffect, useState } from "react"
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react"
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
  const intent = formData.get("intent")
  console.log({ intent })
  switch (intent) {
    case "clear":
      return json({ news: [] })
    case "more":
      const props = {
        sport: formData.get("sport") as string,
        category: formData.get("category") as string,
        page: formData.get("page") as string,
      }
      const news = await getPlayerNewsPost(props)
      return json({ news })
    default:
      return null
  }
}

interface ActionData {
  news: string[]
}

export default function Index() {
  const { news, sport, category } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<ActionData>({ key: sport })

  // const myValue = useOutletContext();

  const [moreNews, setMoreNews] = useState<string[]>([])
  // wrap the app in a news context?
  // or maybe determine if more is empty and setmore to []

  useEffect(() => {
    const more = fetcher.data?.news ?? []
    console.log({ more })
    // does a navigation reset fetcher?
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
        {isIdle && (
          <button type="submit" name="intent" value="more">
            load page
          </button>
        )}
        {!isIdle && <Spinner variant="ellipsis" />}
      </fetcher.Form>
    </>
  )
}
