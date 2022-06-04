//////////////////SS/////////////////////////////////////////basic required code
//Must to configure private data on apiConfig.js file
const wizlib = require("wizcloud-api");
const getCredential = require('./getCred')
var fs = require("fs");




async function exportRecords(fileData, privetKey) {
  //console.log("filedata" + fileData);

  const [
    usserDbname,
    usserServerName,
    usserPrivetKey
  ] = getCredential.getCastumersCred(privetKey)

  try {
    let myDBname = usserDbname;
    wizlib.init(usserPrivetKey, usserServerName);
  } catch (e) {
    console.log(e);

  }

  let [reportCod, parameters] = fileData;


  let apiRes = await wizlib.exportDataRecords(myDBname, {
    datafile: reportCod,
    parameters: parameters,
  });
  const jsondata = JSON.parse(apiRes);
  const data = JSON.stringify(jsondata, null, 2);

  fs.writeFile("./reportsEnc/castumersReport.json", data, (err) => {
    if (err) throw err;
    console.log(err, "See resaults in myApiRes.txt");
  });


  return data;
}

module.exports.exportRecords = exportRecords;