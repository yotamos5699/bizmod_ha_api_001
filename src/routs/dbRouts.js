const express = require("express");
const DBrouter = express.Router();
const cors = require(`cors`);
const bodyParser = require("body-parser");
require("dotenv").config();
const dbUrl = process.env.DBport || "http://localhost:4000";
//const dbUrl = "http://localhost:4000";
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

const doLoginOnRegister = async (loginData) => {
  let options = {
    url: `https://bizmod-oauth-server.onrender.com/api/login`,
    //url: "http://localhost:5000/api/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: loginData,
  };
  return axios(options)
    .then((result) => result.data)
    .catch((e) => console.log({ e }));
};

const fetchData = async (req, reqUrl, actionHeader) => {
  const data = await req.body;
  console.log("req headers .....", req.headers);
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

DBrouter.post("/api/loadmatrixes", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;

  fetchData(req, "/api/loadmatrixes")
    .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
    .catch((e) => res.send(e));
});

DBrouter.post("/api/deleteData", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;

  fetchData(req, "/api/deleteData")
    .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
    .catch((e) => res.send(e));
});
DBrouter.post("/api/saveMatrix", Helper.authenticateToken, async (req, res) => {
  console.log("saveMatrix");
  const testMsg = req.testMsg;
  console.log("save matrix ..");
  fetchData(req, "/api/savematrix")
    .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
    .catch((e) => res.send(e));
});

// ****************************  MONGO DB END POINTS  **************************** //
DBrouter.post("/api/loadDocUrls", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;

  fetchData(req, "/api/loadDocUrls")
    .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
    .catch((e) => res.send(e));
});

DBrouter.post("/api/getData", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;
  fetchData(req, "/api/getdata")
    .then((result) => res.send(testMsg ? { result, testMsg } : { result }))
    .catch((e) => res.send(e));
});

DBrouter.post("/api/Register", async (req, res) => {
  console.log("register !!!");
  const testMsg = req.testMsg;
  const body = await req.body;

  // console.log("in matrix ui set config", data);
  let isError = false;
  const registerRes = await Helper.fetchData(req, "/api/register")
    .then((result_) => {
      console.log({ result_ });
      const isPassword = Object.keys(result_).find((value) => value === "userPassword");
      const result = isPassword ? { ...result_.data, userPassword: "********" } : { data: result_.error, status: "no" };

      console.log({ result, result_ });
      return testMsg ? { result, testMsg } : { result };
    })
    .catch((e) => {
      console.log({ e });
      isError = true;
      return res.send(e);
    });

  if (isError) return;

  const loginData = {
    Mail: body.Mail,
    userPassword: body.userPassword,
  };
  const loginRes = await doLoginOnRegister(loginData)
    .then((result) => {
      return testMsg ? { result, testMsg } : { result };
    })
    .catch((e) => e);
  registerRes.loginData = { ...loginRes };

  return res.send(registerRes);
});

DBrouter.post("/api/setConfig", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;

  const actionHeader = req.headers["forcedaction"];
  // console.log("in matrix ui set config", data);
  fetchData(req, "/api/setConfig", actionHeader)
    .then((result) => {
      console.log("result in fetch %%%%", result);
      let resultData = result;
      res.send(testMsg ? { resultData, testMsg } : { resultData });
    })
    .catch((e) => res.send(e));
});

DBrouter.post("/api/setErpConfig", Helper.authenticateToken, async (req, res) => {
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
});
//  *****************************  FIRE BASE END POINTS  **********************************//
DBrouter.post("/api/savesignedFiles", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;
  const options = await req.boby;
  const fetcResult = await fetchData(options, Helper.authenticateToken, "/api/savesignedFils");
  fetcResult.then(res.send(testMsg ? { result, testMsg } : { result }));
});

DBrouter.post("/api/loadsignedFiles", Helper.authenticateToken, async (req, res) => {
  const testMsg = req.testMsg;
  const options = await req.boby;
  const fetcResult = await fetchData(options, Helper.authenticateToken, "/api/loadsignedFiles");
  fetcResult.then(res.send(testMsg ? { result, testMsg } : { result }));
});

module.exports = DBrouter;
module.exports.fetchData = fetchData;
