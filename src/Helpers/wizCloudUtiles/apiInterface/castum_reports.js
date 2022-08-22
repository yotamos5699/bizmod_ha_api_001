const wizlib = require("wizcloud-api");
//var express = require("express");
//var router = express.Router();
var fs = require("fs");
var myObjData;
try {
  myObjData = JSON.parse(fs.readFileSync("apiConfig.json"));
} catch (e) {
  //no config file take from fs
  console.log(e);
}
var myDBname = myObjData.WizcloudApiDBName;
wizlib.init(myObjData.WizcloudApiPrivateKey2, myObjData.WizcloudApiServer);
let params_data;
let encrypt_reportData = "";
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Encrypted report data from "External" option in report issue
console.log(myObjData.stockEncrypt_reportData);
encrypt_reportData = myObjData.castumersEncryptData;
params_data = myObjData.params_data_ca;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Api methods

async function exportCastumersRecords(fileData) {
  //console.log("filedata" + fileData);

  let reportCod = fileData.cod;
  let parameters = fileData.parms;
  let apiRes = await wizlib.exportDataRecords(myDBname, {
    datafile: reportCod,
    parameters: parameters,
  });
  const jsondata = JSON.parse(apiRes);
  // console.log(jsondata);
  const data = JSON.stringify(jsondata, null, 2);
  //console.log(data);

  fs.writeFile("./reportsEnc/castumersReport.json", data, (err) => {
    if (err) throw err;
    console.log(err, "See resaults in myApiRes.txt");
  });
  // console.log(data);

  return data;
}

module.exports.exportCastumersRecords = exportCastumersRecords;