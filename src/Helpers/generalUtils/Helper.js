const { json, header } = require("express/lib/response");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let utfZone = "en";
//const dbUrl = process.env.DBport || "http://localhost:4000";
const dbUrl = "http://localhost:4000";
const axios = require("axios");

const fetchData = async (data, reqUrl) => {
  let options = {
    url: `${dbUrl}${reqUrl}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      authorization: data.headers?.authorization ? data.headers.authorization : null,
    },
    data: data.body ? data.body : data,
  };
  return axios(options).then((result) => result.data);
};
const getUsserID = async (req) => {
  let user = await req?.user;
  let userID;
  try {
    userID = user?.fetchedData?.userID ? user.fetchedData.userID : user.userID;
    //  console.log("userID", userID);
  } catch (e) {
    return {
      status: false,
      data: `no, user id invalid value ${userID} ${JSON.stringify(e)}`,
    };
  }
  return {
    status: true,
    data: userID,
    config: user?.configObj ? user.configObj : null,
  };
};

const saveDocURL = async (docsArrey, oauth) => {
  // console.log({ docsArrey });
  let body = await docsArrey;

  let Req = {
    headers: {
      authorization: oauth,
    },
    body: body,
  };

  //console.log({ Req });
  return await fetchData(Req, "/api/saveDocs")
    .then((result) => {
      // console.log("result in fetch %%%%", result);
      let resultData = result;
      //  console.log({ resultData });
      return { resultData };
    })
    .catch((e) => {
      console.log("error in save doc url", e);
    });
};

const saveMatrixesToDB = async (req, isTrue) => {
  //console.log("$$$$$$$$$$$$$$$ in  saveMatrixesToDB $$$$$$$$$$$$$$$\n", obj);
  let body = await req.body;
  // console.log("!!! body in saveMatrixesToDB !!!", body);
  let headers = await req.headers;
  // console.log("!!! headers in saveMatrixesToDB !!!", headers);
  let bool = await isTrue;
  body["Date"] = new Date().toLocaleString(utfZone, {
    timeZone: "Asia/Jerusalem",
  });
  body["isProduced"] = bool;
  body["isInitiated"] = bool;
  body["isBI"] = bool;

  let Req = {};
  Req["body"] = body;

  Req["headers"] = headers;
  console.log({ body, headers });

  // console.log(Req);
  return await fetchData(Req, "/api/saveMatrix")
    .then((result) => {
      if (result.status == "no") console.log(result.data._message);
      let resultData = result;
      return { resultData };
    })
    .catch((e) => e);
};
const authenticateTokenTest = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  //  console.log({ authHeader });
  const token = authHeader && authHeader.split(" ")[1];

  //console.log({ token });
  if (token == null) {
    req.testMsg = {
      status: 401,
      msg: "***** in test mode ***** no token in header",
    };
    next();
    return;
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      req.testMsg = {
        status: 403,
        msg: "***** in test mode ***** no token in header",
      };
      //  console.log({ user });
      next();
      return;
    }
    req.testMsg = { status: 200 };
    req.user = user;
    //console.log(user);
    next();
  });
};

const createRetJson = async (answer, Action, userID) => {
  console.log(`CreateRetJson function `, answer);
  try {
    ret = {
      userID: userID,
      DocumentIssuedStatus: answer[0]["DocumentIssuedStatus"],
      ValueDate: answer[0]["DocumentDetails"][0][0]["ValueDate"],
      DocumentDefID: answer[0]["DocumentDetails"][0][0]["DocumentID"],
      StockID: answer[0]["DocumentDetails"][0][0]["StockID"],
      DocNumber: answer[0]["DocumentDetails"][0][0]["DocNumber"],
      AccountKey: answer[0]["DocumentDetails"][0][0]["AccountKey"],
      Accountname: answer[0]["DocumentDetails"][0][0]["accountname"],
      TotalCost: answer[0]["DocumentDetails"][0][0]["Tftal"],
      Address: answer[0]["DocumentDetails"][0][0]["Address"],
      DocumentDetails: answer[0]["DocumentDetails"][0][0]["Phone"],
      DocUrl: answer[0]["urlDoc"],
      Action: parseInt(Action),
      SigStat: { isSigned: false },
    };
  } catch (err) {
    console.error("create json ", err);
    return { status: "no", data: err, error: answer?.error };
  }
  console.log("after action object ", { ret });
  return ret;
};

const constructUsserCred = (usser) => {
  let usserCred = {};

  //usserDbname, usserServerName, usserPrivetKey
  usserCred.usserPrivetKey = usser.WizcloudApiPrivateKey;
  usserCred.usserServerName = usser.WizcloudApiServer;
  usserCred.usserDbname = usser.WizcloudApiDBName;
  return usserCred;
};

const constructNewUserCred = (usserData, generatedUsserKey) => {
  let newUsserData = {
    Key: generatedUsserKey,
    Name: usserData.Name,
    Email: usserData.Email,
    WizcloudApiPrivateKey: usserData.WizcloudApiPrivateKey,
    WizcloudApiServer: usserData.WizcloudApiServer,
    WizcloudApiDBName: usserData.WizcloudApiDBName,
  };
  return newUsserData;
};

const readJsonFILE = (fileName) => {
  let docData = fs.readFileSync(path.resolve(__dirname, `../${fileName}.json`), (err) => {
    if (err) throw err;

    console.log(err, "See resaults in myApiRes.txt");
  });

  return JSON.parse(docData);
};

const updateJsonFILE = async (fileName, newData) => {
  //fileName = 'castumersInvoiceUrls'

  //newData = dd

  let data = fs.readFileSync(path.resolve(__dirname, `../${fileName}.json`), (err) => {
    if (err) throw err;

    console.log(err, "See resaults in myApiRes.txt");
  });
  // console.log(data);
  data = await JSON.parse(data);
  //console.log(data);

  newData.forEach((row, index) => {
    // console.log("row  " + row + "index " + index);
    data.data.push(row);
  });

  //console.log(typeof data);

  fs.writeFileSync(path.resolve(__dirname, `../${fileName}.json`), JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log(err, "See resaults in myApiRes.txt");
  });
  return data;
};

const checkDataValidation = async (jsonData, columnToValidate) => {
  let errorLog = [];
  let error = {};
  columArrey = await columnToValidate;
  let headers;
  try {
    headers = Object.keys(jsonData[0]);
  } catch (e) {
    return e;
  }

  if (!columArrey) return null;
  jsonData.forEach((tableRecord, tableRecoedIndex) => {
    let rowsIndexes = [];

    columArrey.forEach((columnNumber) => {
      for (let i = tableRecoedIndex + 1; i <= jsonData.length - 1; i++) {
        //  let length = jsonData.length;
        //     console.log({ i, tableRecoedIndex, length });
        //  let j = jsonData[i];

        // console.log({ tableRecord, j });
        if (
          tableRecord[headers[columnNumber - 1]] == jsonData[i][headers[columnNumber - 1]] &&
          tableRecord[headers[columnNumber - 1]] != null
        ) {
          rowsIndexes.length > 0 ? rowsIndexes.push(i) : rowsIndexes.push(tableRecoedIndex, i);
        }
      }
      if (rowsIndexes.length > 0) {
        error = {
          "סוג תקלה": "תקלת כפל מידע",
          "בשורות ": `${rowsIndexes} `,
          "בכותרת ": ` ${headers[columnNumber - 1]}`,
          "ערך ": `${tableRecord[headers[columnNumber - 1]]}`,
        };
        errorLog.push(error);
      }
    });
  });

  return errorLog ? errorLog : "no errors to show";
};

//checkDataValidation();

const sortReportData = (reportData, sortKey) => {
  let Keys;
  let Values;
  try {
    Keys = Object.keys(sortKey);
    Values = Object.values(sortKey);
  } catch (err) {
    console.log("keys and sheet ", err);
  }

  let newSortedData;
  let updatedData = reportData;

  Keys.forEach((key, index) => {
    newSortedData = [];
    updatedData.forEach((row) => {
      if (row[key] == Values[index]) {
        newSortedData.push(row);
      }
    });
    updatedData = newSortedData;
    // console.log(`sorted data \n ${JSON.stringify(newSortedData)}`);
  });

  if (!updatedData)
    return {
      status: "no rows to return",
    };
  return updatedData;
};

module.exports.getUsserID = getUsserID;
module.exports.saveMatrixesToDB = saveMatrixesToDB;
module.exports.saveDocURL = saveDocURL;
module.exports.authenticateToken = authenticateToken;
module.exports.constructNewUserCred = constructNewUserCred;
module.exports.constructUsserCred = constructUsserCred;
module.exports.readJsonFILE = readJsonFILE;
module.exports.updateJsonFILE = updateJsonFILE;
module.exports.sortReportData = sortReportData;
module.exports.createRetJson = createRetJson;
module.exports.checkDataValidation = checkDataValidation;
module.exports.authenticateTokenTest = authenticateTokenTest;
