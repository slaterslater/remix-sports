import { useRevalidator } from "@remix-run/react"
import { IoMdRefresh } from "react-icons/io"
import Spinner from "./Spinner"

export default function RefreshButton() {
  const revalidator = useRevalidator()
  const isIdle = revalidator.state === "idle"

  const refresh = () => {
    if (!isIdle) return
    window.scrollTo({ top: 0, behavior: "instant" })
    revalidator.revalidate()
  }

  return (
    <button
      id="refresh"
      type="button"
      onClick={refresh}
      title="refresh data"
      disabled={!isIdle}
    >
      {isIdle ? <IoMdRefresh /> : <Spinner variant="ring" />}
    </button>
  )
}
