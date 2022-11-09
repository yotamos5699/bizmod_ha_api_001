// *************** MAIN APP SERVER *************ss**
/*
++ remove db call in bi data. insted deliver the items names from ui
++ regular async functions on start
   
   * update items/castumers report
   * check prems


*/
//const axios = require()
//const Buffer = require("buffer");
//const Buffer = require("node:buffer");
const download = require("download");

const crypto = require("crypto");
const express = require("express");
const app = express();
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const cors = require(`cors`);
const bodyParser = require("body-parser");
const DBrouter = require("./routs/dbRouts");
const documentCreator = require(`./Helpers/wizCloudUtiles/apiInterface/DocumentCreator`);
const reportsCreator = require("./Helpers/wizCloudUtiles/apiInterface/flexDoc");
const Helper = require("./Helpers/generalUtils/Helper");
const matrixesHandeler = require("./Helpers/wizCloudUtiles/helpers/calcKi");
const PDFMerger = require("pdf-merger-js");
const utfZone = "en";
const uri =
  "mongodb+srv://yotamos:linux6926@cluster0.zj6wiy3.mongodb.net/mtxlog?retryWrites=true&w=majority";
const mongoose = require("mongoose");
const { report } = require("./routs/dbRouts");
const { default: axios } = require("axios");
const { Blob } = require("buffer");
const { fileURLToPath } = require("url");
const MGoptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(uri, MGoptions)
  .then((res) => console.log("conected to mongo...."))
  .catch((e) => console.log(e));

const storedReports = new mongoose.Schema(
  {
    userID: String,
    Date: Date,
    ID: String,
    Report: Object,
  },
  { timestamps: true, strict: true, strictQuery: false }
);

const StoredReports = mongoose.model("StoredReports", storedReports);

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(DBrouter);

