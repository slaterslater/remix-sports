import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { json } from "@vercel/remix"
import type { ActionFunction, LoaderFunction } from "@vercel/remix"
import { useEffect, useState } from "react"
import News from "~/components/News"
import Spinner from "~/components/Spinner"

import { getPlayerNewsPost } from "~/utils/getPlayerNewsPost"

const OPTIONS = {
  all: "All+News",
  headlines: "Headline",
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const sport = params["*"]
  const url = new URL(request.url)
  const newsParam = url.searchParams.get("news") as keyof typeof OPTIONS | null
  const newsType = newsParam ? OPTIONS[newsParam] : "all"
  const posts = await getPlayerNewsPost({ sport, newsType })
  return json({ sport, newsParam, newsType, posts })
}

interface ActionData {
  posts: string[]
}

interface FormData {
  sport: string
  newsType: string
  page: string
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { sport, newsType, page } = Object.fromEntries(formData)
  const posts = await getPlayerNewsPost({ sport, newsType, page } as FormData)
  return json<ActionData>({ posts })
}

export default function Index() {
  const { sport, newsParam, newsType, posts } = useLoaderData<typeof loader>()
  const moreNews = useActionData<ActionData>()
  const [news, setNews] = useState(posts)

  const navigation = useNavigation()
  const isIdle = navigation.state === "idle"

  useEffect(() => {
    if (!isIdle) return
    if (posts && !moreNews) {
      setNews(posts)
      setPage(1)
    }
    if (moreNews) {
      setNews((prev: string[]) => [...prev, ...moreNews.posts])
    }
  }, [posts, moreNews, isIdle])

  const [page, setPage] = useState(1)
  const nextPage = () => setPage((prev) => (prev += 1))

  const action = `${sport}?news=${newsParam}`

  return (
    <>
      <News news={news} key={action} />
      {isIdle && (
        <Form
          id="loadmore"
          method="POST"
          onSubmit={nextPage}
          preventScrollReset={true}
          action={action}
        >
          <input type="hidden" value={page + 1} name="page" />
          <input type="hidden" value={sport} name="sport" />
          <input type="hidden" value={newsType} name="newsType" />
          <button type="submit" name="intent" value="more">
            load more
          </button>
        </Form>
      )}
      {!isIdle && <Spinner variant="ellipsis" />}
    </>
  )
}
