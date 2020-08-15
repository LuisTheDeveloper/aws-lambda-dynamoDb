const express = require("express");
const app = express();
const router = express.Router();

const ApiBuilder = require("claudia-api-builder");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const api = new ApiBuilder();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const headlines = require("./fetchNews");
const dbFunctions = require("./dbFunctions");

//https://q3mu3gpuo8.execute-api.us-east-2.amazonaws.com/latest

api.get("/", function () {
  return "News Search Engine development version 0.0.2";
});

//https://q3mu3gpuo8.execute-api.us-east-2.amazonaws.com/latest/newsmz

api.get("/newsmz", () => {
  return headlines.getHeadlines();
});

//https://q3mu3gpuo8.execute-api.us-east-2.amazonaws.com/latest/news
api.get("/news", () => {
  return dynamoDb
    .scan({ TableName: "news" })
    .promise()
    .then((response) => response.Items);
});

api.post(
  "/newsmz",
  (request) => {
    return dbFunctions.dbInsert(request);
  },
  { sucess: 201 }
);

api.post(
  "/news",
  function (request) {
    const params = {
      TableName: "news",
      Item: {
        id: uuidv4(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        title: request.body.title,
        lead: request.body.lead,
        url: request.body.url,
      },
    };
    return dynamoDb.put(params).promise();
  },
  { sucess: 201 }
);

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

module.exports = api;
