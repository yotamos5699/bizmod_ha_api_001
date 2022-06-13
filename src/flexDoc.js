//////////////////SS/////////////////////////////////////////basic required code
//Must to configure private data on apiConfig.js file
const wizlib = require("wizcloud-api");
const getCredential = require('./getCred')
var fs = require("fs");
const defultReports = require('./filencryption');
const {
  PassThrough
} = require("stream");



async function exportRecords(fileData, privetKey) {
  //console.log("filedata" + fileData);
  // jsondata = await reportsCreator.exportRecords(userKey, req.body.TID)


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
  fileData == '4' ? [reportCod, parameters] = fileData : [reportCod, parameters] = docHash[fileData][0]


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
  treeData = JSON.parse(treeData)
  let resArrey = [];
  console.log(treeData.repdata)

  treeData.repdata.forEach(item => {
    let record = {};
    apiRes.repdata.forEach(row => {
      // record = row
      //console.log(row['מפתח פריט'] + " " + item['מפתח פריט'])
      //console.log(row['מפתח פריט'] + " " + item['מפתח פריט אב'])

      if (row['מפתח פריט'] == item['מפתח פריט אב']) {
        record = row
        record['מפתח פריט אב'] = item['מפתח פריט']
        console.log(row['מפתח פריט'] + " " + item['מפתח פריט אב'])
      }
      // } else {
      //   record = row
      //   record['מפתח פריט אב'] = item['מפתח פריט']
      // }

    })
    if(record){resArrey.push(record)}
    else{
        record = row
        record['מפתח פריט אב'] == row['מפתח פריט']
        resArrey.push(record)
    } 
  })
  
  

  const jsondata = resArrey;
  const data = JSON.stringify(jsondata, null, 2);

  fs.writeFile("./dbFiles/lastItemsCall.json", data, (err) => {
    if (err) throw err;
    // console.log(err, "See resaults in myApiRes.txt");
  });


  return data;
  }
 

module.exports.exportRecords = exportRecords;