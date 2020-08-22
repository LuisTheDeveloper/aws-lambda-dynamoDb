const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { response } = require("express");
const { putDbNews } = require("./insertNews");

const AWS = require("aws-sdk");
AWS.config.region = "us-east-2";
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const _ = require("moment");

const searchUrl =
  "https://www.dw.com/pt-002/not%C3%ADcias/mo%C3%A7ambique/s-30380";

// const getHeadlines = async () => {
//   const headlines = [];

//   try {
//     const response = await fetch(searchUrl);
//     const body = await response.text();

//     const fetchRes = {
//       url: response.url,
//       status: response.status,
//     };
//     headlines.push(fetchRes);

//     const $ = cheerio.load(body);

//     let tempData = "";
//     let $url = "";

//     $(".col2.basicTeaser").each(function (i, element) {
//       const $element = $(element);

//       if ($element.find(".imgTeaserM").length) {
//         $url = $element.find("a");
//       }

//       if ($element.find(".teaserContentWrap").length) {
//         tempData = $element.find("h2").children().remove().end().text();
//         tempData = tempData.replace(/"|\n|#/g, "");

//         const $title = tempData.trim();

//         tempData = $element.find("p").text();
//         tempData = tempData.replace(/"|\n|#/g, "");
//         const $lead = tempData.trim();

//         const news = {
//           title: $title,
//           lead: $lead,
//           url: $url.attr("href"),
//         };
//         headlines.push(news);
//       }

//       if ($element.find(".group").length) {
//         $url = $element.find(".news").children("a");

//         tempData = $element.find(".news").children("a").children("h2").text();
//         tempData = tempData.replace(/"|\n|#/g, "");
//         const $title = tempData.trim();

//         tempData = $element.find(".news").children("a").children("p").text();
//         tempData = tempData.replace(/"|\n|#/g, "");
//         const $lead = tempData.trim();

//         const news = {
//           title: $title,
//           lead: $lead,
//           url: $url.attr("href"),
//         };
//         headlines.push(news);

//         if ($element.find(".linkList.intern").length) {
//           $url = $element.find(".linkList.intern").children("a");

//           tempData = $element
//             .find(".linkList.intern")
//             .children("a")
//             .children("h2")
//             .text();
//           tempData = tempData.replace(/"|\n|#/g, "");
//           const $title = tempData.trim();

//           const $lead = "";

//           const news = {
//             title: $title,
//             lead: $lead,
//             url: $url.attr("href"),
//           };
//           headlines.push(news);
//         }

//         if ($element.find(".linkList.overlayIcon").length) {
//           $url = $element.find(".linkList.overlayIcon").children("a");

//           const $title = "";
//           const $lead = "";

//           const news = {
//             title: $title,
//             lead: $lead,
//             url: $url.attr("href"),
//           };
//           headlines.push(news);
//         }
//       }
//     });

//     putDbNews(headlines);
//     return headlines;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

const getHeadlines = async () => {
  const resp = [];

  const headlines = [
    {
      title: "Cabo Delgado: mais de 300 deslocados já chegaram à Zambézia",
      lead:
        "Governo provincial da Zambézia reúne recursos para apoiar as pessoas que fogem do conflito em Cabo Delgado. Famílias estão instaladas em casas alugadas e em reassentamentos em diversas cidades na província.",
      url:
        "/pt-002/cabo-delgado-mais-de-300-deslocados-já-chegaram-à-zambézia/a-54651916",
    },
    {
      title: "XXXXXXXXXjá chegaram à Zambézia",
      lead:
        "GoverYYYYYYYYYYYYYYYYYYursos para apoiar as pessoas que fogem do conflito em Cabo Delgado. Famílias est.",
      url: "/pt-0TTTTTTTTTTTTTTTTTTTTTTs-já-chegaram-à-zambézia/a-54651916",
    },
  ];

  const status = Promise.all(
    headlines.map(async (item) => await putHeadline(item))
  );

  return status;
};

const putHeadline = async (headline) => {
  const params = {
    TableName: "news",
    Item: {
      id: uuidv4(),
      title: headline.title,
      lead: headline.lead,
      urlNews: headline.url,
      createdAtDate: _().format("L"),
      created2AtDate: _().format("LL"),
      createdAtTime: _().format("LTS"),
    },
  };
  return await docClient.put(params).promise();
};

module.exports = getHeadlines;
