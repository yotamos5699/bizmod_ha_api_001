const express = require('express')
const app = express()
const fs = require("fs");
const PORT = process.env.PORT || 5000
const cors = require(`cors`);
//const router = require("./newRouts/sign");
const tableSorting = require("./tableSorting");
//const documentCreator = require(`./DocumentApiExample`);
const reportsCreator = require('./flexDoc');
const calcki = require('./calcki')
const {
  errorMonitor
} = require('stream');
const {
  json
} = require('express');
const {
  Console
} = require('console');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(
  cors({
    origin: "*",
  })
);


app.use(express.json());
app.listen(PORT, (err) =>
  console.log(`server ${err ? " on" : "listening"} port` + PORT)
);



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



app.post("/api/calcki", async function (req, res) {
    let reqData = await req.body;

    if (reqData.Type == '1') {
      try {
        let table = await calcki.matrixToTable(reqData.data)
        res.json(JSON.parse(table))
      } catch (err) {
        console.log(`error on prosses  ${err} \n request info \n ${JSON.stringify(req)}`);
      }
    } else if (reqData.Type == '2') {
      try {
        let documents = await tableSorting.jsonToInvoice(reqData.data)
        res.json(JSON.parse(documents))
      } catch (err) {
        console.log(`error on prosses  ${err} \n request info \n ${JSON.stringify(req)}`);
      }
    }
  }

);

app.post("/api/getrecords", async function (req, res) {
  let jsondata;
  var reportData = await req.body;
  
  console.log(JSON.stringify(reportData))
  let userKey = req.headers.authorization;
  console.log(userKey)
  if (userKey == 'Bearer 1111') {
    console.log("passs if")
    try {
      console.log(reportData.TID)
      reportData.TID != '4' ? jsondata = await reportsCreator.exportRecords(reportData.TID, userKey) :
        jsondata = await reportsCreator.exportRecords(reportData, userKey)
        console.log(jsondata)
    } catch (err) {
      console.dir(`error on prosses  ${err} \n request info \n ${JSON.stringify(req.body)}`);
      console.debug(err)

    }
  }
  res.json({
    status: "yes",
    data: jsondata
  });
});

app.post("/api/test", async function (req, res) {
  let reqData = await req.body;
  let key = await req.headers.authorization
  console.log(JSON.stringify(reqData.TID))
  console.log(JSON.stringify(key))

})