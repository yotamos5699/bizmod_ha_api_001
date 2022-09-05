// *************** MAIN APP SERVER ***************
const crypto = require("crypto");
const express = require("express");
const app = express();
//const mgHelper = require("../not in use files/DBs/dbFiles/mgHelper");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const cors = require(`cors`);
const bodyParser = require("body-parser");
const DBrouter = require("./routs/dbRouts");
const db = require("./routs/dbRouts");
const tableSorting = require("./Helpers/wizCloudUtiles/helpers/tablesorting");
const documentCreator = require(`./Helpers/wizCloudUtiles/apiInterface/DocumentCreator`);
const reportsCreator = require("./Helpers/wizCloudUtiles/apiInterface/flexDoc");
const Helper = require("./Helpers/generalUtils/Helper");
const calcki = require("./Helpers/wizCloudUtiles/helpers/calcKi");
const matrixesHandeler = require("./Helpers/wizCloudUtiles/helpers/calcKi");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(DBrouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.listen(PORT, (err) =>
  console.log(`server ${err ? " on" : "listening"} port` + PORT)
);

app.post("/api/generatekey", async (req, res) => {
  res.send({ key: crypto.randomBytes(32).toString("hex") });
});

const progressBar = async (text, gotStats, currentDoc, totalDocs) => {
  return {
    stageName: text,
    gotStats: gotStats,
    stats: {
      amountFinished: currentDoc ? currentDoc : 0,
      totalToProcess: totalDocs ? totalDocs : 0,
    },
  };
};

app.post("/api/createdoc", Helper.authenticateToken, async (req, res) => {
  console.log("%%%%%%%%%%% in create docs %%%%%%%%%");

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=UTF-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Transfer-Encoding": "chunked",
  });
  // res.setHeader("Content-Type", "application/json",

  // 'Cache-Control': 'no-cache',
  //   'Connection': 'keep-alive',
  //   'Transfer-Encoding': 'chunked'
  // );
  let progressData = {};
  const matrixesData = await req.body;
  // console.log(matrixesData);
  const userID = await req.user.fetchedData.userID;
  console.log("sssssssssssssssssssssssssssssssssssssssssssss", userID);
  let Action;
  let logArrey = [];

  // progress bar
  progressData = progressBar("מכין מטריצה לעיבוד", false);
  res.status(202).write(JSON.stringify(progressData));

  matrixesHandeler
    .prererMatixesData(matrixesData)
    .then(async (result) => {
      progressData = await progressBar("שומר תוכן מטריצות במסד נתונים", false);
      res.status(202).write(JSON.stringify(progressData));
      const dataToSave = await matrixesHandeler.constructMatrixToDbObjB(
        matrixesData,
        userID
      );
      const saveStatus = await Helper.saveMatrixesToDB(dataToSave, true);
      console.log("save status !!!!!!!!!!!!!!!!\n", saveStatus);
      const statusMsg =
        saveStatus.resultData.status == "yes"
          ? "נשמר בהצלחה"
          : "תקלה בתהליך השמירה ";

      progressData = await progressBar(statusMsg, false);
      res.status(202).write(JSON.stringify(progressData));
      return result;
    })
    .then(async (result) => {
      Action = result.ActionID;
      let data = result.data.docData;
      const dataLength = data.length;
      console.log("************* data length **************\n", dataLength);
      for (let i = 0; i <= data.length - 1; i++) {
        await documentCreator
          .createDoc(data[i], i)
          .then(async (docOutPut) => {
            progressData = await progressBar(
              "מפיק מסמך",
              true,
              i + 1,
              dataLength
            );
            res.status(202).write(JSON.stringify(progressData));

            return await Helper.createRetJson(docOutPut, i, Action, userID);
          })
          .then((docResult) => logArrey.push(docResult));
      }
    })
    .then(async () => {
      // progress bar
      progressData = await progressBar("שומר תוצאות במסד הנתונים", false);
      res.status(202).write(JSON.stringify(progressData));
      // _______________________________________________________________//
      return Helper.saveDocURL(logArrey);
    })
    .then((result) => {
      res.status(200);
      res.write(JSON.stringify({ status: "yes", data: result }));
      res.end();
    })
    .catch((err) => {
      console.log(`catch in main loop...\n ${err}`);
      res.status(200);
      res.write(JSON.stringify({ status: "no", data: err }));
      res.end();
    });
});

