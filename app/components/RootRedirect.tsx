import { useLocation, useNavigate } from "@remix-run/react"
import { useEffect } from "react"
import { PREFERENCE } from "~/utils/localStorageKeys"
import Spinner from "./Spinner"

export default function RootRedirect() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // navigate to route user saw last
  useEffect(() => {
    const sport = localStorage.getItem(PREFERENCE.sport) ?? "fantasy/football"
    const category = localStorage.getItem(PREFERENCE.category) ?? "headlines"
    let url = `${sport}?category=${category}`
    navigate(url)
  }, [navigate])

  if (pathname !== "/") return null
  return <Spinner variant="ellipsis" />
}
