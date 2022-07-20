const express = require('express')
const app = express()
const fs = require("fs");
const PORT = process.env.PORT || 5000
const cors = require(`cors`);
//const router = require("./newRouts/dbapi");
const tableSorting = require("./tableSorting");
const documentCreator = require(`./DocumentCreator`);
const reportsCreator = require('./flexDoc');
const Helper = require('./Helper')
const calcki = require('./calcki')
const path = require("path");
var timeout = require('express-timeout-handler');
const crypto = require('crypto')
try {
  app.use(timeout.handler(options));
} catch (err) {
  console.log("on time out heandeler")
  console.dir(err)
}
// const {
//   errorMonitor
// } = require('stream');
// const {
//   json
// } = require('express');
// const {
//   Console
// } = require('console');


function generateKey() {
  let key = crypto.randomBytes(32).toString('hex')
  return key
}




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(
  cors({
    origin: "*",
  })
);

try {
  app.use(express.json());
} catch (err) {
  console.log("on app.use.json()")
  console.dir(err)
}
app.listen(PORT, (err) =>
  console.log(`server ${err ? " on" : "listening"} port` + PORT)
);


app.get("/api/generatekey", (req, res) => {
  console.log(req.headers)
  let response = generateKey()
res.end(JSON.stringify({"key":response}))

})

app.post("/api/createdoc", timeout.set(500000), async function (req, res) {

  var [docData, docID] = req.body.data;
  var Action = req.body.Action;

  console.log(docData, " ", docID, " ", Action)
  var rr = [{}]
  var docReturnArrey = [];

  let sortedTable = [];
  try {
    sortedTable = await tableSorting.jsonToInvoice(docData);
  } catch (err) {
    console.dir(`sort table !!!!, ${JSON.stringify(sortedTable, null, 2)}`)
  }
  if (sortedTable.length < 1) return res.end(`
    "Detailes":"no data"`)
  // else res.end(`
  //   "Details": "מכין את הקובץ אח שלי"`)

  //let counter = 0
  for (let i = 0; i <= sortedTable.length - 1; i++) {

    console.log("number of times " + i);
    console.log(
      `%cDoc data sended to creating document:-... \n  ${JSON.stringify(
        sortedTable[i],
        null,
        2
      )}`
    );
    await documentCreator
      .createDoc(JSON.parse(sortedTable[i]), docID, i)
      .then(async (docOutPut) => {
        console.log(
          `%cResponse from create doc nun ${i}\n ${JSON.stringify(
            docOutPut,
            null,
            2
          )}`, "font-size:30px;"
        );

        let obj2Return = await Helper.createRetJson(docOutPut, i, Action);
        return obj2Return
      })
      .then((docResult) => {
        console.log(
          `doc filterd resoult num ${i} \n${JSON.stringify(docResult)}`
        );

        docReturnArrey.push(docResult);
      }).catch((err) => {
        console.log(`catch in main loop...\n ${err}`);
        console.dir(err);
      });
  }
  let logMsg = docReturnArrey ? "*********** Doc Arrey is 'OK' ************" : "*********** Doc Arre is 'NULL' ***********"

  console.log(`************************Doc response arrey*********************
           \n  ***************************************************************\n
           ${logMsg}`)
  try {
    rr = await Helper.updateJsonFILE('castumersInvoiceUrls', docReturnArrey)
  } catch (e) {
    console.log(e)
  }
  console.log(JSON.stringify(rr))



  try {
    return res
      .json({
        status: docReturnArrey ? "yes" : "no ",
        data: JSON.stringify(docReturnArrey, null, 2),
      })
  } catch (err) {
    console.error(err);
    res.send(err)
    res.end("server crashed")
  }
});

app.get("/api/geturls", async function (req, res) {

  let fileName = 'castumersInvoiceUrls'

  console.log(req.headers);

  let data = fs.readFileSync(path.resolve(__dirname, `./${fileName}.json`), (err) => {
    if (err) throw err;
    console.log(err, "See resaults in myApiRes.txt");
  })
  data = JSON.parse(data)
  console.log(JSON.stringify(data.data))

  res.send(JSON.stringify(data, null, 2)).end();
});

var options = {
  // If omitted there is no default timeout on endpoints
  timeout: 3000,

  // Optional. This function will be called on a timeout and it MUST
  // terminate the request.
  // If omitted the module will end the request with a default 503 error.

  onTimeout: function (req, res) {
    res.status(503).send('Service unavailable. Please retry.');
  },
  // Optional. Define a function to be called if an attempt to send a response
  // happens after the timeout where:
  // - method: is the method that was called on the response object
  // - args: are the arguments passed to the method
  // - requestTime: is the duration of the request
  // timeout happened
  onDelayedResponse: function (req, method, args, requestTime) {
    console.log(`Attempted to call ${method} after timeout`);
  },
  // Optional. Provide a list of which methods should be disabled on the
  // response object when a timeout happens and an error has been sent. If
  // omitted, a default list of all methods that tries to send a response
  // will be disable on the response object
  disable: ['write', 'setHeaders', 'send', 'json', 'end']
};


app.post("/api/calcki", async function (req, res) {
    let reqData = await req.body;
    console.log("body  dfdfdfdf" + JSON.stringify(reqData))
    if (reqData.FID == '1') {
      console.log(`print if pass${reqData.FID}`)
      try {
        let table = await calcki.joinMatrixes(JSON.parse(reqData.matrixesData), reqData.trimData)
        res.json(JSON.stringify(table))
      } catch (err) {
        console.log(`error on prosses  ${err} \n request info \n ${JSON.stringify(reqData)}`);
      }
    } else if (reqData.Type == '2') {
      try {
        let documents = await tableSorting.jsonToInvoice(reqData.data)
        res.json(JSON.stringify(documents))
      } catch (err) {
        console.log(`error on prosses  ${err} \n request info \n ${JSON.stringify(req)}`);
      }
    }
  }

);






app.post("/api/getrecords", async function (req, res) {
  console.log
  let jsondata;
  var reportData = await req.body;

  console.log(JSON.stringify(reportData))
  let userKey = req.headers.authorization;
  console.log(userKey)
  if (userKey == 'Bearer 1111') {
    console.log("passs if")
    try {
      console.log(reportData.TID)
      reportData.TID != '4' ? jsondata = await reportsCreator.exportRecords(reportData, userKey) :
        jsondata = await reportsCreator.exportRecords(reportData, userKey)

      //  console.log(jsondata)
      //res.json(jsondata)
    } catch (err) {
      console.dir(`error on prosses  ${err} \n request info \n ${JSON.stringify(req.body)}`);
      console.debug(err)

    }
  }
  let validationMsg = null
  // console.log(jsondata)
  if (jsondata) {
    validationMsg = Helper.checkDataValidation(jsondata,[1,2])
  }
  res.json({
    status: jsondata ? 'yes' : 'no',
    data: JSON.stringify(jsondata),
    validationError: validationMsg ? validationMsg : null
  });

  //console.log(JSON.stringify(jsondata))
});

app.post("/api/test", async function (req, res) {
  try {
    let reqData = await req.body;
    let matrixData = await reqData.matrixesData
    console.log(reqData)
    res.json(reqData)
  } catch (err) {
    console.dir(err)
  }
})


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