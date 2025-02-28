import { useRevalidator } from "@remix-run/react"
import { IoMdRefresh } from "react-icons/io"
import Spinner from "./Spinner"
import NavOptions from "./NavOptions"
import { useEffect, useRef } from "react"

export default function Nav() {
  const navRef = useRef(null)
  const revalidator = useRevalidator()
  const isIdle = revalidator.state === "idle"

  const refresh = () => {
    if (!isIdle) return
    revalidator.revalidate()
  }

  useEffect(() => {
    console.log({ navRef })
  }, [])

  return (
    <nav ref={navRef}>
      <NavOptions />
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
