import { redirect } from "@remix-run/server-runtime"

export const loader = () => {
  return redirect("/fantasy/football")
}

export default function IndexRoute() {
  return null
}
