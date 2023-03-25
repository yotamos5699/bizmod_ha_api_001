const wizlib = require("wizcloud-api");
const getCredential = require("../helpers/getCred");
const Helper = require("../../generalUtils/Helper");
const defultReports = require("./filencryption");
const e = require("express");
const realUserID = "6358f8717dd95eceee53eac3";

const amir = "638dac1454f08b935ed4af2f";
const yafit = "638dad0c54f08b935ed4af34";

const sortKeysDict = {
  sort: "קוד מיון",
  storage: "מחסן",
};

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
const mockConfig = {
  // ErpConfig: { erpName: "HA", CompanyKey: "kjklj", CompanyServer: "jkjlkjl", CompanyDbName: "" },
  Reports: {
    defaultReports: {
      castumers: [{ sortingKey: "קוד מיון", sortingType: "single", sortingValue: [8] }],
      products: [
        { sortingKey: "מחסן", sortingType: "single", sortingValue: [1, 2] },
        { sortingKey: "קוד מיון", sortingType: "range", sortingValue: [250, 600] },
      ],
    },
  },
  mtxConfig: { docLimit: { isLimited: true, Amount: 1 }, taxDocs: { isAllow: false, Refund: { Amount: null } } },
  selectedDoc: "taxInvoice",
  selectedAction: "produce",
  docsAmount: 1,
  refoundMaxAmount: null,
  detailsCode: [10],
  customersCode: [8],
  ErpConfig: {
    erpName: "HA",
    HA: {
      // usserPrivetKey:
      //   "23e54b4b3e541261140bdeb257538ba11c5104620e61217d5d6735a3c9361a5aac67a7f85278e4e53f3008598d8927f68e89e3e16147c194f96976bdf3075d55",
      // usserServerName: "lb11.wizcloud.co.il",
      // usserDbname: "wizdb2394n5",
      usserPrivetKey:
        "23e54b4b3e541261140bdeb257538ba11c5104620e61217d5d6735a3c9361a5aac67a7f85278e4e53f3008598d8927f68e89e3e16147c194f96976bdf3075d55",
      usserServerName: "lb11.wizcloud.co.il",
      usserDbname: "wizdb2394n5",
    },
  },
};

async function checkConectionJson(erpConectionData) {
  //console.log({ erpConectionData });
  // const erpConectionData = config ? config.ErpConfig.HA : await getCredential.getCastumersCred(ID);
  const { usserDbname, usserServerName, usserPrivetKey } = erpConectionData;
  let myDBname = usserDbname;
  let initData;
  try {
    initData = wizlib.init(usserPrivetKey, usserServerName);
    //console.log({ initData });
  } catch (e) {}
  let cc = await wizlib
    .CompaniesForToken(myDBname)
    .then(() => {
      return { status: "yes", data: "conection json ok" };
    })
    .catch((e) => {
      return { status: "no", data: e };
    });
  return cc;
}

async function exportRecords(reqData, userID, config = mockConfig) {
  //console.log("~~~~~~~~~~~~~~~~~ in flex docs ~~~~~~~~~~~~~~~~~~");
  if (defultReports == undefined) return "error in fetching defultReports data";

  let fileData = reqData.TID;
  let sortKey = await reqData.sortKey;

  fileData == "1" ? (Warehouse = reqData.Warehouse) : (Warehouse = null);

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

  if (config) console.log({ config });
  const erpConectionData = config ? config : await getCredential.getCastumersCred(ID);
  const { usserDbname, usserServerName, usserPrivetKey } = erpConectionData;

  let myDBname = usserDbname;
  try {
    wizlib.init(usserPrivetKey, usserServerName);
  } catch (e) {
    return e;
  }

  if (fileData == "1") {
    [reportCod, parameters] = docHash[fileData][0];
  } else if (fileData == "2") {
    [reportCod, parameters] = docHash[fileData];
    console.log("file data ", reqData);
  }

  let apiRes = await JSON.parse(
    await wizlib.exportDataRecords(myDBname, {
      datafile: reportCod,
      parameters: parameters,
    })
  );
  let itemsReportData;
  if (fileData == "1") {
    itemsReportData = formatItemsData({ reportCod, parameters, myDBname, apiRes, fileData });
  }
  //apiRes = JSON.parse(apiRes);

  let jsondata = itemsReportData?.length > 0 ? itemsReportData : apiRes.status.repdata;

  const reportSortParams = fileData == "1" ? reqData.products : reqData.castumers;
  console.log({ reportSortParams });
  if (reportSortParams) {
    console.log("if (reportSortParams)");
    jsondata = sortReportData({ jsondata, reportSortParams }, fileData);
    return jsondata;
  } else return jsondata;
}

