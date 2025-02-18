// Headlines Component

interface NewsProps {
  news: string[] | undefined
}

export default function Headlines({ news }: NewsProps) {
  if (!news) return null
  return (
    <ul id="headlines">
      {news.map((__html, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html }} />
      ))}
    </ul>
  )
}
