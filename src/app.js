const express = require('express')
const app = express()
const fs = require("fs");
const PORT = process.env.PORT || 3000
const cors = require(`cors`);
const router = require("./newRouts/sign");
const tableSorting = require("./tableSorting");
const documentCreator = require(`./DocumentApiExample`);
const reportsCreator = require('./flexDoc');
const {
  errorMonitor
} = require('stream');
const {
  json
} = require('express');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(
  cors({
    origin: "*",
  })
);

app.use(router)

app.use(express.json());
app.listen(PORT, (err) =>
  console.log(`server ${err ? " on" : "listening"} port` + PORT)
);
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// 



app.post("/api/createdoc", async function (req, res) {
  var [docData, docID, usserKey] = req.body;
  console.log("doc data  " + docData + "don num  " + docID);

  var jsonArrey = await tableSorting.jsonToInvoice(docData);
  for (let i = 0; i < jsonArrey.length; i++) {
    console.log(typeof jsonArrey + jsonArrey);
    try {
      await documentCreator.createDoc(JSON.parse(jsonArrey[i]), docID, usserKey);
    } catch (err) {
      console.log(`error on prosses  ${err} \n request info \n ${JSON.stringify(req)}`);
    }
  }
  res.json({
    status: "yes",
    data: jsonArrey
  });
});



app.post("/api/getrecords", async function (req, res) {
  let [reportData, usserKey] = await req.body;
  try {
    const jsondata = await reportsCreator.exportRecords(reportData, usserKey);
  } catch (err) {
    console.log(`error on prosses  ${err} \n request info \n ${JSON.stringify(req)}`);

  }
  res.json({
    status: "yes",
    data: jsondata
  });
});