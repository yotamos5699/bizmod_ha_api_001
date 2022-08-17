const express = require("express");
const DBrouter = express.Router();

const bodyParser = require("body-parser");
//const mongoose = require("mongoose");
require("dotenv").config();
//const dbUrl = process.env.DB_SERVER_BASE_URL || 5000;
const dbUrl = "http://localhost:5000";
const axios = require("axios");
const { validate } = require("uuid");
//const { options } = require("./fireBase");
const Helper = require('../Helpers/generalUtils/Helper')


console.log(dbUrl);
DBrouter.use(express.json());
DBrouter.use(bodyParser.urlencoded({ extended: true }));
DBrouter.use(bodyParser.json());
const fetchData = async (data, reqUrl) => {
  let options = {
    url: `${dbUrl}${reqUrl}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    
    },
    data: data,
  };
  return axios(options).then((result) => result.data);
};

DBrouter.post("/api/loadmatrixes", async (req, res) => {
  const data = await req.body;
  console.log('data !!!',data)
  fetchData(data, "/api/loadmatrixes")
    .then((result) => res.send(result))
    .catch((e) => res.send(e));
});

DBrouter.post("/api/saveMatrix", async function (req, res) {
  const data = await req.body;
  fetchData(data, "/api/savematrix")
    .then((result) => res.send(result))
    .catch((e) => res.send(e));
});

// ****************************  MONGO DB END POINTS  **************************** //
DBrouter.post("/api/loadDocUrls", async (req, res) => {
  const data = await req.body;
  fetchData(data, "/api/loadDocUrls")
    .then((result) => res.send(result))
    .catch((e) => res.send(e));
});

DBrouter.post("/api/getData", async function (req, res) {
  const data = await req.body;
  fetchData(data, "/api/getdata")
    .then((result) => res.send(result))
    .catch((e) => res.send(e));
});

DBrouter.post("/api/Register", async (req, res) => {
  const data = await req.body;
  fetchData(data, "/api/register")
    .then((result) => res.send(result))
    .catch((e) => res.send(e));
})

DBrouter.post("/api/setConfig", async (req, res) => {
  const data = await req.body;
  fetchData(data, "/api/setConfig")
    .then((result) => res.send(result))
    .catch((e) => res.send(e));
})
//  *****************************  FIRE BASE END POINTS  **********************************//
DBrouter.post("/api/savesignedFiles", async function (req, res) {
  const options = await req.boby;
  const fetcResult = await fetchData(options, "/api/savesignedFils");
  fetcResult.then(res.send(fetcResult));
});

DBrouter.post("/api/loadsignedFiles", async function (req, res) {
  const options = await req.boby;
  const fetcResult = await fetchData(options, "/api/loadsignedFiles");
  fetcResult.then(res.send(fetcResult));
});

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
