import {
  Form,
  useLocation,
  useNavigate,
  useSearchParams,
} from "@remix-run/react"
import { CATEGORY, SPORT } from "~/localStorageKeys"

export default function NavOptions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

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

  const current: { [key: string]: string } = {
    sport: location.pathname.substring(1),
    category: location.search.split("=")[1],
  }

  return (
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
