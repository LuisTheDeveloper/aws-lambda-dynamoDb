const AWS = require("aws-sdk");
AWS.config.region = "us-east-2";
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const _ = require("moment");

const insertNews = async (urlNews, data) => {
  var params = {
    TableName: "news",
    FilterExpression: "urlNews = :news_url",
    ExpressionAttributeValues: { ":news_url": urlNews },
  };

  const result = await docClient
    .scan(params)
    .promise()
    .then((res) => {
      return res;
    })
    .catch((saveError) => {
      console.log(`News not saved : (`, saveError);
      throw saveError;
    });

  if (result.Count === 0) putNewsIntoDb(data);
};

const putNewsIntoDb = (data) => {
  return docClient
    .put({
      TableName: "news",
      Item: {
        id: uuidv4(),
        title: data.title,
        lead: data.lead,
        urlNews: data.url,
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

module.exports = { insertNews, putNewsIntoDb };
