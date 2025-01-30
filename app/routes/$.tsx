import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { json } from "@vercel/remix"
import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@vercel/remix"
import { useEffect, useState } from "react"
import Headlines from "~/components/Headlines"
import { SiteNav } from "~/components/SiteNav"
import Spinner, { links as EllipsisStyles } from "~/components/SpinnerEllipsis"
import { links as RingStyles } from "~/components/SpinnerRing"
import styles from "~/styles/global.css?url"
import { getPlayerNewsPost } from "~/utils/getPlayerNewsPost"

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Sports" },
    { name: "description", content: "Sports Headlines" },
  ]
}

export const links: LinksFunction = () => [
  ...EllipsisStyles(),
  ...RingStyles(),
  { rel: "stylesheet", href: styles },
]

const options = {
  all: "All+News",
  headlines: "Headline",
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const sport = params["*"]
  const url = new URL(request.url)
  const newsParam = url.searchParams.get("news") as keyof typeof options | null
  const newsType = newsParam ? options[newsParam] : "all"
  const posts = await getPlayerNewsPost({ sport, newsType })
  return json({ sport, newsParam, newsType, posts })
}

type ActionData = {
  posts: string[]
}

type FormData = {
  sport: string
  newsType: string
  page: string
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const { sport, newsType, page } = Object.fromEntries(formData)
  const posts = await getPlayerNewsPost({ sport, newsType, page } as FormData)
  return json<ActionData>({ posts })
}

export default function Index() {
  const { sport, newsParam, newsType, posts } = useLoaderData<typeof loader>()
  const moreNews = useActionData<ActionData>()
  const navigation = useNavigation()

  const [page, setPage] = useState(1)
  const [news, setNews] = useState(posts)

  useEffect(() => {
    if (posts && !moreNews) setNews(posts)
    if (moreNews) {
      setNews((prev: string[]) => [...prev, ...moreNews.posts])
    }
  }, [posts, moreNews])

  const nextPage = () => setPage((prev) => (prev += 1))

  const isIdle = navigation.state === "idle"
  const action = `${sport}?news=${newsParam}`

  return (
    <main>
      <SiteNav />
      <Headlines news={news} key={action} />
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
          <button type="submit">load more</button>
        </Form>
      )}
      {!isIdle && <Spinner />}
    </main>
  )
}
