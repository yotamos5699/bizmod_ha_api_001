const crypto = require("crypto");
const fs = require("fs");
const { userInfo } = require("os");
const path = require("path");
const Helper = require("../../../Helpers/generalUtils/Helper");
const aa = require("./apiConfig.json");
// const mongoose = require("mongoose");
// const { MtxLog, Users } = require("../../../../not in use files/DBs/dbObjects/MGschemas");

const loadCastumersConfigData = async () => {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, "")));
};

const getCastumersCred = async (key) => {
  let castumersConfig = aa;
  console.log(castumersConfig);
  let usserCred = {};
  castumersConfig.forEach((usser) => {
    if (usser.Key == key) {
      usserCred = Helper.constructUsserCred(usser);
    }
  });
  if (usserCred) {
    console.log("~~~~~~~~~~~~~~~~ user cred ~~~~~~~~~~~~~~~", usserCred);
    return usserCred;
  } else return "no usser in data base ....";
};

const hashUserKey = (key) => {
  return crypto.createHash("md5").update(key).digest("hex");
};

const generateKey = (collection) => {
  const keysLocation = { MtxLog: "matrixID", Users: "HasedUserKey" };
  const Key = crypto.randomBytes(32).toString("hex");
  const hashedKey = hashUserKey(Key);

  if ([collection].find(`"${keysLocation[collection]}":"${hashedKey}"`))
    generateKey();
  else return { hashedKey: hashedKey, Key: Key };
};

const setNewUsserCradential = (usserData, generatedUsserKey) => {
  let newUsserData = Helper.constructNewUserCred(usserData, generatedUsserKey);

  castumersConfigData.push(newUsserData);
  fs.writeFile(CastumersConfig, castumersConfigData, (err) => {
    if (err) throw err;
    console.log(err, "See resaults in myApiRes.txt");
  });
};

//getCastumersCred("1111");
module.exports.generateKey = generateKey;
module.exports.setNewUsserCradential = setNewUsserCradential;
module.exports.getCastumersCred = getCastumersCred;
