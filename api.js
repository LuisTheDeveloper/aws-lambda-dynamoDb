"use strict";
const Api = require("claudia-api-builder");
const api = new Api();

const getNews = require("./handlers/getNews");
const createNews = require("./handlers/createNews");
const { urlExists, putNewsIntoDb } = require("./handlers/fetchNews");
const getHeadlines = require("./fetchNews");

api.get("/", () => "Welcome to the API News!");

api.get("/news", () => {
  return getNews();
});

api.get("/fetch", () => {
  const res = urlExists(
    "/pt-002/moçambique-música-online-em-tempo-de-pandemia/av-54443942"
  );

  return res;
});

api.get("/putnews", () => {
  return getHeadlines();
});

api.post(
  "/news",
  (request) => {
    return createNews(request.body);
  },
  {
    success: 201,
    error: 400,
  }
);

module.exports = api;

// app.listen(3010, () => {
//   console.log("Server listening at http://localhost:3010");
// });
