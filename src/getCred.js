 const catumerConfig = require('./apiConfig.json')
 const crypto = require('crypto')
 const fs = require("fs");
 var castumersConfigData = [{}];
//  try {
//      castumersConfigData = JSON.parse(fs.readFileSync("apiConfig.json"));
//      // console.log(castumersConfigData);
//  } catch (e) {s
//      //no config file tak from fs
//      //  console.log(e);
//  }

 

 function getCastumersCred(key) {

    try {
        castumersConfigData = JSON.parse(fs.readFileSync("apiConfig.json"));
        // console.log(castumersConfigData);
    } catch (e) {
        //no config file tak from fs
        //  console.log(e);
    }


    console.log("this is the usser json file content" + JSON.stringify(castumersConfigData))
     let usserCred = {}
     console.log("tal u are in !!!!!!!!!!!!!!!!!!!!!!!!")
     castumersConfigData.forEach(usser => {
         if (usser.Key == key) {
             usserCred.WizcloudApiPrivateKey = usser.WizcloudApiPrivateKey
             usserCred.WizcloudApiServer = usser.WizcloudApiServer
             usserCred.WizcloudApiDBName = usser.WizcloudApiDBName
         }
     })
     console.log(usserCred)
     if (usserCred) return [usserCred.WizcloudApiDBName, usserCred.WizcloudApiServer, usserCred.WizcloudApiPrivateKey]
     else return "no usser in data base ...."


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
     fs.writeFile("./apiConfig.json", castumersConfigData, (err) => {
         if (err) throw err;
         console.log(err, "See resaults in myApiRes.txt");
     });



 }
 //getCastumersCred('1111')
 module.exports.generateKey = generateKey;
 module.exports.setNewUsserCradential = setNewUsserCradential;
 module.exports.getCastumersCred = getCastumersCred;