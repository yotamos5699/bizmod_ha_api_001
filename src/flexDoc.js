//////////////////SS/////////////////////////////////////////basic required code
//Must to configure private data on apiConfig.js file
const wizlib = require("wizcloud-api");
const getCredential = require('./getCred')
var fs = require("fs");

const defultReports = require('./filencryption');
const {
  PassThrough
} = require("stream");
const {
  Console
} = require("console");



async function exportRecords(reqData, privetKey) {
  //console.log("filedata" + fileData);
  // jsondata = await reportsCreator.exportRecords(userKey, req.body.TID)

  let fileData = reqData.TID
  console.log("file data  DDFDFDFDFD   " + JSON.stringify(fileData))
  console.log("sanity check sanity check sanity check sanity check !!!!! ")
  let sortKey = reqData.sortKey

  const [
    usserDbname,
    usserServerName,
    usserPrivetKey
  ] = getCredential.getCastumersCred('1111')

  console.log(usserDbname)
  console.log(usserServerName)
  console.log(usserPrivetKey)

  let myDBname = usserDbname;
  try {

    wizlib.init(usserPrivetKey, usserServerName);
  } catch (e) {
    console.log(e);
  }

  let docHash = {
    '1': [
      [defultReports.stockEncrypt_reportData,
        defultReports.params_data_st
      ],
      [defultReports.encrypt_treeItemsreportData,
        defultReports.treeItemsParams_data
      ]
    ],

    '2': [defultReports.castumersEncryptData,
      defultReports.params_data_ca
    ]
  }

  let reportCod, parameters;
  if (fileData == '4') {
    [reportCod, parameters] = fileData
  } else if (fileData == '1') {
    [reportCod, parameters] = docHash[fileData][0]
  } else if (fileData == '2') {
    [reportCod, parameters] = docHash[fileData]

  }


  let apiRes = await wizlib.exportDataRecords(myDBname, {
    datafile: reportCod,
    parameters: parameters,


  });

  let treeData
  if (fileData == '1') {
    [reportCod, parameters] = docHash[fileData][1]
    treeData = await wizlib.exportDataRecords(myDBname, {
      datafile: reportCod,
      parameters: parameters,


    });
  }
  apiRes = JSON.parse(apiRes)
  console.log(apiRes)

  let resArrey = [];
  if (fileData == '1') {
    treeData = JSON.parse(treeData)

    console.log(treeData.repdata)

    treeData.repdata.forEach(item => {
      let record = {};
      apiRes.repdata.forEach(row => {

        if (row['מפתח פריט'] == item['מפתח פריט אב']) {
          record = row
          record['מפתח פריט אב'] = item['מפתח פריט']
          console.log(row['מפתח פריט'] + " " + item['מפתח פריט אב'])
        }

      })
      if (record) {
        resArrey.push(record)
      } else {
        record = row
        record['מפתח פריט אב'] == row['מפתח פריט']
        resArrey.push(record)
      }
    })
  }


  const jsondata = resArrey.length > 0 ? resArrey : apiRes
  // console.log("jsondata " + jsondata)
  const data = JSON.stringify(jsondata, null, 2);

  fs.writeFile(path.resolve(__dirname, "./dbFiles/lastItemsCall.json"), data, (err) => {
    if (err) throw err;
    // console.log(err, "See resaults in myApiRes.txt");
  });


  console.log("fuck u  " + JSON.stringify(jsondata, null, 2))

  if (sortKey) {
    let sortedData = []
    jsondata.forEach(row => {
      if (row['קוד מיון'] == sortKey) {
        sortedData.push(row)
      }
    })
    return sortedData
  } else return jsondata;
}


module.exports.exportRecords = exportRecords;