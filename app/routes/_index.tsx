import { redirect } from "@remix-run/server-runtime"

export const loader = () => {
  return redirect("/fantasy/football?news=headlines")
}

export default function IndexRoute() {
  return null
}
