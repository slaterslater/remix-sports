import { useEffect, useMemo } from "react"
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@vercel/remix"
import { json } from "@vercel/remix"
import News from "~/components/News"
import Spinner from "~/components/Spinner"
import { getPlayerNewsPost } from "~/utils/getPlayerNewsPost"
import type { OutletContextType } from "~/root"

export const loader: LoaderFunction = async ({ request, params }) => {
  const sport = params["*"]
  const url = new URL(request.url)
  const category = url.searchParams.get("category")
  const news = await getPlayerNewsPost({ sport, category })
  return json({ news, sport, category })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  // const intent = formData.get("intent")
  // switch (intent) {
  //   case "clear":
  //     return json({ news: [] })
  //   case "more":
  const props = {
    sport: formData.get("sport") as string,
    category: formData.get("category") as string,
    page: formData.get("page") as string,
  }
  const news = await getPlayerNewsPost(props)
  return json({ news })
  // default:
  //   return null
  // }
}

interface ActionData {
  news: string[]
}

export default function Index() {
  const { news, setNews } = useOutletContext<OutletContextType>()
  const data = useLoaderData<typeof loader>()
  // const { sport, category } = loaderData
  const fetcher = useFetcher<ActionData>({ key: data.sport })

  const latest = useMemo(() => JSON.stringify(data.news), [data])

  const revalidator = useRevalidator()
  console.log({ rs: revalidator.state })

  useEffect(() => {
    const more = fetcher.data?.news ?? []
    setNews((prev: string[]) => [...prev, ...more])
  }, [fetcher.data])

  useEffect(() => {
    setNews(data.news)
  }, [latest])

  const isIdle = fetcher.state === "idle"
  const nextPage = news.length / 10 + 1

  return (
    <>
      <News news={news} />
      <fetcher.Form
        id="loadmore"
        method="post"
        preventScrollReset={true}
        action={data.sport}
      >
        <input type="hidden" value={nextPage} name="page" />
        <input type="hidden" value={data.sport} name="sport" />
        <input type="hidden" value={data.category} name="category" />
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
