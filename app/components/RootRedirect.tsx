import { useLocation, useNavigate } from "@remix-run/react"
import { useEffect } from "react"
import { CATEGORY, SPORT } from "~/localStorageKeys"
import Spinner from "./Spinner"

export default function RootRedirect() {
  const navigate = useNavigate()
  const location = useLocation()

  // navigate to route user saw last
  useEffect(() => {
    console.log("redirect")
    const sport = localStorage.getItem(SPORT) ?? "fantasy/football"
    const category = localStorage.getItem(CATEGORY) ?? "headlines"
    let url = `${sport}?category=${category}`
    navigate(url)
  }, [navigate])

  if (location.search) return null
  return (
    <div id="noSport">
      <Spinner variant="ellipsis" />
    </div>
  )
}
