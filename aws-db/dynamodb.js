const AWS = require("aws-sdk");
const config = require("./config");

const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");

AWS.config.update(config.aws_remote_config);

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// const dbInsert = () => {
//   const params = {
//     TableName: "news",
//     Item: {
//       id: uuidv4(),
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//       title: "title",
//       lead: "lead",
//       url: "url",
//     },
//   };

//   return dynamoDb.put(params).promise();
// };

const dbInsert = () => {
  const data = [
    {
      title:
        "Covid-19: Receio dos estudantes marca reinício das aulas em Moçambique",
      lead:
        "Zambézia regista fraca adesão de estudantes ao reinício das aulas nas universidades. Ao contrário de outras regiões, província não reabre institutos técnico-profissionais como autoriza decreto para o reinício faseado.",
      url:
        "/pt-002/covid-19-receio-dos-estudantes-marca-reinício-das-aulas-em-moçambique/a-54612241",
    },
    {
      title:
        "Quais seriam as implicações de uma entrada norte-americana em Cabo Delgado?",
      lead:
        "Para os moçambicanos e para região seria um sinal claro de que os americanos estão interessados em Nacala. Este é um ponto estratégico interessante e seria um local de projeção de força para Cabo Delgado e para África.",
      url:
        "/pt-002/quais-seriam-as-implicações-de-uma-entrada-norte-americana-em-cabo-delgado/a-54607713",
    },
  ];

  data.forEach((element) => {
    const params = {
      TableName: "news",
      Item: {
        id: uuidv4(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        title: element.title,
        lead: element.lead,
        url: element.url,
      },
    };
    return dynamoDb
      .put(params)
      .promise()
      .then((res) => {
        console.log("Headline is saved", res);
        return { status: "success" };
      })
      .catch((saveError) => {
        console.log(`Headline not saved : (`, saveError);
        throw saveError;
      });
  });
};

module.exports = dbInsert;
