import { useState } from "react"
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

  const { news } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<ActionData>({ key })

  const [page, setPage] = useState(1)
  const nextPage = () => setPage((prev) => (prev += 1))

  const moreNews = fetcher.data?.news ?? []
  const isIdle = fetcher.state === "idle"

  return (
    <>
      <News news={[...news, ...moreNews]} />
      <fetcher.Form
        id="loadmore"
        method="post"
        onSubmit={nextPage}
        preventScrollReset={true}
        action={pathname}
      >
        <input type="hidden" value={page + 1} name="page" />
        {isIdle && <button type="submit">load more</button>}
        {!isIdle && <Spinner variant="ellipsis" />}
      </fetcher.Form>
    </>
  )
}