app.post("/api/mergepdfs", Helper.authenticateToken, async (req, res) => {
  console.log("%%%%%%%%%%% merge pdfs%%%%%%%%%");
  res.contentType("application/pdf");
  let pdfsObject;
  try {
    pdfsObject = await req.body;
  } catch (err) {
    return res.send(err);
  }
  const Urls = await pdfsObject.map((doc) => doc.DocUrl);
  const merger = new PDFMerger();
  let Errors = [];

  for (let i = 0; i <= Urls.length - 1; i++) {
    console.log(Urls[i], typeof Urls[i]);
    let urlIsBrocken = false;
    let Err;
    await download(Urls[i])
      .then((file) => {
        fs.writeFileSync(`./${i}.pdf`, file);
      })
      .catch((err) => {
        console.log(err);
        Err = err;
        urlIsBrocken = true;
      });
    if (urlIsBrocken) {
      return res.send({ status: "no", data: "urls brocken getting 404" });
    }

    try {
      await merger.add(`./${i}.pdf`);
      fs.unlinkSync(`./${i}.pdf`);
    } catch (e) {
      console.log(e);
      Errors.push({
        msg: e,
        DocNumber: pdfsObject[i].DocNumber,
      });
    }
  }
  console.log("errors 2222222", Errors);

  await merger
    .saveAsBuffer()
    .then((mergedPdfBuffer) => {
      fs.writeFileSync("./merged.pdf", mergedPdfBuffer);
    })
    .then(() => {
      let Files = fs.readFileSync("./merged.pdf");
      console.log("after save merger !!!!!");
      res.setHeader("errors", Errors);
      res.send(Files);
    })
    .catch((err) => res.send({ status: "no", data: err }));
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.listen(PORT, (err) =>
  console.log(`matrix UI server ${err ? " on" : "listening"} port ${PORT}`)
);
//close cyrcle function
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

  res.setHeader("content-type", "application/json");
  let oauth = req.headers["authorization"];
  let addedValue;
  let progressData = {};
  const matrixesData = await req.body;
  let userID;
  try {
    userID = (await req.user?.fetchedData?.userID)
      ? req.user.fetchedData.userID
      : req.user.userID;
    console.log("userID", userID);
  } catch (e) {
    return res.send({
      status: `no, user id invalid value ${userID}`,
      data: JSON.stringify(e),
    });
  }
  console.log("sssssssssssssssssssssssssssssssssssssssssssss", userID);
  let Action;
  let logArrey = [];

  progressData = progressBar("מכין מטריצה לעיבוד", false);
  res.status(202).write(JSON.stringify(progressData));

  matrixesHandeler
    .prererMatixesData(matrixesData)
    .then(async (result) => {
      progressData = await progressBar("שומר תוכן מטריצות במסד נתונים", false);
      res.status(202).write(JSON.stringify(progressData));
      // const dataToSave = await matrixesHandeler.constructMatrixToDbObjB(
      //   matrixesData,
      //   userID
      // );
      const dataToSave = await matrixesHandeler.constructMatrixToDbObjB(req);
      // console.log({ dataToSave });
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
          .createDoc(data[i], i, userID)
          .then(async (docOutPut) => {
            if (i == 0)
              addedValue = docOutPut[0]["DocumentDetails"][0][0]["DocNumber"];
            progressData = await progressBar(
              "מפיק מסמך",
              true,
              i + 1,
              dataLength
            );
            res.status(202).write(JSON.stringify(progressData));

            return await Helper.createRetJson(
              docOutPut,
              i,
              Action,
              userID,
              addedValue
            );
          })
          .then((docResult) => logArrey.push(docResult));
      }
    })
    .then(async () => {
      // progress bar
      progressData = await progressBar("שומר תוצאות במסד הנתונים", false);
      res.status(202).write(JSON.stringify(progressData));
      // _______________________________________________________________//
      return await Helper.saveDocURL(logArrey, oauth);
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

    const columnToValidate = await req.body.columnToValidate;

    let checkUserID = await Helper.getUsserID(req);
    if (checkUserID.status == false) return res.send(checkUserID.data);
    let userID = checkUserID.data;

    let searchData;
    let isNew;
    let isSended = false;
    const reportData = await req.body;
    const UPDATE_TIME_INTERVAL = 1000 * 12;
    await StoredReports.find({ ID: JSON.stringify(reportData), userID: userID })
      .then(async (report) => {
        let len = report.length;
        console.log({ len });
        report.length == 0 ? (isNew = true) : (isNew = false);
        searchData = report;
        const DATA_TO_log = report[0]._doc;
        console.log("date in report", DATA_TO_log.Date);

        if (!isNew) {
          const currentTime = new Date().getTime();
          //.toLocaleString(utfZone, {
          //   timeZone: "Asia/Jerusalem",
          // }).getTime();

          const reportTime = new Date(report[0]._doc.Date).getTime();
          console.table({ currentTime, reportTime });
          if (currentTime - reportTime < UPDATE_TIME_INTERVAL) {
            isSended = true;
            let validationMsg = await Helper.checkDataValidation(
              report[0]._doc.Report.jsondata,
              columnToValidate
            );
            console.log("data sended to client ");
            isNew = false;
            let jsonData = report[0]._doc.Report.jsondata;
            res.send({
              status: report[0].Report
                ? "yes from fast DB"
                : `no, report data invalid value ${report[0].Report} `,
              data: jsonData,
              validationError: validationMsg ? validationMsg : null,
            });
          }
        }
      })
      .catch((e) => console.log(e));
    // console.log(reportData);

    reportData.TID != "4"
      ? reportsCreator
          .exportRecords(reportData, userID)
          .then(async (jsondata) => {
            let validationMsg = await Helper.checkDataValidation(
              jsondata,
              [1, 2]
            );
            return { jsondata, validationMsg };
          })
          .then(async (jsondata, validationMsg) => {
            const reportObject = {
              userID: userID,
              Date: new Date().toLocaleString(utfZone, {
                timeZone: "Asia/Jerusalem",
              }),
              ID: JSON.stringify(reportData),
              Report: jsondata,
            };
            const report = new StoredReports(reportObject);
            //   console.log("&&& searchData &&&& \n", searchData);
            isNew
              ? report
                  .save()
                  .then((data) => {
                    console.log(" is new save ", data);
                  })
                  .catch((e) => {
                    console.log(e);
                  })
              : StoredReports.updateOne(
                  { ID: JSON.stringify(reportData) },
                  {
                    $set: { ...reportObject, id: searchData._id },
                  }
                )
                  .then((result) => console.log(result))
                  .catch((e) => console.log(e));

            !isSended
              ? res.send({
                  status: (await jsondata)
                    ? "yes from slow DB"
                    : `no, NO JSON DATA IN SLOW DB VALUE ${jsondata}`,
                  data: jsondata.jsondata,
                  validationError: validationMsg ? validationMsg : null,
                })
              : console.log("updating report");
          })
          .catch((e) => {
            console.debug(e);
            !isSended && res.send({ status: "no, IN CALL END ", data: e });
          })
      : console.log("*** castum Reports Section ***");
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
