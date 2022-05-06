const PORT = process.env.PORT || 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();

const articles = [];

///////////////BBC////////////
axios
  .get("https://www.bbc.com/sport/football/premier-league")
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $(".gel-layout__item", html).each(function () {
      if ($(this).find(".gs-c-promo").attr("data-bbc-result")) {
        const title = $(this).find(".gs-c-promo").attr("data-bbc-title");
        const url = $(this).find(".gs-c-promo").attr("data-bbc-result");
        const imgURL = $(this)
          .find(".gs-o-responsive-image")
          .find("img")
          .attr("data-src");
        const img =
          imgURL.slice(0, 38) + "240" + imgURL.slice(45, imgURL.length);
        const source = "Bbc";
        const article = {
          source,
          title,
          url,
          img,
        };
        articles.push(article);
      }
    });
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.json("Welcome to the latest Premier League News API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.listen(PORT, () => console.log("Server running on PORT " + PORT));
