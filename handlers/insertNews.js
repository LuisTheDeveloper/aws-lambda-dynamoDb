const AWS = require("aws-sdk");
AWS.config.region = "us-east-2";
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const _ = require("moment");

// const insertNews = async (urlNews, data) => {
//   var params = {
//     TableName: "news",
//     FilterExpression: "urlNews = :news_url",
//     ExpressionAttributeValues: { ":news_url": urlNews },
//   };

//   try {
//     const result = await docClient.scan(params).promise();
//     if (result.Count === 0) {
//       const insertRes = await putNewsIntoDb(data);
//       return insertRes;
//     } else {
//       return { message: "news already in db" };
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// const putNewsIntoDb = async (data) => {
//   const params = {
//     TableName: "news",
//     Item: {
//       id: uuidv4(),
//       title: data.title,
//       lead: data.lead,
//       urlNews: data.url,
//       createdAtDate: _().format("L"),
//       created2AtDate: _().format("LL"),
//       createdAtTime: _().format("LTS"),
//     },
//   };

//   try {
//     const data = await docClient.put(params).promise();
//     const result = {
//       statusCode: 200,
//       data: data,
//     };
//     return result;
//   } catch (error) {
//     const result = {
//       statusCode: 400,
//       error: `Unable to process the request: ${error.stack}`,
//     };
//     throw error;
//     //return result;
//   }
// };

const putDbNews = async (data) => {
  const res = data.map(async (item) => {
    const count = await checkUrl(item.url);
    if (count === 0) {
      try {
        const data = await docClient
          .put({
            TableName: "news",
            Item: {
              id: uuidv4(),
              title: item.title,
              lead: item.lead,
              urlNews: item.url,
              createdAtDate: _().format("L"),
              created2AtDate: _().format("LL"),
              createdAtTime: _().format("LTS"),
            },
          })
          .promise();
        const result = {
          statusCode: 200,
          data: data,
        };
        return result;
      } catch (error) {
        const result = {
          statusCode: 400,
          error: `Unable to process the putDbNews: ${error.stack}`,
        };
        throw result;
      }
    }
  });
  return res;
};

const checkUrl = async (urlNews) => {
  var params = {
    TableName: "news",
    FilterExpression: "urlNews = :news_url",
    ExpressionAttributeValues: { ":news_url": urlNews },
  };

  try {
    const result = await docClient.scan(params).promise();
    return result.Count;
  } catch (error) {
    const result = {
      statusCode: 400,
      error: `Unable to process the checkUrl: ${error.stack}`,
    };
    throw result;
  }
};

module.exports = { putDbNews };
