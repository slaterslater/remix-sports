import { useRevalidator } from "@remix-run/react"
import { IoMdRefresh } from "react-icons/io"
import Spinner from "./Spinner"
import NavOptions from "./NavOptions"
import { useEffect, useRef } from "react"

export default function Nav() {
  const navRef = useRef<HTMLElement | null>(null)
  const scrollY = useRef(0)
  const thresholdY = useRef(0)

  const handleScroll = () => {
    let nav = navRef.current
    if (!nav) return

    const y = window.scrollY
    if (y < scrollY.current) {
      nav.classList.remove("hidden")

      thresholdY.current = 0
    } else {
      thresholdY.current += 1
      if (thresholdY.current < 35) return
      nav.classList.add("hidden")
    }
    scrollY.current = y
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <nav ref={navRef}>
      <NavOptions />
      <RefreshButton />
    </nav>
  )
}

function RefreshButton() {
  const revalidator = useRevalidator()

  const isIdle = revalidator.state === "idle"

  const refresh = () => {
    if (!isIdle) return
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
