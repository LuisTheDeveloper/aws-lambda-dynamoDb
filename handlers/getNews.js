const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const getNews = (newsId) => {
  if (typeof newsId === "undefined")
    return docClient
      .scan({
        TableName: "news",
      })
      .promise()
      .then((result) => result.Items);

  return docClient
    .get({
      TableName: "pizza-orders",
      Key: { id: newsId },
    })
    .promise()
    .then((result) => result.Item);
};

module.exports = getNews;
