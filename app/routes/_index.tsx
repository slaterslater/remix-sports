import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
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

  const [page, setPage] = useState(1)
  const [headlines, setHeadlines] = useState(news)

  useEffect(() => {
    if (!moreNews) return
    setHeadlines((prev) => [...prev, ...moreNews.headlines])
  }, [moreNews])

  const nextPage = () => setPage((prev) => (prev += 1))
  const isIdle = navigation.state === "idle"

  return (
    <main>
      {/* <nav>
        <ul>
          <li><Link href="/" title="go to top">NFL</Link></li>
          <li><Link href="/" title="go to top">Jays</Link></li>
          <li><Link href="/" title="go to top"><IoMdRefresh /></Link></li>
        </ul>
      </nav> */}
      <Headlines news={headlines} />
      <Form method="POST" onSubmit={nextPage} preventScrollReset={true}>
        <input type="hidden" value={page + 1} name="nextpage" />
        {isIdle && <button type="submit">load more</button>}
      </Form>
    </main>
  )
}
