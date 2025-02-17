import {
  Form,
  useLocation,
  useNavigate,
  useRevalidator,
  useSearchParams,
} from "@remix-run/react"
import { IoMdRefresh } from "react-icons/io"
import Spinner from "./Spinner"
import { useEffect } from "react"

const SPORT = "sport-preference"
const NEWS = "news-preference"

export function SiteNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const revalidator = useRevalidator()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const sport = window.localStorage.getItem(SPORT) ?? "fantasy/football"
    const news = window.localStorage.getItem(NEWS) ?? "headlines"
    let url = `${sport}?news=${news}`
    navigate(url)
  }, [navigate])

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    switch (name) {
      case "sport":
        window.localStorage.setItem(SPORT, value)
        const news = searchParams.get("news")
        navigate(`${value}?news=${news}`)
        break
      case "newsType":
        window.localStorage.setItem(NEWS, value)
        setSearchParams((prev) => {
          prev.set("news", value)
          return prev
        })
        break
      default:
        return
    }
  }

  const isIdle = revalidator.state === "idle"

  const refresh = () => {
    if (!isIdle) return
    revalidator.revalidate()
  }

  const current: { [key: string]: string } = {
    sport: location.pathname.substring(1),
    newsType: location.search.split("=")[1],
  }

  return (
    <nav>
      <Form key={JSON.stringify(current)}>
        {Object.keys(navOptions).map((select) => (
          <select
            key={select}
            name={select}
            defaultValue={current[select]}
            onChange={(e) => {
              const { name, value } = e.target
              handleChange({ name, value })
            }}
          >
            {navOptions[select].map(({ key, value }) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </select>
        ))}
      </Form>
      <button
        id="refresh"
        type="button"
        onClick={refresh}
        title="refresh data"
        disabled={!isIdle}
      >
        {isIdle ? <IoMdRefresh /> : <Spinner variant="ring" />}
      </button>
    </nav>
  )
}

interface NavOptions {
  [key: string]: { key: string; value: string }[]
}

export const navOptions: NavOptions = {
  sport: [
    { key: "NFL", value: "fantasy/football" },
    { key: "Jays", value: "mlb/toronto-blue-jays" },
  ],
  newsType: [
    { key: "Headlines", value: "headlines" },
    { key: "All News", value: "all" },
  ],
}
