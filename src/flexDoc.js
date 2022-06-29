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
const {
  table
} = require("console");
const res = require("express/lib/response");

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
    console.log(JSON.stringify(treeData, null, 2))
    console.log(JSON.stringify(apiRes, null, 2))
    // console.log(treeData.repdata)

    treeData.repdata.forEach(treeDataRow => {
      let record = {};
      apiRes.repdata.forEach((itemsDataRow) => {

        if (itemsDataRow['מפתח פריט'] == treeDataRow['מפתח פריט אב']) {
          record = itemsDataRow
          record['מפתח פריט אב'] = treeDataRow['מפתח פריט']

          //  console.log(row['מפתח פריט'] + " " + item['מפתח פריט אב'])
        }

      })
      if (record) {
        resArrey.push(record)
      } else {
        record = itemsDataRow
        record['מפתח פריט אב'] = itemsDataRow['מפתח פריט']
        resArrey.push(record)
      }
    })
  }



  let newArrey = []
  resArrey.forEach(resRow => {
    let record = {}

    apiRes.repdata.forEach(tableRow => {
      if (resRow['מפתח פריט אב'] == tableRow['מפתח פריט']) {
        record = resRow
        record['שם פריט אב'] = tableRow['שם פריט']
        record['תרה כמותית אב'] = tableRow['יתרה כמותית במלאי']
        newArrey.push(record)
      }

    })

  })
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

  let jsondata = resArrey.length > 0 ? newArrey : apiRes
  // console.log("jsondata " + jsondata)
  const data = JSON.stringify(jsondata, null, 2);

  fs.writeFile(path.resolve(__dirname, "./lastItemsCall.json"), data, (err) => {
    if (err) throw err;
    // console.log(err, "See resaults in myApiRes.txt");
  });

  // console.log("json.res  " + JSON.stringify(jsondata, null, 2))

  if (sortKey) {
    try {
      jsondata = Helper.sortReportData(jsondata, sortKey)

      return jsondata
    } catch (err) {
      console.log(`error on sortReportData${err}`)
    }
  } else {
    console.log("raw data...." + JSON.stringify(jsondata))
    return jsondata;
  }
}

module.exports.exportRecords = exportRecords;