const express = require("express");
const PGrouter = express.Router();
const fs = require("fs");
const storage = require('./fireBase')
const path = require("path");
const Helper = require('../../Helper')
const pgClient = require('../dbFiles/pgConfig');


PGrouter.use(express.json());

// PGrouter.get("/api/loadmatrixes", async (req, res) => {
//     console.log('in api get ans')
//   pgClient.query(`Select * from ans`, (err, result) => {
//     if (!err) {
//         console.log(result.rows)
//       res.send(result.rows);
//       res.end
//     }else{
//     res.send(err)
//     res.end
//     }
//   });
//   pgClient.end;
// });

// PGrouter.post("/api/saveMatrix", async function (req, res) {
//     let { password, numbers, msg } = await req.body;
  
//     console.log("in log");
//     let {
//       id: { id },
//       timestamp,
//       body,
//       from,
//       _data: { notifyName },
//       location,
//     } = message;
  
//     console.log("datasafaasa", message._data);
  
//     let insertQuery = `insert into mtxlog(ID, timeStemp, Msg, senderNum , senderName, geoLocation) 
//                          values('${id}', '${timestamp}', '${body}', '${from}','${notifyName}','${location}')`;
//     pgClient.query(insertQuery, (err) => {
//       let logMsg = !err ? "Insertion was successful" : err.message;
//       console.log(logMsg);
//     });
  
  //   pgClient.end;
  // })









module.exports = PGrouter;

// router.post("/api/saveMatrix", async function (req, res) {
//     let reqBody = await req.body
//     let fileData = await Helper.readJsonFILE("mtrixDbJson")
//     let data = await Helper.updateJsonFileData(reqBody, fileData)



//     let updatedFileDataLOG = await Helper.writeToJsonFile("mtrixDbJson", JSON.stringify(data, null, 2))
//     let backUpFileDataLOG = await Helper.writeToJsonFile("mtrixDbJsonback", JSON.stringify(data, null, 2))
//     console.log(`**************************** Write files error log **********************\n 
//              ***************** old file Log *****************\n${updatedFileDataLOG}\n
//              ***************** backup file Log **************\n${backUpFileDataLOG}`)




//     return res.send('file uploaded').end
// });

// app.get("/api/loadMatrix", async function (req, res) {
//     let fileName = "mtrixDbJson";
//     let backUpFileData = "no backup file exists"
//     let oldFileData = await Helper.readJsonFILE("mtrixDbJson")
//     if (fs.existsSync(path.resolve(__dirname, `mtrixDbJsonback.json`))) {
//        backUpFileData = await Helper.readJsonFILE("mtrixDbJsonback")
//     }

//     console.log(`*************************** Url DB Files error log **********************\n 
//     ***************** old file data *****************\n${JSON.stringify(oldFileData,null,2)}\n
//     ***************** backup file data **************\n${JSON.stringify(backUpFileData,null,2)}`)

//     try {
//         if (backUpFileData) {
//             if (oldFileData.length < backUpFileData.length) {
//                 fs.unlinkSync(path.resolve(__dirname, `mtrixDbJson.json`))
//                 fs.rename(path.resolve(__dirname, `mtrixDbJsonback.json`), path.resolve(__dirname, `castumersInvoiceUrls.json`))
//             } else {
//                 fs.unlinkSync(path.resolve(__dirname, `mtrixDbJsonback.json`))
//             }
//         }
//     } catch (err) {
//         console.log(err)
//     }

//     let data = fs.readFileSync(
//         path.resolve(__dirname, `./${fileName}.json`),
//         (err) => {
//             if (err) throw err;
//             console.log(err, "See resaults in myApiRes.txt");
//         }
//     );
//     data = JSON.parse(data);
//     console.log(JSON.stringify(data, null, 2));

//     res.send(JSON.stringify({
//         "data": data
//     }, null, 2)).end();
// });


// app.post("/api/sendMsgs", async (req,res) => {
//     let { password, numbers, msg } = await req.body;
  
//     // let barierKey = await axios.get(keyUrl);
  
//     // if (barierKey != password || barierKey == undefined || password == undefined)
//     //   return res.end(JSON.stringify({ error: "auth error, not aload" }));
 
//     console.log("in log");
//     let {
//       id: { id },
//       timestamp,
//       body,
//       from,
//       _data: { notifyName },
//       location,
//     } = message;
  
//     console.log("datasafaasa", message._data);
  
//     let insertQuery = `insert into ANS(ID, timeStemp, Msg, senderNum , senderName, geoLocation) 
//                          values('${id}', '${timestamp}', '${body}', '${from}','${notifyName}','${location}')`;
//     pgClient.query(insertQuery, (err) => {
//       let logMsg = !err ? "Insertion was successful" : err.message;
//       console.log(logMsg);
//     });
  
//     pgClient.end;
//   })