app.post(
  "/api/initvalidate",
  Helper.authenticateToken,
  async function (req, res) {
    const { usserDbname, usserPrivetKey, usserServerName } = await req.body;
    console.log("********************* DATA IN REQUEST **********************");
    console.table({ usserDbname, usserPrivetKey, usserServerName });
    try {
      documentCreator
        .validateInitialData(usserDbname, usserPrivetKey, usserServerName)
        .then((result) => res.send(result))
        .catch((e) => {
          console.log(e);
          res.send(e);
        });
    } catch (e) {
      console.log(e);
    }
  }
);

app.post(
  "/api/getrecords",
  Helper.authenticateToken,
  async function (req, res) {
    console.log("~~~~~~~~~~~~~ getrecords ~~~~~~~~~~~~~~~~~");
    let jsondata;
    let reportData = await req.body;
    console.log(reportData);
    let userKey = req.headers.authorization;
    // if (userKey == "Bearer 1111") {
    console.log("passs if");
    try {
      console.log(reportData.TID);
      reportData.TID != "4"
        ? (jsondata = await reportsCreator.exportRecords(reportData, userKey))
        : (jsondata = await reportsCreator.exportRecords(reportData, userKey));
    } catch (err) {
      console.dir(
        `error on prosses  ${err} \n request info \n ${JSON.stringify(
          req.body
        )}`
      );
      console.debug(err);
      res.send({ status: "no", data: e });
    }

    let validationMsg = null;
    if (jsondata) {
      validationMsg = Helper.checkDataValidation(jsondata, [1, 2]);
    }
    res.send({
      status: jsondata ? "yes" : "no",
      data: JSON.stringify(jsondata),
      validationError: validationMsg ? validationMsg : null,
    });
    // .catch((e) => {
    //   res.send({ status: "no", data: e });
    // });
  }
);

app.post("/api/test", async function (req, res) {
  try {
    let reqData = await req.body;
    let matrixData = await reqData.matrixesData;
    console.log(reqData);
    res.json(reqData);
  } catch (err) {
    console.dir(err);
  }
});

