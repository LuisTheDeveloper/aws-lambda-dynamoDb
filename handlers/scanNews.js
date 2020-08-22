const AWS = require("aws-sdk");
AWS.config.region = "us-east-2";
const docClient = new AWS.DynamoDB.DocumentClient();

const scanNews = async () => {
  //  if (typeof newsId === "undefined") {

  const params = { TableName: "news" };
  try {
    const data = await docClient.scan(params).promise();
    const result = {
      statusCode: 200,
      Items: data,
    };
    return result;
  } catch (error) {
    const result = {
      statusCode: 400,
      error: `Unable to process the request: ${error.stack}`,
    };
    return result;
  }
};

module.exports = scanNews;
