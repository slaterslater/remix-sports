import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useRevalidator,
} from "@remix-run/react"
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
  type LinksFunction,
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const page = "1"
  const news = await getPlayerNewsPost(page)
  return json({ news })
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const page = formData.get("nextpage")
  const headlines = await getPlayerNewsPost(page as string)
  return json({ headlines })
}

export default function Index() {
  const { news } = useLoaderData<typeof loader>()
  const moreNews = useActionData<typeof action>()
  const navigation = useNavigation()
  const revalidator = useRevalidator()

  const [page, setPage] = useState(1)
  const [headlines, setHeadlines] = useState(news)

  useEffect(() => {
    const interval = setInterval(() => {
      if (revalidator.state !== "idle") return
      revalidator.revalidate()
    }, 1000 * 20) // every 20 seconds
    return () => clearInterval(interval)
  }, [revalidator])

  useEffect(() => {
    if (!moreNews) return
    setHeadlines((prev) => [...prev, ...moreNews.headlines])
  }, [moreNews])

  const nextPage = () => setPage((prev) => (prev += 1))
  const isIdle = navigation.state === "idle"

  return (
    <main>
      <SiteNav />
      <Headlines news={headlines} />
      {isIdle && (
        <Form method="POST" onSubmit={nextPage} preventScrollReset={true}>
          <input type="hidden" value={page + 1} name="nextpage" />
          <button type="submit">load more</button>
        </Form>
      )}
      {!isIdle && <Spinner />}
    </main>
  )
}
