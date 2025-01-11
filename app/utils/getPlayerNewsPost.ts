import * as cheerio from "cheerio"

export const getPlayerNewsPost = async ({
  sport,
  page,
}: {
  sport: string | undefined
  page?: string | number | null
}) => {
  const URL = `https://www.nbcsports.com/${sport}/player-news?f0=Headline&p=${page}`
  // const URL = `https://www.nbcsports.com/fantasy/football/player-news?f0=Headline&p=${page}`
  // https://www.nbcsports.com/mlb/toronto-blue-jays/player-news
  // $
  const resp = await fetch(URL)
  const text = await resp.text()

  const $ = cheerio.load(text)
  const playerNewsPost = $(".PlayerNewsPost")
    .map(function () {
      const postClone = $(this).clone()
      postClone.find(".PlayerNewsPost-footer, .FavoriteLink-wrapper").remove()
      return postClone.html()
    })
    .toArray()

  return playerNewsPost
}
