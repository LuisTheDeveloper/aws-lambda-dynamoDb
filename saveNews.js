const fetch = require("node-fetch");

function saveHeadline({ title, lead, url }) {
  console.log("saveHadline called");

  var raw = JSON.stringify({
    title: title,
    lead: lead,
    url: url,
  });

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://q3mu3gpuo8.execute-api.us-east-2.amazonaws.com/latest/news",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log("success"))
    .catch((error) => console.log("error", error));
}

module.exports = {
  saveHeadline,
};
