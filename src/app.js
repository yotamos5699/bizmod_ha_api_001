const download = require("download");
const createDocValidator = require("./createDocValidator");
const castumReports = require("./castumReports");
const crypto = require("crypto");
const express = require("express");
const app = express();
const fs = require("fs");
const PORT = process.env.PORT || 3000;
//const PORT = 3000;
const cors = require(`cors`);
const bodyParser = require("body-parser");
const DBrouter = require("./routs/dbRouts");
const documentCreator = require(`./Helpers/wizCloudUtiles/apiInterface/DocumentCreator`);
const reportsCreator = require("./Helpers/wizCloudUtiles/apiInterface/flexDoc");
const Helper = require("./Helpers/generalUtils/Helper");
const matrixesHandeler = require("./Helpers/wizCloudUtiles/helpers/calcKi");
const PDFMerger = require("pdf-merger-js");
const utfZone = "en";
const uri = "mongodb+srv://yotamos:linux6926@cluster0.zj6wiy3.mongodb.net/mtxlog?retryWrites=true&w=majority";
const mongoose = require("mongoose");
const { Console } = require("console");
const { default: axios } = require("axios");
const { encode } = require("punycode");
const { ZC_ErrorLogger } = require("./ZCmonitor");
const MGoptions = { useNewUrlParser: true, useUnifiedTopology: true };
const docHelper = require("./createDocsHelper");
const { join } = require("path");
const accountSid = "AC0228e43244a7b1cd0a5ce9d10b14d4eb";
const authToken = "d3156c45622da27e95a3ca4f975cf474";
const client = require("twilio")(accountSid, authToken);

mongoose
  .connect(uri, MGoptions)
  .then(() => console.log("conected to mongo...."))
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
  const Filename = req?.headers["filename"];
  const progressBar = false;

  progressBar && setProgressBar(Filename, { stageName: 1, text: "פונקציית mergePdf מתחילה לעבוד" }, false);
  console.log("%%%%%%%%%s%% merge pdfs%%%%%%%%%");
  res.contentType("application/pdf");
  let pdfsObject;
  try {
    pdfsObject = await req.body;
  } catch (err) {
    progressBar && setProgressBar(Filename, { stageName: 2, text: "תקלה" }, false);
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
        progressBar && setProgressBar(Filename, { stageName: `a${i}`, text: "ממזג קןבץ " }, true, i + 1, Urls.length);
        fs.writeFileSync(`./${i}.pdf`, file);
      })
      .catch((err) => {
        console.log(err);
        Err = err;
        urlIsBrocken = true;
      });
    if (urlIsBrocken) {
      progressBar &&
        setProgressBar(Filename, { stageName: `a${i}`, text: "קישור תקול", termenate: true }, true, i + 1, Urls.length);
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
      progressBar && setProgressBar(Filename, { stageName: `sc`, text: "סיים בהצלחה", termenate: true }, false);
      res.send(Files);
    })
    .catch((err) => {
      progressBar && setProgressBar(Filename, { stageName: `sc`, text: "סיים בתקלה", termenate: true }, false);
      res.send({ status: "no", data: err });
    });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.listen(PORT, (err) => console.log(`matrix UI server ${err ? " on" : "listening"} port ${PORT}`));
//close cyrcle function
app.post("/api/generatekey", async (req, res) => {
  res.send({ key: crypto.randomBytes(32).toString("hex") });
});

const setProgressBar = async (filename, messageData, gotStats, currentDoc, totalDocs) => {
  const data = {
    data: messageData?.urlsData ? messageData.urlsData : null,
    termenate: messageData?.termenate ? true : false,
    stageName: typeof messageData == "object" ? messageData.stageName : "in process",
    msg: typeof messageData == "object" ? messageData.text : messageData,
    errors: messageData?.errors ? messageData.errors : null,
    gotStats: gotStats,
    stats: {
      amountFinished: currentDoc ? currentDoc : 0,
      totalToProcess: totalDocs ? totalDocs : 0,
    },
  };
  let path = `./${filename}.json`;
  updateProgressBar(filename, data);
  // setInterval(() => {
  //   return "ok";
  // }, 550);
};

