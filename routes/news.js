const express = require("express");
const router = express.Router();

const ApiBuilder = require("claudia-api-builder");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");


const api = new ApiBuilder();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// router.get("/", function () {
//   return dynamoDb
//     .scan({ TableName: "news" })
//     .promise()
//     .then((response) => response.Items);
// });

router.get("/", (req, res) => {
    res.json({ msg: "success routing!"})
    // try {
    //     return dynamoDb
    //         .scan({ TableName: "news" })
    //         .promise()
    //         .then((response) => response.Items);
    // } catch (error) {
    //     console.error(err.message);
    //     res.status(500).send("Server Error"); 
    //  }
});


module.exports = router