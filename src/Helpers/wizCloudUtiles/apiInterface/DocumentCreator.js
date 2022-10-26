////////////////////////////////////////////////////////////basic required code
//Must to configure private data on apiConfig.js file
const wizlib = require("wizcloud-api");
const getCredential = require("../helpers/getCred");
const realUserID = "6358f8717dd95eceee53eac3";
var fs = require("fs");
const validateInitialData = async (
  usserDbname,
  usserPrivetKey,
  usserServerName
) => {
  try {
    return await showDocument(usserDbname, usserPrivetKey, usserServerName);
  } catch (e) {
    console.log("&&&&&&&&&&&&&&& in validate e $$$$$$$$$$$$$", e);
    return e;
  }
};

async function createDoc(docData, index, userID) {
  console.log(
    `creat doC startS doC num"${index}" data:\n ${JSON.stringify(docData)}`
  );

  let ID;
  if (userID == realUserID) {
    console.log("ofek is connected");
    ID = realUserID;
  } else ID = "1111";
  const { usserDbname, usserServerName, usserPrivetKey } =
    await getCredential.getCastumersCred(ID);

  // console.log(`usser db name++\n ${usserDbname} usser server name ++\n ${usserServerName} usser privet key ++\n ${usserPrivetKey}`)

  let myDBname = usserDbname;
  try {
    wizlib.init(usserPrivetKey, usserServerName);
  } catch (e) {
    console.log(e);
  }

  // console.log(stock);
  // var doc = {
  //   DocumentID: docID,
  //   AccountKey: stock.AccountKey,
  //   moves: stock.moves,
  // };
  console.log("DOC DATA  !!!!!!!!!", docData);
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
async function showDocument(myDBname, usserPrivetKey, usserServerName) {
  console.table({ myDBname, usserServerName, usserPrivetKey });
  console.log("DBnAME &&&&&&&&&&&&", myDBname);

  try {
    wizlib.init(usserPrivetKey, usserServerName);
  } catch (e) {
    console.log(" ************* E in INIT ***********  ", e);
    return { status: "no", result: e };
  }

  try {
    let result = await wizlib.auth(myDBname);
    console.log(result);
    let apiRes = await wizlib.showDocument(myDBname, {
      DocumentID: "1",
    });
    console.log("****** api res in show document ******", apiRes);
    return apiRes;
  } catch (e) {
    console.log("****** error in show document ******", e);
    return { status: "no", result: e };
  }
}
