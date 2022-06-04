 const catumerConfig = require('./apiConfig.json')
const crypto = require('crypto')
const fs = require("fs");
var castumersConfigData = [{}];
try {
    castumersConfigData = JSON.parse(fs.readFileSync("apiConfig.json"));
    console.log(castumersConfigData);
} catch (e) {
    //no config file take from fs
    console.log(e);
}


function getCastumersCred(key) {
    let usserCred = {}
    castumersConfigData.forEach(usser => {
        if (usser.Key == key) {
            usserCred.WizcloudApiPrivateKey = usser.WizcloudApiPrivateKey
            usserCred.WizcloudApiServer = usser.WizcloudApiServer
            usserCred.WizcloudApiDBName = usser.WizcloudApiDBName
        }
    })

    if (usserCred) return [usserCred.WizcloudApiDBName, usserCred.WizcloudApiServer, usserCred.WizcloudApiPrivateKey]
    else return "no usser in data base ...."


}



function generateKey() {
    let key = crypto.randomBytes(32).toString('hex')
    return key
}


function setNewUsserCradential(usserData, generatedUsserKey) {
    let usserData = {
        "Key": generatedUsserKey,
        "Name": usserData.Name,
        "Email": usserData.Email,
        "WizcloudApiPrivateKey": usserData.WizcloudApiPrivateKey,
        "WizcloudApiServer": usserData.WizcloudApiServer,
        "WizcloudApiDBName": usserData.WizcloudApiDBName

    }
    castumersConfigData.push(usserData)
    fs.writeFile("./apiConfig.json", castumersConfigData, (err) => {
        if (err) throw err;
        console.log(err, "See resaults in myApiRes.txt");
    });

}

module.exports.generateKey = generateKey;
module.exports.setNewUsserCradential = setNewUsserCradential;
module.exports.getCastumersCred = getCastumersCred;