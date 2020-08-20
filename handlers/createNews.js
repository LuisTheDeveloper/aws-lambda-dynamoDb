const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const _ = require("moment");

const createNews = (request) => {
  if (!request || !request.title || !request.lead)
    throw new Error("Unable to process the request");

  return docClient
    .put({
      TableName: "news",
      Item: {
        id: uuidv4(),
        title: request.title,
        lead: request.lead,
        url: request.url,
        createdAtDate: _().format("L"),
        created2AtDate: _().format("LL"),
        createdAtTime: _().format("LTS"),
      },
    })
    .promise()
    .then((res) => {
      console.log("News saved", res);
      return res;
    })
    .catch((saveError) => {
      console.log(`News not saved : (`, saveError);
      throw saveError;
    });
};

module.exports = createNews;
