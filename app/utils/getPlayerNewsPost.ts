import * as cheerio from "cheerio"

enum news {
  all = "All+News",
  headlines = "Headline",
}

const CLASSES_TO_REMOVE = [
  ".PlayerNewsPost-footer",
  ".FavoriteLink-wrapper",
  ".PlayerNewsPost-promotionalText",
  ".PlayerNewsPost-actions",
  ".PlayerNewsPost-ctas",
  // ".PlayerNewsPost-statsCta"
]

export const getPlayerNewsPost = async ({
  sport,
  category,
  page = 1,
}: {
  sport: string | undefined
  category: string | null
  page?: string | number | null
}) => {
  const newsCategory = news[category as keyof typeof news]
  const URL = `https://www.nbcsports.com/${sport}/player-news?f0=${newsCategory}&p=${page}`

  const resp = await fetch(URL)
  const text = await resp.text()

  const $ = cheerio.load(text)
  const playerNewsPost = $(".PlayerNewsPost")
    .map(function () {
      const postClone = $(this).clone()
      postClone
        .find(CLASSES_TO_REMOVE.join(", "))
        .remove()
      return postClone.html()
    })
    .toArray()

  return playerNewsPost
}
