//////////////////SS/////////////////////////////////////////basic required code
//Must to configure private data on apiConfig.js file
const wizlib = require("wizcloud-api");
const fs = require("fs");
const myObjData = require("../src/Helpers/wizCloudUtiles/helpers/apiConfig.json");
//var express = require("express");
//var router = express.Router();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Api methods

async function exportCastumersRecords(fileData) {
  //console.log("filedata" + fileData);
  console.log(myObjData);
  console.log(typeof myObjData);
  console.log(Array.isArray(myObjData));
  var myDBname = await myObjData[0].WizcloudApiDBName;
  wizlib.init(myObjData[0].WizcloudApiPrivateKey, myObjData[0].WizcloudApiServer);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Encrypted report data from "External" option in report issue
  //console.log(myObjData.stockEncrypt_reportData);
  //encrypt_reportData = myObjData.castumersEncryptData;
  //params_data = myObjData.params_data_ca;

  let { reportCod, parameters } = await fileData;

  let apiRes = await wizlib.exportDataRecords(myDBname, {
    datafile: reportCod,
    parameters: parameters,
  });
  const jsondata = JSON.parse(apiRes);
  // console.log(jsondata);
  const data = JSON.stringify(jsondata, null, 2);
  //console.log(data);

  return data;
}

module.exports.exportCastumersRecords = exportCastumersRecords;
//exportCastumersRecords();
/*router.get("/", async function (req, res) {
  let apiRes = await wizlib.exportDataRecords(myDBname, {
    datafile: encrypt_reportData,
    parameters: params_data,
  });
  res.json(apiRes);
});

module.exports = router; */
