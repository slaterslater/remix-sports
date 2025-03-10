// Headlines Component

import { useNewsContext } from "./NewsOutlet"

export default function NewsList() {
  const { news } = useNewsContext()
  if (!news) return null
  return (
    <ul id="headlines">
      {news.map((__html, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html }} />
      ))}
    </ul>
  )
}
