//////////////////SS/////////////////////////////////////////basic required code
//Must to configure private data on apiConfig.js file
const wizlib = require("wizcloud-api");
const getCredential = require('./getCred')
var fs = require("fs");

const defultReports = require('./filencryption');
const {
  PassThrough
} = require("stream");



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


  const jsondata = resArrey.length > 0 ? resArrey : apiRes
  // console.log("jsondata " + jsondata)
  const data = JSON.stringify(jsondata, null, 2);

  fs.writeFile("./dbFiles/lastItemsCall.json", data, (err) => {
    if (err) throw err;
    // console.log(err, "See resaults in myApiRes.txt");
  });


  // console.log("json.res  " + JSON.stringify(jsondata, null, 2))

  if (sortKey) {
    console.log("sorting data ......")
    let sortedData = []
    jsondata.repdata.forEach(row => {
      if (row['קוד מיון'] == sortKey) {
        sortedData.push(row)
      }
    })
    console.log("SORTED DATA" + sortedData)
    return sortedData
  } else {
    console.log("raw data...." + jsondata.repdata)
    return jsondata;
  }
}


module.exports.exportRecords = exportRecords;

// "matrixesData":[{
//   "matrixID": "asdajhjkhasd!@#$xdfhasdg$%4fgjf%^&#$@FHGJ",
//   "DocumentID": "1",
//   "data": [
//   ["AcountName", "AountKey", "CellPhone", "bb100", "xp100", "ab500", "spxp100", "sr"],
//   ["yota", "10001", "506655699", "2", null, "1", "4", null],
//   ["yosh", "10022", "506655698", "2", "3", null, "4", "6"],
//   ["moti", "10401", "504654523", "2", "3", "1", "4", "6"],
//   ["dana", "10601", "525543268", null, "3", "1", "4", "6"],
//   ["tal", "11201", "507635997", "2", null, "1", "4", "6"]
//   ]
//   },
//   {
//   "matrixConfig": {
//   "submitTstemp": "12/11/2022",
//   "managerID": "2312411241",
//   "totalSells": 12312312,
//   "mainMatrixId": "asdajhjkhasd!@#$xdfhasdg$%4fgjf%^&#$@FHGJ"
//   },
//   "matrixGlobalData": {
//   "Details": "LONG TIME ON DE",
//   "problemsLog": {
//   "moneyMissing": 1312,
//   "castumers": "asdasdasda"
//   }
  
//   },
//   "data": [{
//   "cellsData": [null, null, null, null, null, null, null, null],
//   "docData": [null]
//   },
//   {
//   "cellsData": [null, null, null, {
//   "cellData": {
//   "itemRow": [{
//   "Price": 222
//   }]
//   }
//   }, null, null, null, null, null],
//   "docData": [{
//   "Details": "לתשלום עד ה 3.4.23"
//   }]
//   },
  
//   {
//   "cellsData": [null, null, null, null, null, null, null, null],
//   "docData": [null]
//   },
  
//   {
//   "cellsData": [null, null, null, null, {
//   "cellData": {
//   "itemRow": [{
//   "DiscountPrc": 7
//   }, {
//   "Details": "מחיר מיוחד לגייז"
//   }]
//   }
//   }, null, null, null],
//   "docData": [null]
//   },
  
//   {
//   "cellsData": [null, null, null, null, null, null, null, null],
//   "docData": [{
//   "DiscountPrc": 12
//   }]
//   },
//   {
//   "cellsData": [null, null, null, null, null, null, null, {
//   "cellData": {
//   "itemRow": [{
//   "DiscountPrc": 3
//   }],
//   "metaData": [{
//   "Details": "לקוח לא משלם במסירה"
//   }]
//   }
//   }],
//   "docData": [null]
  
//   }]}]
//   }