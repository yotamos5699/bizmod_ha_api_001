////////////////////////////////////////////////////////////basic required code
//Must to configure private data on apiConfig.js file
const wizlib = require("wizcloud-api");
const getCredential = require("../helpers/getCred");
const realUserID = "6358f8717dd95eceee53eac3";
const amir = "638dac1454f08b935ed4af2f";
const yafit = "638dad0c54f08b935ed4af34";

const tempKey =
  "23e54b4b3e541261140bdeb257538ba11c5104620e61217d5d6735a3c9361a5aac67a7f85278e4e53f3008598d8927f68e89e3e16147c194f96976bdf3075d55";
// ********************************    MATRIX LOGS       ********************************//
const tempDbName = "wizdb2394n5";
const tempServer = "lb11.wizcloud.co.il";
const validateInitialData = async (usserDbname, usserPrivetKey, usserServerName) => {
  try {
    return await showDocument(usserDbname, usserPrivetKey, usserServerName);
  } catch (e) {
    console.log("&&&&&&&&&&&&&&& in validate e $$$$$$$$$$$$$", e);
    return e;
  }
};

async function createDoc(docData, index, userID) {
  console.log(`creat doC startS doC num"${index}" data:\n ${JSON.stringify(docData)}`);

  let ID;
  if (userID == realUserID) ID = realUserID;
  else if (userID == amir) ID = amir;
  else if (userID == yafit) ID = yafit;
  else ID = "1111";
  const { usserDbname, usserServerName, usserPrivetKey } = await getCredential.getCastumersCred(ID);

  let myDBname = usserDbname;
  console.log({ index });
  if (parseInt(index) == 0 || parseInt(index) % 5 == 0) {
    console.log("index passed");
    try {
      wizlib.init(usserPrivetKey, usserServerName);
    } catch (e) {
      console.log(e);
    }
  }
  //console.log("DOC DATA  !!!!!!!!!", docData);
  let apiRes = await wizlib.createDocument(myDBname, {
    rows: docData,
    issueStock: true,
    deleteTemp: false,
  });
  //  console.log(apiRes);

  return JSON.parse(apiRes);
}

module.exports.createDoc = createDoc;
module.exports.delDocument = delDocument;
module.exports.showDocument = showDocument;
module.exports.validateInitialData = validateInitialData;

async function issueDoc() {
  let apiRes = await wizlib.issueDoc(myDBname, {
    stockID: 744,
  });
  console.log(apiRes);
}
async function delDocument() {
  let apiRes = await wizlib.delDocument(myDBname, {
    stockID: 768,
  });
  console.log(apiRes);
}
async function showDocument(myDBname = tempDbName, usserPrivetKey = tempKey, usserServerName = tempServer) {
  //  let myDBname = usserDbname;
  try {
    wizlib.init(usserPrivetKey, usserServerName);
  } catch (e) {
    console.log(e);
  }
  let results = [];

  for (let i = 12; i <= 100; i++) {
    let apiRes = await wizlib.showDocument(myDBname, {
      stockID: i,
    });

    if (apiRes) results.push(apiRes);
  }

  // ValueDate: "2021-12-25",
  return results;
}
