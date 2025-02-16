import {
  Form,
  useLocation,
  useNavigate,
  useRevalidator,
} from "@remix-run/react"
import { IoMdRefresh } from "react-icons/io"
import Spinner from "./Spinner"
import { useEffect } from "react"

const PREFERENCE = "remix_sports_url"

export function SiteNav() {
  const navigate = useNavigate()

  useEffect(() => {
    const preference = window.localStorage.getItem(PREFERENCE)
    const url = preference ?? "/fantasy/football?news=headlines"
    navigate(url)
  }, [navigate])

  const handleChange = (event: React.FormEvent | undefined) => {
    const form = event?.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const { sport, newsType } = Object.fromEntries(formData)
    const url = `${sport}?news=${newsType}`
    window.localStorage.setItem(PREFERENCE, url)
    navigate(url)
  }

  const revalidator = useRevalidator()
  const isIdle = revalidator.state === "idle"

  const refresh = () => {
    if (!isIdle) return
    revalidator.revalidate()
  }

  const location = useLocation()
  const { pathname, search } = location

  interface CurrentLocation {
    [key: string]: string
  }
  const current: CurrentLocation = {
    sport: pathname.substring(1),
    newsType: search.split("=")[1],
  }

  return (
    <nav>
      <Form onChange={handleChange}>
        {Object.keys(navOptions).map((name) => (
          <select name={name} key={name}>
            {navOptions[name].map(({ key, value }) => (
              <option
                key={key}
                value={value}
                selected={current[name] === value}
              >
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
