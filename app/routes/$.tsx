import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useRevalidator,
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
import SiteNav from "~/components/SiteNav"
import Spinner, { links as SpinnerLinks } from "~/components/Spinner"
import styles from "~/styles/global.css?url"
import { getPlayerNewsPost } from "~/utils/getPlayerNewsPost"

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Sports" },
    { name: "description", content: "Sports Headlines" },
  ]
}

export const links: LinksFunction = () => [
  ...SpinnerLinks(),
  { rel: "stylesheet", href: styles },
]

export const loader: LoaderFunction = async ({ request, params }) => {
  const sport = params["*"]
  const news = await getPlayerNewsPost({ sport })
  return json({ sport, news })
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const sport = params["*"]
  const page = formData.get("nextpage") as string
  const headlines = await getPlayerNewsPost({ sport, page })
  return json({ headlines })
}

export default function Index() {
  const { sport, news } = useLoaderData<typeof loader>()
  const moreNews = useActionData<typeof action>()
  const navigation = useNavigation()
  const revalidator = useRevalidator()

  const [page, setPage] = useState(1)
  const [headlines, setHeadlines] = useState(news)

  useEffect(() => {
    const interval = setInterval(() => {
      if (revalidator.state !== "idle") return
      try {
        revalidator.revalidate()
      } catch (error) {
        console.log(error)
      }
    }, 1000 * 20) // every 20 seconds
    return () => clearInterval(interval)
  }, [revalidator])

  useEffect(() => {
    if (!moreNews) return
    setHeadlines((prev: string[]) => [...prev, ...moreNews.headlines])
  }, [moreNews])

  const nextPage = () => setPage((prev) => (prev += 1))
  const isIdle = navigation.state === "idle"

  return (
    <main>
      <SiteNav />
      <Headlines news={headlines} />
      {isIdle && (
        <Form
          method="POST"
          onSubmit={nextPage}
          preventScrollReset={true}
          action={sport}
        >
          <input type="hidden" value={page + 1} name="nextpage" />
          <button type="submit">load more</button>
        </Form>
      )}
      {!isIdle && <Spinner />}
    </main>
  )
}
