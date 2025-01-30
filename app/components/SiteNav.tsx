import { Form, useNavigate, useRevalidator } from "@remix-run/react"
import { IoMdRefresh } from "react-icons/io"
import Spinner from "./SpinnerRing"

export function SiteNav() {
  const navigate = useNavigate()
  const revalidator = useRevalidator()

  const isIdle = revalidator.state === "idle"

  const handleChange = (event: React.FormEvent | undefined) => {
    const form = event?.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const { sport, newsType } = Object.fromEntries(formData)
    const url = `${sport}?news=${newsType}`
    navigate(url)
  }

  const refresh = () => {
    if (!isIdle) return
    revalidator.revalidate()
  }

  return (
    <nav>
      <Form onChange={handleChange}>
        <select name="sport">
          <option value="fantasy/football">NFL</option>
          <option value="mlb/toronto-blue-jays">Jays</option>
        </select>
        <select name="newsType">
          <option value="headlines">Headlines</option>
          <option value="all">All News</option>
        </select>
      </Form>
      <button
        id="refresh"
        type="button"
        onClick={refresh}
        title="refresh data"
        disabled={!isIdle}
      >
        {isIdle ? <IoMdRefresh /> : <Spinner />}
      </button>
    </nav>
  )
}
