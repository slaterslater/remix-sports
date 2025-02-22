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
const CATEGORY = "news-preference"

export function SiteNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const revalidator = useRevalidator()
  const [searchParams, setSearchParams] = useSearchParams()

  // set inital news param and navigate from root route
  useEffect(() => {
    const sport = window.localStorage.getItem(SPORT) ?? "fantasy/football"
    const category = window.localStorage.getItem(CATEGORY) ?? "headlines"
    let url = `${sport}?category=${category}`
    navigate(url)
  }, [navigate])

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    switch (name) {
      case "sport": // change route and keep params
        window.localStorage.setItem(SPORT, value)
        const category = searchParams.get("category")
        navigate(`${value}?category=${category}`)
        break
      case "category": // change params and keep route
        window.localStorage.setItem(CATEGORY, value)
        setSearchParams((prev) => {
          prev.set("category", value)
          return prev
        })
        break
      default:
        return
    }
  }

  const isIdle = revalidator.state === "idle"
  const current: { [key: string]: string } = {
    sport: location.pathname.substring(1),
    category: location.search.split("=")[1],
  }

  return (
    <>
      <nav>
        <Form>
          {Object.keys(navOptions).map((select) => {
            const defaultValue = current[select] ?? ""
            return (
              <select
                key={select}
                name={select}
                value={defaultValue}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleChange({ name, value })
                }}
              >
                {!defaultValue && <option hidden disabled value="" />}
                {navOptions[select].map(({ key, value }) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            )
          })}
        </Form>
        <button
          id="refresh"
          type="button"
          onClick={() => {
            if (isIdle) revalidator.revalidate()
          }}
          title="refresh data"
          disabled={!isIdle || !location.search} // nothing to refresh
        >
          {isIdle ? <IoMdRefresh /> : <Spinner variant="ring" />}
        </button>
      </nav>
      {!current.sport && ( // waiting for useEffect to navigate
        <div id="noSport">
          <Spinner variant="ellipsis" />
        </div>
      )}
    </>
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
  category: [
    { key: "Headlines", value: "headlines" },
    { key: "All News", value: "all" },
  ],
}
