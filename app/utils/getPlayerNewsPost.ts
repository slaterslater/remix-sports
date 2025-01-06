import * as cheerio from "cheerio"

export const getPlayerNewsPost = async (page: string | number) => {
  const URL = `https://www.nbcsports.com/fantasy/football/player-news?f0=Headline&p=${page}`
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
