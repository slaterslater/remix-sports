import NavOptions from "./NavOptions"
import { useEffect, useRef } from "react"
import RefreshButton from "./RefreshButton"

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
