import { NavLink } from "@remix-run/react"

export default function SiteNav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="fantasy/football"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
            reloadDocument
          >
            NFL
          </NavLink>
        </li>
        <li>
          <NavLink
            to="mlb/toronto-blue-jays"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
            reloadDocument
          >
            Jays
          </NavLink>
        </li>
        {/* <li>
          <Link href="." title="go to top">
            <IoMdRefresh />
          </Link>
        </li> */}
      </ul>
    </nav>
  )
}
