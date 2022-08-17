//const mongoose = require("mongoose");
const { MtxLog, DocData } = require("../dbObjects/MGschemas");

const saveDocURL = async (docObj) => {
  let docData;
  let res;
  let resArrey = [];
  
  
  if (!Array.isArray(docObj)) {
    docData = new DocData(docObj);
    res = await docData.save();
    return res;
 

} else {
    for (let i = 0; i <= docObj.length - 1; i++) {
      docData = new DocData(docObj[i]);

      res = await docData.save();
      resArrey.push(res);
    }

    return resArrey;
  }
};

module.exports.saveDocURL = saveDocURL;
