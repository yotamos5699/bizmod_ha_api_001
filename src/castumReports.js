const wizlib = require("wizcloud-api");

const myObjData = require("../src/Helpers/wizCloudUtiles/helpers/apiConfig.json");

async function exportCastumersRecords(fileData) {
  const myDBname = await myObjData[0].WizcloudApiDBName;
  wizlib.init(myObjData[0].WizcloudApiPrivateKey, myObjData[0].WizcloudApiServer);

  const { reportCod, parameters } = await fileData;

  const apiRes = await wizlib.exportDataRecords(myDBname, {
    datafile: reportCod,
    parameters: parameters,
  });
  const jsondata = JSON.parse(apiRes);

  const data = JSON.stringify(jsondata, null, 2);

  return data;
}

module.exports.exportCastumersRecords = exportCastumersRecords;
