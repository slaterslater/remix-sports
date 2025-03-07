import { useFetcher, useLoaderData } from "@remix-run/react"
import { useEffect } from "react"
import type { NewsData } from "~/routes/$"
import { useNewsContext } from "./NewsOutlet"
import Spinner from "./Spinner"

export default function MoreButton() {
  const { news, setNews } = useNewsContext()
  const { sport, category } = useLoaderData<NewsData>()
  const fetcher = useFetcher<NewsData>({ key: sport })

  useEffect(() => {
    const more = fetcher.data?.news ?? []
    setNews((prev: string[]) => [...prev, ...more])
  }, [fetcher.data])

  const isIdle = fetcher.state === "idle"
  const nextPage = news.length / 10 + 1

  return (
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
  )
}
