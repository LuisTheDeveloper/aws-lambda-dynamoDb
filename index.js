const express = require("express");
const app = express();
const router = express.Router();

const ApiBuilder = require("claudia-api-builder");
const AWS = require("aws-sdk");

// const config = require("./aws-db/config"); // only for local testing
// AWS.config.update(config.aws_remote_config); // only for local testing

const { v4: uuidv4 } = require("uuid");

const api = new ApiBuilder();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const headlines = require("./fetchNews");
const dbFunctions = require("./dbFunctions");
const createHeadlines = require("./handlers/createHeadlines");
const dbInsert = require("./aws-db/dynamodb");

// Home page - announcements page
//https://q3mu3gpuo8.execute-api.us-east-2.amazonaws.com/latest
api.get("/", function () {
  return {
    AnnouncementDate: "16-August-2020",
    API: "News Search Engine development version 0.0.2",
    Announcement: "New updates to release very soon, stay tuned",
  };
});

// Fetch all the news instantly from the origin and return a json object
//https://q3mu3gpuo8.execute-api.us-east-2.amazonaws.com/latest/newsmz
api.get("/newsmz", () => {
  return headlines.getHeadlines();
});

// //https://q3mu3gpuo8.execute-api.us-east-2.amazonaws.com/latest/news
// api.get("/news", () => {
//   return dynamoDb
//     .scan({ TableName: "news" })
//     .promise()
//     .then((response) => response.Items);
// });

api.get(
  "/newsmz/db",
  async () => {
    //const apiHeadLines = await headlines.getHeadlines();
    return dbInsert();
  },
  {
    success: 201,
    error: 400,
  }
);

// app.get("/sample", async (req, res) => {
//   //const json = await headlines.getHeadlines();
//   return dbInsert();
// });

api.get("/news/{id}", function (request) {
  const id = decodeURI(request.pathParams.id);
  const params = {
    TableName: "news",
    Key: {
      id: id,
    },
  };

  return dynamoDb
    .get(params)
    .promise()
    .then(function (response) {
      return response.Item;
    });
});

api.put(
  "/news/{id}",
  function (request) {
    const id = decodeURI(request.pathParams.id);
    const params = {
      TableName: "news",
      Item: {
        id: id,
        ...request.body,
      },
    };

    return dynamoDb
      .put(params)
      .promise()
      .then(function () {
        return id;
      });
  },
  { sucess: { contentType: "text/plain" } }
);

api.delete(
  "/news/{id}",
  function (request) {
    const id = decodeURI(request.pathParams.id);
    const params = {
      TableName: "news",
      Key: {
        id: id,
      },
    };

    return dynamoDb
      .delete(params)
      .promise()
      .then(function () {
        return id;
      });
  },
  { sucess: { contentType: "text/plain" } }
);

//module.exports = { app, api };
module.exports = api;

// app.listen(3010, () => {
//   console.log("Server listening at http://localhost:3010");
// });
