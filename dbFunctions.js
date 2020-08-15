const ApiBuilder = require("claudia-api-builder");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const api = new ApiBuilder();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const dbInsert = (request) => {
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
};

module.exports = dbInsert;
