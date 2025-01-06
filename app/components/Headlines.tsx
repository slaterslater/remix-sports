export default function Headlines({ news }: { news: string[] | undefined }) {
  if (!news) return null
  return (
    <ul
      id="headlines"
      className="z-10 w-full max-w-lg items-center justify-between font-mono text-sm lg:flex"
    >
      {news.map((__html, i) => (
        <li key={i} className="mb-10 pb-5 snap-y">
          <div dangerouslySetInnerHTML={{ __html }} />
        </li>
      ))}
    </ul>
  )
}
