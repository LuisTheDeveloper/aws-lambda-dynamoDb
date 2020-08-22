"use strict";
//aws iam put-role-policy --role-name newsengine-executor --policy-name newsApiDynamoDB --policy-document file://./roles/dynamodb.json
const express = require("express");
const app = express();

const AWS = require("aws-sdk");
AWS.config.region = "us-east-2";
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const _ = require("moment");

const Api = require("claudia-api-builder");
const api = new Api();

const scanNews = require("./handlers/scanNews");
const createNews = require("./handlers/insertNews");
const getHeadlines = require("./handlers/fetchNews");

api.get("/", () => "Welcome to the API News!");

api.get("/news", () => {
  return scanNews();
});

// app.get("/news", async (req, res) => {
//   const data = await scanNews();
//   res.send(data);
// });

api.get("/putnews", async (request) => {
  const data = await getHeadlines();
  return { body: data };
});

// app.get("/putnews", () => {
//   return getHeadlines();
// });

// app.get("/headlines", async (req, res) => {
//   const data = await getHeadlines();
//   res.send({ body: data });
// });

// app.get("/test", async (req, res) => {
//   const params = {
//     TableName: "news",
//     Item: {
//       id: uuidv4(),
//       title: "title sample",
//       lead: "lead sample",
//       urlNews: "url sample",
//       createdAtDate: _().format("L"),
//       created2AtDate: _().format("LL"),
//       createdAtTime: _().format("LTS"),
//     },
//   };

//   try {
//     const data = await docClient.put(params).promise();
//     res.send({
//       statusCode: 200,
//       body: JSON.stringify({ params, data }),
//     });
//   } catch (error) {
//     res.send({
//       statusCode: 400,
//       error: `Unable to process the request: ${error.stack}`,
//     });
//   }
// });

// app.get("/putnews", async (req, res) => {
//   const data = await getHeadlines();
//   res.send({
//     body: data,
//   });
// });

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
