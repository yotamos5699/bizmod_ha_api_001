const wizlib = require("wizcloud-api");
const getCredential = require("../helpers/getCred");
const Helper = require("../../generalUtils/Helper");
const defultReports = require("./filencryption");
const e = require("express");
const ofek = "69d62ed5fab64d1dae700d34";

const ariya = "69d56ea4fab64d1dae700d29";

const amir = "638dac1454f08b935ed4af2f";
const yafit = "638dad0c54f08b935ed4af34";

let docHash = {};
try {
  docHash = {
    1: [
      [defultReports.stockEncrypt_reportData, defultReports.params_data_st],
      [defultReports.encrypt_treeItemsreportData, defultReports.treeItemsParams_data],
    ],

    2: [defultReports.castumersEncryptData, defultReports.params_data_ca],
  };
} catch (err) {
  console.dir(err);
  return err;
}

async function exportRecords(reqData, userID) {
  console.log("~~~~~~~~~~~~~~~~~ in flex docs ~~~~~~~~~~~~~~~~~~");
  if (defultReports == undefined) return "error in fetching defultReports data";

  let fileData = reqData.TID;
  let sortKey = await reqData.sortKey;
  let Warehouse = "";
  fileData == "1" ? (Warehouse = reqData.Warehouse) : (Warehouse = null);

  //let ID = (await userID) == realUserID ? realUserID : amir ? amir : yafit ? yafit : "1111";
  //if (ID != "1111") console.log("ofek is connected");
  let ID;
  if (userID == ofek) {
    ID = ofek;
  } else if (userID == amir) {
    ID = amir;
  } else if (userID == yafit) {
    ID = yafit;
  } else if (userID == ariya) {
    ID = ariya;
  } else {
    ID = "1111";
  }

  console.log({ ID });
  const { usserDbname, usserServerName, usserPrivetKey } = await getCredential.getCastumersCred(ID);

  let myDBname = usserDbname;
  try {
    wizlib.init(usserPrivetKey, usserServerName);
  } catch (e) {
    return e;
  }

  let reportCod, parameters;
  if (fileData == "4") {
    [reportCod, parameters] = fileData;
  } else if (fileData == "1") {
    [reportCod, parameters] = docHash[fileData][0];
  } else if (fileData == "2") {
    [reportCod, parameters] = docHash[fileData];
    console.log("file data ", fileData);
  }

  let apiRes = await wizlib.exportDataRecords(myDBname, {
    datafile: reportCod,
    parameters: parameters,
  });

  let treeData;
  if (fileData == "1") {
    [reportCod, parameters] = docHash[fileData][1];
    treeData = await wizlib.exportDataRecords(myDBname, {
      datafile: reportCod,
      parameters: parameters,
    });
  }
  apiRes = JSON.parse(apiRes);
  //console.log(apiRes.status.repdata);
  // console.log(apiRes)

  let resArrey = [];
  if (fileData == "1") {
    try {
      treeData = JSON.parse(treeData);
    } catch (e) {
      return e;
    }
    // console.log(JSON.stringify(treeData, null, 2));
    apiRes.status.repdata.forEach((itemsDataRow) => {
      let record = {};
      let isRecord = false;
      treeData.status.repdata.forEach((treeDataRow) => {
        if (itemsDataRow["מפתח פריט"] == treeDataRow["מפתח פריט אב"]) {
          record = itemsDataRow;
          record["מפתח פריט אב"] = treeDataRow["מפתח פריט"];
          isRecord = true;
          //  console.log(row['מפתח פריט'] + " " + item['מפתח פריט אב'])
        }
      });
      if (isRecord) {
        resArrey.push(record);
      } else {
        record = itemsDataRow;
        record["מפתח פריט אב"] = itemsDataRow["מפתח פריט"];
        resArrey.push(record);
      }
    });
  }

  let newArrey = [];
  console.log("resss array ", resArrey);
  resArrey.forEach((resRow) => {
    let record = {};

    apiRes.status.repdata.forEach((tableRow) => {
      if (resRow["מפתח פריט אב"] == tableRow["מפתח פריט"]) {
        record = resRow;
        record["שם פריט אב"] = tableRow["שם פריט"];
        record["תרה כמותית אב"] = tableRow["יתרה כמותית במלאי"];
        newArrey.push(record);
      }
    });
  });
  //console.log(JSON.stringify(newArrey, null, 2));
  //console.log({ apiRes });
  // console.log("res keys", Object.keys(apiRes.status));
  //console.log("RES.REPDATA", apiRes.status.repdata);
  //  console.log({ newArrey });
  let jsondata = resArrey.length > 0 ? newArrey : apiRes.status.repdata;
  // console.log({ jsondata });
  //const data = JSON.stringify(jsondata, null, 2);
  //console.log("json data !!!", jsondata);
  if (sortKey) {
    try {
      jsondata = Helper.sortReportData(jsondata, sortKey);

      return jsondata;
    } catch (err) {
      console.log(`error on sortReportData${err}`);
    }
  } else {
    console.log("raw data...." + JSON.stringify(jsondata));
    return jsondata;
  }
}