// app.post("/api/calcki", async function (req, res) {
//   let reqData = await req.body;
//   if (reqData.FID == "1") {
//     console.log(`print if pass${reqData.FID}`);
//     try {
//       let table = await calcki.joinMatrixes(
//         JSON.parse(reqData.matrixesData),
//         reqData.trimData
//       );
//       res.json(JSON.stringify(table));
//     } catch (err) {
//       console.log(`error on prosses  ${err} \n request info }`);
//     }
//   } else if (reqData.Type == "2") {
//     try {
//       let documents = await tableSorting.jsonToInvoice(reqData.data);
//       res.json(JSON.stringify(documents));
//     } catch (err) {
//       console.log(
//         `error on prosses  ${err} \n request info \n ${JSON.stringify(req)}`
//       );
//     }
//   }
// });
// let obj = {
//   "NewDocumentStockID": 776,
//   "DocumentIssuedStatus": "OK",
//   "DocumentDetails": [
//     [{
//       "StockID": 776,
//       "DocumentID": 1,
//       "DocNumber": 2134,
//       "status": 1,
//       "AccountKey": "200090",
//       "accountname": "אלזם אור",
//       "Address": "מנחם בגין 63",
//       "City": null,
//       "Phone": null,
//       "batch": 9999,
//       "ValueDate": "2022-06-21",
//       "duedate": "2022-06-21",
//       "paydate": "2022-06-21",
//       "copies": 2,
//       "DiscountPrc": 0,
//       "Tftal": 93.6,
//       "vatprc": 17,
//       "tftalvatfree": 0,
//       "tftalvat": 80,
//       "reference": null,
//       "remarks": null,
//       "printstyle": 1,
//       "Details": null,
//       "Agent": 0,
//       "currency": "ש\"ח",
//       "rate": null,
//       "mainrate": 1,
//       "issuedate": "2022-06-21"
//     }],
//     [{
//       "StockID": 776,
//       "moveid": 1594,
//       "itemkey": "BB100SA",
//       "itemname": "גת בייבי",
//       "Warehouse": 1,
//       "Agent": 0,
//       "Details": null,
//       "duedate": "2022-06-21",
//       "status": 1,
//       "CurrencyCode": "ש\"ח",
//       "rate": 1,
//       "Price": 40,
//       "Quantity": 1,
//       "Tftal": 40,
//       "DiscountPrc": 0
//     },
//     {
//       "StockID": 776,
//       "moveid": 1595,
//       "itemkey": "XR100SA",
//       "itemname": "גת XR",
//       "Warehouse": 1,
//       "Agent": 0,
//       "Details": null,
//       "duedate": "2022-06-21",
//       "status": 1,
//       "CurrencyCode": "ש\"ח",
//       "rate": 1,
//       "Price": 40,
//       "Quantity": 1,
//       "Tftal": 40,
//       "DiscountPrc": 0
//     },
//     {
//       "StockID": 776,
//       "moveid": 1596,
//       "itemkey": "XP",
//       "itemname": "גת XP מוצר אב",
//       "Warehouse": 1,
//       "Agent": 0,
//       "Details": null,
//       "duedate": "2022-06-21",
//       "status": 1,
//       "CurrencyCode": "ש\"ח",
//       "rate": 1,
//       "Price": 200,
//       "Quantity": 0.1,
//       "Tftal": 20,
//       "DiscountPrc": 0
//     },
//     {
//       "StockID": 776,
//       "moveid": 1597,
//       "itemkey": "BAGXP",
//       "itemname": "שקית לגת XP",
//       "Warehouse": 1,
//       "Agent": 0,
//       "Details": null,
//       "duedate": "2022-06-21",
//       "status": 1,
//       "CurrencyCode": "ש\"ח",
//       "rate": 1,
//       "Price": 20,
//       "Quantity": 1,
//       "Tftal": 20,
//       "DiscountPrc": 0
//     }
//     ]
//   ],
//   "urlDoc": "https://hash11n3.wizcloud.co.il/IWIZ/HTM8D4_wizdb2394n5_776_2927829802.pdf"
// }

// // function myFunction() {

// //   let ret = {
// //     "NewDocumentStockID": obj.NewDocumentStockID,
// //     "DocumentIssuedStatus": obj.DocumentIssuedStatus,
// //     "AccountKey": obj.DocumentDetails[0][0].AccountKey,
// //     "accountname": obj.DocumentDetails[0][0].accountname,
// //     "urldoc": obj.urlDoc

// //   }

// //   Logger.log(ret)
// // }

// let data =
// [{ "AccountKey": 6107, "ItemKey": "BB100SA", "Quantity": 2 },
//  { "AccountKey": 6107, "ItemKey": "XP100SA", "Quantity": 4 },
//   { "AccountKey": 6107, "ItemKey": "XR100SA", "Quantity": 3 },
//    { "AccountKey": 6107, "ItemKey": "SP250SA", "Quantity": 4 },
// { "AccountKey": 6201, "ItemKey": "HI250SA", "Quantity": 5 },
//  { "AccountKey": 6201, "ItemKey": "KI250SA", "Quantity": 10 }]
// var options = {
//   // If omitted there is no default timeout on endpoints
//   timeout: 3000,

//   // Optional. This function will be called on a timeout and it MUST
//   // terminate the request.
//   // If omitted the module will end the request with a default 503 error.

//   onTimeout: function (req, res) {
//     res.status(503).send("Service unavailable. Please retry.");
//   },
//   onDelayedResponse: function (req, method, args, requestTime) {
//     console.log(`Attempted to call ${method} after timeout`);
//   },
//   disable: ["write", "setHeaders", "send", "json", "end"],
// };
// let logMsg = docReturnArrey
// ? "*********** Doc Arrey is 'OK' ************"
// : "*********** Doc Arre is 'NULL' ***********";

// console.log(`************************Doc response arrey*********************
//        \n  ***************************************************************\n
//        ${logMsg}`);
// try {
// rr = await Helper.updateJsonFILE("castumersInvoiceUrls", docReturnArrey);
// } catch (e) {
// console.log(e);
// }
// console.log(JSON.stringify(rr));