async function formatItemsData(props) {
  let treeData;
  try {
    [reportCod, parameters] = docHash[props.fileData][1];
    treeData = await JSON.parse(
      await wizlib.exportDataRecords(props.myDBname, {
        datafile: props.reportCod,
        parameters: props.parameters,
      })
    );
  } catch (e) {
    //console.log({ e });
  }

  let resArrey = [];

  props.apiRes.status.repdata.forEach((itemsDataRow) => {
    let record = {};
    let isRecord = false;
    treeData.status.repdata.forEach((treeDataRow) => {
      if (itemsDataRow["מפתח פריט"] == treeDataRow["מפתח פריט אב"]) {
        record = itemsDataRow;
        record["מפתח פריט אב"] = treeDataRow["מפתח פריט"];
        isRecord = true;
        //  //console.log(row['מפתח פריט'] + " " + item['מפתח פריט אב'])
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

  let newArrey = [];
  resArrey.forEach((resRow) => {
    let record = {};

    props.apiRes.status.repdata.forEach((tableRow) => {
      if (resRow["מפתח פריט אב"] == tableRow["מפתח פריט"]) {
        record = resRow;
        record["שם פריט אב"] = tableRow["שם פריט"];
        record["תרה כמותית אב"] = tableRow["יתרה כמותית במלאי"];
        newArrey.push(record);
      }
    });
  });

  return newArrey;
}

function sortReportData(props, tbNum) {
  console.log("sortReportData", { props, tbNum });
  let newSortedData = [];
  //let updatedData = props.reportData;
  console.log("sorting type !!!!!!!!!!!", props.reportSortParams);

  for (let i = 0; i <= props.reportSortParams.length - 1; i++) {
    if (props.reportSortParams[i].sortingType == "single" || props.reportSortParams[i].sortingType == "multi") {
      let currentFilterdData = [];
      let key = props.reportSortParams[i].sortingKey;

      props.reportSortParams[i].sortingValue.forEach((value) => {
        let isIn = false;
        //console.log({ key, value });
        props.jsondata.forEach((row) => {
          if (row[key] == value) {
            isIn = true;
            currentFilterdData.push(row);
          }
          console.log({ row, isIn });
        });
      });

      currentFilterdData && newSortedData.push([...currentFilterdData]);
    } else if (props.reportSortParams[i].sortingType == "range") {
      for (let i = 0; i <= props.reportSortParams.length - 1; i++) {
        let currentFilterdData = [];
        let key = props.reportSortParams[i].sortingKey;

        //console.log({ key, value });
        props.jsondata.forEach((row) => {
          let isIn;

          if (
            row[key] > props.reportSortParams[i].sortingValue[0] &&
            row[key] < props.reportSortParams[i].sortingValue[1]
          ) {
            isIn = true;
            currentFilterdData.push(row);
          }
          console.log({ row, isIn });
        });

        currentFilterdData && newSortedData.push([...currentFilterdData]);
      }
    } else {
      return "invalid sorting type, getting " + props.reportSortParams.sortingType;
    }
  }
  //console.log({ newSortedData });
  return newSortedData;

  //   //console.log({ newSortedData });
  //   return newSortedData;
  // }
}

module.exports.exportRecords = exportRecords;
module.exports.checkConectionJson = checkConectionJson;