const writeFileIfExist = (filename, data) => {
  let path = "./" + filename + ".json";
  if (fs.existsSync(path))
    fs.writeFileSync(path, JSON.stringify(data), {
      encoding: "utf8",
      flag: "w",
    });
  else fs.writeFileSync(path, JSON.stringify(data), { encoding: "utf8" });
};

// app.post("/api/getlasterrorlog", Helper.authenticateToken, async (req, res) => {
//   const { filename } = await req.body;
//   let path = "./" + filename + ".json";
//   let file_exist = fs.existsSync(path);
//   //  console.log({ file_exist });
//   if (file_exist) {
//     let result = JSON.parse(fs.readFileSync(path, { encoding: "utf8", flag: "r" }));
//     res.send(result);
//   } else {
//     res.status(503).send({ status: "no", data: "no file in seraver by thet name" });
//   }
// });

const updateProgressBar = async (filename, progressData) => {
  //console.log("IN PROGRESS BAR --", { filename, progr essData });
  const data = progressData;
  console.log("progress bar data 11!!!!", { data });

  writeFileIfExist(filename, data);
};

function delay(delayInms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

app.post("/api/createdoc2", Helper.authenticateToken, async (req, res) => {
  // console.log("%%%%%%%%%%% in create docs %%%%%%%%%");
  const Filename = req?.headers["filename"];
  // console.log({ Filename });
  const progressBar = true;
  const validator = true;
  res.setHeader("Access-Control-Allow-Origin", "*");

  let Errors = [];
  let oauth = req.headers["authorization"];

  const user = await req?.user;

  const matrixesData = await req.body;
  const test = await createDocValidator.validate(matrixesData, "default");

  let objectErrors;
  if (validator) {
    // console.log("!!!!!!!! validatror in !!!!!");
    if (test?.status == "no") {
      ZC_ErrorLogger(test, { text: "validation error ,", toLog: true }, { serverName: "ha" }, null, true);
      return res.send({ status: "no", data: test });
    } else {
      //   console.log("validator in yes ");

      objectErrors = test?.data?.length ? [...test.data] : null;
      res.send({
        status: "yes",
        data: objectErrors ? "object got problems but not bracking ones " : "object ok",
        errors: objectErrors,
      });
    }
  }
  // console.log({ matrixesData });

  progressBar && setProgressBar(Filename, { stageName: "start", text: "מאתחל...." }, false);

  let userID;
  try {
    userID = user?.fetchedData?.userID ? user.fetchedData.userID : user.userID;
    // console.log("userID", userID);
  } catch (e) {
    console.log(`
      status: no, user id invalid value ${userID},
      data: JSON.stringify(e),
    `);
  }

  let Action = parseInt(Filename.slice(2, Filename.length));
  //console.log({ Action });
  let logArrey = [];
  let ErrorMatrix = [];
  progressBar && setProgressBar(Filename, { stageName: "a", text: "מכין מטריצה לעיבוד" }, false);
  // console.log("sssssssssssssssssssssfadggasdgs", Object.keys(matrixesData));
  matrixesHandeler
    .prererMatixesData(matrixesData)
    .then(async (result) => {
      progressBar && setProgressBar(Filename, { stageName: "b", text: "שומר תוכן מטריצות במסד נתונים" }, false);
      const dataToSave = await matrixesHandeler.constructMatrixToDbObjB(req);

      const saveStatus = await Helper.saveMatrixesToDB(dataToSave, true);
      if (saveStatus?.resultData?.status == "no") console.log(` status: "no", data: "problem with matrix name"`);
      const statusMsg = saveStatus?.resultData?.status == "yes" ? "נשמר בהצלחה" : "תקלה בתהליך השמירה ";

      progressBar && setProgressBar(Filename, { stageName: "c", text: statusMsg }, false);
      return result;
    })
    .then(async (result) => {
      //   console.log({ Action });
      let allData = result.data.docData;
      const { data, errorMatrix } = await docHelper.setApprovedDataAndErrorLog(allData, matrixesData);
      //   console.log({ data, errorMatrix });
      ErrorMatrix = docHelper.joinErrorMatrixWithObjsectErrors(errorMatrix, objectErrors);

      for (let j = 0; j <= data.length - 1; j++) {
        await documentCreator.createDoc(data[j], j, userID).then(async (docOutPut) => {
          await Helper.createRetJson(docOutPut, Action, userID)
            .then((docData) => {
              console.log({ j, docData });
              progressBar &&
                setProgressBar(
                  Filename,
                  { stageName: `f${j}`, text: "מפיק מסמך", urlsData: docData },
                  true,
                  j + 1,
                  data.length
                );

              if (docOutPut?.status == "no") {
                progressBar &&
                  setProgressBar(Filename, {
                    stageName: "finish",
                    text: "תקלה בהפקת מסמכים",
                  });
                return console.log(` status: "no", data: "error in docOutPut" `);
              }

              return docData;
            })
            .then(async (docResult) => {
              if (!docResult?.status) {
                logArrey.push(docResult);
              } else {
                Errors.push(docResult.error[0]);
                ErrorMatrix = docHelper.updateErrorMatrix(ErrorMatrix, matrixesData, docResult.error[0]);
                console.log({ Errors });
              }
            });
        });
        //let d = delay(12000);
      }
      d = await delay(2000);
      return logArrey;
    })
    .then(async () => {
      progressBar && setProgressBar(Filename, { stageName: "S", text: "שומר תוצאות במסד הנתונים" }, false);
      console.log({ logArrey, oauth });
      const docsArray = await Helper.saveDocURL(logArrey, oauth);
      console.log("sssdara", docsArray.resultData.data);
      return docsArray;
    })
    .then(async (result) => {
      progressBar &&
        setProgressBar(
          Filename,
          {
            stageName: "finish",
            text: "סיום",
            termenate: true,
            errors: {
              global: Errors.length > 0 ? Errors : null,
              errorsMatrix: docHelper.gotErrors(ErrorMatrix) ? ErrorMatrix : null,
            },
            // urlsData: [...result.resultData.data],
          },
          false
        );

      console.log(` status: "yes", data: ${result}`);
      //   res.send(JSON.stringify({ status: "yes", data: result }));
    })
    .catch((err) => {
      console.log(`catch in main loop...\n ${err}`);
      progressBar &&
        setProgressBar(
          Filename,
          {
            stageName: "finish",
            text: "תקלה בהפקת המטריצה",
            errors: {
              global: Errors.length > 0 ? Errors : null,
              errorsMatrix: docHelper.gotErrors(ErrorMatrix) ? ErrorMatrix : null,
            },
          },
          false
        );

      console.log(` status: "no", data: ${err}`);
    });
});

app.post("/api/initvalidate", Helper.authenticateToken, async function (req, res) {
  const stage = req.headers["stage"];
  const body = await req.body;

  console.log({ stage });
  if (stage === "conection") {
    const result = await reportsCreator.checkConectionJson(body);
    res.send(result);
  }
  if (stage === "reports") {
    //console.log("in reports check");
    const userID = Helper.getUsserID(req);
    //console.log({ userID });
    const data = {
      headers: { authorization: req.headers?.authorization },
      body: { collection: "Config" },
    };
    const config = await Helper.fetchData(data, "/api/getdata").then((res) => res.data[0]);
    //console.log({ config });

    const erpConectionJson = config.ErpConfig[config.ErpConfig.erpName];

    const reports = await Promise.all([
      reportsCreator.exportRecords({ castumers: body.castumers, TID: "2" }, userID, erpConectionJson),
      reportsCreator.exportRecords({ products: body.products, TID: "1" }, userID, erpConectionJson),
    ]).then((values) => {
      //console.log({ values });
      return values;
    });
    //console.log({ reports });
    return res.send(reports);
  }
});

app.post("/api/getrecords", Helper.authenticateToken, async function (req, res) {
  console.log("~~~~~~~~~~~~~ getrecords ~~~~~~~~~~~~~~~~~");

  const columnToValidate = await req.body.columnToValidate;

  let checkUserID = await Helper.getUsserID(req);
  if (checkUserID.status == false) return res.send(checkUserID.data);
  let userID = checkUserID.data;

  let searchData;
  let isNew;
  let isSended = false;
  const reportData = await req.body;

  const UPDATE_TIME_INTERVAL = 1000 * 300;
  await StoredReports.find({ ID: JSON.stringify(reportData), userID: userID })
    .then(async (report) => {
      let len = report.length;
      console.log({ len });
      report.length == 0 ? (isNew = true) : (isNew = false);
      searchData = report;

      if (!isNew) {
        const currentTime = new Date(new Date().toLocaleString("en", { timeZone: "Asia/Jerusalem" })).getTime();
        const reportTime = new Date(report[0]._doc.Date).getTime();
        console.table({ currentTime, reportTime });
        if (currentTime - reportTime < UPDATE_TIME_INTERVAL) {
          isSended = true;
          let validationMsg = await Helper.checkDataValidation(report[0]._doc.Report.jsondata, columnToValidate);
          console.log("data sended to client ");
          isNew = false;
          let jsonData = report[0]._doc.Report.jsondata;
          res.send({
            status: report[0].Report ? "yes from fast DB" : `no, report data invalid value ${report[0].Report} `,
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
          console.log({ jsondata });
          // if (jsondata !== "object") throw console.error(jsondata);
          let validationMsg = await Helper.checkDataValidation(jsondata, [1, 2]);
          return { jsondata, validationMsg };
        })
        .then(async (jsondata, validationMsg) => {
          const reportObject = {
            userID: userID,
            Date: new Date().toLocaleString("en", { timeZone: "Asia/Jerusalem" }),
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
                status: (await jsondata) ? "yes from slow DB" : `no, NO JSON DATA IN SLOW DB VALUE ${jsondata}`,
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
});

app.post("/api/flexdoc", async function (req, res) {
  let fileCod = await req.body;
  const jsdata = await castumReports.exportCastumersRecords(fileCod);
  let parsed = await JSON.parse(jsdata);
  fs.writeFileSync("jsonData.json", JSON.stringify(parsed.status.repdata, null, 2), (err) => console.log);
  res.send(jsdata).end();
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

app.post("/api/getProgressBar", async (req, res) => {
  const Filename = req.headers["filename"];
  const TimeLimit = parseInt(req.headers["timelimit"]);

  // console.log("IN GET PROGRESS DATA ", { Filename, TimeLimit });
  let path = "./" + Filename + ".json";

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  const { id } = await req.body;
  res.status(200);
  let runtime = 0;
  let stageName = "";
  let intervals = setInterval(() => {
    // console.log("IN GET PROGRESS DATA ", { Filename, TimeLimit, runtime });
    let file_exist = fs.existsSync(path);
    //  console.log({ file_exist });
    if (file_exist) {
      let result = JSON.parse(fs.readFileSync(path, { encoding: "utf8", flag: "r" }));
      //  console.log("file exist");
      console.log("resualt Stage Name", result.stageName, { stageName });
      if (result.stageName != stageName) {
        stageName = result.stageName;
        res.write(JSON.stringify(result));
        console.log("file updated");
      }
      if (result.stageName == "finish" || result?.termenate) {
        toBreak = true;
        clearInterval(intervals);
        console.log("BRAKING FROM GET PROGRESS BAR");
        fs.unlinkSync(path);
        return res.end();
      }
    }

    runtime += 1;

    let limit = TimeLimit ? TimeLimit * 2000 : 60;

    if (runtime > limit) {
      ``;
      res.write("to long");
      file_exist && fs.unlinkSync(path);
      clearInterval(intervals);
      return res.end(" out");
    }
  }, 500);
});
