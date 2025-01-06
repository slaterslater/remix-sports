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
import * as cheerio from "cheerio"
import { useEffect, useState } from "react"
import { useInterval } from "usehooks-ts"
import SiteNav from "~/components/SiteNav"
import Spinner from "~/components/Spinner"
import styles from "~/styles/global.css?url"

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Sports" },
    { name: "description", content: "Sports Headlines" },
  ]
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

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

export const getPlayerNewsPost = async (page: string | number) => {
  const URL = `https://www.nbcsports.com/fantasy/football/player-news?f0=Headline&p=${page}`
  const resp = await fetch(URL)
  const text = await resp.text()

  const $ = cheerio.load(text)
  const playerNewsPost = $(".PlayerNewsPost")
    .map(function () {
      const postClone = $(this).clone()
      postClone.find(".PlayerNewsPost-footer, .FavoriteLink-wrapper").remove()
      return postClone.html()
    })
    .toArray()

  return playerNewsPost
}

const Headlines = ({ news }: { news: string[] | undefined }) => {
  if (!news) return null
  return (
    <ul
      id="headlines"
      className="z-10 w-full max-w-lg items-center justify-between font-mono text-sm lg:flex"
    >
      {news.map((__html, i) => (
        <li key={i} className="mb-10 pb-5 snap-y">
          <div dangerouslySetInnerHTML={{ __html }} />
        </li>
      ))}
    </ul>
  )
}

export default function Index() {
  const { news } = useLoaderData<typeof loader>()
  const moreNews = useActionData<typeof action>()
  const navigation = useNavigation()
  const revalidator = useRevalidator()

  const [page, setPage] = useState(1)
  const [headlines, setHeadlines] = useState(news)

  const REFRESH = 1000 * 20 // 20 seconds

  useInterval(() => {
    if (revalidator.state !== "idle") return
    try {
      revalidator.revalidate()
    } catch (error) {
      console.log({ error })
    }
  }, REFRESH)

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
