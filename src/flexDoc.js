//////////////////SS/////////////////////////////////////////basic required code
//Must to configure private data on apiConfig.js file
const wizlib = require("wizcloud-api");
const getCredential = require('./getCred')
var fs = require("fs");
const path = require("path");
const Helper = require('./Helper')
const defultReports = require('./filencryption');
const {
  PassThrough
} = require("stream");

const docHash = {
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


async function exportRecords(reqData, privetKey) {
  //console.log("filedata" + fileData);
  // jsondata = await reportsCreator.exportRecords(userKey, req.body.TID)

  let fileData = reqData.TID
  console.log("file data  DDFDFDFDFD   " + JSON.stringify(fileData))
  let sortKey = reqData.sortKey
  let Warehouse = ''
  fileData == '1' ? Warehouse = reqData.Warehouse : Warehouse = null


  const [
    usserDbname,
    usserServerName,
    usserPrivetKey
  ] = await getCredential.getCastumersCred("1111")

  console.log(`usser cred \n${usserDbname}\n${usserServerName}\n${usserPrivetKey}`)

  let myDBname = usserDbname;
  try {

    wizlib.init(usserPrivetKey, usserServerName);
  } catch (e) {
    console.log(e);
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
  // console.log(apiRes)

  let resArrey = [];
  if (fileData == '1') {
    treeData = JSON.parse(treeData)

    // console.log(treeData.repdata)

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


  let jsondata = resArrey.length > 0 ? resArrey : apiRes
  // console.log("jsondata " + jsondata)
  const data = JSON.stringify(jsondata, null, 2);

  fs.writeFile(path.resolve(__dirname, "./lastItemsCall.json"), data, (err) => {
    if (err) throw err;
    // console.log(err, "See resaults in myApiRes.txt");
  });

  // console.log("json.res  " + JSON.stringify(jsondata, null, 2))

  if (sortKey || Warehouse) {
    try {
      jsondata = Helper.sortReportData(jsondata.repdata, sortKey, Warehouse)

      return jsondata
    } catch (err) {
      console.log(`error on sortReportData${err}`)
    }
  } else {
    console.log("raw data...." + jsondata.repdata)
    return jsondata.repdata;
  }
}

module.exports.exportRecords = exportRecords;