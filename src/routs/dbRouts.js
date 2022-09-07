const express = require("express");
const DBrouter = express.Router();
const cors = require(`cors`);
const bodyParser = require("body-parser");
require("dotenv").config();
const dbUrl =
  process.env.DBport ||
  "https://bizmod-db-server.herokuapp.com/" ||
  "http://localhost:5000";
const axios = require("axios");
const Helper = require("../Helpers/generalUtils/Helper");
const matrixesHandeler = require("../Helpers/wizCloudUtiles/helpers/calcKi");

DBrouter.use(
  cors({
    origin: "*",
  })
);

console.log(dbUrl);
DBrouter.use(express.json());
DBrouter.use(bodyParser.urlencoded({ extended: true }));
DBrouter.use(bodyParser.json());

const fetchData = async (req, reqUrl, actionHeader) => {
  const data = await req.body;
  if (reqUrl == "/api/saveMatrix") {
    console.log(" in save matrix @@@@@@@@@@@@@@@@@@@@@@@")(
      ({ data } = await matrixesHandeler.prererMatixesData({ data }))
    );
  }

  const authHeader = req.headers["authorization"];
  const Type = req.headers["type"];
  let options = {
    url: `${dbUrl}${reqUrl}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: authHeader,
      ForcedAction: actionHeader ? actionHeader : null,
    },
    data: data,
  };
  return axios(options).then((result) => result.data);
};

DBrouter.post(
  "/api/loadmatrixes",
  Helper.authenticateToken,
  async (req, res) => {
    const testMsg = req.testMsg;

    fetchData(req, "/api/loadmatrixes")
      .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
      .catch((e) => res.send(e));
  }
);

DBrouter.post("/api/deleteData", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;

  fetchData(req, "/api/deleteData")
    .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
    .catch((e) => res.send(e));
});
DBrouter.post("/api/saveMatrix", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;

  fetchData(req, "/api/savematrix")
    .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
    .catch((e) => res.send(e));
});

// ****************************  MONGO DB END POINTS  **************************** //
DBrouter.post(
  "/api/loadDocUrls",
  Helper.authenticateToken,
  async (req, res) => {
    const testMsg = req.testMsg;

    fetchData(req, "/api/loadDocUrls")
      .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
      .catch((e) => res.send(e));
  }
);

DBrouter.post("/api/getData", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;

  fetchData(req, "/api/getdata")
    .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
    .catch((e) => res.send(e));
});

DBrouter.post("/api/Register", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;

  fetchData(req, "/api/register")
    .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
    .catch((e) => res.send(e));
});

DBrouter.post("/api/setConfig", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;

  const actionHeader = req.headers["forcedaction"];
  console.log("in matrix ui set config", data);
  fetchData(req, "/api/setConfig", actionHeader)
    .then((result) => {
      console.log("result in fetch %%%%", result);
      let resultData = result;
      res.send(testMsg ? { resultData, testMsg } : { resultData });
    })
    .catch((e) => res.send(e));
});

DBrouter.post(
  "/api/setErpConfig",
  Helper.authenticateToken,
  async (req, res) => {
    const testMsg = req.testMsg;

    const actionHeader = req.headers["forcedaction"];
    console.log("in matrix ui erp config ", data);
    fetchData(req, "/api/setErpConfig", actionHeader)
      .then((result) => {
        console.log("result in fetch %%%%", result);
        let resultData = result.data;
        res.send(testMsg ? { resultData, testMsg } : { resultData });
      })
      .catch((e) => res.send(e));
  }
);
//  *****************************  FIRE BASE END POINTS  **********************************//
DBrouter.post(
  "/api/savesignedFiles",
  Helper.authenticateToken,
  async (req, res) => {
    const testMsg = req.testMsg;
    const options = await req.boby;
    const fetcResult = await fetchData(
      options,
      Helper.authenticateToken,
      "/api/savesignedFils"
    );
    fetcResult.then(res.send(testMsg ? { result, testMsg } : { result }));
  }
);

DBrouter.post(
  "/api/loadsignedFiles",
  Helper.authenticateToken,
  async (req, res) => {
    const testMsg = req.testMsg;
    const options = await req.boby;
    const fetcResult = await fetchData(
      options,
      Helper.authenticateToken,
      "/api/loadsignedFiles"
    );
    fetcResult.then(res.send(testMsg ? { result, testMsg } : { result }));
  }
);

module.exports = DBrouter;

// const uri =
//   "mongodb+srv://yotamos:linux6926@cluster0.zj6wiy3.mongodb.net/mtxlog?retryWrites=true&w=majority";
// const MGoptions = { useNewUrlParser: true, useUnifiedTopology: true };
// MGrouter.use(express.json());
// MGrouter.use(bodyParser.urlencoded({ extended: true }));
// MGrouter.use(bodyParser.json());
// mongoose
//   .connect(uri, MGoptions)
//   .then((res) => console.log("conected to mongo...."))
//   .catch((e) => console.log(e));

// MGrouter.post("/api/loadmatrixes", async (req, res) => {
//   MtxLog.find()
//     .then((result) => {
//       console.log(result);
//       res.send({ status: "yes", data: result });
//     })
//     .catch((e) => {
//       console.log(e);
//       res.send({ status: "no", data: e });
//     });
// });

// MGrouter.post("/api/saveMatrix", async function (req, res) {
//   let body = await req.body;
//   const { matrixID, UserID, matrixesData } = body;

//   let reqMtxData = new MtxLog({
//     matrixID: JSON.stringify(matrixID),
//     UserID: JSON.stringify(UserID),
//     matrixesData: JSON.stringify(matrixesData),
//   });

//   reqMtxData
//     .save()
//     .then((result) => {
//       console.log(result);
//       res.send({ status: "yes", data: result });
//     })
//     .catch((e) => {
//       console.log(e);
//       res.send({ status: "no", data: e });
//     });
// });

// MGrouter.post("/api/loadDocUrls", async (req, res) => {
//   DocData.find()
//     .then((result) => {
//       console.log(result);
//       res.send({ status: "yes", data: result });
//     })
//     .catch((e) => {
//       console.log(e);
//       res.send({ status: "no", data: e });
//     });
// });

// router.post("/api/savesignedFiles", async function (req, res) {

//   let fileName = await req.body.fileName
//   let file = await req.body.file
//   let account = await req.body.AccountKey
//   try {
//       uploadFile(fileName, file, account).then(
//           console.log("file uploaded...")
//       )
//   } catch (err) {
//       console.log('error on uploading file')
//       return res.send('error').end;
//   }
//   return res.send('file uploaded').end
// });

// router.get("/api/loadsignedFiles", async function (req, res) {
//   let path = await req.body.Path
//   let accounts = await ewq.body.Accounts
//   try {
//       let urlsList = await getUrlList(path, accounts)
//       res.json({
//           data: JSON.stringify(urlsList)
//       }).end;
//   } catch (err) {

//       console.log(err)
//       res.json({
//           data: 'error'
//       }).end;
//   }

// });
// module.exports = MGrouter;
