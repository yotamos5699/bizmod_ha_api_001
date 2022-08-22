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
const tableSorting = require("./Helpers/wizCloudUtiles/helpers/tablesorting");
const documentCreator = require(`./Helpers/wizCloudUtiles/apiInterface/DocumentCreator`);
const reportsCreator = require("./Helpers/wizCloudUtiles/apiInterface/flexDoc");
const Helper = require("./Helpers/generalUtils/Helper");
const calcki = require("./Helpers/wizCloudUtiles/helpers/calcKi");


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
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

app.post("/api/createdoc",Helper.authenticateTokenTest, async (req, res) => {
  var Action = req.body.Action;

  // res.end({ status: "yes", data: "עובד על הקבצים אח שלי" });
  let [docData, docID] = req.body.data;
  let logArrey = [];
  tableSorting
    .jsonToInvoice(docData)
    .then(async (sortedTable) => {
      for (let i = 0; i <= sortedTable.length - 1; i++) {
        await documentCreator
          .createDoc(JSON.parse(sortedTable[i]), docID, i)
          .then(
            async (docOutPut) =>
              await Helper.createRetJson(docOutPut, i, Action)
          )
          .then((docResult) => logArrey.push(docResult));
      }
    })
    .then(() => mgHelper.saveDocURL(logArrey))
    .then((result) => res.json({ status: "yes", data: result }))

    .catch((err) => {
      console.log(`catch in main loop...\n ${err}`);
      res.json({
        status: "no",
        data: err,
      });
    });
});



app.post("/api/getrecords",Helper.authenticateToken, async function (req, res) {
  console.log;
  let jsondata;
  let reportData = await req.body;
  let userKey = req.headers.authorization;
  if (userKey == "Bearer 1111") {
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
    }
  }

  let validationMsg = null;
  if (jsondata) {
    validationMsg = Helper.checkDataValidation(jsondata, [1, 2]);
  }
  res.json({
    status: jsondata ? "yes" : "no",
    data: JSON.stringify(jsondata),
    validationError: validationMsg ? validationMsg : null,
  });
});

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
