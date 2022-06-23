 //const catumerConfig = require('./apiConfig.json')
 const crypto = require('crypto')
 const fs = require("fs");
 const path = require("path");
 const {
   Console
 } = require('console');
 
 async function loadCastumersConfigData() {
   var castumersConfigData = [{}];
   // var myObjData;
   try {
     castumersConfigData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./apiConfig.json")));
     console.log("castumersConfigData", castumersConfigData);
     // console.log(JSON.stringify(castumersConfigData, null, 2))
   } catch (e) {
     //no config file take from fs
     console.log(e);
   }
   return castumersConfigData
 }

 async function getCastumersCred(key) {
   //console.log(CastumersConfig)
   console.log(" key !!!!!!! ", key)
   // loadCastumersConfigData()
   let castumersConfig = await loadCastumersConfigData()
   console.log("this is the usser json file content" + JSON.stringify(castumersConfig))
   let usserCred = {}
   console.log("tal u are in !!!!!!!!!!!!!!!!!!!!!!!!")
   castumersConfig.forEach(usser => {
     if (usser.Key == key) {
       usserCred.WizcloudApiPrivateKey = usser.WizcloudApiPrivateKey
       usserCred.WizcloudApiServer = usser.WizcloudApiServer
       usserCred.WizcloudApiDBName = usser.WizcloudApiDBName
     }
   })
   console.log(usserCred)
   if (usserCred) {
     console.log(`usser red requierd...  \n ${JSON.stringify(usserCred)} `)
     return [usserCred.WizcloudApiDBName, usserCred.WizcloudApiServer, usserCred.WizcloudApiPrivateKey]
   } else return "no usser in data base ...."


 }



 function generateKey() {
   let key = crypto.randomBytes(32).toString('hex')
   return key
 }




 function setNewUsserCradential(usserData, generatedUsserKey) {
   let newUsserData = {
     "Key": generatedUsserKey,
     "Name": usserData.Name,
     "Email": usserData.Email,
     "WizcloudApiPrivateKey": usserData.WizcloudApiPrivateKey,
     "WizcloudApiServer": usserData.WizcloudApiServer,
     "WizcloudApiDBName": usserData.WizcloudApiDBName

   }
   castumersConfigData.push(newUsserData)
   fs.writeFile(CastumersConfig, castumersConfigData, (err) => {
     if (err) throw err;
     console.log(err, "See resaults in myApiRes.txt");
   });



 }
 getCastumersCred('1111')


 //module.exports.loadCastumersConfigData = loadCastumersConfigData;
 module.exports.generateKey = generateKey;
 module.exports.setNewUsserCradential = setNewUsserCradential;
 module.exports.getCastumersCred = getCastumersCred;


 //  const catumerConfig = require('./apiConfig.json')
 //  const crypto = require('crypto')
 //  const path = require("path");
 //  const fs = require("fs");
 //  var castumersConfigData = [{}];
 // //  try {
 // @@ -15,11 +16,12 @@
 //  function getCastumersCred(key) {

 //     try {
 //         castumersConfigData = JSON.parse(fs.readFileSync("apiConfig.json"));
 //         // console.log(castumersConfigData);
 //         console.log("getCastumersCred key", key);

 //         castumersConfigData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./apiConfig.json")));
 //         console.log("castumersConfigData", castumersConfigData);
 //     } catch (e) {
 //         //no config file tak from fs
 //         //  console.log(e);
 //          console.log("getCastumersCred, err: ", e);
 //     }

 //  //  const fs = require("fs");
 //  //  var castumersConfigData = [{}];
 //  // //  try {
 //  // //      castumersConfigData = JSON.parse(fs.readFileSync("apiConfig.json"));
 //  // //      // console.log(castumersConfigData);
 //  // //  } catch (e) {
 //  // //      //no config file tak from fs
 //  // //      //  console.log(e);
 //  // //  }



 //  //  function getCastumersCred(key) {

 //  //     try {
 //  //         console.log("getCastumersCred key", key);

 //  //         castumersConfigData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./apiConfig.json")));
 //  //         console.log("castumersConfigData", castumersConfigData);
 //  //     } catch (e) {
 //  //          console.log("getCastumersCred, err: ", e);
 //  //     }