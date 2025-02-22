import * as cheerio from "cheerio"

enum news {
  all = "All+News",
  headlines = "Headline",
}

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
        .find(
          ".PlayerNewsPost-footer, .FavoriteLink-wrapper, .PlayerNewsPost-promotionalText"
        )
        .remove()
      return postClone.html()
    })
    .toArray()

  return playerNewsPost
}
