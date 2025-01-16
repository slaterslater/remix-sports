import { Form, useNavigate } from "@remix-run/react"

export function SiteNav() {
  const navigate = useNavigate()

  const handleChange = (event: React.FormEvent | undefined) => {
    const form = event?.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const { sport, newsType } = Object.fromEntries(formData)
    const url = `${sport}?news=${newsType}`
    navigate(url)
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
    </nav>

    //  <IoMdRefresh />
  )
}