module.exports.exportRecords = exportRecords;

// record['שם אב'] = itemsDataRow['שם פריט']
// record['יתרה כמותית במלאי'] = row['יתרה כמותית במלאי']
// record['משקל'] = itemsDataRow['משקל']
// //   {
//   "איתור אב": null,
//   "מפתח פריט אב": "XPF",
//   "משקל אב": 1,
//   "איתור": null,
//   "מפתח פריט": "XP",
//   "משקל": 1
// },
// "שם פריט": "גת קימבו לפי משקל",
// "מפתח פריט": "KIKG",
// "קוד מיון": 51200,
// "יתרה כמותית במלאי": 0,
// "משקל": 1,
// "מחסן": 1
const ss = {
  matrixID: "fad6df3afab7489e65527d684efe69007cde0070eec894f5708ea114b5360ec1",
  matrixName: "יום 09042026 דרום צפון  משוכפל_02",
  matrixesData: {
    mainMatrix: {
      matrixID: "fad6df3afab7489e65527d684efe69007cde0070eec894f5708ea114b5360ec1",
      ActionID: [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      AccountKey: [
        "6110",
        "6216",
        "6271",
        "6077",
        "6284",
        "6280",
        "6026",
        "6054",
        "6253",
        "6254",
        "6104",
        "6085",
        "6053",
        "6051",
      ],
      DocumentID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      DriverID: [
        "lopSS88_TY&*ghkjh",
        "lopSS88_TY&*ghkjh",
        "lopSS88_TY&*ghkjh",
        "pewr1778256edrf",
        "pewr1778256edrf",
        "pewr1778256edrf",
        "msgfr6_TY&*ghkjh",
        "msgfr6_TY&*ghkjh",
        "msgfr6_TY&*ghkjh",
        "66jh6_TY&*gsejh",
        "pewr1778256edrf",
        "molpc0_TY&*ptrew",
        "66jh6_TY&*gsejh",
        "66jh6_TY&*gsejh",
      ],
      ActionAutho: [
        "Default",
        "Default",
        "Default",
        "Default",
        "Default",
        "Default",
        "Default",
        "Default",
        "Default",
        "Default",
        "Default",
        "Default",
        "Default",
        "Default",
      ],
      itemsHeaders: ["BB100SA", "XP100SA", "XR100SA", "SP250SA", "SX250SA", "KI250SA"],
      itemsNames: ["גת בייבי", "גת XP", "גת XR", "גת SP מובחר", "גת SPXP", "קימבו גדול"],
      cellsData: [
        [0, 10, 0, 5, 0, 10],
        [10, 35, 0, 5, 0, 35],
        [5, 10, 5, 0, 0, 6],
        [5, 7, 0, 2, 0, 5],
        [0, 0, 0, 0, 0, 15],
        [0, 3, 0, 3, 2, 3],
        [8, 32, 0, 0, 0, 10],
        [0, 12, 0, 5, 0, 3],
        [0, 20, 0, 0, 0, 0],
        [5, 5, 3, 5, 2, 7],
        [0, 0, 0, 5, 0, 12],
        [8, 12, 15, 5, 0, 0],
        [2, 6, 2, 5, 0, 0],
        [12, 20, 10, 2, 0, 10],
      ],
    },
    changesMatrix: {
      matrixConfig: null,
      matrixGlobalData: null,
      cellsData: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
      ],
      docData: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      metaData: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    },
  },
  Date: "4/13/2026, 10:39:41 AM",
  isBI: true,
};
