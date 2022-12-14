const wizlib = require("wizcloud-api");
const getCredential = require("../helpers/getCred");
const Helper = require("../../generalUtils/Helper");
const defultReports = require("./filencryption");
const e = require("express");
const realUserID = "6358f8717dd95eceee53eac3";

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
  if (userID == realUserID) {
    ID = realUserID;
  } else if (userID == amir) {
    ID = amir;
  } else if (userID == yafit) {
    ID = yafit;
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
