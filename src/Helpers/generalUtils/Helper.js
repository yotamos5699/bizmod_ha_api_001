const { json, header } = require("express/lib/response");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const dbUrl =
  process.env.DBport ||
  "https://bizmod-db-server.herokuapp.com" ||
  "http://localhost:5000";
const axios = require("axios");

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

const saveDocURL = async (docsArrey) => {
  console.log(
    "$$$$$$$$$$$$$$$$$ in saveDocURLg $$$$$$$$$$$$$$$$$$\n ",
    docsArrey
  );
  return await fetchData(docsArrey, "/api/saveDocs")
    .then((result) => {
      console.log("result in fetch %%%%", result);
      let resultData = result;
      return { resultData };
    })
    .catch((e) => e);
};

const saveMatrixesToDB = async (obj, isbi) => {
  console.log("$$$$$$$$$$$$$$$ in  saveMatrixesToDB $$$$$$$$$$$$$$$\n", obj);
  obj.isBI = await isbi;
  console.log(obj);
  return await fetchData(obj, "/api/saveMatrix")
    .then((result) => {
      console.log("result in fetch %%%%", result);
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
// {
//   fetchedData: {
//     status: 'yes',
//     configObj: {
//       usserID: [Object],
//       DefaultDriver: [Object],
//       DocumentDef: [Object],
//       PremissionMtx: [Object]
//     },
//     userID: '62fd0ceeedbc87baf3979757'
//   },
//   iat: 1662022559
// }

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
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
      console.log(user);
      next();
      return;
    }
    req.testMsg = { status: 200 };
    req.user = user;
    console.log(user);
    next();
  });
};

const createRetJson = async (answer, index, Action, userID, addedValue) => {
  console.log(
    `CreateRetJson function !! \n number doc ${index} \n ${JSON.stringify(
      answer
    )}`
  );
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
    Action: Action + addedValue,
    SigStat: { isSigned: false },
  };
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
  let docData = fs.readFileSync(
    path.resolve(__dirname, `../${fileName}.json`),
    (err) => {
      if (err) throw err;

      console.log(err, "See resaults in myApiRes.txt");
    }
  );

  return JSON.parse(docData);
};

const updateJsonFILE = async (fileName, newData) => {
  //fileName = 'castumersInvoiceUrls'

  //newData = dd

  let data = fs.readFileSync(
    path.resolve(__dirname, `../${fileName}.json`),
    (err) => {
      if (err) throw err;

      console.log(err, "See resaults in myApiRes.txt");
    }
  );
  console.log(data);
  data = await JSON.parse(data);
  console.log(data);

  newData.forEach((row, index) => {
    console.log("row  " + row + "index " + index);
    data.data.push(row);
  });

  console.log(typeof data);
  console.log(data);

  fs.writeFileSync(
    path.resolve(__dirname, `../${fileName}.json`),
    JSON.stringify(data),
    (err) => {
      if (err) throw err;
      console.log(err, "See resaults in myApiRes.txt");
    }
  );
  return data;
};

const checkDataValidation = async (jsonData, columArrey) => {
  let errorLog = [];
  let error = {};
  columArrey = [1, 2, 3];
  let headers;
  try {
    headers = Object.keys(jsonData[0]);
  } catch (e) {
    return e;
  }
  jsonData.forEach((row, outindex) => {
    let rowIndex = [];
    columArrey.forEach((column, index) => {
      jsonData.forEach((inrow, inindex) => {
        if (outindex != index) {
          if (row[headers[column - 1]] == inrow[headers[column - 1]]) {
            rowIndex
              ? rowIndex.push(inindex)
              : rowIndex.push(outindex, inindex);
          }
        }
      });
      if (rowIndex.length > 1) {
        error = {
          "סוג תקלה": "תקלת כפל מידע",
          "בשורות ": `${rowIndex} `,
          "בכותרת ": ` ${headers[column - 1]}`,
          "ערך ": `${row[headers[column - 1]]}`,
        };
        errorLog.push(error);
      }
      rowIndex = [];
    });
  });

  let res = errorLog ? errorLog : null;

  console.log(
    `**************************** Error Log ****************************\n `
  );
  //console.table(res);

  return res;
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
    console.log(`sorted data \n ${JSON.stringify(newSortedData)}`);
  });

  if (!updatedData)
    return {
      status: "no rows to return",
    };
  return updatedData;
};

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
